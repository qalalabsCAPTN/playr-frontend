import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { recordEvent } from '@/lib/orchestration/events';
import { getEasebuzzCredentials, verifyResponseHash } from '@/lib/easebuzz/client';
import { emitPurchaseCompleted } from '@/lib/nectar/client';
import { forwardPaidOrderToUnicommerce } from '@/lib/unicommerce/forward';

function parseCallbackData(req: Request, formData?: FormData): Record<string, string> {
  const data: Record<string, string> = {};
  if (formData) {
    formData.forEach((val, key) => {
      data[key] = val.toString();
    });
    return data;
  }
  const url = new URL(req.url);
  url.searchParams.forEach((val, key) => {
    data[key] = val;
  });
  return data;
}

async function handleEasebuzzCallback(data: Record<string, string>): Promise<NextResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://playr.in';
  const creds = getEasebuzzCredentials();

  const isVerified = verifyResponseHash(data, creds.salt);
  if (!isVerified && process.env.NODE_ENV === 'production') {
    await recordEvent({
      domain: 'payment',
      severity: 'critical',
      action: 'easebuzz.invalid_signature',
      resourceType: 'orders',
      resourceId: data.txnid || 'unknown',
      message: 'Easebuzz reverse hash verification failed',
      metadata: { txnid: data.txnid },
    });
    return NextResponse.redirect(`${baseUrl}/checkout?failed=true&reason=signature_mismatch`, 303);
  }

  const txnid = data.txnid || data.easepayid;
  const orderRef = data.udf1 || txnid;

  if (!txnid) {
    return NextResponse.redirect(`${baseUrl}/checkout?failed=true&reason=missing_txn`, 303);
  }

  const isSuccess = data.status?.toLowerCase() === 'success';
  const admin = createAdminClient();

  // Find and update the order in Supabase
  try {
    const { data: order } = await admin
      .from('orders')
      .select('id, order_number, grand_total, status, payment_status, currency, customer_id')
      .or(`payment_intent_id.eq.${txnid},id.eq.${orderRef},order_number.eq.${orderRef}`)
      .maybeSingle();

    if (order) {
      const orderId = order.id;
      if (isSuccess) {
        await admin
          .from('orders')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_intent_id: txnid,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        // Record payment success event
        await recordEvent({
          domain: 'payment',
          severity: 'info',
          action: 'easebuzz.payment_success',
          resourceType: 'orders',
          resourceId: orderId,
          message: `Easebuzz payment successful for order ${order.order_number || orderId}`,
          metadata: { txnid, amount: data.amount, mode: data.mode },
        });

        // 1. Emit purchase completed to NECTAR API
        try {
          await emitPurchaseCompleted({
            id: orderId,
            customer_id: order.customer_id,
            grand_total: order.grand_total,
            currency: order.currency,
          });
        } catch (e: any) {
          console.warn('[Easebuzz Webhook] Nectar emit warning:', e?.message);
        }

        // 2. Forward paid order to UNICOMMERCE
        try {
          await forwardPaidOrderToUnicommerce(orderId);
        } catch (e: any) {
          console.warn('[Easebuzz Webhook] Unicommerce forward warning:', e?.message);
        }

        return NextResponse.redirect(`${baseUrl}/order-success/${order.order_number || orderId}`, 303);
      } else {
        await admin
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        return NextResponse.redirect(`${baseUrl}/checkout?failed=true&order_id=${orderId}`, 303);
      }
    }
  } catch (err: any) {
    console.error('[Easebuzz Webhook] DB update error:', err);
  }

  // Fallback redirect if order row not located
  if (isSuccess) {
    return NextResponse.redirect(`${baseUrl}/order-success/${orderRef}`, 303);
  } else {
    return NextResponse.redirect(`${baseUrl}/checkout?failed=true&order_id=${orderRef}`, 303);
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    return handleEasebuzzCallback(parseCallbackData(req, formData));
  } catch (err: any) {
    console.error('[Easebuzz Webhook] POST error:', err);
    return NextResponse.json({ error: 'Webhook processing error', details: err?.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    return handleEasebuzzCallback(parseCallbackData(req));
  } catch (err: any) {
    console.error('[Easebuzz Webhook] GET error:', err);
    return NextResponse.json({ error: 'Webhook processing error', details: err?.message }, { status: 500 });
  }
}
