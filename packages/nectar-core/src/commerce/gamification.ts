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

const DEV_FALLBACK_CHALLENGES: Challenge[] = [
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

const DEV_FALLBACK_LEADERBOARD: LeaderboardEntry[] = [
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

  /**
   * Get the authenticated user's full XP/tier state.
   * NECTAR backend owns all calculations — frontend renders only.
   */
  async getUserXP(userId: string): Promise<XPState> {
    try {
      return await this.client.get<XPState>(`/api/loyalty/users/${userId}/xp`);
    } catch {
      console.warn('[NECTAR Loyalty] getUserXP: BFF unavailable, using dev fallback');
      return { ...DEV_FALLBACK_XP, userId };
    }
  }

  /**
   * Get challenges. Without userId = public program list.
   * With userId = personalized progress + status included.
   */
  async getChallenges(userId?: string): Promise<Challenge[]> {
    try {
      const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      return await this.client.get<Challenge[]>(`/api/loyalty/challenges${qs}`);
    } catch {
      console.warn('[NECTAR Loyalty] getChallenges: BFF unavailable, using dev fallback');
      return DEV_FALLBACK_CHALLENGES;
    }
  }

  /**
   * Get available rewards for a user (availability depends on their tier + XP balance).
   */
  async getRewards(userId: string): Promise<Reward[]> {
    try {
      return await this.client.get<Reward[]>(`/api/loyalty/rewards?userId=${encodeURIComponent(userId)}`);
    } catch {
      console.warn('[NECTAR Loyalty] getRewards: BFF unavailable, using dev fallback');
      return DEV_FALLBACK_REWARDS;
    }
  }

  /**
   * Get leaderboard entries.
   */
  async getLeaderboard(
    period: 'all' | 'monthly' | 'weekly' = 'all',
    limit = 50
  ): Promise<LeaderboardEntry[]> {
    try {
      return await this.client.get<LeaderboardEntry[]>(
        `/api/loyalty/leaderboard?period=${period}&limit=${limit}`
      );
    } catch {
      console.warn('[NECTAR Loyalty] getLeaderboard: BFF unavailable, using dev fallback');
      return DEV_FALLBACK_LEADERBOARD;
    }
  }

  /**
   * Get gamification context for a product page.
   * NECTAR computes how much XP this product earns and which challenges it counts toward.
   */
  async getProductGamificationContext(
    productId: string,
    userId?: string
  ): Promise<GamificationProductContext> {
    try {
      const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      return await this.client.get<GamificationProductContext>(
        `/api/loyalty/products/${productId}/context${qs}`
      );
    } catch {
      console.warn('[NECTAR Loyalty] getProductGamificationContext: BFF unavailable');
      return {
        productId,
        xpEarned: 0,
        tierBonus: 0,
        totalXPEarned: 0,
        challengeContributions: [],
      };
    }
  }

  /**
   * Redeem a reward (consumes XP).
   * Returns true on success.
   */
  async redeemReward(userId: string, rewardId: string): Promise<boolean> {
    try {
      await this.client.post(`/api/loyalty/rewards/${rewardId}/redeem`, { userId });
      return true;
    } catch {
      console.error('[NECTAR Loyalty] redeemReward: failed');
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
