"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuthStore } from "@/store/authStore"
import {
  UserProfile,
  Order,
  WalletState,
  RewardsState,
  type XPState,
} from "@playr/nectar-core"

interface AccountContextType {
  profile: UserProfile | null;
  orders: Order[];
  wallet: WalletState | null;
  rewards: RewardsState | null;
  xpState: XPState | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

const mapTierToRewardTier = (t?: string): "bronze" | "silver" | "gold" | "elite" => {
  if (!t) return "bronze";
  const lower = t.toLowerCase();
  if (lower.includes("legend") || lower.includes("elite")) return "elite";
  if (lower.includes("player") || lower.includes("gold")) return "gold";
  if (lower.includes("silver")) return "silver";
  return "bronze";
};

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const authUser = useAuthStore((s) => s.user)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const authLoading = useAuthStore((s) => s.isLoading)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [wallet, setWallet] = useState<WalletState | null>(null)
  const [rewards, setRewards] = useState<RewardsState | null>(null)
  const [xpState, setXpState] = useState<XPState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = useCallback(async () => {
    if (!authUser) {
      setProfile(null)
      setOrders([])
      setWallet(null)
      setRewards(null)
      setXpState(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const names = (authUser.name || '').trim().split(' ')
      const firstName = names[0] || 'Member'
      const lastName = names.slice(1).join(' ') || ''
      const memberSinceYear = authUser.memberSince
        ? new Date(authUser.memberSince).getFullYear()
        : new Date().getFullYear()

      const realProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        firstName,
        lastName,
        phone: authUser.phone || '',
        memberSince: memberSinceYear,
      }

      setProfile(realProfile)
      setWallet({
        balance: authUser.sprrBalance || 0,
        currency: 'INR',
        transactions: [],
      })
      setRewards({
        points: authUser.sprrBalance || 0,
        tier: mapTierToRewardTier(authUser.tier),
        nextTierPoints: 500,
        transactions: [],
      })

      // Fetch user's orders from API or Supabase if available
      try {
        const res = await fetch(`/api/identity/users/${authUser.id}/orders`)
        if (res.ok) {
          const ords = await res.json()
          setOrders(Array.isArray(ords) ? ords : [])
        } else {
          setOrders([])
        }
      } catch {
        setOrders([])
      }
    } catch (err: any) {
      console.error('AccountProvider refreshData error:', err)
      setError('Failed to load account data')
    } finally {
      setIsLoading(false)
    }
  }, [authUser])

  useEffect(() => {
    if (isHydrated) {
      void refreshData()
    }
  }, [isHydrated, refreshData])

  return (
    <AccountContext.Provider value={{
      profile,
      orders,
      wallet,
      rewards,
      xpState,
      isLoading: !isHydrated || authLoading || isLoading,
      error,
      refreshData
    }}>
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}
