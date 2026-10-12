import crypto from 'crypto';

function timingEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function uniwareChannelUsername(): string {
  return process.env.UNICOMMERCE_CHANNEL_USERNAME || process.env.UNICOMMERCE_USERNAME || 'streetplayr';
}

export function uniwareChannelPassword(): string {
  return (
    process.env.UNICOMMERCE_CHANNEL_PASSWORD ||
    process.env.UNICOMMERCE_PASSWORD ||
    process.env.UNICOMMERCE_WEBHOOK_SECRET ||
    process.env.CRON_SECRET ||
    ''
  );
}

/** Stable token Uniware stores after /authToken. */
export function uniwareChannelAccessToken(): string {
  const secret = uniwareChannelPassword();
  if (!secret) return '';
  return crypto.createHmac('sha256', secret).update('playr-uniware-channel').digest('hex');
}

export function uniwareChannelCredentialsOk(username: string, password: string): boolean {
  const expectedUser = uniwareChannelUsername();
  const expectedPass = uniwareChannelPassword();
  if (!expectedPass) return true; // dev permissive
  return timingEqual(username.trim(), expectedUser) && timingEqual(password, expectedPass);
}

export function uniwareChannelApiKeyOk(apiKey: string): boolean {
  if (!apiKey) return false;
  const allowed = [
    uniwareChannelAccessToken(),
    process.env.UNICOMMERCE_PASSWORD,
    process.env.UNICOMMERCE_WEBHOOK_SECRET,
    process.env.CRON_SECRET,
  ].filter((v): v is string => Boolean(v));
  if (allowed.length === 0) return true; // permissive in dev
  return allowed.some((token) => timingEqual(apiKey, token));
}
