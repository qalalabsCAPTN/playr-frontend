import nodemailer, { type Transporter } from 'nodemailer';
import { getSmtpConfig } from './smtp';
import {
  EMAIL_SUBJECT,
  type TransactionalTemplate,
  otpEmailHtml,
  otpEmailText,
  orderEmailHtml,
  orderEmailText,
  type OrderEmailDetails,
} from './templates';

export type { TransactionalTemplate, OrderEmailDetails };
export { otpEmailHtml, otpEmailText, orderEmailHtml, orderEmailText };

type SendMailer = Pick<Transporter, 'sendMail'>;

let testMailer: SendMailer | null = null;

export function __setMailerForTests(mailer: SendMailer | null): void {
  testMailer = mailer;
}

export async function sendTransactionalEmail(params: {
  to: string;
  template: TransactionalTemplate;
  subject?: string;
  html: string;
  text: string;
  referenceId?: string;
}): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  const smtp = getSmtpConfig();
  if (!smtp.ok) {
    console.warn(`[playR SMTP] Skipped sending ${params.template} to ${params.to}: ${smtp.error}`);
    return { sent: false, skipped: true, error: smtp.error };
  }

  try {
    const mailer: SendMailer =
      testMailer ??
      nodemailer.createTransport({
        host: smtp.config.host,
        port: smtp.config.port,
        secure: smtp.config.secure,
        auth: { user: smtp.config.user, pass: smtp.config.password },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
      });

    const info = await mailer.sendMail({
      from: smtp.config.from,
      to: params.to,
      subject: params.subject || EMAIL_SUBJECT[params.template],
      html: params.html,
      text: params.text,
    });

    const accepted = Array.isArray(info.accepted) ? info.accepted.length : 0;
    if (accepted < 1) {
      const error = 'SMTP server accepted 0 recipients.';
      console.error(`[playR SMTP] Failed: ${error}`);
      return { sent: false, error };
    }

    console.info(`[playR SMTP] Sent ${params.template} successfully to ${params.to}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.info(`[playR SMTP] Email Preview URL: ${previewUrl}`);
    }
    return { sent: true };
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown SMTP send failure.';
    console.error(`[playR SMTP] Send exception:`, error);
    return { sent: false, error };
  }
}

export async function sendOtpEmail(to: string, otp: string) {
  return sendTransactionalEmail({
    to,
    template: 'otp',
    html: otpEmailHtml(otp),
    text: otpEmailText(otp),
  });
}

export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  details?: OrderEmailDetails
) {
  return sendTransactionalEmail({
    to,
    template: 'order_confirmation',
    html: orderEmailHtml('Thank you for your order!', 'We have received your order and are preparing it for shipment.', orderNumber, details),
    text: orderEmailText('Thank you for your order!', 'We have received your order and are preparing it for shipment.', orderNumber, details),
    referenceId: orderNumber,
  });
}
