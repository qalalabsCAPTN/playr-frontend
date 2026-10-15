import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ALLOWED_REDIRECT_PATHS = [
  '/', '/home', '/account', '/account/orders', '/account/profile',
  '/account/addresses', '/account/returns', '/account/wishlist',
  '/cart', '/checkout', '/wishlist',
];

function isValidRedirect(path: string): boolean {
  if (!path.startsWith('/')) return false;
  if (path.includes('://') || path.includes('..')) return false;
  if (ALLOWED_REDIRECT_PATHS.includes(path)) return true;
  if (path.startsWith('/account')) return true;
  if (path.startsWith('/checkout')) return true;
  return false;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const otpType = requestUrl.searchParams.get('type');
  const nextParam = requestUrl.searchParams.get('next');
  const next = nextParam && isValidRedirect(nextParam) ? nextParam : '/account';

  const EMAIL_OTP_TYPES = ['signup', 'invite', 'magiclink', 'email', 'recovery'] as const;
  const isEmailOtpType = (
    value: string | null
  ): value is (typeof EMAIL_OTP_TYPES)[number] =>
    Boolean(value && (EMAIL_OTP_TYPES as readonly string[]).includes(value));

  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const baseUrl = forwardedHost ? `${forwardedProto}://${forwardedHost}` : requestUrl.origin;

  if (code || (tokenHash && isEmailOtpType(otpType))) {
    try {
      const cookieStore = await cookies();
      const pendingCookies: Array<{
        name: string;
        value: string;
        options: Record<string, unknown>;
      }> = [];

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://sayxtpglwjiinnrftifq.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheXh0cGdsd2ppaW5ucmZ0aWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyODQxMzksImV4cCI6MjA5Mzg2MDEzOX0.NiT5r6z4HABTfP7LXYihnkic8xSLqldEoJ6KK4HLDVU',
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) => {
                pendingCookies.push({ name, value, options });
                try {
                  cookieStore.set(name, value, options);
                } catch {
                  /* Server Component context */
                }
              });
            },
          },
        }
      );

      const { data: sessionData, error } = tokenHash && isEmailOtpType(otpType)
        ? await supabase.auth.verifyOtp({ type: otpType, token_hash: tokenHash })
        : await supabase.auth.exchangeCodeForSession(code!);

      if (error) {
        console.error('[Auth Callback] session error:', error.message, error);
        return NextResponse.redirect(`${baseUrl}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`);
      }

      // Provision or link user in local DB / Nectar Core
      const authUser = sessionData?.user;
      if (authUser && authUser.email) {
        try {
          const { getDbUserByEmail, createDbUser } = require('@playr/nectar-core');
          const existingUser = await getDbUserByEmail(authUser.email);
          if (!existingUser) {
            const fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || '';
            const parts = fullName.trim().split(' ');
            const firstName = parts[0] || 'User';
            const lastName = parts.slice(1).join(' ') || '';
            await createDbUser({
              id: authUser.id,
              email: authUser.email,
              firstName,
              lastName,
              phone: authUser.phone || '',
            });
          }
        } catch (dbErr) {
          console.error('[Auth Callback] User provisioning warning:', dbErr);
        }
      }

      const redirectDestination = `${baseUrl}${next}`;
      const response = NextResponse.redirect(redirectDestination);
      for (const { name, value, options } of pendingCookies) {
        response.cookies.set(name, value, options as any);
      }
      return response;
    } catch (e: any) {
      console.error('[Auth Callback] Exception during exchange:', e);
      return NextResponse.redirect(`${baseUrl}/auth/auth-code-error?error=${encodeURIComponent(e.message || 'unknown_exception')}`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error?error=missing_code`);
}
