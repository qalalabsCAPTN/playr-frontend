/**
 * NECTAR Gamification Service
 *
 * Single source of truth for all XP, tier, challenge, reward, and leaderboard data.
 * Frontend is RENDER ONLY — no XP calculations, no tier logic, no progression math.
 *
 * Data flow:
 *   NECTAR BFF → NectarLoyaltyAdapter → AccountProvider / page-level calls → components
 *
 * BFF endpoints required (to be implemented in NECTAR BFF):
 *   GET /api/loyalty/users/{userId}/xp
 *   GET /api/loyalty/challenges?userId={userId}  (userId optional for public list)
 *   GET /api/loyalty/rewards?userId={userId}
 *   GET /api/loyalty/leaderboard?period=all|monthly|weekly&limit=N
 *   GET /api/loyalty/products/{productId}/context?userId={userId}
 *   POST /api/loyalty/rewards/{rewardId}/redeem
 */

import { NectarTenantClient, nectarClient } from '../adapters/tenant';

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface XPTier {
  id: string;
  name: string;
  minXP: number;
  maxXP: number | null; // null = top tier (no ceiling)
  benefits: string[];
  badgeIcon: string;
}

export interface XPState {
  userId: string;
  totalXP: number;
  currentTier: XPTier;
  nextTier: XPTier | null;
  xpToNextTier: number | null;
  progressPercent: number; // 0–100, computed by backend
}

export type ChallengeType =
  | 'purchase'
  | 'review'
  | 'referral'
  | 'social'
  | 'streak'
  | 'milestone'
  | 'seasonal';

export type ChallengeStatus = 'active' | 'completed' | 'upcoming' | 'expired';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: ChallengeType;
  status: ChallengeStatus;
  progressCurrent?: number;
  progressTotal?: number;
  expiresAt?: string | null;
  badgeIcon: string;
  isPersonalized?: boolean; // true if status/progress are user-specific
}

export type RewardType =
  | 'discount'
  | 'free_shipping'
  | 'exclusive_product'
  | 'early_access'
  | 'cashback';

export interface Reward {
  id: string;
  title: string;
  description: string;
  xpCost: number;
  type: RewardType;
  value: string; // e.g. "10% off", "Free shipping", "₹200 cashback"
  isAvailable: boolean;
  minTier?: string;
  expiresAt?: string | null;
  imageUrl?: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  totalXP: number;
  tierName: string;
  isCurrentUser?: boolean;
}

export interface GamificationProductContext {
  productId: string;
  xpEarned: number;       // Base XP for this product
  tierBonus: number;       // Bonus XP based on user's tier (set by NECTAR, 0 for guests)
  totalXPEarned: number;   // xpEarned + tierBonus
  challengeContributions: Array<{
    challengeId: string;
    challengeTitle: string;
    contribution: string;  // e.g. "1 of 3 purchases"
  }>;
}

// ─── Dev Fallback Data ────────────────────────────────────────────────────────
// Used when NECTAR BFF is unavailable (development / pre-launch).
// This is PROGRAM-LEVEL data (tier definitions, available challenges) — not user state.
// Remove once NECTAR BFF is live for these endpoints.

const DEV_TIERS: Record<string, XPTier> = {
  bronze: {
    id: 'bronze',
    name: 'Bronze',
    minXP: 0,
    maxXP: 499,
    benefits: ['Early access to sale announcements'],
    badgeIcon: 'workspace_premium',
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    minXP: 500,
    maxXP: 1999,
    benefits: ['5% XP cashback on purchases', 'Early access to sales'],
    badgeIcon: 'military_tech',
  },
  gold: {
    id: 'gold',
    name: 'Gold',
    minXP: 2000,
    maxXP: 4999,
    benefits: ['10% XP cashback', 'Free standard shipping', 'New drop early access'],
    badgeIcon: 'emoji_events',
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    minXP: 5000,
    maxXP: null,
    benefits: ['15% XP cashback', 'Free express shipping', 'Exclusive products', 'Priority support', 'Signed jerseys access'],
    badgeIcon: 'verified',
  },
};

const DEV_FALLBACK_XP: XPState = {
  userId: 'dev',
  totalXP: 1250,
  currentTier: DEV_TIERS.silver,
  nextTier: DEV_TIERS.gold,
  xpToNextTier: 750,
  progressPercent: 50, // 1250-500 = 750 out of 1500 range = 50%
};

const _DEV_FALLBACK_CHALLENGES: Challenge[] = [
  {
    id: 'ch_first_purchase',
    title: 'First Purchase',
    description: 'Complete your first order and unlock Silver status bonus XP.',
    xpReward: 500,
    type: 'purchase',
    status: 'active',
    badgeIcon: 'shopping_bag',
  },
  {
    id: 'ch_review',
    title: 'Leave a Review',
    description: 'Write an honest product review and help the community.',
    xpReward: 200,
    type: 'review',
    status: 'active',
    badgeIcon: 'reviews',
  },
  {
    id: 'ch_refer_friend',
    title: 'Refer a Friend',
    description: 'Invite a teammate — you both unlock bonus XP.',
    xpReward: 1000,
    type: 'referral',
    status: 'active',
    badgeIcon: 'group_add',
  },
  {
    id: 'ch_triple_purchase',
    title: '3-Order Streak',
    description: 'Complete 3 orders in a single season.',
    xpReward: 750,
    type: 'streak',
    status: 'active',
    progressCurrent: 1,
    progressTotal: 3,
    badgeIcon: 'local_fire_department',
  },
  {
    id: 'ch_share_look',
    title: 'Share Your Look',
    description: 'Post your playR kit on social media and tag us.',
    xpReward: 300,
    type: 'social',
    status: 'upcoming',
    badgeIcon: 'share',
  },
  {
    id: 'ch_ipl_bundle',
    title: 'IPL Fan Bundle',
    description: 'Purchase any IPL official jersey + accessories in one order.',
    xpReward: 1500,
    type: 'milestone',
    status: 'active',
    badgeIcon: 'sports_cricket',
  },
];

const DEV_FALLBACK_REWARDS: Reward[] = [
  {
    id: 'rwd_5pct_off',
    title: '5% Off Your Next Order',
    description: 'Applies to your next checkout. One-time use.',
    xpCost: 500,
    type: 'discount',
    value: '5% discount',
    isAvailable: true,
  },
  {
    id: 'rwd_free_shipping',
    title: 'Free Standard Shipping',
    description: 'Free shipping on your next order, any value.',
    xpCost: 400,
    type: 'free_shipping',
    value: 'Free standard shipping',
    isAvailable: true,
  },
  {
    id: 'rwd_10pct_off',
    title: '10% Off (Gold+)',
    description: 'Exclusive to Gold and Elite members.',
    xpCost: 1000,
    type: 'discount',
    value: '10% discount',
    isAvailable: false,
    minTier: 'gold',
  },
  {
    id: 'rwd_early_access',
    title: 'New Drop Early Access',
    description: 'Shop new arrivals 24 hours before anyone else.',
    xpCost: 800,
    type: 'early_access',
    value: '24h early access',
    isAvailable: true,
  },
  {
    id: 'rwd_cashback_200',
    title: '₹200 Cashback',
    description: 'Credited to your playR wallet on your next purchase.',
    xpCost: 1500,
    type: 'cashback',
    value: '₹200 wallet credit',
    isAvailable: false,
    minTier: 'gold',
  },
  {
    id: 'rwd_exclusive',
    title: 'Exclusive Player Edition Drop',
    description: 'Access to limited player edition merchandise — Elite only.',
    xpCost: 3000,
    type: 'exclusive_product',
    value: 'Elite drop access',
    isAvailable: false,
    minTier: 'elite',
  },
];

const _DEV_FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', displayName: 'RohitS_CSK', totalXP: 12400, tierName: 'Elite' },
  { rank: 2, userId: 'u2', displayName: 'Kavitha.Runs', totalXP: 9870, tierName: 'Elite' },
  { rank: 3, userId: 'u3', displayName: 'PlayrFan99', totalXP: 7200, tierName: 'Gold' },
  { rank: 4, userId: 'u4', displayName: 'ArjunXGear', totalXP: 6100, tierName: 'Gold' },
  { rank: 5, userId: 'u5', displayName: 'SportsKid_21', totalXP: 5800, tierName: 'Gold' },
  { rank: 6, userId: 'u6', displayName: 'CricketPro7', totalXP: 4900, tierName: 'Gold' },
  { rank: 7, userId: 'u7', displayName: 'Meenakshi_B', totalXP: 3800, tierName: 'Silver' },
  { rank: 8, userId: 'u8', displayName: 'NikhilSports', totalXP: 3200, tierName: 'Silver' },
  { rank: 9, userId: 'u9', displayName: 'TeamJersey88', totalXP: 2800, tierName: 'Silver' },
  { rank: 10, userId: 'u10', displayName: 'FastTrack_Run', totalXP: 2500, tierName: 'Silver' },
];

// ─── Adapter ──────────────────────────────────────────────────────────────────

export class NectarLoyaltyAdapter {
  private client: NectarTenantClient;

  constructor(client: NectarTenantClient = nectarClient) {
    this.client = client;
  }

  private calculateXPState(userId: string, xp: number): XPState {
    let currentTier = DEV_TIERS.bronze;
    let nextTier: XPTier | null = DEV_TIERS.silver;
    let xpToNextTier: number | null = 500 - xp;
    let progressPercent = Math.min(100, Math.max(0, (xp / 500) * 100));

    if (xp >= 5000) {
      currentTier = DEV_TIERS.elite;
      nextTier = null;
      xpToNextTier = null;
      progressPercent = 100;
    } else if (xp >= 2000) {
      currentTier = DEV_TIERS.gold;
      nextTier = DEV_TIERS.elite;
      xpToNextTier = 5000 - xp;
      progressPercent = Math.min(100, Math.max(0, ((xp - 2000) / 3000) * 100));
    } else if (xp >= 500) {
      currentTier = DEV_TIERS.silver;
      nextTier = DEV_TIERS.gold;
      xpToNextTier = 2000 - xp;
      progressPercent = Math.min(100, Math.max(0, ((xp - 500) / 1500) * 100));
    }

    return {
      userId,
      totalXP: xp,
      currentTier,
      nextTier,
      xpToNextTier,
      progressPercent
    };
  }

  /**
   * Get the authenticated user's full XP/tier state.
   */
  async getUserXP(userId: string): Promise<XPState> {
    if (typeof window === 'undefined') {
      const { getDbUserById } = require('../db/db');
      const user = await getDbUserById(userId);
      if (user) {
        return this.calculateXPState(userId, user.xp || 0);
      }
    }

    try {
      return await this.client.get<XPState>(`/api/loyalty/users/${userId}/xp`);
    } catch {
      console.warn('[NECTAR Loyalty] getUserXP: BFF unavailable, returning client fallback');
      return { ...DEV_FALLBACK_XP, userId };
    }
  }

  /**
   * Get challenges. Without userId = public program list.
   * With userId = personalized progress + status included.
   */
  async getChallenges(userId?: string): Promise<Challenge[]> {
    let ordersCount = 0;
    let reviewsCount = 0;
    let userXP = 0;
    let userWalletTransactions: any[] = [];

    if (typeof window === 'undefined' && userId) {
      const { getDbOrdersByUserId, getDbUserById } = require('../db/db');
      try {
        const orders = await getDbOrdersByUserId(userId);
        ordersCount = orders.length;
        
        const user = await getDbUserById(userId);
        if (user) {
          userXP = user.xp || 0;
          userWalletTransactions = user.walletTransactions || [];
          const { getDbAuditLogs } = require('../db/db');
          const logs = await getDbAuditLogs();
          reviewsCount = logs.filter((l: any) => l.userId === userId && l.action === 'write_review').length;
        }
      } catch (e) {}
    }

    const resolveChallenges = (ordersQty: number, reviewsQty: number, xp: number, walletTxns: any[]): Challenge[] => {
      const hasTopup = walletTxns.some((t: any) => t.type === 'credit' && t.amount >= 1000 && t.description.toLowerCase().includes('topup'));
      return [
        {
          id: 'ch_first_purchase',
          title: 'First Purchase',
          description: 'Complete your first order and unlock Silver status bonus XP.',
          xpReward: 500,
          type: 'purchase',
          status: ordersQty >= 1 ? 'completed' : 'active',
          badgeIcon: 'shopping_bag',
          progressCurrent: ordersQty >= 1 ? 1 : 0,
          progressTotal: 1,
          isPersonalized: true
        },
        {
          id: 'ch_review',
          title: 'Leave a Review',
          description: 'Write an honest product review and help the community.',
          xpReward: 200,
          type: 'review',
          status: reviewsQty >= 1 ? 'completed' : 'active',
          badgeIcon: 'reviews',
          progressCurrent: reviewsQty >= 1 ? 1 : 0,
          progressTotal: 1,
          isPersonalized: true
        },
        {
          id: 'ch_refer_friend',
          title: 'Refer a Friend',
          description: 'Invite a teammate — you both unlock bonus XP.',
          xpReward: 1000,
          type: 'referral',
          status: 'active',
          badgeIcon: 'group_add',
          progressCurrent: 0,
          progressTotal: 1,
          isPersonalized: true
        },
        {
          id: 'ch_triple_purchase',
          title: '3-Order Streak',
          description: 'Complete 3 orders in a single season.',
          xpReward: 750,
          type: 'streak',
          status: ordersQty >= 3 ? 'completed' : 'active',
          progressCurrent: Math.min(3, ordersQty),
          progressTotal: 3,
          badgeIcon: 'local_fire_department',
          isPersonalized: true
        },
        {
          id: 'ch_elite_club',
          title: 'Join the Elite Club',
          description: 'Achieve Elite status on the playR XP loyalty program.',
          xpReward: 1000,
          type: 'milestone',
          status: xp >= 5000 ? 'completed' : 'active',
          progressCurrent: xp >= 5000 ? 1 : 0,
          progressTotal: 1,
          badgeIcon: 'workspace_premium',
          isPersonalized: true
        },
        {
          id: 'ch_wallet_topup',
          title: 'Wallet Power-Up',
          description: 'Top up your NECTAR wallet with ₹1000+ in a single transaction.',
          xpReward: 500,
          type: 'milestone',
          status: hasTopup ? 'completed' : 'active',
          progressCurrent: hasTopup ? 1 : 0,
          progressTotal: 1,
          badgeIcon: 'account_balance_wallet',
          isPersonalized: true
        },
        {
          id: 'ch_share_look',
          title: 'Share Your Look',
          description: 'Post your playR kit on social media and tag us.',
          xpReward: 300,
          type: 'social',
          status: 'upcoming',
          badgeIcon: 'share',
          isPersonalized: false
        },
        {
          id: 'ch_ipl_bundle',
          title: 'IPL Fan Bundle',
          description: 'Purchase any IPL official jersey + accessories in one order.',
          xpReward: 1500,
          type: 'milestone',
          status: 'active',
          badgeIcon: 'sports_cricket',
          isPersonalized: false
        }
      ];
    };

    if (typeof window === 'undefined') {
      return resolveChallenges(ordersCount, reviewsCount, userXP, userWalletTransactions);
    }

    try {
      const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      return await this.client.get<Challenge[]>(`/api/loyalty/challenges${qs}`);
    } catch {
      console.warn('[NECTAR Loyalty] getChallenges: BFF unavailable, using db fallback');
      return resolveChallenges(ordersCount, reviewsCount, userXP, userWalletTransactions);
    }
  }

  /**
   * Get available rewards for a user.
   */
  async getRewards(userId: string): Promise<Reward[]> {
    let userXP = 0;
    let userTier = 'bronze';
    if (typeof window === 'undefined') {
      const { getDbUserById } = require('../db/db');
      const user = await getDbUserById(userId);
      if (user) {
        userXP = user.xp || 0;
        userTier = user.tier || 'bronze';
      }
    }

    const resolveRewards = (xp: number, tier: string): Reward[] => {
      const tierLevels: Record<string, number> = { bronze: 0, silver: 1, gold: 2, elite: 3 };
      const currentLevel = tierLevels[tier.toLowerCase()] || 0;

      return DEV_FALLBACK_REWARDS.map(r => {
        const minTierRequired = r.minTier ? r.minTier.toLowerCase() : 'bronze';
        const minLevel = tierLevels[minTierRequired] || 0;
        const hasPoints = xp >= r.xpCost;
        const meetsTier = currentLevel >= minLevel;

        return {
          ...r,
          isAvailable: hasPoints && meetsTier
        };
      });
    };

    if (typeof window === 'undefined') {
      return resolveRewards(userXP, userTier);
    }

    try {
      return await this.client.get<Reward[]>(`/api/loyalty/rewards?userId=${encodeURIComponent(userId)}`);
    } catch {
      console.warn('[NECTAR Loyalty] getRewards: BFF unavailable, using db fallback');
      return resolveRewards(userXP, userTier);
    }
  }

  /**
   * Get leaderboard entries.
   */
  async getLeaderboard(
    period: 'all' | 'monthly' | 'weekly' = 'all',
    limit = 50,
    currentUserId?: string
  ): Promise<LeaderboardEntry[]> {
    if (typeof window === 'undefined') {
      const { getDbUsers } = require('../db/db');
      const users = await getDbUsers();
      const sorted = [...users].sort((a: any, b: any) => (b.xp || 0) - (a.xp || 0));
      return sorted.slice(0, limit).map((u: any, idx: number) => ({
        rank: idx + 1,
        userId: u.id,
        displayName: u.firstName + ' ' + u.lastName[0] + '.',
        totalXP: u.xp || 0,
        tierName: u.tier.charAt(0).toUpperCase() + u.tier.slice(1),
        isCurrentUser: u.id === currentUserId
      }));
    }

    try {
      const qs = currentUserId ? `&userId=${encodeURIComponent(currentUserId)}` : '';
      return await this.client.get<LeaderboardEntry[]>(
        `/api/loyalty/leaderboard?period=${period}&limit=${limit}${qs}`
      );
    } catch {
      console.warn('[NECTAR Loyalty] getLeaderboard: BFF unavailable, returning empty client fallback');
      return [];
    }
  }

  /**
   * Get gamification context for a product page.
   */
  async getProductGamificationContext(
    productId: string,
    userId?: string
  ): Promise<GamificationProductContext> {
    let userTier = 'bronze';
    if (typeof window === 'undefined' && userId) {
      const { getDbUserById } = require('../db/db');
      const user = await getDbUserById(userId);
      if (user) {
        userTier = user.tier || 'bronze';
      }
    }

    const resolveContext = (tier: string): GamificationProductContext => {
      const multiplier = tier === 'elite' ? 0.15 : tier === 'gold' ? 0.10 : tier === 'silver' ? 0.05 : 0.0;
      const baseXP = 150; // Standard reward base XP for product
      const bonus = Math.round(baseXP * multiplier);
      return {
        productId,
        xpEarned: baseXP,
        tierBonus: bonus,
        totalXPEarned: baseXP + bonus,
        challengeContributions: [
          { challengeId: 'ch_first_purchase', challengeTitle: 'First Purchase', contribution: '1 order' }
        ]
      };
    };

    if (typeof window === 'undefined') {
      return resolveContext(userTier);
    }

    try {
      const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      return await this.client.get<GamificationProductContext>(
        `/api/loyalty/products/${productId}/context${qs}`
      );
    } catch {
      return resolveContext(userTier);
    }
  }

  /**
   * Redeem a reward (consumes XP).
   */
  async redeemReward(userId: string, rewardId: string): Promise<boolean> {
    if (typeof window === 'undefined') {
      const { getDbUserById, updateDbUser, addDbAuditLog } = require('../db/db');
      const user = await getDbUserById(userId);
      const reward = DEV_FALLBACK_REWARDS.find(r => r.id === rewardId);
      if (user && reward && user.xp >= reward.xpCost) {
        const newXP = user.xp - reward.xpCost;
        // Re-calculate tier
        let newTier = 'bronze';
        if (newXP >= 5000) newTier = 'elite';
        else if (newXP >= 2000) newTier = 'gold';
        else if (newXP >= 500) newTier = 'silver';
        
        // Update user
        await updateDbUser(userId, { xp: newXP, tier: newTier });
        await addDbAuditLog(userId, 'redeem_reward', `Redeemed reward: ${reward.title} for ${reward.xpCost} XP.`);
        return true;
      }
      return false;
    }

    try {
      await this.client.post(`/api/loyalty/rewards/${rewardId}/redeem`, { userId });
      return true;
    } catch {
      console.error('[NECTAR Loyalty] redeemReward: failed on client side');
      return false;
    }
  }
}


export const loyaltyAdapter = new NectarLoyaltyAdapter();

// ─── Tier helpers (display only, no calculations) ─────────────────────────────

export const TIER_ORDER = ['bronze', 'silver', 'gold', 'elite'] as const;

export function getTierColor(tierId: string): string {
  switch (tierId) {
    case 'bronze': return 'text-[#cd7f32]';
    case 'silver': return 'text-[#c0c0c0]';
    case 'gold': return 'text-inverse-primary';
    case 'elite': return 'text-[#e5c07b]';
    default: return 'text-outline';
  }
}

export function getTierBg(tierId: string): string {
  switch (tierId) {
    case 'bronze': return 'bg-[#cd7f32]/15';
    case 'silver': return 'bg-[#c0c0c0]/15';
    case 'gold': return 'bg-primary-container/30';
    case 'elite': return 'bg-inverse-primary/15';
    default: return 'bg-surface-container';
  }
}
