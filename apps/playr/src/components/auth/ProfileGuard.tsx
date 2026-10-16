'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import LoginModal from './LoginModal';

/**
 * In-place auth gate for the account section. Instead of redirecting away,
 * renders a clean sign-in panel with the login popup, so the user never leaves
 * the dashboard shell.
 */
export default function ProfileGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [loginOpen, setLoginOpen] = useState(true);

  // Avoid flash before Zustand rehydrates
  if (!isHydrated) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="acct-empty max-w-md w-full mx-auto">
          <span className="lmodal__eyebrow">playR Locker</span>
          <h2 className="acct-empty__title">Sign In to View Your Account</h2>
          <p className="acct-empty__sub">
            Your points, order history, athlete tier, and saved delivery addresses live here.
          </p>
          <button type="button" className="pill" onClick={() => setLoginOpen(true)}>
            Sign In to playR
          </button>
        </div>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} redirectTo="/account" />
      </div>
    );
  }

  return <>{children}</>;
}
