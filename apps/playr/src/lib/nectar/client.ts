/**
 * NECTAR Event Bridge — Server-only client for POST /v1/events
 * Connects playR to the central NECTAR loyalty & rewards engine.
 */

import { createHmac, randomUUID } from 'crypto';

export interface NectarEventEnvelope {
  eventId: string;
  eventType: string;
  version: number;
  timestamp: string;
  actorUserId: string;
  platform: string;
  platformTraceId?: string;
  payload: Record<string, unknown>;
}

export interface EmitEventResult {
  ok: boolean;
  status?: 'queued' | 'duplicate';
  error?: string;
}

const NECTAR_PLATFORM_ID = process.env.NEXT_PUBLIC_BRAND_ID || 'playr';

function getConfig(): { baseUrl: string; token: string } | null {
  const baseUrl =
    process.env.NECTAR_API_URL ||
    process.env.NEXT_PUBLIC_NECTAR_API_URL ||
    'https://nectar-api-1081952187019.asia-south1.run.app';

  const token =
    process.env.NECTAR_SIGNING_SECRET ||
    process.env.PLATFORM_TOKEN_PLAYR ||
    process.env.PLATFORM_TOKEN_STREETPLAYR ||
    'playr-nectar-secret';

  if (!baseUrl) return null;
  return { baseUrl: baseUrl.replace(/\/$/, ''), token };
}

export function buildEvent(params: {
  eventType: string;
  actorUserId: string;
  payload: Record<string, unknown>;
  eventId?: string;
  platformTraceId?: string;
}): NectarEventEnvelope {
  return {
    eventId: params.eventId ?? randomUUID(),
    eventType: params.eventType,
    version: 1,
    timestamp: new Date().toISOString(),
    actorUserId: params.actorUserId,
    platform: NECTAR_PLATFORM_ID,
    platformTraceId: params.platformTraceId,
    payload: params.payload,
  };
}

export async function emitEvent(event: NectarEventEnvelope): Promise<EmitEventResult> {
  const config = getConfig();
  if (!config) {
    console.warn('[nectar] NECTAR_API_URL not configured — skipping event emit', {
      eventType: event.eventType,
      eventId: event.eventId,
    });
    return { ok: false, error: 'NECTAR not configured' };
  }

  const body = JSON.stringify(event);
  const signature = 'sha256=' + createHmac('sha256', config.token).update(body).digest('hex');

  try {
    const res = await fetch(`${config.baseUrl}/v1/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Nectar-Platform': NECTAR_PLATFORM_ID,
        'X-Nectar-Token': config.token,
        'X-Nectar-Signature': signature,
      },
      body,
      signal: AbortSignal.timeout(8000),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, status: data.status || 'queued' };
    }

    const errText = await res.text().catch(() => '');
    console.warn('[nectar] Event emission failed with status:', res.status, errText);
    return { ok: false, error: `HTTP ${res.status}: ${errText}` };
  } catch (err: any) {
    console.warn('[nectar] Outbound event emit error (non-fatal):', err.message);
    return { ok: false, error: err.message };
  }
}

export async function emitPurchaseCompleted(order: {
  id: string;
  customer_id?: string | null;
  grand_total?: number | string | null;
  subtotal?: number | string | null;
  currency?: string | null;
  items?: Array<{ sku?: string; quantity?: number; price?: number }>;
}): Promise<EmitEventResult> {
  const actorUserId = order.customer_id || 'guest';
  const total = parseFloat(String(order.grand_total || '0'));

  const envelope = buildEvent({
    eventType: 'purchase.completed',
    actorUserId,
    eventId: `nectar_order_${order.id}`,
    payload: {
      orderId: order.id,
      amount: total,
      subtotal: parseFloat(String(order.subtotal || total)),
      currency: order.currency || 'INR',
      timestamp: new Date().toISOString(),
      items: order.items || [],
      brand: NECTAR_PLATFORM_ID,
    },
  });

  return emitEvent(envelope);
}
