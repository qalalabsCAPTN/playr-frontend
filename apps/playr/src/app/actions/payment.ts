"use server"

import crypto from "crypto";

export async function createRazorpayOrderAction(amount: number) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    throw new Error("Invalid order amount");
  }

  try {
    // In production, call Razorpay API directly:
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET });
    // const order = await razorpay.orders.create({ amount: Math.round(amount * 100), currency: "INR", receipt: `receipt_${Date.now()}` });
    
    // Simulating a real API call to the gateway
    const mockProviderOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    
    return {
      orderId: mockProviderOrderId,
      amount: Math.round(amount * 100),
      currency: "INR",
    };
  } catch (err) {
    console.error("Failed to create Razorpay order", err);
    throw new Error("Payment initialization failed");
  }
}

export async function verifyPaymentSignatureAction(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new Error("Missing signature verification parameters");
  }

  // Security Verification (Production standard)
  const secret = process.env.RAZORPAY_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error("Payment gateway configuration missing on server.");
    }
  }

  const effectiveSecret = secret || "development_secret";
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", effectiveSecret)
    .update(body.toString())
    .digest("hex");

  // In production, expectedSignature MUST match razorpaySignature exactly
  const isAuthentic = process.env.NODE_ENV === 'production'
    ? expectedSignature === razorpaySignature
    : (expectedSignature === razorpaySignature || (!secret && process.env.NODE_ENV === 'development'));

  if (!isAuthentic) {
    throw new Error("Invalid payment signature");
  }

  return { verified: true, paymentId: razorpayPaymentId };
}
