"use client"

/**
 * XPHeader — NECTAR render-only presentation layer.
 *
 * Rules:
 * - NO XP calculations of any kind
 * - NO tier logic
 * - Reads ONLY from AccountContext (data owned by NECTAR BFF)
 * - Displayed inline in the main Header for authenticated users
 */

import React from "react"
import Link from "next/link"
import { useAccount } from "@/components/account/AccountProvider"
import { getTierColor, getTierBg } from "@playr/nectar-core"

export function XPHeader() {
  const { xpState, isLoading } = useAccount()

  // Not loaded yet — render compact skeleton
  if (isLoading) {
    return (
      <div className="hidden md:flex items-center gap-2 animate-pulse">
        <div className="w-20 h-3 bg-on-surface/10 rounded-full" />
        <div className="w-14 h-3 bg-on-surface/10 rounded-full" />
      </div>
    )
  }

  // No XP data (unauthenticated or BFF down — graceful degradation: show nothing)
  if (!xpState) return null

  const tierId = xpState.currentTier.id
  const tierColorClass = getTierColor(tierId)
  const tierBgClass = getTierBg(tierId)

  return (
    <Link
      href="/rewards"
      className="hidden md:flex items-center gap-3 group"
      aria-label={`Your XP: ${xpState.totalXP.toLocaleString()} — ${xpState.currentTier.name} tier`}
    >
      {/* Tier badge */}
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-opacity group-hover:opacity-80 ${tierBgClass} ${tierColorClass}`}>
        <span className="material-symbols-outlined text-[14px]">{xpState.currentTier.badgeIcon}</span>
        {xpState.currentTier.name}
      </div>

      {/* XP progress bar */}
      <div className="flex flex-col gap-0.5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-on-surface tabular-nums whitespace-nowrap">
            {xpState.totalXP.toLocaleString()} XP
          </span>
          {xpState.nextTier && xpState.xpToNextTier !== null && (
            <span className="text-[10px] text-on-surface-variant tabular-nums whitespace-nowrap">
              {xpState.xpToNextTier.toLocaleString()} to {xpState.nextTier.name}
            </span>
          )}
        </div>
        <div className="w-28 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="xp-bar-fill h-full rounded-full transition-all duration-700"
            style={{ width: `${xpState.progressPercent}%` }}
          />
        </div>
      </div>
    </Link>
  )
}
