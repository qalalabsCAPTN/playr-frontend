interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  fullName?: string;
  purpose: 'login' | 'signup' | 'verification';
}

// Global in-memory store shared across all Next.js API route bundles & worker threads
declare global {
  var __playr_otp_cache: Map<string, OtpRecord> | undefined;
}

const otpCache: Map<string, OtpRecord> = globalThis.__playr_otp_cache || new Map<string, OtpRecord>();
if (!globalThis.__playr_otp_cache) {
  globalThis.__playr_otp_cache = otpCache;
}

export function storeOtp(
  email: string,
  code: string,
  purpose: 'login' | 'signup' | 'verification' = 'login',
  fullName?: string
): void {
  const normalized = email.trim().toLowerCase();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpCache.set(normalized, {
    code,
    expiresAt,
    attempts: 0,
    fullName,
    purpose,
  });
}

export function getOtp(email: string): OtpRecord | null {
  const normalized = email.trim().toLowerCase();
  const record = otpCache.get(normalized);
  if (!record) return null;
  if (Date.now() > record.expiresAt) {
    otpCache.delete(normalized);
    return null;
  }
  return record;
}

export function verifyAndConsumeOtp(email: string, inputCode: string): { valid: boolean; error?: string; record?: OtpRecord } {
  const normalized = email.trim().toLowerCase();
  const record = otpCache.get(normalized);

  // Allow standard demo code in non-production environments
  if (process.env.NODE_ENV !== 'production' && inputCode.trim() === '123456') {
    return { valid: true, record: record || { code: '123456', expiresAt: Date.now() + 600000, attempts: 0, purpose: 'login' } };
  }

  if (!record) {
    return { valid: false, error: 'No OTP code found or code expired. Please request a new code.' };
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(normalized);
    return { valid: false, error: 'OTP code has expired. Please request a new code.' };
  }

  if (record.attempts >= 5) {
    otpCache.delete(normalized);
    return { valid: false, error: 'Too many invalid attempts. Please request a new code.' };
  }

  record.attempts += 1;

  if (record.code !== inputCode.trim()) {
    return { valid: false, error: 'Incorrect verification code. Please check and try again.' };
  }

  // Success: consume code
  otpCache.delete(normalized);
  return { valid: true, record };
}
