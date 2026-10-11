import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eventPublisher } from '@playr/nectar-core';
import { getEasebuzzConfig, verifyEasebuzzResponseHash } from '@/lib/easebuzz';

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let bodyData: any = {};
    let rawBody = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        bodyData[key] = value.toString();
      });
    } else {
      rawBody = await req.text();
      try {
        bodyData = JSON.parse(rawBody);
      } catch {
        bodyData = {};
      }
    }

    // 1. Easebuzz Webhook Verification (CR-PAY-N03: Webhook tampering / hash mismatch)
    if (bodyData.status && (bodyData.txnid || bodyData.easepayid)) {
      const { key, salt } = getEasebuzzConfig();
      const isValidEasebuzz = verifyEasebuzzResponseHash(bodyData, key, salt);

      if (!isValidEasebuzz && process.env.NODE_ENV === 'production') {
        console.error('Easebuzz callback hash mismatch / tampering detected', bodyData);
        return NextResponse.json({ error: 'Invalid hash signature' }, { status: 400 });
      }

      if (bodyData.status === 'success') {
        await eventPublisher.emitPurchaseCompleted({
          orderId: bodyData.txnid || bodyData.easepayid,
          userId: bodyData.email || 'unknown',
          totalAmount: parseFloat(bodyData.amount || '0'),
          currency: 'INR',
          paymentMethod: 'easebuzz',
          timestamp: new Date().toISOString(),
          items: [],
        });
        return NextResponse.json({ status: 'ok', message: 'Easebuzz payment verified' });
      } else {
        return NextResponse.json({ status: 'failed', message: 'Payment marked unsuccessful' });
      }
    }

    // 2. Legacy / Generic Signature Webhook
    const signature = req.headers.get('x-razorpay-signature');
    if (signature) {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'development_webhook_secret';
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature && process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }

      if (bodyData.event === 'order.paid') {
        const paymentEntity = bodyData.payload?.payment?.entity;
        await eventPublisher.emitPurchaseCompleted({
          orderId: paymentEntity?.order_id || 'unknown',
          userId: paymentEntity?.notes?.userId || 'unknown',
          totalAmount: (paymentEntity?.amount || 0) / 100,
          currency: paymentEntity?.currency || 'INR',
          paymentMethod: paymentEntity?.method || 'online',
          timestamp: new Date().toISOString(),
          items: [],
        });
        return NextResponse.json({ status: 'ok' });
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Payment webhook processing failed', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
