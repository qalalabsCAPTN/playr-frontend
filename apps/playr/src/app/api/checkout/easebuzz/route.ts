import { NextRequest, NextResponse } from 'next/server';
import { getEasebuzzCredentials, initiatePayment } from '@/lib/easebuzz/client';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      firstname = 'Customer',
      email = 'customer@playr.in',
      phone = '9999999999',
      productinfo = 'playR Sports Performance Order',
      txnid = `PR_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      surl,
      furl,
      udf1 = '',
      udf2 = '',
      udf3 = '',
    } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json({ error: 'Easebuzz requires amount >= 1.00 INR' }, { status: 400 });
    }

    const formattedAmount = numAmount.toFixed(2);
    const creds = getEasebuzzCredentials();

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://playr.in';
    const callbackSurl = surl || `${baseUrl}/api/webhooks/easebuzz`;
    const callbackFurl = furl || `${baseUrl}/api/webhooks/easebuzz`;

    const paymentParams = {
      txnid,
      amount: formattedAmount,
      productinfo: productinfo.slice(0, 45),
      firstname,
      email,
      phone,
      surl: callbackSurl,
      furl: callbackFurl,
      udf1: udf1 || txnid,
      udf2,
      udf3,
    };

    // Save preliminary payment intent in database if order exists
    try {
      const admin = createAdminClient();
      await admin
        .from('orders')
        .update({
          payment_intent_id: txnid,
          payment_status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${txnid},order_number.eq.${txnid}`);
    } catch {
      // Preliminary order lookup is best-effort
    }

    const result = await initiatePayment(creds, paymentParams);

    if (!result.success) {
      return NextResponse.json({ error: result.error, code: 'GATEWAY_ERROR' }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      accessKey: result.data.accessKey,
      paymentUrl: result.data.paymentUrl,
      txnid,
      amount: formattedAmount,
      key: creds.merchantKey,
    });
  } catch (err: any) {
    console.error('[Easebuzz API] Exception during checkout initiation:', err);
    return NextResponse.json({ error: 'Internal Server Error', details: err?.message }, { status: 500 });
  }
}
