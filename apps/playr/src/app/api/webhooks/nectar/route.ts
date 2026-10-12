import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { syncSprrBalanceFromNectar } from '@/lib/nectar/balance';
import { recordEvent } from '@/lib/orchestration/events';

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret =
    process.env.NECTAR_SIGNING_SECRET ??
    process.env.PLATFORM_TOKEN_PLAYR ??
    process.env.PLATFORM_TOKEN_STREETPLAYR ??
    '';
  if (!secret || !signatureHeader) return true; // dev permissive

  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signatureHeader);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const token = request.headers.get('x-nectar-token');
  const expectedToken =
    process.env.NECTAR_SIGNING_SECRET ??
    process.env.PLATFORM_TOKEN_PLAYR ??
    process.env.PLATFORM_TOKEN_STREETPLAYR ??
    '';

  if (expectedToken && token && token !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get('x-nectar-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: any = {};
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const userId = body.actorUserId ?? body.payload?.userId ?? body.userId;
  if (!userId) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'missing_user_id' });
  }

  const syncResult = await syncSprrBalanceFromNectar(userId);

  await recordEvent({
    domain: 'loyalty',
    severity: 'info',
    action: 'nectar.webhook_sync',
    resourceType: 'profiles',
    resourceId: userId,
    message: `Nectar webhook synced balance for ${userId}`,
    metadata: { userId, ...syncResult },
  });

  return NextResponse.json({ ok: true, balance: syncResult.balance, synced: syncResult.synced });
}
