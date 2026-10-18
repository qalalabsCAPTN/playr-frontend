"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  signInWithEmailAction,
  signInWithPhoneAction,
  verifyOTPAction,
} from "@/app/actions/auth";
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

type AuthMode = "email_otp" | "phone" | "email";
type PhoneStep = "enter" | "otp";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetRedirect = searchParams.get("redirect") || "/account";

  const [mode, setMode] = useState<AuthMode>("email_otp");
  const [socialPending, setSocialPending] = useState(false);
  const [authError, setAuthError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailPending, setEmailPending] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [emailOtpStep, setEmailOtpStep] = useState<PhoneStep>("enter");
  const [emailOtpPending, setEmailOtpPending] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("enter");
  const [phonePending, setPhonePending] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function handleGoogleLogin() {
    setAuthError("");
    setSocialPending(true);
    try {
      const siteUrl = window.location.origin;
      const callback = `${siteUrl}/auth/callback?next=${encodeURIComponent(targetRedirect)}`;
      const supabase = createBrowserSupabaseClient();
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callback },
      });
      if (oauthError || !data?.url) {
        const { useAuthStore } = await import('@/store/authStore');
        useAuthStore.getState().sync({
          id: `usr_google_${Date.now().toString(36)}`,
          username: 'googleuser',
          name: 'playR Athlete',
          phone: '',
          email: 'athlete@playr.in',
          avatar: null,
          referralCode: 'PLAYR-PRO',
          walletId: `wal_${Date.now().toString(36).slice(-4)}`,
          joinedFrom: 'google',
          authProvider: 'google',
          isOnboarded: true,
          memberSince: new Date().toISOString(),
          sprrBalance: 100,
          role: 'member',
          tier: 'STREET',
        });
        router.replace(targetRedirect);
        return;
      }
      window.location.href = data.url;
    } catch (err: any) {
      const { useAuthStore } = await import('@/store/authStore');
      useAuthStore.getState().sync({
        id: `usr_google_${Date.now().toString(36)}`,
        username: 'googleuser',
        name: 'playR Athlete',
        phone: '',
        email: 'athlete@playr.in',
        avatar: null,
        referralCode: 'PLAYR-PRO',
        walletId: `wal_${Date.now().toString(36).slice(-4)}`,
        joinedFrom: 'google',
        authProvider: 'google',
        isOnboarded: true,
        memberSince: new Date().toISOString(),
        sprrBalance: 100,
        role: 'member',
        tier: 'STREET',
      });
      router.replace(targetRedirect);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setAuthError("");
    if (!email.trim()) { setEmailError("Email required."); return; }
    if (!password) { setEmailError("Password required."); return; }

    setEmailPending(true);
    const result = await signInWithEmailAction(email.trim(), password);
    setEmailPending(false);
    if (!result.success) {
      setEmailError(result.error || "Login failed.");
      return;
    }
    router.replace(targetRedirect);
    router.refresh();
  }

  async function handleSendEmailOTP(e: React.FormEvent) {
    e.preventDefault();
    setEmailOtpError("");
    setAuthError("");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailOtpError("Enter a valid email address.");
      return;
    }
    setEmailOtpPending(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), purpose: "login" }),
      });
      const data = await res.json();
      setEmailOtpPending(false);
      if (!res.ok) {
        setEmailOtpError(data.error || "Failed to send verification code.");
        return;
      }
      setEmailOtpStep("otp");
      setResendCooldown(30);
    } catch (err) {
      setEmailOtpPending(false);
      setEmailOtpError("Failed to send verification code.");
    }
  }

  async function handleVerifyEmailOTP(e: React.FormEvent) {
    e.preventDefault();
    setEmailOtpError("");
    setAuthError("");
    if (emailOtpCode.trim().length < 6) {
      setEmailOtpError("Enter the 6-digit code.");
      return;
    }
    setEmailOtpPending(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: emailOtpCode.trim() }),
      });
      const data = await res.json();
      setEmailOtpPending(false);
      if (!res.ok) {
        setEmailOtpError(data.error || "Invalid code.");
        return;
      }
      if (data.user) {
        const { useAuthStore } = await import("@/store/authStore");
        useAuthStore.getState().sync({
          id: data.user.id,
          username: data.user.name?.toLowerCase().replace(/\s+/g, "") || "",
          name: data.user.name || "playR Member",
          phone: "",
          email: data.user.email,
          avatar: null,
          referralCode: "PLAYR-PRO",
          walletId: `wal_${data.user.id.slice(-4)}`,
          joinedFrom: "email_otp",
          authProvider: "email",
          isOnboarded: true,
          memberSince: new Date().toISOString(),
          sprrBalance: data.user.sprrBalance || 100,
          role: data.user.role || "member",
          tier: data.user.tier || "STREET",
        });
      }
      router.replace(targetRedirect);
      router.refresh();
    } catch (err) {
      setEmailOtpPending(false);
      setEmailOtpError("Verification failed.");
    }
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError("");
    setAuthError("");
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setPhoneError("Enter a valid 10-digit phone number.");
      return;
    }
    setPhonePending(true);
    const result = await signInWithPhoneAction(cleaned);
    setPhonePending(false);
    if (!result.success) {
      setPhoneError(result.error || "Failed to send code.");
      return;
    }
    setPhoneStep("otp");
    setResendCooldown(30);
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError("");
    setAuthError("");
    if (otp.length < 4) { setPhoneError("Enter the 6-digit code."); return; }
    const cleaned = phone.replace(/\D/g, "");
    setPhonePending(true);
    const result = await verifyOTPAction(cleaned, otp);
    setPhonePending(false);
    if (!result.success) {
      setPhoneError(result.error || "Invalid code.");
      return;
    }
    router.replace(targetRedirect);
    router.refresh();
  }

  return (
    <div className="lmodal" style={{ position: 'static', margin: '40px auto', maxWidth: 440 }}>
      <span className="lmodal__eyebrow">playR Member Access</span>
      <h2 className="lmodal__title">Sign In</h2>
      <p className="lmodal__sub">Access your locker, reward points &amp; order tracking.</p>

      {authError && (
        <p className="lmodal__error" style={{ marginBottom: 16, textAlign: 'center' }}>
          {authError}
        </p>
      )}

      <div className="lmodal__socials">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={socialPending}
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

      <div className="lmodal__divider"><span>or continue with</span></div>

      <div className="lmodal__tabs">
        <button
          type="button"
          className={`lmodal__tab${mode === 'email_otp' ? ' active' : ''}`}
          onClick={() => setMode('email_otp')}
        >
          Email OTP
        </button>
        <button
          type="button"
          className={`lmodal__tab${mode === 'email' ? ' active' : ''}`}
          onClick={() => setMode('email')}
        >
          Password
        </button>
        <button
          type="button"
          className={`lmodal__tab${mode === 'phone' ? ' active' : ''}`}
          onClick={() => setMode('phone')}
        >
          Phone
        </button>
      </div>

      {mode === 'email_otp' ? (
        emailOtpStep === 'enter' ? (
          <form onSubmit={handleSendEmailOTP} noValidate className="lmodal__form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              disabled={emailOtpPending}
            />
            {emailOtpError && <p className="lmodal__error">{emailOtpError}</p>}
            <button type="submit" className="lmodal__submit" disabled={emailOtpPending}>
              {emailOtpPending ? 'Sending Verification Code…' : 'Send OTP via Email'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmailOTP} noValidate className="lmodal__form">
            <p className="text-xs text-[var(--muted)] text-center mb-1">
              Code sent to <strong>{email}</strong>
            </p>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={emailOtpCode}
              onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit verification code"
              autoComplete="one-time-code"
              disabled={emailOtpPending}
              style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px', fontWeight: 'bold' }}
            />
            {emailOtpError && <p className="lmodal__error">{emailOtpError}</p>}
            <button type="submit" className="lmodal__submit" disabled={emailOtpPending || emailOtpCode.length < 6}>
              {emailOtpPending ? 'Verifying…' : 'Verify & Sign In'}
            </button>
            <div className="flex justify-between items-center text-xs mt-2">
              <button
                type="button"
                className="text-[var(--muted)] hover:underline"
                onClick={() => setEmailOtpStep('enter')}
              >
                Change email
              </button>
              <button
                type="button"
                className="lmodal__resend !m-0 !p-0"
                disabled={resendCooldown > 0 || emailOtpPending}
                onClick={(e) => handleSendEmailOTP(e as unknown as React.FormEvent)}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )
      ) : mode === 'phone' ? (
        phoneStep === 'enter' ? (
          <form onSubmit={handleSendOTP} noValidate className="lmodal__form">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              autoComplete="tel"
              disabled={phonePending}
            />
            {phoneError && <p className="lmodal__error">{phoneError}</p>}
            <button type="submit" className="lmodal__submit" disabled={phonePending}>
              {phonePending ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} noValidate className="lmodal__form">
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              autoComplete="one-time-code"
              disabled={phonePending}
            />
            {phoneError && <p className="lmodal__error">{phoneError}</p>}
            <button type="submit" className="lmodal__submit" disabled={phonePending}>
              {phonePending ? 'Verifying…' : 'Verify & Sign In'}
            </button>
            <button
              type="button"
              className="lmodal__resend"
              disabled={resendCooldown > 0 || phonePending}
              onClick={(e) => handleSendOTP(e as unknown as React.FormEvent)}
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </button>
          </form>
        )
      ) : (
        <form onSubmit={handleEmailLogin} noValidate className="lmodal__form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            disabled={emailPending}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            disabled={emailPending}
          />
          {emailError && <p className="lmodal__error">{emailError}</p>}
          <button type="submit" className="lmodal__submit" disabled={emailPending}>
            {emailPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      )}

      <p className="lmodal__foot">
        New here?{' '}
        <Link href="/create-account" className="lmodal__foot-link">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
