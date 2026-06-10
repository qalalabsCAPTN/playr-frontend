import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { eventPublisher } from '@playr/nectar-core';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "development_webhook_secret";

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'order.paid') {
      const paymentEntity = event.payload.payment.entity;
      
      // Async NECTAR emission ensuring system resilience
      await eventPublisher.emitPurchaseCompleted({
        orderId: paymentEntity.order_id,
        userId: paymentEntity.notes?.userId || "unknown",
        totalAmount: paymentEntity.amount / 100,
        currency: paymentEntity.currency,
        paymentMethod: paymentEntity.method,
        timestamp: new Date().toISOString(),
        items: [] // usually derived from database via orderId in a real async webhook
      });
      
      return NextResponse.json({ status: "ok" });
    }

    return NextResponse.json({ status: "ignored" });
  } catch (err) {
    console.error("Webhook processing failed", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
