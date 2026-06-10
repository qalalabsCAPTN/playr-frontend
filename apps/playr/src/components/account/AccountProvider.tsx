"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  UserProfile,
  Order,
  WalletState,
  RewardsState,
  MockLoyaltyService,
  identityAdapter,
  NectarLoyaltyAdapter,
  type XPState,
} from "@playr/nectar-core"

const loyaltyAdapter = new NectarLoyaltyAdapter()

interface AccountContextType {
  profile: UserProfile | null;
  orders: Order[];
  wallet: WalletState | null;
  rewards: RewardsState | null;
  xpState: XPState | null;       // NECTAR-owned — never computed here
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [wallet, setWallet] = useState<WalletState | null>(null)
  const [rewards, setRewards] = useState<RewardsState | null>(null)
  const [xpState, setXpState] = useState<XPState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    if (status === "loading") return;
    
    // If not authenticated, clear states
    if (!session?.user) {
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
      const userId = (session.user as any).id || "real_usr_8f92a";
      const [prof, ords, wal, rew, xp] = await Promise.all([
        identityAdapter.getProfile(userId),
        identityAdapter.getOrders(userId),
        MockLoyaltyService.getWalletBalance(), // TODO: Replace mock when backend live
        MockLoyaltyService.getRewardsPoints(), // TODO: Replace mock when backend live
        loyaltyAdapter.getUserXP(userId),
      ])
      setProfile(prof)
      setOrders(ords)
      setWallet(wal)
      setRewards(rew)
      setXpState(xp)
    } catch (err) {
      setError("Failed to load account data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  return (
    <AccountContext.Provider value={{
      profile,
      orders,
      wallet,
      rewards,
      xpState,
      isLoading,
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
