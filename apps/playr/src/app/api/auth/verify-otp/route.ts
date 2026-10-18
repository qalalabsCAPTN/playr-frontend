import { NextResponse } from 'next/server';
import { verifyAndConsumeOtp } from '@/lib/auth/otp-store';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and 6-digit OTP code are required.' }, { status: 400 });
    }

    const verification = verifyAndConsumeOtp(email, otp);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.error || 'Invalid OTP code.' }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const name = verification.record?.fullName || normalized.split('@')[0];
    const newId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

    const userProfile = {
      id: newId,
      email: normalized,
      name: name,
      role: 'member',
      sprrBalance: 100, // Welcome bonus
      tier: 'STREET',
    };

    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully.',
      user: userProfile,
    });

    // Set playr_auth_session cookie for SSR persistence
    response.cookies.set('playr_auth_session', JSON.stringify({
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      role: userProfile.role,
    }), {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error('[verify-otp api error]', err);
    return NextResponse.json({ error: 'An unexpected error occurred during verification.' }, { status: 500 });
  }
}

