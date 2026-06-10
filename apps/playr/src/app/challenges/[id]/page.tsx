/**
 * /challenges/[id] — Challenge Detail Page
 *
 * Server component. Fetches challenge list from NECTAR, finds the matching challenge by ID.
 * No business logic here — just renders what NECTAR returns.
 */

import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loyaltyAdapter } from '@playr/nectar-core'

export default async function ChallengeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const challenges = await loyaltyAdapter.getChallenges()
  const challenge = challenges.find(c => c.id === id)

  if (!challenge) notFound()

  const hasProgress = challenge.progressTotal !== undefined && challenge.progressCurrent !== undefined
  const progressPct = hasProgress
    ? Math.round((challenge.progressCurrent! / challenge.progressTotal!) * 100)
    : null

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 text-sm text-on-surface-variant font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <Link href="/challenges" className="hover:text-primary transition-colors">Challenges</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">{challenge.title}</span>
        </nav>

        {/* Header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary-container/30 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-3xl">{challenge.badgeIcon}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary-container/20 px-2.5 py-1 rounded-full">
                {challenge.type}
              </span>
              <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                challenge.status === 'active' ? 'bg-primary-container/20 text-primary' :
                challenge.status === 'completed' ? 'bg-secondary-container/30 text-secondary' :
                'bg-surface-container text-on-surface-variant'
              }`}>
                {challenge.status}
              </span>
            </div>
            <h1 className="font-black text-4xl md:text-5xl uppercase tracking-tighter text-on-surface leading-tight">
              {challenge.title}
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="text-on-surface-variant text-lg leading-relaxed mb-10">{challenge.description}</p>

        {/* XP reward */}
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">XP Reward</p>
            <p className="font-black text-4xl text-primary">+{challenge.xpReward.toLocaleString()} XP</p>
          </div>
          {challenge.expiresAt && (
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Expires</p>
              <p className="font-bold text-on-surface">
                {new Date(challenge.expiresAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {/* Progress bar (only if NECTAR returned personalized data) */}
        {hasProgress && progressPct !== null && (
          <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Your Progress</p>
              <p className="font-bold text-on-surface">{challenge.progressCurrent} / {challenge.progressTotal}</p>
            </div>
            <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
              <div className="xp-bar-fill h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-on-surface-variant mt-2">{progressPct}% complete</p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          {challenge.status === 'active' ? (
            <>
              <Link href="/collections/all" className="flex-1 bg-primary-container text-on-primary-container font-bold text-sm uppercase tracking-widest py-4 rounded-full text-center hover:scale-[1.02] active:scale-95 transition-all duration-200">
                Start Challenge
              </Link>
              <Link href="/challenges" className="flex-1 bg-surface-container text-on-surface font-bold text-sm uppercase tracking-widest py-4 rounded-full text-center hover:bg-surface-container-high transition-colors">
                All Challenges
              </Link>
            </>
          ) : challenge.status === 'completed' ? (
            <div className="flex-1 bg-secondary-container/30 text-on-secondary-container font-bold text-sm uppercase tracking-widest py-4 rounded-full text-center">
              Challenge Complete ✓
            </div>
          ) : (
            <div className="flex-1 bg-surface-container text-on-surface-variant/50 font-bold text-sm uppercase tracking-widest py-4 rounded-full text-center cursor-not-allowed">
              Coming Soon
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
