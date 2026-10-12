import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, points, rewardId } = body;

    if (!userId || !points) {
      return NextResponse.json({ error: 'Missing userId or points' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: profile } = await admin
      .from('profiles')
      .select('loyalty_points')
      .eq('id', userId)
      .maybeSingle();

    const currentPoints = profile?.loyalty_points || 0;
    if (currentPoints < points) {
      return NextResponse.json({ error: 'Insufficient points balance' }, { status: 400 });
    }

    const newBalance = currentPoints - points;
    await admin.from('profiles').update({ loyalty_points: newBalance }).eq('id', userId);

    return NextResponse.json({
      success: true,
      redeemedPoints: points,
      remainingBalance: newBalance,
      rewardId,
      code: `PLAYR-RD-${Math.floor(100000 + Math.random() * 900000)}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Redemption error' }, { status: 500 });
  }
}
