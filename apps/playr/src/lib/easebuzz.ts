import crypto from 'crypto';

export interface EasebuzzPaymentParams {
  txnid: string;
  amount: string; // Formatted with 2 decimals e.g. "999.00"
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl?: string;
  furl?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  udf6?: string;
  udf7?: string;
  udf8?: string;
  udf9?: string;
  udf10?: string;
}

export interface EasebuzzConfig {
  key: string;
  salt: string;
  env: 'test' | 'prod';
}

export function getEasebuzzConfig(): EasebuzzConfig {
  const env = (process.env.EASEBUZZ_ENV === 'prod' || process.env.NODE_ENV === 'production') ? 'prod' : 'test';
  const key = process.env.EASEBUZZ_MERCHANT_KEY || '2PBP7CABJY';
  const salt = process.env.EASEBUZZ_SALT || 'DAH6OV4O0R';
  return { key, salt, env };
}

/**
 * Generate SHA-512 signature hash for Easebuzz payment initiation
 * Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
 */
export function generateEasebuzzHash(
  params: EasebuzzPaymentParams,
  key: string,
  salt: string
): string {
  const {
    txnid,
    amount,
    productinfo,
    firstname,
    email,
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
  } = params;

  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Verify reverse SHA-512 hash on Easebuzz payment response/callback
 * Format: salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
export function verifyEasebuzzResponseHash(
  responsePayload: Record<string, any>,
  key: string,
  salt: string
): boolean {
  const {
    status = '',
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
    hash = '',
  } = responsePayload;

  const reverseHashString = `${salt}|${status}|${udf10}|${udf9}|${udf8}|${udf7}|${udf6}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

  return calculatedHash.toLowerCase() === (hash || '').toLowerCase();
}

export function getEasebuzzEndpoint(env: 'test' | 'prod'): string {
  return env === 'prod'
    ? 'https://pay.easebuzz.in/payment/initiateLink'
    : 'https://testpay.easebuzz.in/payment/initiateLink';
}
