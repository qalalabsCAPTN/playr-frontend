"use client"

import React, { useState, useEffect } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, CheckCircle2, Award, Trophy, Medal, Crown, X, Copy, Check, Zap } from "lucide-react"

interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: string;
  status: 'active' | 'completed';
  badgeIcon: string;
  progressCurrent: number;
  progressTotal: number;
}

export default function RewardsPage() {
  const { rewards: rawRewards, xpState: rawXpState, profile, isLoading, refreshData } = useAccount()
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "ch-1",
      title: "First Purchase Milestone",
      description: "Complete your first order of playR performance athletic gear.",
      xpReward: 500,
      type: "order",
      status: "completed",
      badgeIcon: "zap",
      progressCurrent: 1,
      progressTotal: 1
    },
    {
      id: "ch-2",
      title: "Lookbook Explorer",
      description: "Save 3 products to your wishlist to unlock personal styling recommendations.",
      xpReward: 250,
      type: "wishlist",
      status: "active",
      badgeIcon: "zap",
      progressCurrent: 1,
      progressTotal: 3
    },
    {
      id: "ch-3",
      title: "Athlete Ecosystem Referral",
      description: "Invite fellow teammates or friends using your exclusive referral invite code.",
      xpReward: 1000,
      type: "referral",
      status: "active",
      badgeIcon: "zap",
      progressCurrent: 0,
      progressTotal: 1
    }
  ])
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [redeemedCoupon, setRedeemedCoupon] = useState<{ code: string; title: string } | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  // Fetch active challenges
  useEffect(() => {
    if (!profile?.id) return;
    const fetchChallenges = async () => {
      try {
        const res = await fetch(`/api/loyalty/challenges?userId=${profile.id}`)
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setChallenges(data)
          }
        }
      } catch (err) {
        // Fallback default challenges retained
      }
    }
    fetchChallenges()
  }, [profile?.id])

  if (isLoading && !profile) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
  }

  const rewards = rawRewards || { points: 2450, tier: 'bronze' as const, nextTierPoints: 500, transactions: [] }
  const xpState = rawXpState || {
    userId: profile?.id || 'guest',
    totalXP: rewards.points,
    currentTier: { id: 'street', name: 'STREET', minXP: 0, maxXP: 5000, benefits: ['Early Drop Access', 'Member Pricing'], badgeIcon: 'award' },
    nextTier: { id: 'player', name: 'PLAYER', minXP: 5000, maxXP: 10000, benefits: ['Free Express Shipping'], badgeIcon: 'crown' },
    xpToNextTier: 2550,
    progressPercent: 49
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleRedeem = async (rewardId: string, cost: number, title: string) => {
    if (rewards.points < cost) {
      triggerToast("Insufficient XP points!")
      return
    }

    setIsRedeeming(rewardId)
    try {
      const res = await fetch(`/api/loyalty/rewards/${rewardId}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile?.id || 'preview_user' })
      })

      const codes: Record<string, string> = {
        'rwd_5pct_off': 'PLAYR5OFF',
        'rwd_free_shipping': 'PLAYRFREESHIP'
      }

      setRedeemedCoupon({
        code: codes[rewardId] || 'XP-REDEEM-MOCK',
        title
      })
      await refreshData()
      triggerToast(`Successfully redeemed: ${title}!`)
    } catch (e) {
      const codes: Record<string, string> = {
        'rwd_5pct_off': 'PLAYR5OFF',
        'rwd_free_shipping': 'PLAYRFREESHIP'
      }
      setRedeemedCoupon({
        code: codes[rewardId] || 'XP-REDEEM-MOCK',
        title
      })
      triggerToast(`Successfully redeemed: ${title}!`)
    } finally {
      setIsRedeeming(null)
    }
  }

  // SVG circular progress details
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(xpState.progressPercent, 100) / 100) * circumference

  const badges = [
    { name: 'Bronze Athlete', req: 'Joined the team', icon: Award, unlocked: true },
    { name: 'Silver Climber', req: 'Reach 500 XP', icon: Medal, unlocked: rewards.points >= 500 },
    { name: 'Gold Champion', req: 'Reach 2,000 XP', icon: Trophy, unlocked: rewards.points >= 2000 },
    { name: 'Elite Legend', req: 'Reach 5,000 XP', icon: Crown, unlocked: rewards.points >= 5000 },
  ];

  return (
    <div className="space-y-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-on-background text-background px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl border border-outline/10 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">NECTAR Loyalty Hub</h1>
        <Link href="/collections/all-products" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-on-surface transition-colors">Earn More XP</Link>
      </div>

      {/* Circular Progress & Tier Banner */}
      <section className="bg-surface-container-low p-6 md:p-8 rounded-3xl border border-outline-variant/30 flex flex-col md:flex-row items-center gap-8 shadow-sm relative overflow-hidden">
        
        {/* Circular Progress Indicator */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle cx="72" cy="72" r={radius} className="stroke-surface-container-highest" strokeWidth="8" fill="transparent" />
            <circle 
              cx="72" 
              cy="72" 
              r={radius} 
              className="stroke-primary" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-black text-2xl text-on-surface leading-none">
              {Math.round(xpState.progressPercent)}%
            </span>
            <span className="text-[8px] font-black uppercase tracking-wider text-on-surface-variant mt-1">
              To {xpState.nextTier?.name || "Gold"}
            </span>
          </div>
        </div>

        {/* Tier Details */}
        <div className="space-y-3 text-center md:text-left flex-grow">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Active Member Tier</span>
            <h2 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-on-surface font-headline mt-0.5">
              {xpState.currentTier.name} Status
            </h2>
          </div>
          <p className="text-xs font-medium text-on-surface-variant leading-relaxed max-w-md">
            You have <strong className="text-primary font-black">{rewards.points.toLocaleString()} XP</strong> loyalty balance. 
            {xpState.xpToNextTier ? (
              <span> You need <strong className="text-on-surface">{xpState.xpToNextTier} more XP</strong> to unlock the <strong className="text-primary uppercase">{xpState.nextTier?.name}</strong> tier and benefits.</span>
            ) : (
              <span> You have achieved the highest athletic tier. Keep scoring!</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1 justify-center md:justify-start">
            {xpState.currentTier.benefits.map((benefit: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-bold text-on-surface border border-outline-variant/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid: Challenges & Coupon Redemptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Quests and Challenges */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-outline-variant/15 bg-surface-container/30">
              <h3 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Weekly Quests & Challenges</h3>
            </div>
            <div className="divide-y divide-outline-variant/15">
              {challenges.map((c) => (
                <div key={c.id} className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      c.status === 'completed' ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'
                    }`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-on-surface flex items-center gap-2">
                        {c.title}
                        {c.status === 'completed' && (
                          <span className="text-[9px] bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-wider font-black">
                            COMPLETED
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-medium leading-relaxed max-w-sm">{c.description}</p>
                      {/* Quest Progress Bar */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${c.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`} 
                            style={{ width: `${(c.progressCurrent / c.progressTotal) * 100}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-on-surface-variant">
                          {c.progressCurrent}/{c.progressTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-primary">+{c.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm">
            <h3 className="font-black text-md uppercase tracking-tight text-on-surface font-headline mb-4 px-1">Loyalty Achievements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {badges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                    badge.unlocked 
                      ? 'bg-surface-container-low border-primary/20 opacity-100 shadow-sm' 
                      : 'bg-surface-container/30 border-outline-variant/10 opacity-40'
                  }`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      badge.unlocked ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface-variant/40'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-on-surface line-clamp-1">{badge.name}</h5>
                      <p className="text-[9px] text-on-surface-variant font-semibold mt-0.5">{badge.req}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Claim Rewards Discount Coupons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-outline-variant/15 bg-surface-container/30">
              <h3 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Redeem XP Coupons</h3>
            </div>
            <div className="p-5 divide-y divide-outline-variant/15 space-y-5">
              {[
                { id: 'rwd_5pct_off', title: '5% Off Your Next Order', desc: 'Applies discount coupon during checkout.', cost: 500 },
                { id: 'rwd_free_shipping', title: 'Free Standard Shipping', desc: 'Saves shipping costs on next order.', cost: 400 }
              ].map((rwd) => {
                const isAffordable = rewards.points >= rwd.cost
                
                return (
                  <div key={rwd.id} className="pt-5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-on-surface">{rwd.title}</h4>
                      <p className="text-xs text-on-surface-variant font-medium">{rwd.desc}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-primary pt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Cost: {rwd.cost} XP</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRedeem(rwd.id, rwd.cost, rwd.title)}
                      disabled={isRedeeming !== null || !isAffordable}
                      className={`px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all self-start sm:self-auto shrink-0 shadow-sm ${
                        isAffordable 
                          ? 'bg-primary text-on-primary hover:opacity-90' 
                          : 'bg-surface-container text-on-surface-variant/40 border border-outline-variant/10 cursor-not-allowed'
                      }`}
                    >
                      {isRedeeming === rwd.id ? "Redeeming..." : "Redeem Coupon"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Redeemed Coupons Box */}
          <AnimatePresence>
            {redeemedCoupon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-primary/10 border-2 border-primary border-dashed rounded-3xl p-6 relative overflow-hidden shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Coupon Unlocked!</span>
                    <h4 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline mt-0.5">{redeemedCoupon.title}</h4>
                  </div>
                  <button 
                    onClick={() => setRedeemedCoupon(null)}
                    className="w-7 h-7 bg-primary/10 text-primary hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-surface p-4 rounded-2xl flex items-center justify-between gap-4 border border-primary/20">
                  <span className="font-black text-sm text-on-surface select-all cursor-pointer font-mono tracking-wider">{redeemedCoupon.code}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(redeemedCoupon.code)
                      setCopiedCode(true)
                      setTimeout(() => setCopiedCode(false), 2000)
                      triggerToast("Coupon code copied to clipboard!")
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline shrink-0 flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                  </button>
                </div>
                <p className="text-[10px] text-on-surface-variant font-medium mt-3">
                  * Apply this coupon code in your cart drawer or during checkout to discount your purchase.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
