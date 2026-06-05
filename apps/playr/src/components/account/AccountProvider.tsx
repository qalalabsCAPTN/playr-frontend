"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { UserProfile, Order, WalletState, RewardsState, MockLoyaltyService, identityAdapter } from "@playr/nectar-core"

interface AccountContextType {
  profile: UserProfile | null;
  orders: Order[];
  wallet: WalletState | null;
  rewards: RewardsState | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [wallet, setWallet] = useState<WalletState | null>(null)
  const [rewards, setRewards] = useState<RewardsState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const mockUserId = "usr_1" // Since we don't have real Auth yet
      const [prof, ords, wal, rew] = await Promise.all([
        identityAdapter.getProfile(mockUserId),
        identityAdapter.getOrders(mockUserId),
        MockLoyaltyService.getWalletBalance(),
        MockLoyaltyService.getRewardsPoints()
      ])
      setProfile(prof)
      setOrders(ords)
      setWallet(wal)
      setRewards(rew)
    } catch (err) {
      setError("Failed to load account data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <AccountContext.Provider value={{
      profile,
      orders,
      wallet,
      rewards,
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
