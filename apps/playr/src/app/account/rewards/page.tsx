"use client"

import React from "react"
import { useAccount } from "@/components/account/AccountProvider"
import Link from "next/link"

export default function RewardsPage() {
  const { rewards, isLoading } = useAccount()

  if (isLoading || !rewards) return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>

  const progressPercentage = Math.min((rewards.points / rewards.nextTierPoints) * 100, 100);

  return (
    <div className="space-y-stack-lg">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-headline-md text-headline-md uppercase tracking-tight">NECTAR Rewards</h3>
        <Link href="/" className="font-label-bold text-primary underline decoration-2 underline-offset-4">Earn More Points</Link>
      </div>

      {/* Hero Card */}
      <section className="bg-on-surface text-background p-8 sm:p-12 rounded-xl border-2 border-on-surface block-shadow flex flex-col justify-between relative overflow-hidden h-auto min-h-[300px]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="font-label-sm uppercase opacity-70">Current Points</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h2 className="font-display-xl text-6xl sm:text-7xl text-action-yellow">{rewards.points.toLocaleString()}</h2>
              <span className="font-headline-md uppercase text-xl">Points</span>
            </div>
            <p className="font-body-md mt-4 text-surface-variant max-w-sm">
              You are currently on the <strong className="text-action-yellow uppercase">{rewards.tier}</strong> tier. 
              {rewards.points < rewards.nextTierPoints && ` Earn ${rewards.nextTierPoints - rewards.points} more points to unlock Gold status.`}
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="flex justify-between font-label-bold mb-2">
              <span className="uppercase text-action-yellow">{rewards.tier}</span>
              <span className="uppercase opacity-50">Gold</span>
            </div>
            <div className="h-4 bg-background/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-action-yellow rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-right text-label-sm mt-2 opacity-50">{rewards.points} / {rewards.nextTierPoints}</p>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[400px]">stars</span>
        </div>
      </section>

      {/* Rewards History */}
      <section className="bg-surface-container-lowest rounded-xl border-2 border-on-surface overflow-hidden">
        <div className="p-6 border-b-2 border-surface-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md uppercase">Point History</h3>
        </div>
        
        {rewards.transactions.length > 0 ? (
          <div className="divide-y-2 divide-surface-variant">
            {rewards.transactions.map(txn => (
              <div key={txn.id} className="p-6 flex justify-between items-center hover:bg-surface-container/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${txn.type === 'earned' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface'}`}>
                    <span className="material-symbols-outlined">{txn.type === 'earned' ? 'add_circle' : 'remove_circle'}</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold">{txn.description}</h4>
                    <span className="text-label-sm text-secondary">{new Date(txn.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`font-headline-sm ${txn.type === 'earned' ? 'text-primary' : 'text-on-surface'}`}>
                  {txn.type === 'earned' ? '+' : '-'}{txn.points} pts
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-secondary">
            No rewards history found.
          </div>
        )}
      </section>
    </div>
  )
}
