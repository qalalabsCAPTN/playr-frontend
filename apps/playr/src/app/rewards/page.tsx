/**
 * /rewards — Rewards Center
 *
 * Server component. Fetches public reward catalog from NECTAR BFF.
 * User-specific availability (isAvailable, minTier check) is resolved by NECTAR.
 * Frontend ONLY renders what NECTAR returns.
 */

import React from 'react'
import Link from 'next/link'
import { loyaltyAdapter } from '@playr/nectar-core'
import type { Reward, RewardType } from '@playr/nectar-core'

// For public view, we load with a placeholder userId.
// When auth is wired, this becomes the real session user ID.
const PUBLIC_USER_ID = 'public'

const TYPE_LABELS: Record<RewardType, string> = {
  discount: 'Discount',
  free_shipping: 'Free Shipping',
  exclusive_product: 'Exclusive Drop',
  early_access: 'Early Access',
  cashback: 'Cashback',
}

const TYPE_ICONS: Record<RewardType, string> = {
  discount: 'local_offer',
  free_shipping: 'local_shipping',
  exclusive_product: 'diamond',
  early_access: 'schedule',
  cashback: 'account_balance_wallet',
}

function RewardCard({ reward }: { reward: Reward }) {
  const icon = TYPE_ICONS[reward.type]
  const typeLabel = TYPE_LABELS[reward.type]

  return (
    <div className={`relative rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300 ${
      reward.isAvailable
        ? 'border-outline-variant/30 bg-surface-container-low hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5'
        : 'border-outline-variant/15 bg-surface-container-lowest/50 opacity-60'
    }`}>
      {/* Type badge */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full w-fit">
          <span className="material-symbols-outlined text-primary text-[16px]">{icon}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{typeLabel}</span>
        </div>
        {reward.minTier && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/50 bg-surface-container px-2 py-1 rounded-full">
            {reward.minTier}+
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="font-bold text-lg text-on-surface leading-tight">{reward.title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{reward.description}</p>
      </div>

      {/* Value + Cost */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Value</p>
          <p className="font-black text-on-surface">{reward.value}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Cost</p>
          <p className="font-black text-primary">{reward.xpCost.toLocaleString()} XP</p>
        </div>
      </div>

      {reward.isAvailable ? (
        <Link href="/account/rewards" className="block w-full bg-primary-container text-on-primary-container font-bold text-sm uppercase tracking-widest py-3.5 rounded-full text-center hover:scale-[1.02] active:scale-95 transition-all duration-200">
          Redeem
        </Link>
      ) : (
        <button disabled className="w-full bg-surface-container text-on-surface-variant/40 font-bold text-sm uppercase tracking-widest py-3.5 rounded-full cursor-not-allowed">
          {reward.minTier ? `Requires ${reward.minTier} tier` : 'Unavailable'}
        </button>
      )}
    </div>
  )
}

export default async function RewardsPage() {
  const rewards = await loyaltyAdapter.getRewards(PUBLIC_USER_ID)

  const available = rewards.filter(r => r.isAvailable)
  const locked = rewards.filter(r => !r.isAvailable)

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">

        {/* Hero */}
        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">playR XP Program</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tighter text-on-surface leading-[0.9]">
              Rewards<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary">Center</span>
            </h1>
            <div className="flex gap-4">
              <Link href="/challenges" className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors group">
                <span className="material-symbols-outlined text-base group-hover:-translate-x-0.5 transition-transform">bolt</span>
                Earn More XP
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors group">
                <span className="material-symbols-outlined text-base">leaderboard</span>
                Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Sign-in prompt */}
        <div className="bg-surface-container-low border border-primary/20 rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center gap-4">
          <span className="material-symbols-outlined text-primary text-3xl">lock_open</span>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-on-surface">Sign in to see your personalized rewards</p>
            <p className="text-on-surface-variant text-sm mt-1">Your XP balance, tier, and available rewards are loaded from your account.</p>
          </div>
          <Link href="/account" className="bg-primary-container text-on-primary-container font-bold text-sm uppercase tracking-widest px-6 py-3 rounded-full hover:scale-[1.02] transition-transform shrink-0">
            Sign In
          </Link>
        </div>

        {/* Available rewards */}
        {available.length > 0 && (
          <section className="mb-16">
            <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">star</span>
              Available Now
              <span className="text-sm font-normal text-on-surface-variant normal-case tracking-normal ml-2">{available.length} rewards</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {available.map(r => <RewardCard key={r.id} reward={r} />)}
            </div>
          </section>
        )}

        {/* Locked rewards */}
        {locked.length > 0 && (
          <section>
            <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant">lock</span>
              Unlock as You Level Up
              <span className="text-sm font-normal text-on-surface-variant normal-case tracking-normal ml-2">{locked.length} rewards</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locked.map(r => <RewardCard key={r.id} reward={r} />)}
            </div>
          </section>
        )}

        {/* How it works */}
        <section className="mt-20 bg-inverse-surface rounded-3xl p-10 md:p-16">
          <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tighter text-inverse-on-surface mb-10">
            How to Earn XP
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'shopping_bag', title: 'Shop', desc: 'Earn XP on every purchase. NECTAR calculates exact XP per product.' },
              { icon: 'reviews', title: 'Review', desc: 'Leave honest product reviews and earn bonus XP from NECTAR.' },
              { icon: 'group_add', title: 'Refer', desc: 'Invite friends — both of you unlock XP bonuses through NECTAR.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-inverse-primary text-xl">{item.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-inverse-on-surface uppercase tracking-wider mb-1">{item.title}</p>
                  <p className="text-inverse-on-surface/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/challenges" className="inline-flex items-center gap-2 bg-inverse-on-surface text-inverse-surface font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-200">
              <span className="material-symbols-outlined text-base">bolt</span>
              View Active Challenges
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
