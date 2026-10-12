import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordEvent } from '@/lib/orchestration/events';
import { forwardPaidOrderToUnicommerce } from '@/lib/unicommerce/forward';
import { emitPurchaseCompleted } from '@/lib/nectar/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      total,
      subtotal,
      discount = 0,
      shippingFee = 0,
      items = [],
      shippingAddress = {},
      deliverySpeed = 'standard',
      appliedCoupon = null,
      useNectarWallet = false,
      paymentMethod = 'online',
      paymentStatus = 'pending',
    } = body;

    const orderNumber = `PR-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const brandId = process.env.NEXT_PUBLIC_BRAND_ID || 'playr';
    const grandTotal = parseFloat(String(total || 0));

    const admin = createAdminClient();

    // 1. Resolve or create customer in Supabase
    let customerId: string | null = null;
    const email = shippingAddress.email || userId;
    if (email) {
      try {
        const { data: customer } = await admin
          .from('customers')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (customer) {
          customerId = customer.id;
        } else {
          const { data: newCust } = await admin
            .from('customers')
            .insert({
              brand_id: brandId,
              email,
              first_name: shippingAddress.firstName || '',
              last_name: shippingAddress.lastName || '',
              phone: shippingAddress.phone || '',
            })
            .select('id')
            .maybeSingle();

          if (newCust) customerId = newCust.id;
        }
      } catch (e: any) {
        console.warn('[Orders API] Customer lookup warning:', e?.message);
      }
    }

    // 2. Insert into Supabase orders table
    let createdOrderId = orderNumber;
    try {
      const { data: insertedOrder, error: orderErr } = await admin
        .from('orders')
        .insert({
          order_number: orderNumber,
          brand_id: brandId,
          customer_id: customerId,
          notes: userId,
          status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
          payment_status: paymentStatus,
          grand_total: grandTotal,
          subtotal: parseFloat(String(subtotal || grandTotal)),
          discount_total: parseFloat(String(discount || 0)),
          currency: 'INR',
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          payment_intent_id: orderNumber,
          metadata: {
            deliverySpeed,
            appliedCoupon,
            useNectarWallet,
            paymentMethod,
            shippingFee,
          },
        })
        .select('id')
        .single();

      if (!orderErr && insertedOrder?.id) {
        createdOrderId = insertedOrder.id;
      }
    } catch (e: any) {
      console.warn('[Orders API] DB order insert warning:', e?.message);
    }

    // 3. Insert order items
    if (items.length > 0) {
      try {
        const itemRows = items.map((item: any) => ({
          order_id: createdOrderId,
          product_id: item.productId || 'unknown',
          product_title: item.title || 'playR Performance Gear',
          variant_title: item.size || 'One Size',
          sku: item.sku || `PR-${(item.productId || 'SKU').slice(0, 10).toUpperCase()}`,
          quantity: item.quantity || 1,
          unit_price: item.price || 0,
        }));
        await admin.from('order_items').insert(itemRows);
      } catch (e: any) {
        console.warn('[Orders API] DB order items insert warning:', e?.message);
      }
    }

    // 4. Record event
    await recordEvent({
      domain: 'order',
      severity: 'info',
      action: 'orders.create',
      resourceType: 'orders',
      resourceId: createdOrderId,
      message: `Order ${orderNumber} created via ${paymentMethod} (${paymentStatus})`,
      metadata: { orderNumber, grandTotal, paymentMethod, paymentStatus },
    });

    // 5. If already paid (or COD confirmed), bridge to Unicommerce & Nectar
    if (paymentStatus === 'paid') {
      void forwardPaidOrderToUnicommerce(createdOrderId).catch(() => {});
      void emitPurchaseCompleted({
        id: createdOrderId,
        customer_id: customerId,
        grand_total: grandTotal,
        currency: 'INR',
        items: items.map((i: any) => ({ sku: i.sku, quantity: i.quantity, price: i.price })),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      order: {
        id: createdOrderId,
        orderNumber,
        displayId: orderNumber,
        total: grandTotal,
        paymentStatus,
      },
    });
  } catch (err: any) {
    console.error('[Orders API] POST error:', err);
    return NextResponse.json({ error: 'Failed to create order', details: err?.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = createAdminClient();
    const orderId = req.nextUrl.searchParams.get('orderId');
    const customerId = req.nextUrl.searchParams.get('customerId');

    let query = admin.from('orders').select('*, order_items(*)');
    if (orderId) {
      query = query.or(`id.eq.${orderId},order_number.eq.${orderId}`);
    }
    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false }).limit(20);
    if (error) {
      return NextResponse.json({ orders: [] });
    }
    return NextResponse.json({ orders: orders || [] });
  } catch (err: any) {
    return NextResponse.json({ orders: [], error: err?.message });
  }
}
