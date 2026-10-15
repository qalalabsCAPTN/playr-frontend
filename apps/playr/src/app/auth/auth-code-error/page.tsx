import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Authentication Error | playR',
};

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-6 text-[var(--fg)]">
      <div className="max-w-md text-center space-y-6 bg-[var(--panel)] border border-[var(--line)] p-8 rounded-[var(--radius-lg)] shadow-2xl">
        <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--fg)]">
          Authentication Error
        </h1>
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Session authorization could not be completed.
        </p>
        <p className="text-xs text-[var(--muted)]">
          The window may have been closed before completion, or the authorization request expired.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-block w-full py-3 bg-[var(--fg)] text-[var(--panel)] font-bold text-xs uppercase tracking-widest rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
