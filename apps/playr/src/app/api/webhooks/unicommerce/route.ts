import { NextResponse } from 'next/server';
import { UnicommerceWebhookService } from '@/lib/unicommerce/webhooks';
import { UnicommerceLogger } from '@/lib/unicommerce/logging';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature =
      request.headers.get('x-unicommerce-signature') ||
      request.headers.get('x-webhook-signature') ||
      request.headers.get('x-signature') ||
      '';

    const isValid = UnicommerceWebhookService.verifySignature(rawBody, signature);
    if (!isValid) {
      await UnicommerceLogger.warn('webhooks.signature_invalid', 'Invalid Unicommerce webhook signature', 'webhook');
      return NextResponse.json({ error: 'Invalid signature verification' }, { status: 401 });
    }

    let eventData;
    try {
      eventData = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const webhookService = new UnicommerceWebhookService();
    await webhookService.processWebhook(eventData);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    await UnicommerceLogger.error('webhooks.route_error', 'Webhook handler error', err, 'webhook');
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
