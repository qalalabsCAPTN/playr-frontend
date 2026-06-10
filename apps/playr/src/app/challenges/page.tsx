/**
 * /challenges — Challenges Hub
 *
 * Server component. Fetches public challenge list from NECTAR BFF.
 * No user-specific progress shown here (public page).
 * When auth is wired, pass userId to getChallenges() for personalized status.
 */

import React from 'react'
import Link from 'next/link'
import { loyaltyAdapter } from '@playr/nectar-core'
import type { Challenge, ChallengeType } from '@playr/nectar-core'

const TYPE_LABELS: Record<ChallengeType, string> = {
  purchase: 'Purchase',
  review: 'Review',
  referral: 'Referral',
  social: 'Social',
  streak: 'Streak',
  milestone: 'Milestone',
  seasonal: 'Seasonal',
}

const STATUS_STYLES = {
  active:    { bg: 'bg-primary-container/30', text: 'text-inverse-primary', dot: 'bg-inverse-primary' },
  upcoming:  { bg: 'bg-surface-container', text: 'text-on-surface-variant', dot: 'bg-on-surface-variant/30' },
  completed: { bg: 'bg-secondary-container/30', text: 'text-on-secondary-container', dot: 'bg-secondary' },
  expired:   { bg: 'bg-error-container/20', text: 'text-error', dot: 'bg-error' },
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const statusStyle = STATUS_STYLES[challenge.status] ?? STATUS_STYLES.active
  const hasProgress = challenge.progressTotal !== undefined && challenge.progressCurrent !== undefined
  const progressPct = hasProgress
    ? Math.round((challenge.progressCurrent! / challenge.progressTotal!) * 100)
    : null

  return (
    <Link
      href={`/challenges/${challenge.id}`}
      className="group flex flex-col gap-5 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-xl">{challenge.badgeIcon}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
            {challenge.status}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
            {TYPE_LABELS[challenge.type]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="font-bold text-lg text-on-surface leading-tight group-hover:text-primary transition-colors">
          {challenge.title}
        </h3>
        <p className="text-on-surface-variant text-sm leading-relaxed line-clamp-2">{challenge.description}</p>
      </div>

      {/* Progress (personalized, shown if NECTAR returns it) */}
      {hasProgress && progressPct !== null && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-on-surface-variant">
            <span>{challenge.progressCurrent} / {challenge.progressTotal}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="xp-bar-fill h-full rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {/* Reward */}
      <div className="flex items-center justify-between pt-4 border-t border-outline-variant/15">
        <span className="font-black text-xl text-primary">+{challenge.xpReward.toLocaleString()} XP</span>
        {challenge.expiresAt && (
          <span className="text-xs text-on-surface-variant">
            Expires {new Date(challenge.expiresAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
          </span>
        )}
        <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-1 transition-all text-lg">arrow_forward</span>
      </div>
    </Link>
  )
}

export default async function ChallengesPage() {
  const challenges = await loyaltyAdapter.getChallenges()

  const active = challenges.filter(c => c.status === 'active')
  const upcoming = challenges.filter(c => c.status === 'upcoming')
  const completed = challenges.filter(c => c.status === 'completed')

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-12">

        {/* Hero */}
        <div className="mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">playR XP Program</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tighter text-on-surface leading-[0.9]">
              Challenges<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary">Hub</span>
            </h1>
            <div className="flex gap-4">
              <Link href="/rewards" className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors group">
                <span className="material-symbols-outlined text-base">stars</span>
                Rewards
              </Link>
              <Link href="/leaderboard" className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">
                <span className="material-symbols-outlined text-base">leaderboard</span>
                Leaderboard
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Active', count: active.length, color: 'text-primary' },
            { label: 'Upcoming', count: upcoming.length, color: 'text-on-surface-variant' },
            { label: 'Completed', count: completed.length, color: 'text-secondary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-low rounded-2xl p-5 text-center">
              <p className={`font-black text-3xl ${stat.color}`}>{stat.count}</p>
              <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Sign-in prompt for personalized progress */}
        <div className="bg-surface-container-low border border-primary/20 rounded-2xl p-5 mb-12 flex flex-col sm:flex-row items-center gap-4">
          <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-on-surface text-sm">Sign in to track your challenge progress</p>
            <p className="text-on-surface-variant text-xs mt-0.5">NECTAR tracks your progress automatically — just log in to see it here.</p>
          </div>
          <Link href="/account" className="bg-primary-container text-on-primary-container font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full hover:scale-[1.02] transition-transform shrink-0">
            Sign In
          </Link>
        </div>

        {/* Active challenges */}
        {active.length > 0 && (
          <section className="mb-16">
            <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              Active Challenges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map(c => <ChallengeCard key={c.id} challenge={c} />)}
            </div>
          </section>
        )}

        {/* Upcoming challenges */}
        {upcoming.length > 0 && (
          <section className="mb-16">
            <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-on-surface-variant/30 inline-block" />
              Coming Soon
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map(c => <ChallengeCard key={c.id} challenge={c} />)}
            </div>
          </section>
        )}

        {/* Completed challenges */}
        {completed.length > 0 && (
          <section>
            <h2 className="font-black text-2xl uppercase tracking-tight text-on-surface mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
              Completed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-70">
              {completed.map(c => <ChallengeCard key={c.id} challenge={c} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
