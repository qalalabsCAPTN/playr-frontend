'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import LoginModal from './LoginModal';

/**
 * In-place auth gate for the account section. Instead of redirecting away,
 * renders a clean sign-in panel with the login popup, so the user never leaves
 * the dashboard shell.
 */
const DEMO_USER = {
  id: "usr_athlete_preview",
  username: "alexmercer",
  name: "Alex Mercer",
  phone: "+91 98765 43210",
  email: "athlete@playr.in",
  avatar: null,
  referralCode: "PLAYR-PRO",
  walletId: "wal_1001",
  joinedFrom: "preview",
  authProvider: "phone" as const,
  isOnboarded: true,
  memberSince: "2026-01-15T00:00:00.000Z",
  sprrBalance: 2450,
  role: "member" as const,
  tier: "STREET"
};

export default function ProfileGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const sync = useAuthStore((s) => s.sync);
  const [loginOpen, setLoginOpen] = useState(true);

  // Avoid flash before Zustand rehydrates
  if (!isHydrated) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="acct-empty max-w-md w-full mx-auto text-center space-y-4">
          <span className="lmodal__eyebrow">playR Locker</span>
          <h2 className="acct-empty__title font-black text-2xl uppercase tracking-tight text-on-surface">Sign In to View Your Account</h2>
          <p className="acct-empty__sub text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            Your points, order history, athlete tier, and saved delivery addresses live here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button type="button" className="pill bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity" onClick={() => setLoginOpen(true)}>
              Sign In to playR
            </button>
            <button 
              type="button" 
              onClick={() => sync(DEMO_USER)}
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest border border-outline-variant/60 text-on-surface hover:bg-on-surface/5 transition-colors"
            >
              Preview Demo Locker
            </button>
          </div>
        </div>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} redirectTo="/account" />
      </div>
    );
  }

  return <>{children}</>;
}
