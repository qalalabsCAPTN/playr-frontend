"use client"

/**
 * Global client-side providers.
 * Wraps the entire app:
 *   NextAuthProvider (legacy compatibility)
 *   └─ AuthProvider (Supabase SSR & live session sync)
 *      └─ CommerceProvider (cart/wishlist synced to Supabase)
 *         └─ AccountProvider (identity + NECTAR XP/loyalty)
 */

import React from "react"
import { CommerceProvider } from "@/components/commerce/CommerceProvider"
import { AccountProvider } from "@/components/account/AccountProvider"
import { NextAuthProvider } from "@/components/auth/NextAuthProvider"
import AuthProvider from "@/components/auth/AuthProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <AuthProvider>
        <CommerceProvider>
          <AccountProvider>
            {children}
          </AccountProvider>
        </CommerceProvider>
      </AuthProvider>
    </NextAuthProvider>
  )
}
