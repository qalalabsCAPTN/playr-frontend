"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { signUpWithEmailAction } from "@/app/actions/auth";
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function CreateAccountForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);
  const [socialPending, setSocialPending] = useState(false);
  const [error, setError] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(false);

  const isAnyPending = pending || socialPending;

  async function handleSignUp() {
    setError("");
    if (!fullName.trim()) { setError("Name required."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Valid email required."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setPending(true);
    const result = await signUpWithEmailAction(
      email.trim(),
      password,
      fullName.trim()
    );
    setPending(false);

    if (!result.success) {
      setError(result.error || "Sign up failed.");
      return;
    }

    if (result.data?.user && !result.data.session) {
      setVerifyEmail(true);
      return;
    }

    router.replace("/account");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setError("");
    setSocialPending(true);
    try {
      const siteUrl = window.location.origin;
      const redirectTo = `${siteUrl}/auth/callback?next=/account`;
      const supabase = createBrowserSupabaseClient();
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (oauthError || !data?.url) {
        setSocialPending(false);
        setError(oauthError?.message || "Sign-in failed. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch (err: any) {
      setSocialPending(false);
      setError(err?.message || "Google sign-in failed.");
    }
  }

  if (verifyEmail) {
    return (
      <div className="lmodal" style={{ position: 'static', margin: '40px auto', maxWidth: 440 }}>
        <span className="lmodal__eyebrow">Check your inbox</span>
        <h2 className="lmodal__title">Confirm your email</h2>
        <p className="lmodal__sub">
          We sent a verification link to <strong>{email}</strong>. Please check your inbox to activate your playR account.
        </p>
        <Link href="/login" className="lmodal__submit" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="lmodal" style={{ position: 'static', margin: '40px auto', maxWidth: 440 }}>
      <span className="lmodal__eyebrow">Join the Squad</span>
      <h2 className="lmodal__title">Create Account</h2>
      <p className="lmodal__sub">Unlock exclusive athlete drops, rewards points &amp; order tracking.</p>

      {error && (
        <p className="lmodal__error" style={{ marginBottom: 16, textAlign: 'center' }}>
          {error}
        </p>
      )}

      <div className="lmodal__socials">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isAnyPending}
          className="lmodal__social"
        >
          {socialPending ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="animate-spin" viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting…
            </span>
          ) : (
            <>
              <GoogleIcon />
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      <div className="lmodal__divider"><span>or with email</span></div>

      <div className="lmodal__form">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          autoComplete="name"
          disabled={isAnyPending}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          autoComplete="email"
          disabled={isAnyPending}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)"
          autoComplete="new-password"
          disabled={isAnyPending}
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm Password"
          autoComplete="new-password"
          disabled={isAnyPending}
        />

        <button
          type="button"
          onClick={handleSignUp}
          disabled={isAnyPending}
          className="lmodal__submit"
        >
          {pending ? "Creating account…" : "Create Account"}
        </button>
      </div>

      <p className="lmodal__foot">
        Already have an account?{" "}
        <Link href="/login" className="lmodal__foot-link">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function CreateAccountPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
        <CreateAccountForm />
      </Suspense>
    </main>
  );
}
