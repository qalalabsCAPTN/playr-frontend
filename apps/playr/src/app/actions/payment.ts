"use server"

import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createRazorpayOrderAction(amount: number) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized to create payment order");
  }

  try {
    // In production, you would call the Razorpay API directly here from the server:
    // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY, key_secret: process.env.RAZORPAY_SECRET });
    // const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR", receipt: `receipt_${Date.now()}` });
    
    // Simulating a real API call to the gateway
    const mockProviderOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    
    return {
      orderId: mockProviderOrderId,
      amount: amount * 100,
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
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Security Verification (Production standard)
  const secret = process.env.RAZORPAY_SECRET || "development_secret";
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  // Simulate success for dev environment if secrets match or if in mock mode
  const isAuthentic = expectedSignature === razorpaySignature || process.env.NODE_ENV === 'development';

  if (!isAuthentic) {
    throw new Error("Invalid payment signature");
  }

  return { verified: true, paymentId: razorpayPaymentId };
}
