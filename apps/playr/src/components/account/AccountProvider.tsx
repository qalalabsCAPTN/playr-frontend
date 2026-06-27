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
        MockLoyaltyService.getWalletBalance(userId),
        MockLoyaltyService.getRewardsPoints(userId),
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
    
    // Auto seed localStorage wishlist and recently viewed for the demo user
    if (session?.user?.email === "demo@playr.in") {
      try {
        const storedWishlist = localStorage.getItem("playr_wishlist")
        if (!storedWishlist || JSON.parse(storedWishlist).length === 0) {
          const demoWishlist = [
            {
              productId: "prod_pro_tee",
              title: "Pro Training Tee",
              price: 1299,
              imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0",
              category: "Men"
            },
            {
              productId: "prod_csk_jersey",
              title: "CSK Match Jersey 2026",
              price: 1799,
              imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA",
              category: "Club"
            }
          ]
          localStorage.setItem("playr_wishlist", JSON.stringify(demoWishlist))
        }

        const storedRecentlyViewed = localStorage.getItem("recently_viewed")
        if (!storedRecentlyViewed || JSON.parse(storedRecentlyViewed).length === 0) {
          const demoRecentlyViewed = ["pro-training-tee", "csk-match-jersey", "performance-shorts"]
          localStorage.setItem("recently_viewed", JSON.stringify(demoRecentlyViewed))
        }
      } catch (e) {
        console.error("Failed to seed localStorage for demo user", e)
      }
    }
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
