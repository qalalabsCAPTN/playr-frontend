import crypto from 'crypto';
import { getUnicommerceConfig } from './config';
import { UnicommerceLogger } from './logging';
import { createAdminClient } from '@/lib/supabase/admin';

export class UnicommerceWebhookService {
  static verifySignature(rawBody: string, signature: string): boolean {
    const config = getUnicommerceConfig();
    const secret = config.webhookSecret;

    if (!secret) {
      if (process.env.NODE_ENV !== 'production') return true;
      return false;
    }
    if (!signature) return false;

    try {
      const computedHash = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      const computedBuffer = Buffer.from(computedHash, 'hex');
      const signatureBuffer = Buffer.from(signature, 'hex');
      if (computedBuffer.length !== signatureBuffer.length) return false;
      return crypto.timingSafeEqual(computedBuffer, signatureBuffer);
    } catch {
      return false;
    }
  }

  async processWebhook(event: any): Promise<void> {
    await UnicommerceLogger.info('webhooks.process_event', `Webhook event: ${event.type || 'unknown'}`, 'webhook', event);
    const admin = createAdminClient();

    if (event.type === 'order.shipped' && event.payload?.orderCode) {
      const { orderCode, trackingNumber, courier } = event.payload;
      await admin
        .from('orders')
        .update({
          status: 'shipped',
          tracking_number: trackingNumber,
          carrier: courier,
          updated_at: new Date().toISOString(),
        })
        .or(`source_order_id.eq.${orderCode},order_number.eq.${orderCode}`);
    } else if (event.type === 'order.delivered' && event.payload?.orderCode) {
      const { orderCode } = event.payload;
      await admin
        .from('orders')
        .update({
          status: 'delivered',
          updated_at: new Date().toISOString(),
        })
        .or(`source_order_id.eq.${orderCode},order_number.eq.${orderCode}`);
    }
  }
}
