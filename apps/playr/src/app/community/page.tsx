/* eslint-disable no-unused-vars */
/**
 * /community — Community Feed
 *
 * Architecture placeholder — correct structure for future NECTAR activity feed integration.
 * Currently shows a coming-soon state with correct data shapes documented.
 *
 * When NECTAR BFF adds /api/community/feed endpoint:
 *   - Replace PLACEHOLDER_FEED with: await nectarClient.get('/api/community/feed?limit=20')
 *   - FeedEntry type must match NECTAR contract exactly
 *   - No frontend logic — render only
 */

import React from 'react'
import Link from 'next/link'

// Future NECTAR contract shape — defined now so the BFF team can match it
interface FeedEntry {
  id: string
  userId: string
  displayName: string
  avatarUrl: string | null
  action: 'purchase' | 'review' | 'challenge_complete' | 'tier_up' | 'referral'
  metadata: {
    productTitle?: string
    productSlug?: string
    challengeTitle?: string
    newTier?: string
    xpEarned?: number
  }
  createdAt: string
}

// Action display helpers — rendering config only, no logic
const ACTION_DISPLAY = {
  purchase: { icon: 'shopping_bag', label: 'purchased' },
  review: { icon: 'reviews', label: 'reviewed' },
  challenge_complete: { icon: 'bolt', label: 'completed a challenge' },
  tier_up: { icon: 'military_tech', label: 'levelled up to' },
  referral: { icon: 'group_add', label: 'referred a friend and earned' },
}

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[1100px] mx-auto px-4 md:px-12">

        {/* Hero */}
        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">playR Community</span>
          <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tighter text-on-surface leading-[0.9]">
            Squad<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary">Activity</span>
          </h1>
        </div>

        {/* Coming soon state */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Feed (coming soon) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-10 text-center">
              <span className="material-symbols-outlined text-primary text-5xl mb-4 block">forum</span>
              <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-3">Feed Coming Soon</h2>
              <p className="text-on-surface-variant text-base leading-relaxed max-w-md mx-auto">
                The community activity feed is powered by NECTAR. When the /api/community/feed endpoint is live,
                you&apos;ll see purchases, challenge completions, tier-ups, and referrals here in real time.
              </p>
            </div>

            {/* Skeleton preview of what the feed will look like */}
            <div className="space-y-3 opacity-30 pointer-events-none select-none" aria-hidden="true">
              {[
                { label: 'Someone purchased CSK Official Jersey', icon: 'shopping_bag', xp: '+80 XP' },
                { label: 'Someone completed challenge: First Purchase', icon: 'bolt', xp: '+500 XP' },
                { label: 'Someone levelled up to Gold tier', icon: 'military_tech', xp: '' },
                { label: 'Someone reviewed Pro Polo', icon: 'reviews', xp: '+200 XP' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-5 py-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface text-sm font-medium">{item.label}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">Just now</p>
                  </div>
                  {item.xp && <span className="text-primary font-bold text-sm">{item.xp}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick links */}
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6">
              <h3 className="font-black text-lg uppercase tracking-tight text-on-surface mb-5">Earn XP Now</h3>
              <div className="space-y-3">
                {[
                  { href: '/challenges', icon: 'bolt', label: 'Active Challenges' },
                  { href: '/rewards', icon: 'stars', label: 'Rewards Center' },
                  { href: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
                  { href: '/collections/all', icon: 'shopping_bag', label: 'Shop & Earn' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 text-on-surface-variant hover:text-primary font-medium text-sm transition-colors group"
                  >
                    <span className="material-symbols-outlined text-base">{link.icon}</span>
                    {link.label}
                    <span className="material-symbols-outlined text-[14px] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Architecture note (dev only — remove for production) */}
            <div className="bg-primary-container/10 border border-primary/20 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Dev Note</p>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Community feed data must come from NECTAR BFF endpoint{' '}
                <code className="bg-surface-container px-1 rounded text-primary">/api/community/feed</code>.
                Never mock user activity in frontend. This component is architecture-ready —
                swap the placeholder with the real BFF call.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
