/**
 * Forward a paid playR order to Uniware (Unicommerce).
 * Triggered automatically on Easebuzz payment success, webhook callbacks, or checkout.
 */

import { createAdminClient } from '@/lib/supabase/admin';
import { recordEvent } from '@/lib/orchestration/events';
import { UnicommerceOrderService } from './orders';
import { UnicommerceLogger } from './logging';
import { getUnicommerceConfig, isUnicommerceLiveConfigured } from './config';

export type UniwareForwardResult = {
  ok: boolean;
  skipped?: boolean;
  uniwareCode?: string;
  error?: string;
};

export async function forwardPaidOrderToUnicommerce(orderId: string): Promise<UniwareForwardResult> {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from('orders')
    .select('id, order_number, status, payment_status, shipping_address, billing_address, currency, created_at, source_order_id, grand_total')
    .eq('id', orderId)
    .maybeSingle();

  if (!order) return { ok: false, error: 'ORDER_NOT_FOUND' };

  if (order.source_order_id) {
    return { ok: true, skipped: true, uniwareCode: order.source_order_id };
  }

  const config = getUnicommerceConfig();
  if (!config.isDemoMode && !isUnicommerceLiveConfigured(config)) {
    const error = 'UNICOMMERCE_API_URL or credentials missing';
    await UnicommerceLogger.error('orders.forward_config_missing', error, new Error(error), order.id);
    return { ok: false, error };
  }

  const { data: orderItems } = await admin
    .from('order_items')
    .select('sku, quantity, unit_price, product_title, variant_title')
    .eq('order_id', order.id);

  const shipAddr = (order.shipping_address || {}) as any;
  const billAddr = (order.billing_address || order.shipping_address || {}) as any;

  const items = (orderItems && orderItems.length > 0)
    ? orderItems.map((item) => ({
        sku: item.sku || 'PR-GENERIC',
        name: item.variant_title || item.product_title || 'playR Performance Gear',
        price: Number(item.unit_price ?? 0),
        quantity: Number(item.quantity ?? 1),
      }))
    : [
        {
          sku: 'PR-ORD-ITEM',
          name: 'playR Gear',
          price: Number(order.grand_total ?? 0),
          quantity: 1,
        },
      ];

  const orderService = new UnicommerceOrderService();
  const ucResult = await orderService.createOrder(
    {
      id: order.id,
      displayCode: order.order_number || order.id.slice(0, 12).toUpperCase(),
      createdAt: order.created_at,
      currency: order.currency || 'INR',
      paymentMethod: order.payment_status === 'paid' ? 'PREPAID' : 'COD',
      shippingAddress: {
        name: `${shipAddr.firstName || ''} ${shipAddr.lastName || ''}`.trim() || shipAddr.name || 'Customer',
        addressLine1: shipAddr.address || shipAddr.line1 || 'Address Line 1',
        addressLine2: shipAddr.apartment || shipAddr.line2 || '',
        city: shipAddr.city || 'Delhi',
        state: shipAddr.state || 'Delhi',
        country: shipAddr.country || 'India',
        pincode: shipAddr.postalCode || shipAddr.pincode || '110001',
        phone: shipAddr.phone || '9999999999',
        email: shipAddr.email || 'orders@playr.in',
      },
      billingAddress: {
        name: `${billAddr.firstName || ''} ${billAddr.lastName || ''}`.trim() || billAddr.name || 'Customer',
        addressLine1: billAddr.address || billAddr.line1 || 'Address Line 1',
        addressLine2: billAddr.apartment || billAddr.line2 || '',
        city: billAddr.city || 'Delhi',
        state: billAddr.state || 'Delhi',
        country: billAddr.country || 'India',
        pincode: billAddr.postalCode || billAddr.pincode || '110001',
        phone: billAddr.phone || '9999999999',
        email: billAddr.email || 'orders@playr.in',
      },
      items,
      grandTotal: Number(order.grand_total ?? 0),
    },
    process.env.UNICOMMERCE_CHANNEL_CODE || 'CUSTOM'
  );

  if (ucResult.success && ucResult.uniwareCode) {
    try {
      await admin.from('orders').update({ source_order_id: ucResult.uniwareCode }).eq('id', order.id);
    } catch {
      // Order table update is best effort
    }

    await recordEvent({
      domain: 'fulfillment',
      severity: 'info',
      action: 'unicommerce.forward_success',
      actorId: 'system',
      resourceType: 'orders',
      resourceId: order.id,
      message: `Order ${order.order_number || order.id} forwarded to Uniware as ${ucResult.uniwareCode}`,
      metadata: { uniwareCode: ucResult.uniwareCode, duplicate: Boolean(ucResult.isDuplicate) },
    });
    return { ok: true, uniwareCode: ucResult.uniwareCode, skipped: Boolean(ucResult.isDuplicate) };
  }

  return { ok: false, error: ucResult.error || 'Forwarding failed' };
}
