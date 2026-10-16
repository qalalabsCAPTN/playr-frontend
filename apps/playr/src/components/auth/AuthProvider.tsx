'use client';

import React, { useEffect, useRef } from 'react';
import { useAuthStore, User } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

/**
 * AuthProvider — centralized Supabase hydration wrapper.
 * Handles zero-flicker sync between Server-side session and Client-side store.
 * Also manages cart merge after login.
 */
export default function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const sync = useAuthStore((s) => s.sync);
  const setHydrated = useAuthStore((s) => s.setHydrated);
  const mergeCartAfterLogin = useCartStore((s) => s.mergeCartAfterLogin);
  const clientFallbackDone = useRef(false);
  const prevInitialUser = useRef<User | null | undefined>(undefined);
  const prevUser = useRef<User | null>(null);

  useEffect(() => {
    async function initAuth() {
      const prev = prevInitialUser.current;
      prevInitialUser.current = initialUser;

      const isSupabaseConfigured = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      // SSR user arrives
      if (initialUser) {
        sync(initialUser);
        setHydrated();
        return;
      }

      // Soft logout: SSR user cleared on refresh
      if (prev) {
        sync(null);
        setHydrated();
        return;
      }

      // First paint with no SSR user — check client session once
      if (clientFallbackDone.current) {
        setHydrated();
        return;
      }
      clientFallbackDone.current = true;

      if (isSupabaseConfigured) {
        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { getProfileAction } = await import('@/app/actions/auth');
            const profile = await getProfileAction();
            sync(profile ?? null);
          } else {
            const currentUser = useAuthStore.getState().user;
            if (currentUser?.id === 'usr_athlete_preview') {
              // Preserve preview session for local visual testing & demo exploration
              sync(currentUser);
            } else {
              sync(null);
            }
          }

          // Listen to live auth state changes
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession?.user) {
              const { getProfileAction } = await import('@/app/actions/auth');
              const profile = await getProfileAction();
              sync(profile ?? null);
            } else if (event === 'SIGNED_OUT') {
              sync(null);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        } catch (e) {
          console.error('[AuthProvider] Client-side session fallback check failed:', e);
          sync(null);
        }
      } else {
        const currentUser = useAuthStore.getState().user;
        if (!currentUser) {
          sync(null);
        }
      }

      setHydrated();
    }

    void initAuth();
  }, [initialUser, sync, setHydrated]);

  // Cart merge: detect login transition and merge guest cart into authenticated cart
  useEffect(() => {
    const wasLoggedOut = !prevUser.current;
    const justLoggedIn = initialUser && wasLoggedOut;
    prevUser.current = initialUser ?? null;

    if (justLoggedIn) {
      void mergeCartAfterLogin();
    }
  }, [initialUser, mergeCartAfterLogin]);

  return <>{children}</>;
}
