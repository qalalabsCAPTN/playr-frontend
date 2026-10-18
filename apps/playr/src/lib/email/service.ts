import nodemailer from 'nodemailer';

interface SendOtpParams {
  to: string;
  otp: string;
  purpose?: 'login' | 'signup' | 'verification';
  fullName?: string;
}

type MailTransporter = ReturnType<typeof nodemailer.createTransport>;

let transporterInstance: MailTransporter | null = null;

export function getMailTransporter(): MailTransporter {
  if (transporterInstance) {
    return transporterInstance;
  }

  const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASSWORD || '';
  const secure = port === 465;

  transporterInstance = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporterInstance;
}

export async function sendOtpEmail({ to, otp, purpose = 'login', fullName }: SendOtpParams) {
  const transporter = getMailTransporter();
  const from = process.env.TRANSACTIONAL_FROM_EMAIL || 'playR <orders@playr.in>';
  
  const actionText = purpose === 'signup' 
    ? 'create your playR account' 
    : 'sign in to your playR account';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>playR Verification Code</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0e12; color: #f3f3f3; margin: 0; padding: 40px 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #16181d; border: 1px solid #262930; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .logo { text-align: center; margin-bottom: 28px; }
          .logo-text { font-size: 32px; font-weight: 900; letter-spacing: -0.05em; color: #f3f3f3; text-transform: uppercase; }
          .logo-text span { color: #f59e0b; }
          h1 { font-size: 20px; font-weight: 800; margin: 0 0 12px; color: #ffffff; text-align: center; letter-spacing: -0.02em; }
          p { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin: 0 0 24px; text-align: center; }
          .otp-card { background: #0c0e12; border: 1px solid #3f3f46; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; }
          .otp-code { font-family: 'SF Mono', Consolas, Monaco, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #f59e0b; margin: 0; }
          .notice { font-size: 12px; color: #71717a; text-align: center; margin: 0; }
          .footer { margin-top: 36px; border-top: 1px solid #262930; padding-top: 20px; font-size: 11px; color: #52525b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <div class="logo-text">play<span>R</span></div>
          </div>
          <h1>Verification Code</h1>
          <p>
            ${fullName ? `Hello ${fullName},<br>` : ''}
            Use the 6-digit code below to ${actionText}. This code is valid for 10 minutes.
          </p>
          <div class="otp-card">
            <div class="otp-code">${otp}</div>
          </div>
          <p class="notice">
            If you did not request this verification code, please ignore this email or contact support at support@playr.in.
          </p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} playR Luxury Sportwear &amp; Performance Gear. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from,
    to,
    subject: `Your playR Verification Code: ${otp}`,
    text: `Your playR verification code is ${otp}. Valid for 10 minutes to ${actionText}.`,
    html,
  });

  if (process.env.SMTP_HOST?.includes('ethereal')) {
    console.log('[SMTP Ethereal] Preview URL:', nodemailer.getTestMessageUrl(info));
  }

  return info;
}
