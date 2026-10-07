/**
 * Live SMTP check script (adapted from StreetPlayR scripts/smtp-gmail-live-test.ts).
 * Never prints SMTP_USER or SMTP_PASSWORD in logs.
 * Usage: node scripts/test-smtp.mjs [recipient@domain.com]
 */

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq);
    let v = t.slice(eq + 1);
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function redact(s) {
  const secrets = [process.env.SMTP_PASSWORD, process.env.SMTP_USER].filter(Boolean);
  let out = String(s);
  for (const secret of secrets) {
    if (secret.length >= 4) out = out.split(secret).join('[redacted]');
  }
  return out.replace(/pass(?:word)?[=:\s]+[^\s]+/gi, 'pass=[redacted]');
}

async function main() {
  loadEnvLocal();
  console.log('--- playR SMTP Configuration Preflight ---');

  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'TRANSACTIONAL_FROM_EMAIL'];
  const missing = required.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.log('STATUS: NOT CONFIGURED');
    console.log(`REASON: Missing environment variables: ${missing.join(', ')}`);
    console.log('\nTo configure, set the following in apps/playr/.env.local:');
    console.log('  SMTP_HOST=smtp.gmail.com');
    console.log('  SMTP_PORT=465');
    console.log('  SMTP_USER=orders@playr.in');
    console.log('  SMTP_PASSWORD=<your-16-character-app-password>');
    console.log('  TRANSACTIONAL_FROM_EMAIL="playR <orders@playr.in>"');
    return;
  }

  const host = process.env.SMTP_HOST.trim();
  const port = Number(process.env.SMTP_PORT.trim());
  const user = process.env.SMTP_USER.trim();
  const pass = process.env.SMTP_PASSWORD.trim();
  const from = process.env.TRANSACTIONAL_FROM_EMAIL.trim();

  console.log('STATUS: CONFIGURED');
  console.log(`Host: ${host}`);
  console.log(`Port: ${port} (Secure: ${port === 465})`);
  console.log(`User: ${redact(user)}`);
  console.log(`From: ${from}`);

  console.log('\nTesting SMTP connection...');
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  try {
    await transporter.verify();
    console.log('SMTP Connection: SUCCESS (Transporter verified)');

    const target = process.argv[2] || process.env.SMTP_TEST_TO;
    if (target && target.includes('@')) {
      console.log(`Sending test email to ${target}...`);
      const info = await transporter.sendMail({
        from,
        to: target,
        subject: 'playR Verification Test Code',
        html: '<div style="font-family:sans-serif;background:#09090b;color:#fff;padding:24px;border-radius:8px;"><h2>playR SMTP Test</h2><p>Your test OTP is: <strong>123456</strong></p></div>',
        text: 'playR SMTP Test: Your test OTP is 123456',
      });
      console.log(`Email dispatched! Accepted recipients: ${JSON.stringify(info.accepted)}`);
    } else {
      console.log('Provide a recipient email to send a test email, e.g.:');
      console.log('  node scripts/test-smtp.mjs user@example.com');
    }
  } catch (err) {
    console.error('SMTP Connection: FAILED');
    console.error(redact(err instanceof Error ? err.message : String(err)));
  }
}

main().catch((e) => {
  console.error(redact(e instanceof Error ? e.message : String(e)));
});
