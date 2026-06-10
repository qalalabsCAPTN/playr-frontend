/* eslint-disable no-unused-vars */
"use client"

/**
 * /leaderboard — Leaderboard Page
 *
 * Client component (period tab switching requires client-side state).
 * Data is fetched fresh on each period change — calls NECTAR BFF, never calculates rankings.
 * Frontend ONLY renders what NECTAR returns.
 */

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { loyaltyAdapter, getTierColor, getTierBg } from '@playr/nectar-core'
import type { LeaderboardEntry } from '@playr/nectar-core'

type Period = 'all' | 'monthly' | 'weekly'

const PERIOD_LABELS: Record<Period, string> = {
  all: 'All Time',
  monthly: 'This Month',
  weekly: 'This Week',
}

const RANK_STYLES = [
  'bg-primary-container/40 text-on-primary-container border-primary-container',  // 1st
  'bg-[#c0c0c0]/15 text-[#c0c0c0] border-[#c0c0c0]/30',                         // 2nd
  'bg-[#cd7f32]/15 text-[#cd7f32] border-[#cd7f32]/30',                          // 3rd
]

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const medals = ['emoji_events', 'workspace_premium', 'military_tech']
    const icons = ['text-inverse-primary', 'text-[#c0c0c0]', 'text-[#cd7f32]']
    return (
      <span className={`material-symbols-outlined text-2xl ${icons[rank - 1]}`}>
        {medals[rank - 1]}
      </span>
    )
  }
  return (
    <span className="font-black text-lg text-on-surface-variant w-6 text-center tabular-nums">
      {rank}
    </span>
  )
}

function LeaderboardRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const isTopThree = entry.rank <= 3
  const tierColorClass = getTierColor(entry.tierName.toLowerCase())
  const tierBgClass = getTierBg(entry.tierName.toLowerCase())

  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
      isTopThree
        ? 'border-2 ' + RANK_STYLES[entry.rank - 1] + ' bg-surface-container-low'
        : entry.isCurrentUser
        ? 'border-2 border-primary/30 bg-primary-container/5'
        : 'border border-outline-variant/15 bg-surface-container-lowest hover:border-outline-variant/30 hover:bg-surface-container-low'
    }`}>

      {/* Rank */}
      <div className="w-8 flex justify-center shrink-0">
        <RankBadge rank={entry.rank} />
      </div>

      {/* Avatar placeholder */}
      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 overflow-hidden">
        {entry.avatarUrl ? (
          <img src={entry.avatarUrl} alt={entry.displayName} className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-on-surface-variant text-xl">account_circle</span>
        )}
      </div>

      {/* Name + tier */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-bold truncate ${entry.isCurrentUser ? 'text-primary' : 'text-on-surface'}`}>
            {entry.displayName}
            {entry.isCurrentUser && <span className="ml-1 text-xs font-normal">(you)</span>}
          </p>
        </div>
        <div className={`flex items-center gap-1 mt-0.5 text-xs font-bold uppercase tracking-wider w-fit px-2 py-0.5 rounded-full ${tierBgClass} ${tierColorClass}`}>
          {entry.tierName}
        </div>
      </div>

      {/* XP */}
      <div className="text-right shrink-0">
        <p className="font-black text-lg text-on-surface tabular-nums">
          {entry.totalXP.toLocaleString()}
        </p>
        <p className="text-xs text-on-surface-variant uppercase tracking-wider">XP</p>
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('all')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    loyaltyAdapter.getLeaderboard(period, 50).then(data => {
      setEntries(data)
      setIsLoading(false)
    })
  }, [period])

  return (
    <main className="min-h-screen bg-background pt-32 pb-24">
      <div className="max-w-[900px] mx-auto px-4 md:px-12">

        {/* Hero */}
        <div className="mb-12">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-4 block">playR XP Program</span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-black text-5xl md:text-7xl uppercase tracking-tighter text-on-surface leading-[0.9]">
              Leader-<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary">board</span>
            </h1>
            <div className="flex gap-4">
              <Link href="/challenges" className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">
                <span className="material-symbols-outlined text-base">bolt</span>
                Challenges
              </Link>
              <Link href="/rewards" className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold text-sm uppercase tracking-widest transition-colors">
                <span className="material-symbols-outlined text-base">stars</span>
                Rewards
              </Link>
            </div>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-surface-container rounded-full w-fit">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-200 ${
                period === p
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        {!isLoading && entries.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd place */}
            <div className="flex flex-col items-center gap-2 pt-8">
              <div className="w-14 h-14 rounded-full bg-[#c0c0c0]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#c0c0c0] text-3xl">workspace_premium</span>
              </div>
              <p className="font-bold text-on-surface text-sm text-center truncate w-full px-2 text-center">{entries[1]?.displayName}</p>
              <p className="font-black text-[#c0c0c0] tabular-nums">{entries[1]?.totalXP.toLocaleString()} XP</p>
            </div>

            {/* 1st place */}
            <div className="flex flex-col items-center gap-2 bg-primary-container/20 rounded-2xl py-6 border border-primary-container/30">
              <span className="material-symbols-outlined text-inverse-primary text-3xl">emoji_events</span>
              <div className="w-16 h-16 rounded-full bg-primary-container/40 flex items-center justify-center">
                <span className="font-black text-on-primary-container text-2xl">1</span>
              </div>
              <p className="font-bold text-on-surface text-sm text-center truncate w-full px-2 text-center">{entries[0]?.displayName}</p>
              <p className="font-black text-inverse-primary tabular-nums">{entries[0]?.totalXP.toLocaleString()} XP</p>
            </div>

            {/* 3rd place */}
            <div className="flex flex-col items-center gap-2 pt-8">
              <div className="w-14 h-14 rounded-full bg-[#cd7f32]/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#cd7f32] text-3xl">military_tech</span>
              </div>
              <p className="font-bold text-on-surface text-sm text-center truncate w-full px-2 text-center">{entries[2]?.displayName}</p>
              <p className="font-black text-[#cd7f32] tabular-nums">{entries[2]?.totalXP.toLocaleString()} XP</p>
            </div>
          </div>
        )}

        {/* Full list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface-container-low rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <LeaderboardRow key={entry.userId} entry={entry} index={index} />
            ))}
          </div>
        )}

        {/* Join CTA */}
        <div className="mt-12 bg-inverse-surface rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-black text-xl text-inverse-on-surface uppercase tracking-tight">Climb the ranks</p>
            <p className="text-inverse-on-surface/50 text-sm mt-1">Complete challenges and earn XP to make the top 10.</p>
          </div>
          <Link href="/challenges" className="bg-inverse-on-surface text-inverse-surface font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shrink-0">
            View Challenges
          </Link>
        </div>
      </div>
    </main>
  )
}
