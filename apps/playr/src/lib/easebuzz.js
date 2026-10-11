const crypto = require('crypto');

function getEasebuzzConfig() {
  const env = (process.env.EASEBUZZ_ENV === 'prod' || process.env.NODE_ENV === 'production') ? 'prod' : 'test';
  const key = process.env.EASEBUZZ_MERCHANT_KEY || '2PBP7CABJY';
  const salt = process.env.EASEBUZZ_SALT || 'DAH6OV4O0R';
  return { key, salt, env };
}

function generateEasebuzzHash(params, key, salt) {
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

function verifyEasebuzzResponseHash(responsePayload, key, salt) {
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

function getEasebuzzEndpoint(env) {
  return env === 'prod'
    ? 'https://pay.easebuzz.in/payment/initiateLink'
    : 'https://testpay.easebuzz.in/payment/initiateLink';
}

module.exports = {
  getEasebuzzConfig,
  generateEasebuzzHash,
  verifyEasebuzzResponseHash,
  getEasebuzzEndpoint,
};
