import { getUnicommerceConfig } from './config';
import { UnicommerceLogger } from './logging';
import { soapRequest } from './soapClient';
import type { UniwareOrderCreateRequest } from './types';

export class UnicommerceOrderService {
  async createOrder(
    order: UniwareOrderCreateRequest,
    channelCode: string = 'CUSTOM'
  ): Promise<{ success: boolean; uniwareCode?: string; error?: string; isDuplicate?: boolean }> {
    const config = getUnicommerceConfig();

    if (config.isDemoMode || !config.password) {
      await UnicommerceLogger.info('orders.create_demo', `Order ${order.id} simulated in demo mode`, order.id);
      return { success: true, uniwareCode: `UC-${order.id}` };
    }

    try {
      const itemsXml = order.items
        .map(
          (item) => `
        <ser:SaleOrderItem>
          <ser:ItemSKU>${item.sku}</ser:ItemSKU>
          <ser:ItemName><![CDATA[${item.name || item.sku}]]></ser:ItemName>
          <ser:ShippingMethodCode>STD</ser:ShippingMethodCode>
          <ser:SellingPrice>${item.price.toFixed(2)}</ser:SellingPrice>
          <ser:TotalTax>${(item.taxAmount || 0).toFixed(2)}</ser:TotalTax>
          <ser:Discount>${(item.discountAmount || 0).toFixed(2)}</ser:Discount>
          <ser:PacketNumber>1</ser:PacketNumber>
        </ser:SaleOrderItem>`
        )
        .join('');

      const soapBody = `
      <ser:CreateSaleOrderRequest>
        <ser:SaleOrder>
          <ser:Code>${order.displayCode}</ser:Code>
          <ser:Channel>${channelCode}</ser:Channel>
          <ser:DisplayOrderCode>${order.displayCode}</ser:DisplayOrderCode>
          <ser:OrderDate>${order.createdAt || new Date().toISOString()}</ser:OrderDate>
          <ser:CashOnDelivery>${order.paymentMethod === 'COD' ? 'true' : 'false'}</ser:CashOnDelivery>
          <ser:CustomerName><![CDATA[${order.shippingAddress.name}]]></ser:CustomerName>
          <ser:CustomerEmail>${order.shippingAddress.email || ''}</ser:CustomerEmail>
          <ser:CustomerPhone>${order.shippingAddress.phone || ''}</ser:CustomerPhone>
          <ser:BillingAddress>
            <ser:Name><![CDATA[${order.billingAddress?.name || order.shippingAddress.name}]]></ser:Name>
            <ser:AddressLine1><![CDATA[${order.billingAddress?.addressLine1 || order.shippingAddress.addressLine1}]]></ser:AddressLine1>
            <ser:City>${order.billingAddress?.city || order.shippingAddress.city}</ser:City>
            <ser:State>${order.billingAddress?.state || order.shippingAddress.state}</ser:State>
            <ser:Country>${order.billingAddress?.country || order.shippingAddress.country || 'India'}</ser:Country>
            <ser:Pincode>${order.billingAddress?.pincode || order.shippingAddress.pincode}</ser:Pincode>
            <ser:Phone>${order.billingAddress?.phone || order.shippingAddress.phone || ''}</ser:Phone>
          </ser:BillingAddress>
          <ser:ShippingAddress>
            <ser:Name><![CDATA[${order.shippingAddress.name}]]></ser:Name>
            <ser:AddressLine1><![CDATA[${order.shippingAddress.addressLine1}]]></ser:AddressLine1>
            <ser:City>${order.shippingAddress.city}</ser:City>
            <ser:State>${order.shippingAddress.state}</ser:State>
            <ser:Country>${order.shippingAddress.country || 'India'}</ser:Country>
            <ser:Pincode>${order.shippingAddress.pincode}</ser:Pincode>
            <ser:Phone>${order.shippingAddress.phone || ''}</ser:Phone>
          </ser:ShippingAddress>
          <ser:SaleOrderItems>${itemsXml}</ser:SaleOrderItems>
        </ser:SaleOrder>
      </ser:CreateSaleOrderRequest>`;

      const res = await soapRequest<any>('CreateSaleOrderRequest', soapBody);

      if (res.successful) {
        return { success: true, uniwareCode: res.code || order.displayCode };
      }

      // Check if duplicate order
      if (res.message?.includes('already exists') || res.code?.includes('DUPLICATE')) {
        return { success: true, uniwareCode: order.displayCode, isDuplicate: true };
      }

      await UnicommerceLogger.warn('orders.create_rejected', `Uniware rejected order: ${res.message}`, order.id, res);
      return { success: false, error: res.message || 'Creation rejected' };
    } catch (err: any) {
      await UnicommerceLogger.error('orders.create_failed', `Exception calling Uniware`, err, order.id);
      return { success: false, error: err.message };
    }
  }
}
