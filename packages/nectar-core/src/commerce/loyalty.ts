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

export const MockLoyaltyService = {
  getWalletBalance: async (): Promise<WalletState> => {
    return { 
      balance: 500, 
      currency: 'INR',
      transactions: [
        { id: "wt_1", date: "2024-05-15T10:00:00Z", amount: 200, type: "credit", description: "Refund for PR-98112" },
        { id: "wt_2", date: "2024-05-01T10:00:00Z", amount: 300, type: "credit", description: "Promotional Credit" }
      ]
    };
  },
  getRewardsPoints: async (): Promise<RewardsState> => {
    return { 
      points: 1250, 
      tier: 'silver',
      nextTierPoints: 1500,
      transactions: [
        { id: "rt_1", date: "2024-05-15T10:00:00Z", points: 80, type: "earned", description: "Order PR-99231" },
        { id: "rt_2", date: "2024-05-02T14:30:00Z", points: 130, type: "earned", description: "Order PR-99104" }
      ]
    };
  },
  redeemWalletBalance: async (amount: number): Promise<boolean> => {
    return true;
  },
  redeemRewardsPoints: async (points: number): Promise<boolean> => {
    return true;
  }
};
