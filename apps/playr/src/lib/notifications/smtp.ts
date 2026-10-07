/**
 * Provider-agnostic SMTP config adapted from StreetPlayR architecture.
 * Default provider: Gmail / Google Workspace SMTP
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER=orders@playr.in (or your sending email)
 *   SMTP_PASSWORD=... (Google App Password / SMTP secret)
 *   TRANSACTIONAL_FROM_EMAIL=playR <orders@playr.in>
 */

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
};

const REQUIRED = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'TRANSACTIONAL_FROM_EMAIL',
] as const;

export type SmtpConfigResult =
  | { ok: true; config: SmtpConfig }
  | { ok: false; error: string; missing: string[] };

export function getSmtpConfig(): SmtpConfigResult {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    return {
      ok: false,
      error: `Email delivery is not configured (${missing.join(', ')}).`,
      missing: [...missing],
    };
  }

  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT!.trim());
  const user = process.env.SMTP_USER!.trim();
  const password = process.env.SMTP_PASSWORD!.trim();
  const from = process.env.TRANSACTIONAL_FROM_EMAIL!.trim();

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { ok: false, error: 'SMTP_PORT is invalid.', missing: [] };
  }
  if (!from.includes('@')) {
    return { ok: false, error: 'TRANSACTIONAL_FROM_EMAIL is invalid.', missing: [] };
  }

  return {
    ok: true,
    config: {
      host,
      port,
      secure: port === 465,
      user,
      password,
      from,
    },
  };
}
