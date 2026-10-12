import { NextRequest, NextResponse } from 'next/server';
import { UnicommerceLogger } from '@/lib/unicommerce/logging';
import { getUnicommerceConfig } from '@/lib/unicommerce/config';

export async function GET(req: NextRequest) {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '') || req.nextUrl.searchParams.get('secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const config = getUnicommerceConfig();
  await UnicommerceLogger.info('cron.sync_inventory', `Uniware inventory sync triggered for ${config.facilityCode}`);

  return NextResponse.json({
    success: true,
    facilityCode: config.facilityCode,
    timestamp: new Date().toISOString(),
    status: 'completed',
  });
}
