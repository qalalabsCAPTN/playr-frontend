import React from 'react'
import Link from 'next/link'

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

const ACTION_DISPLAY = {
  purchase: { icon: 'shopping_bag', label: 'purchased' },
  review: { icon: 'reviews', label: 'reviewed' },
  challenge_complete: { icon: 'bolt', label: 'completed a challenge' },
  tier_up: { icon: 'military_tech', label: 'levelled up to' },
  referral: { icon: 'group_add', label: 'referred a friend and earned' },
}

import { DemoConfig } from '@playr/nectar-core/src/demo/config';

const DEMO_FEED: FeedEntry[] = DemoConfig.isDemoMode ? DemoConfig.community.getFeed() : [];
export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[1100px] mx-auto px-4 md:px-12">

        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">playR Community</span>
          <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tighter text-on-surface leading-[0.9]">
            Squad<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary">Activity</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-3">
              {DEMO_FEED.map((item) => {
                const display = ACTION_DISPLAY[item.action];
                let objectText = "";
                if (item.action === "purchase" || item.action === "review") objectText = item.metadata.productTitle || "";
                if (item.action === "challenge_complete") objectText = item.metadata.challengeTitle || "";
                if (item.action === "tier_up") objectText = item.metadata.newTier || "";

                return (
                  <div key={item.id} className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/20 rounded-xl px-5 py-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">{display.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-on-surface text-base font-medium">
                        <span className="font-bold">{item.displayName}</span> {display.label} <span className="font-bold text-primary">{objectText}</span>
                      </p>
                      <p className="text-on-surface-variant text-xs mt-1 uppercase tracking-wider">{item.createdAt}</p>
                    </div>
                    {item.metadata.xpEarned && (
                      <span className="text-action-yellow font-black text-lg bg-action-yellow/10 px-3 py-1 rounded-full shrink-0">+{item.metadata.xpEarned} XP</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6">
              <h3 className="font-black text-lg uppercase tracking-tight text-on-surface mb-5">Earn XP Now</h3>
              <div className="space-y-3">
                {[
                  { href: '/challenges', icon: 'bolt', label: 'Active Challenges' },
                  { href: '/account/rewards', icon: 'stars', label: 'Rewards Center' },
                  { href: '/leaderboard', icon: 'leaderboard', label: 'Leaderboard' },
                  { href: '/collections', icon: 'shopping_bag', label: 'Shop & Earn' },
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
            
            {/* Join Banner */}
             <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-black text-xl uppercase tracking-tight mb-2">Join the Squad</h3>
                <p className="text-sm opacity-80 mb-4">Complete your first challenge and start dominating the leaderboard.</p>
                <Link href="/challenges">
                  <button className="bg-on-primary-container text-primary-container px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                    View Challenges
                  </button>
                </Link>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                 <span className="material-symbols-outlined text-8xl">sports_score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
