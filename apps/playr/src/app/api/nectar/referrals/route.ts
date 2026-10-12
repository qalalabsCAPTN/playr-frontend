import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'guest';
  const referralCode = `PLAYR-${userId.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

  return NextResponse.json({
    referralCode,
    shareUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://playr.in'}?ref=${referralCode}`,
    rewardPointsPerReferral: 200,
    successfulReferrals: 0,
  });
}
