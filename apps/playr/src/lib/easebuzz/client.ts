/**
 * Easebuzz Payment Gateway Adapter for playR (Hosted Checkout Mode)
 * Initiates payment session with Easebuzz and verifies reverse response hashes.
 */

import crypto from 'crypto';
import type { PaymentEventType } from '@/lib/orchestration/types';

export type EasebuzzEnv = 'test' | 'prod';

export interface EasebuzzCredentials {
  merchantKey: string;
  salt: string;
  env: EasebuzzEnv;
}

export interface EasebuzzInitiateParams {
  txnid: string;
  amount: string; // Formatted with 2 decimals e.g. "999.00"
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  udf6?: string;
  udf7?: string;
}

export interface EasebuzzInitiateResult {
  accessKey: string;
  paymentUrl: string;
}

export function parseEasebuzzEnv(raw: string | undefined): EasebuzzEnv {
  if (raw === 'prod' || process.env.NODE_ENV === 'production') return 'prod';
  return 'test';
}

export function getEasebuzzPayHost(env: EasebuzzEnv): string {
  return env === 'prod' ? 'https://pay.easebuzz.in' : 'https://testpay.easebuzz.in';
}

export function getEasebuzzCredentials(): EasebuzzCredentials {
  const env = parseEasebuzzEnv(process.env.EASEBUZZ_ENV);
  const merchantKey = (process.env.EASEBUZZ_MERCHANT_KEY || '2PBP7CABJY').trim();
  const salt = (process.env.EASEBUZZ_SALT || 'DAH6OV4O0R').trim();
  return { merchantKey, salt, env };
}

export function generateInitiateHash(
  creds: EasebuzzCredentials,
  fields: Pick<
    EasebuzzInitiateParams,
    'txnid' | 'amount' | 'productinfo' | 'firstname' | 'email' | 'udf1' | 'udf2' | 'udf3' | 'udf4' | 'udf5' | 'udf6' | 'udf7'
  >
): string {
  const parts = [
    creds.merchantKey,
    fields.txnid,
    fields.amount,
    fields.productinfo,
    fields.firstname,
    fields.email,
    fields.udf1 ?? '',
    fields.udf2 ?? '',
    fields.udf3 ?? '',
    fields.udf4 ?? '',
    fields.udf5 ?? '',
    fields.udf6 ?? '',
    fields.udf7 ?? '',
    '', // udf8
    '', // udf9
    '', // udf10
    creds.salt,
  ];
  return crypto.createHash('sha512').update(parts.join('|')).digest('hex').toLowerCase();
}

export function verifyResponseHash(data: Record<string, string>, salt: string): boolean {
  const {
    key = '',
    txnid = '',
    amount = '',
    productinfo = '',
    firstname = '',
    email = '',
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    udf6 = '',
    udf7 = '',
    udf8 = '',
    udf9 = '',
    udf10 = '',
    status = '',
    hash = '',
  } = data;

  if (!hash) return false;

  const hashString = [
    salt,
    status,
    udf10,
    udf9,
    udf8,
    udf7,
    udf6,
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ].join('|');

  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
  const a = Buffer.from(calculatedHash.toLowerCase());
  const b = Buffer.from(hash.toLowerCase());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function mapEasebuzzStatus(status: string): PaymentEventType {
  switch (status?.toLowerCase()) {
    case 'success':
      return 'payment_intent.succeeded';
    case 'usercancelled':
    case 'userdropped':
      return 'payment_intent.canceled';
    case 'pending':
      return 'payment_intent.processing';
    case 'failure':
    case 'failed':
    default:
      return 'payment_intent.payment_failed';
  }
}

export async function initiatePayment(
  creds: EasebuzzCredentials,
  params: EasebuzzInitiateParams
): Promise<{ success: true; data: EasebuzzInitiateResult } | { success: false; error: string }> {
  const host = getEasebuzzPayHost(creds.env);
  const hash = generateInitiateHash(creds, params);

  const payload = new URLSearchParams();
  payload.set('key', creds.merchantKey);
  payload.set('txnid', params.txnid);
  payload.set('amount', params.amount);
  payload.set('productinfo', params.productinfo.slice(0, 45));
  payload.set('firstname', params.firstname || 'Customer');
  payload.set('email', params.email || 'customer@playr.in');
  payload.set('phone', params.phone || '9999999999');
  payload.set('surl', params.surl);
  payload.set('furl', params.furl);
  payload.set('hash', hash);
  if (params.udf1?.trim()) payload.set('udf1', params.udf1.trim());
  if (params.udf2?.trim()) payload.set('udf2', params.udf2.trim());
  if (params.udf3?.trim()) payload.set('udf3', params.udf3.trim());

  let response: Response;
  try {
    response = await fetch(`${host}/payment/initiateLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
      signal: AbortSignal.timeout(15000),
    });
  } catch (err: any) {
    console.error('[Easebuzz] Initiate fetch error:', err);
    return { success: false, error: err?.name === 'TimeoutError' ? 'Gateway timed out' : 'Gateway unreachable' };
  }

  const data = await response.json().catch(() => null);
  if (!data || data.status !== 1 || !data.data) {
    const errorMsg = data?.error_desc || data?.data || 'Payment initiation rejected by Easebuzz';
    console.warn('[Easebuzz] Initiate rejected:', errorMsg, data);
    return { success: false, error: String(errorMsg) };
  }

  const accessKey = String(data.data);
  return {
    success: true,
    data: {
      accessKey,
      paymentUrl: `${host}/pay/${accessKey}`,
    },
  };
}
