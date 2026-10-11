import { NextRequest, NextResponse } from 'next/server';
import { getEasebuzzConfig, generateEasebuzzHash, getEasebuzzEndpoint } from '@/lib/easebuzz';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      firstname = 'Valued Customer',
      email = 'customer@playr.in',
      phone = '9999999999',
      productinfo = 'playR Order',
      txnid = `PR_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      surl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://playr.in'}/order-success/${txnid}`,
      furl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://playr.in'}/checkout?failed=true`,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
    } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    const formattedAmount = numAmount.toFixed(2);
    const { key, salt, env } = getEasebuzzConfig();

    const paymentParams = {
      txnid,
      amount: formattedAmount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    };

    const hash = generateEasebuzzHash(paymentParams, key, salt);
    const easebuzzUrl = getEasebuzzEndpoint(env);

    return NextResponse.json({
      success: true,
      key,
      txnid,
      amount: formattedAmount,
      productinfo,
      firstname,
      email,
      phone,
      surl,
      furl,
      hash,
      env,
      easebuzzUrl,
      orderId: txnid,
    });
  } catch (err: any) {
    console.error('Easebuzz checkout error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err?.message }, { status: 500 });
  }
}
