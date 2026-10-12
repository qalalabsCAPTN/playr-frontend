import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { syncSprrBalanceFromNectar } from '@/lib/nectar/balance';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '') || req.nextUrl.searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const { data: users } = await admin.from('profiles').select('id').limit(50);
    const results = [];

    for (const u of users || []) {
      const res = await syncSprrBalanceFromNectar(u.id);
      results.push({ userId: u.id, ...res });
    }

    return NextResponse.json({ success: true, count: results.length, results });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
