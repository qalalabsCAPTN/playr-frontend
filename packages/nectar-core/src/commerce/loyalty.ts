export interface WalletTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
}

export interface WalletState {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
}

export interface RewardsTransaction {
  id: string;
  date: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired';
  description: string;
}

export interface RewardsState {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'elite';
  nextTierPoints: number;
  transactions: RewardsTransaction[];
}

import { getDbUserById, updateDbUser, addDbAuditLog } from '../db/db';

export const MockLoyaltyService = {
  getWalletBalance: async (userId: string = 'real_usr_8f92a'): Promise<WalletState> => {
    let balance = 500;
    if (typeof window === 'undefined') {
      const user = await getDbUserById(userId);
      if (user) {
        balance = user.walletBalance || 0;
      }
    }

    const resolveWallet = (bal: number): WalletState => ({
      balance: bal,
      currency: 'INR',
      transactions: [
        { id: "wt_1", date: "2026-05-15T10:00:00Z", amount: 200, type: "credit" as const, description: "Refund for PR-98112" },
        { id: "wt_2", date: "2026-05-01T10:00:00Z", amount: 300, type: "credit" as const, description: "Promotional Credit" }
      ]
    });

    if (typeof window === 'undefined') {
      return resolveWallet(balance);
    }

    try {
      const res = await fetch(`/api/loyalty/users/${userId}/wallet`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("MockLoyaltyService.getWalletBalance fetch failed, returning db fallback");
    }

    const user = await getDbUserById(userId);
    return resolveWallet(user ? user.walletBalance : balance);
  },

  getRewardsPoints: async (userId: string = 'real_usr_8f92a'): Promise<RewardsState> => {
    let points = 1250;
    let tier: 'bronze' | 'silver' | 'gold' | 'elite' = 'silver';
    if (typeof window === 'undefined') {
      const user = await getDbUserById(userId);
      if (user) {
        points = user.rewardsPoints || 0;
        tier = (user.tier || 'silver') as any;
      }
    }

    const resolveRewards = (pts: number, tr: 'bronze' | 'silver' | 'gold' | 'elite'): RewardsState => ({
      points: pts,
      tier: tr,
      nextTierPoints: tr === 'bronze' ? 500 : tr === 'silver' ? 2000 : tr === 'gold' ? 5000 : 10000,
      transactions: [
        { id: "rt_1", date: "2026-05-15T10:00:00Z", points: 80, type: "earned" as const, description: "Order PR-99231" },
        { id: "rt_2", date: "2026-05-02T14:30:00Z", points: 130, type: "earned" as const, description: "Order PR-99104" }
      ]
    });

    if (typeof window === 'undefined') {
      return resolveRewards(points, tier);
    }

    try {
      const res = await fetch(`/api/loyalty/users/${userId}/rewards`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("MockLoyaltyService.getRewardsPoints fetch failed, returning db fallback");
    }

    const user = await getDbUserById(userId);
    return resolveRewards(user ? user.rewardsPoints : points, (user ? user.tier : tier) as any);
  },

  redeemWalletBalance: async (amount: number, userId: string = 'real_usr_8f92a'): Promise<boolean> => {
    if (typeof window === 'undefined') {
      const user = await getDbUserById(userId);
      if (user && (user.walletBalance || 0) >= amount) {
        await updateDbUser(userId, { walletBalance: user.walletBalance - amount });
        await addDbAuditLog(userId, 'wallet_debit', `Used ₹${amount} wallet balance at checkout.`);
        return true;
      }
      return false;
    }
    return true;
  },

  redeemRewardsPoints: async (points: number, userId: string = 'real_usr_8f92a'): Promise<boolean> => {
    if (typeof window === 'undefined') {
      const user = await getDbUserById(userId);
      if (user && (user.rewardsPoints || 0) >= points) {
        await updateDbUser(userId, { rewardsPoints: user.rewardsPoints - points });
        await addDbAuditLog(userId, 'rewards_debit', `Redeemed ${points} rewards points.`);
        return true;
      }
      return false;
    }
    return true;
  }
};
