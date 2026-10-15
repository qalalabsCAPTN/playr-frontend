'use client';

import React, { useState, MouseEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function LoginModal({ isOpen, onClose, redirectTo = '/account' }: LoginModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialPending, setSocialPending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (tab === 'login') {
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError('Invalid email or password.');
        } else {
          onClose();
          router.push('/account');
          router.refresh();
        }
      } else {
        const parts = name.trim().split(' ');
        const firstName = parts[0] || 'User';
        const lastName = parts.slice(1).join(' ') || 'Customer';

        const regRes = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        });

        const data = await regRes.json();
        if (!regRes.ok) {
          setError(data.error || 'Failed to create account.');
        } else {
          // Auto sign in on successful registration
          const signRes = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          if (signRes?.error) {
            setError('Registration succeeded. Please sign in.');
            setTab('login');
          } else {
            onClose();
            router.push('/account');
            router.refresh();
          }
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSocialPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const siteUrl = window.location.origin;
      const callback = `${siteUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callback },
      });

      if (oauthError || !data?.url) {
        setSocialPending(false);
        setError(oauthError?.message || 'Google sign-in failed. Please try again.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setSocialPending(false);
      setError('An unexpected error occurred during Google sign-in.');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--panel)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6 shadow-2xl relative text-[var(--fg)]"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-2xl font-bold text-[var(--muted)] hover:text-[var(--fg)] rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="flex gap-4 border-b border-[var(--line)] pb-3 mb-6">
          <button
            className={`text-lg font-bold pb-2 relative transition-colors ${
              tab === 'login' ? 'text-[var(--fg)]' : 'text-[var(--muted)]'
            }`}
            onClick={() => setTab('login')}
          >
            Sign In
            {tab === 'login' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[var(--fg)]" />
            )}
          </button>
          <button
            className={`text-lg font-bold pb-2 relative transition-colors ${
              tab === 'register' ? 'text-[var(--fg)]' : 'text-[var(--muted)]'
            }`}
            onClick={() => setTab('register')}
          >
            Create Account
            {tab === 'register' && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[var(--fg)]" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-[var(--radius-sm)] text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-semibold uppercase text-[var(--muted)] mb-1">
                Full Name
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:border-[var(--fg)]"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold uppercase text-[var(--muted)] mb-1">
              Email Address
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:border-[var(--fg)]"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold uppercase text-[var(--muted)] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:border-[var(--fg)] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)] hover:text-[var(--fg)]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || socialPending}
            className="w-full py-3 bg-[var(--fg)] text-[var(--panel)] font-bold text-sm rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
          >
            {isLoading ? 'PLEASE WAIT...' : tab === 'login' ? 'SIGN IN' : 'CONTINUE'}
          </button>
        </form>

        <div className="relative my-6 text-center text-xs text-[var(--muted)]">
          <span className="bg-[var(--panel)] px-2 relative z-10">Or continue with</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--line)]" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={socialPending || isLoading}
          className="w-full py-2.5 bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] font-medium text-xs flex items-center justify-center gap-2 hover:bg-[var(--line)] transition-colors disabled:opacity-50"
        >
          {socialPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Connecting to Google...
            </span>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </>
          )}
        </button>
      </div>
    </div>
  );
}
