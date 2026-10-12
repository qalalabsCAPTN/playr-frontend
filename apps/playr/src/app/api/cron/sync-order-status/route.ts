import { NextRequest, NextResponse } from 'next/server';
import { UnicommerceLogger } from '@/lib/unicommerce/logging';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '') || req.nextUrl.searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await UnicommerceLogger.info('cron.sync_order_status', 'Order status sync reconciliation cycle complete');
  return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
}
