export type TransactionalTemplate =
  | 'otp'
  | 'order_confirmation'
  | 'welcome'
  | 'password_reset'
  | 'contact_ack';

export const EMAIL_SUBJECT: Record<TransactionalTemplate, string> = {
  otp: 'Your playR Verification Code',
  order_confirmation: 'Your playR Order is Confirmed',
  welcome: 'Welcome to playR Elite',
  password_reset: 'Reset Your playR Password',
  contact_ack: 'We Received Your Message — playR Support',
};

export type OrderEmailDetails = {
  items?: { title: string; quantity: number; price: number }[];
  total?: number;
  currency?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function money(amount: number, currency = 'INR'): string {
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN')}`;
  return `${currency} ${amount.toLocaleString('en-IN')}`;
}

export function otpEmailHtml(otp: string): string {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#09090b;color:#f4f4f5;border-radius:12px;border:1px solid #27272a;">
  <div style="border-bottom:1px solid #27272a;padding-bottom:16px;margin-bottom:24px;">
    <h2 style="margin:0;font-size:24px;font-weight:900;letter-spacing:-0.05em;color:#ffffff;text-transform:uppercase;">play<span style="color:#e11d48;">R</span></h2>
  </div>
  <p style="font-size:15px;color:#a1a1aa;line-height:1.5;">Use the following One-Time Password (OTP) to proceed with your verification or password recovery. This code is valid for 10 minutes.</p>
  <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:24px;text-align:center;margin:28px 0;">
    <span style="font-family:monospace;font-size:36px;font-weight:800;letter-spacing:10px;color:#ffffff;">${escapeHtml(otp)}</span>
  </div>
  <p style="font-size:13px;color:#71717a;line-height:1.4;">If you did not request this OTP, please ignore this email or reach out to support at <a href="mailto:info@playr.in" style="color:#e11d48;text-decoration:none;">info@playr.in</a>.</p>
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #27272a;font-size:11px;color:#52525b;text-align:center;">
    &copy; ${new Date().getFullYear()} playR. All rights reserved.
  </div>
</div>`;
}

export function otpEmailText(otp: string): string {
  return `playR Verification Code\n\nYour OTP is: ${otp}\n\nThis code is valid for 10 minutes. If you did not request this code, please ignore this email.\n\n— playR Team`;
}

export function orderEmailHtml(
  title: string,
  body: string,
  orderNumber: string,
  details?: OrderEmailDetails
): string {
  const items = details?.items ?? [];
  const itemBlock = items.length
    ? `<div style="margin:20px 0;border-top:1px solid #27272a;border-bottom:1px solid #27272a;padding:12px 0;">${items
        .map(
          (item) =>
            `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;color:#e4e4e7;">
              <span>${escapeHtml(String(item.quantity))} × ${escapeHtml(item.title)}</span>
              <span style="font-weight:600;">${escapeHtml(money(item.price, details?.currency))}</span>
            </div>`
        )
        .join('')}</div>`
    : '';

  const totalBlock =
    details?.total != null
      ? `<div style="font-size:16px;font-weight:700;display:flex;justify-content:space-between;color:#ffffff;margin-top:12px;">
          <span>Total</span>
          <span>${escapeHtml(money(details.total, details.currency))}</span>
        </div>`
      : '';

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#09090b;color:#f4f4f5;border-radius:12px;border:1px solid #27272a;">
  <div style="border-bottom:1px solid #27272a;padding-bottom:16px;margin-bottom:24px;">
    <h2 style="margin:0;font-size:24px;font-weight:900;letter-spacing:-0.05em;color:#ffffff;text-transform:uppercase;">play<span style="color:#e11d48;">R</span></h2>
  </div>
  <h3 style="font-size:20px;font-weight:700;margin:0 0 8px 0;color:#ffffff;">${escapeHtml(title)}</h3>
  <p style="font-size:14px;color:#a1a1aa;line-height:1.5;">${escapeHtml(body)}</p>
  <p style="font-size:14px;color:#e4e4e7;margin-top:16px;">Order ID: <strong style="color:#ffffff;">#${escapeHtml(orderNumber)}</strong></p>
  ${itemBlock}
  ${totalBlock}
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #27272a;font-size:11px;color:#52525b;text-align:center;">
    &copy; ${new Date().getFullYear()} playR. All rights reserved.
  </div>
</div>`;
}

export function orderEmailText(
  title: string,
  body: string,
  orderNumber: string,
  details?: OrderEmailDetails
): string {
  const items = (details?.items ?? [])
    .map((item) => `${item.quantity} × ${item.title} — ${money(item.price, details?.currency)}`)
    .join('\n');
  const total =
    details?.total != null ? `\nTotal: ${money(details.total, details.currency)}` : '';
  return `${title}\nOrder: #${orderNumber}\n\n${body}${items ? `\n\nItems:\n${items}` : ''}${total}\n\n— playR Team`;
}
