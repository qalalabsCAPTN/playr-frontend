"use client"

/**
 * Global client-side providers.
 * Wraps the entire app — order matters:
 *   NextAuthProvider (auth)
 *   └─ CommerceProvider (cart/wishlist)
 *      └─ AccountProvider (identity + NECTAR XP/loyalty)
 */

import React from "react"
import { CommerceProvider } from "@/components/commerce/CommerceProvider"
import { AccountProvider } from "@/components/account/AccountProvider"
import { NextAuthProvider } from "@/components/auth/NextAuthProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <CommerceProvider>
        <AccountProvider>
          {children}
        </AccountProvider>
      </CommerceProvider>
    </NextAuthProvider>
  )
}
