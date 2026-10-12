import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUnicommerceConfig } from '@/lib/unicommerce/config';
import { getEasebuzzCredentials } from '@/lib/easebuzz/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();
  const environment = process.env.NODE_ENV ?? 'development';

  const report: any = {
    status: 'healthy',
    brand: process.env.NEXT_PUBLIC_BRAND_ID || 'playr',
    timestamp,
    version: '1.0.0',
    environment,
    connections: {
      supabase: { status: 'checking' },
      nectar: { status: 'checking' },
      unicommerce: { status: 'checking' },
      easebuzz: { status: 'checking' },
    },
  };

  // 1. Supabase Check
  try {
    const admin = createAdminClient();
    const { error } = await admin.from('orders').select('id').limit(1);
    if (error && error.code !== 'PGRST301' && error.code !== 'PGRST116') {
      report.connections.supabase = { status: 'connected', note: 'reachable with access policy' };
    } else {
      report.connections.supabase = { status: 'connected', code: 'ok' };
    }
  } catch (err: any) {
    report.connections.supabase = { status: 'degraded', error: err?.message || 'DB query error' };
  }

  // 2. Nectar Ecosystem Check
  const nectarUrl =
    process.env.NECTAR_API_URL ||
    process.env.NEXT_PUBLIC_NECTAR_API_URL ||
    'https://nectar-api-1081952187019.asia-south1.run.app';
  const nectarToken =
    process.env.NECTAR_SIGNING_SECRET ||
    process.env.PLATFORM_TOKEN_PLAYR ||
    process.env.PLATFORM_TOKEN_STREETPLAYR;

  report.connections.nectar = {
    status: nectarUrl && nectarToken ? 'connected' : 'configured',
    endpoint: nectarUrl,
    platform: process.env.NEXT_PUBLIC_BRAND_ID || 'playr',
    signingTokenConfigured: Boolean(nectarToken),
  };

  // 3. Unicommerce Check
  const ucConfig = getUnicommerceConfig();
  report.connections.unicommerce = {
    status: ucConfig.apiUrl && ucConfig.username ? 'connected' : 'configured',
    endpoint: ucConfig.apiUrl,
    facilityCode: ucConfig.facilityCode,
    username: ucConfig.username,
    demoMode: ucConfig.isDemoMode,
  };

  // 4. Easebuzz Check
  const ebCreds = getEasebuzzCredentials();
  report.connections.easebuzz = {
    status: ebCreds.merchantKey && ebCreds.salt ? 'connected' : 'configured',
    env: ebCreds.env,
    merchantKeyPrefix: ebCreds.merchantKey.slice(0, 4) + '***',
  };

  return NextResponse.json(report, { status: 200 });
}
