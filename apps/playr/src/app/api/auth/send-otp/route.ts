import { NextResponse } from 'next/server';
import { sendOtpEmail } from '@/lib/email/service';
import { storeOtp } from '@/lib/auth/otp-store';

export async function POST(req: Request) {
  try {
    const { email, purpose = 'login', fullName } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    storeOtp(email, otp, purpose, fullName);

    try {
      await sendOtpEmail({
        to: email,
        otp,
        purpose,
        fullName,
      });
      console.log(`[SMTP OTP] Sent OTP to ${email} for ${purpose}`);
    } catch (mailError: any) {
      console.error('[SMTP OTP Error]', mailError);
      // In development or if test SMTP, log the code so login continues uninterrupted
      if (process.env.NODE_ENV !== 'production' || process.env.SMTP_HOST?.includes('ethereal')) {
        return NextResponse.json({
          success: true,
          message: 'Code generated. (SMTP test mode: Check terminal / Ethereal)',
          debugOtp: otp,
        });
      }
      return NextResponse.json({ error: 'Failed to send verification email. Please check SMTP configuration.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email.',
      ...(process.env.NODE_ENV !== 'production' ? { debugOtp: otp } : {}),
    });
  } catch (err: any) {
    console.error('[send-otp api error]', err);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
