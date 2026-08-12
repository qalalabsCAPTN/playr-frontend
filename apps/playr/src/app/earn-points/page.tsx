'use client';

import { useState } from 'react';

export default function EarnPointsPage() {
  const [copied, setCopied] = useState(false);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [showActivityHistory, setShowActivityHistory] = useState(false);
  const [showReferralHistory, setShowReferralHistory] = useState(false);

  const referralCode = 'https://playr.in/?tractor_referral_code=49C9FF85';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const leaderboardData = {
    week: [
      { name: 'Pranav Sawant', initials: 'P', referrals: 1 },
      { name: 'Naufal S', initials: 'N', referrals: 1 },
    ],
    month: [
      { name: 'Pranav Sawant', initials: 'P', referrals: 1 },
      { name: 'Naufal S', initials: 'N', referrals: 1 },
      { name: 'Swayamhu Mangla', initials: 'S', referrals: 1 },
      { name: 'Vishal Agarwal', initials: 'V', referrals: 1 },
    ],
    year: [
      { name: 'Swayamhu Mangla', initials: 'S', referrals: 4 },
      { name: 'Vishal Agarwal', initials: 'V', referrals: 3 },
      { name: 'Pranav Sawant', initials: 'P', referrals: 2 },
      { name: 'Naufal S', initials: 'N', referrals: 2 },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f8f6f0] dark:bg-[#14120e] text-[#1c1a16] dark:text-[#f4f4f4] pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Floating 0 Points Badge at Bottom Left */}
      <div className="fixed bottom-5 left-5 z-40">
        <div className="flex items-center gap-2 bg-[#1c1a16] text-white px-3.5 py-2 rounded-full shadow-2xl border border-white/20 text-xs font-bold tracking-wide">
          <div className="w-4 h-4 rounded-full bg-amber-400 text-[#1c1a16] flex items-center justify-center font-black text-[9px]">
            ⚡
          </div>
          <span>0 Points</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Top Header */}
        <section className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your playR Reward</h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Earn Points with every purchase and redeem them for discounts!
          </p>
          <div>
            <button className="px-4 py-1.5 text-xs font-bold rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
              Earn Points
            </button>
          </div>
        </section>

        {/* Section 1: Your Points */}
        <section className="bg-white dark:bg-[#1c1a16] rounded-xl p-8 shadow-sm border border-neutral-200/80 dark:border-neutral-800 text-center space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Your Points</h2>
          <div className="space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <p>Points expire in 2 months from the date they were rewarded.</p>
            <p>Expiry is calculated on rolling basis.</p>
          </div>

          <div className="pt-4 space-y-2 max-w-md mx-auto">
            <p className="text-sm font-semibold">Start your journey to <span className="font-bold text-black dark:text-white">Rookie</span></p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">You are not on any tier at the moment</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden relative mt-2">
              <div className="bg-black dark:bg-white h-full w-[0%] transition-all duration-500" />
            </div>
            <div className="text-right text-[11px] font-bold text-neutral-400">0%</div>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => setShowActivityHistory(!showActivityHistory)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:underline"
            >
              <span>Activity History</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${showActivityHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showActivityHistory && (
              <div className="mt-4 p-4 text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-900 rounded-md">
                No activity recorded yet. Start shopping to earn points!
              </div>
            )}
          </div>
        </section>

        {/* Section 2: VIP Program */}
        <section className="text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">VIP Program</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Unlock more discounts & offers by leveling up</p>
          </div>

          {/* Tier Cards Row 1 (3 items) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1c1a16] p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Level 1</span>
              <h3 className="text-lg font-extrabold">Rookie</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px]">
                Make at least 1 successful purchase to reach this level
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="text-neutral-400">Benefits: </span>
                <span className="font-semibold">Get 1X Points and exclusive offers</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Level 2</span>
              <h3 className="text-lg font-extrabold">Pro</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px]">
                Make at least 3 successful purchases to reach this level
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="text-neutral-400">Benefits: </span>
                <span className="font-semibold">Get 1X Points and exclusive offers</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Level 3</span>
              <h3 className="text-lg font-extrabold">Legend</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px]">
                Make at least 5 successful purchases to reach this level
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="text-neutral-400">Benefits: </span>
                <span className="font-semibold">Get 1X Points and exclusive offers</span>
              </div>
            </div>
          </div>

          {/* Tier Cards Row 2 (2 centered items) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-[#1c1a16] p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Level 4</span>
              <h3 className="text-lg font-extrabold">Creators</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px]">
                Check the <a href="/pages/faq" className="underline">FAQs</a> to find how to reach this level
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="text-neutral-400">Benefits: </span>
                <span className="font-semibold">Get 1.5X Points and exclusive offers</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-6 rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3 shadow-sm">
              <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Level 5</span>
              <h3 className="text-lg font-extrabold">Talent</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 min-h-[32px]">
                Check the <a href="/pages/faq" className="underline">FAQs</a> to find how to reach this level
              </p>
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="text-neutral-400">Benefits: </span>
                <span className="font-semibold">Get 1.5X Points and exclusive offers</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Ways To Earn */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Ways To Earn</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Earn Points with every purchase and redeem them for discounts!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:border-black/30 transition-colors cursor-pointer group">
              <div>
                <h4 className="text-xs font-bold">Anniversary Reward</h4>
                <p className="text-[11px] text-neutral-500">Get 50 Points</p>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:border-black/30 transition-colors cursor-pointer group">
              <div>
                <h4 className="text-xs font-bold">Birthday Reward</h4>
                <p className="text-[11px] text-neutral-500">Get 50 Points</p>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:border-black/30 transition-colors cursor-pointer group">
              <div>
                <h4 className="text-xs font-bold">Write a Review</h4>
                <p className="text-[11px] text-neutral-500">Get 10 Points</p>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:border-black/30 transition-colors cursor-pointer group">
              <div>
                <h4 className="text-xs font-bold">Follow on Instagram</h4>
                <p className="text-[11px] text-neutral-500">Get 100 Points</p>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:border-black/30 transition-colors cursor-pointer group">
              <div>
                <h4 className="text-xs font-bold">Order Placed</h4>
                <p className="text-[11px] text-neutral-500">Get 5 Points for every ₹100 spent</p>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:border-black/30 transition-colors cursor-pointer group">
              <div className="flex items-center gap-2">
                <div>
                  <h4 className="text-xs font-bold flex items-center gap-1.5">
                    Signup Reward
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                  </h4>
                  <p className="text-[11px] text-neutral-500">Get 100 Points</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between shadow-sm hover:border-black/30 transition-colors cursor-pointer group">
              <div>
                <h4 className="text-xs font-bold">Refer &amp; Earn</h4>
                <p className="text-[11px] text-neutral-500">Get 50 Points</p>
              </div>
              <svg className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </section>

        {/* Section 4: Referral Program */}
        <section className="bg-neutral-100/70 dark:bg-neutral-900/60 rounded-2xl p-8 text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Referral Program</h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Share this link with a friend so they can claim the 15% Off Coupon reward.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 w-full sm:w-1/2 text-center shadow-sm">
              <p className="text-[11px] text-neutral-400">They get</p>
              <p className="text-sm font-bold text-black dark:text-white">15% Off Coupon</p>
            </div>

            <div className="bg-white dark:bg-[#1c1a16] p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 w-full sm:w-1/2 text-center shadow-sm flex items-center justify-center gap-2">
              <div>
                <p className="text-[11px] text-neutral-400">You get</p>
                <p className="text-sm font-bold text-black dark:text-white">50 Points</p>
              </div>
              <span className="text-lg">🎁</span>
            </div>
          </div>

          {/* Copy Input Bar */}
          <div className="max-w-xl mx-auto flex items-center bg-white dark:bg-[#1c1a16] rounded-lg border border-neutral-300 dark:border-neutral-700 p-1.5 shadow-sm">
            <input 
              type="text" 
              readOnly 
              value={referralCode}
              className="flex-1 px-3 text-xs bg-transparent focus:outline-none text-neutral-600 dark:text-neutral-300 truncate"
            />
            <button 
              onClick={handleCopy}
              className="px-4 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded text-xs font-bold hover:opacity-90 transition-opacity"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3 text-neutral-600 dark:text-neutral-400">
            <button className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-xs">
              f
            </button>
            <button className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-xs">
              💬
            </button>
            <button className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-xs">
              ✕
            </button>
          </div>

          <div>
            <button 
              onClick={() => setShowReferralHistory(!showReferralHistory)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:underline"
            >
              <span>Your Referral History</span>
              <svg className={`w-3.5 h-3.5 transition-transform ${showReferralHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showReferralHistory && (
              <div className="mt-4 p-4 text-xs text-neutral-500 bg-white dark:bg-[#1c1a16] rounded-md max-w-lg mx-auto">
                No referral history found yet.
              </div>
            )}
          </div>
        </section>

        {/* Section 5: Referral Leaderboard */}
        <section className="text-center space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Referral Leaderboard</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              See who&apos;s earning the most rewards and climb the leaderboard.
            </p>
          </div>

          {/* Timeframe Tabs */}
          <div className="inline-flex items-center bg-neutral-200/80 dark:bg-neutral-800/80 p-1 rounded-lg text-xs font-semibold">
            <button 
              className={`px-4 py-1 rounded-md transition-colors ${timeframe === 'week' ? 'bg-white dark:bg-[#1c1a16] shadow-sm text-black dark:text-white' : 'text-neutral-500'}`}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={`px-4 py-1 rounded-md transition-colors ${timeframe === 'month' ? 'bg-white dark:bg-[#1c1a16] shadow-sm text-black dark:text-white' : 'text-neutral-500'}`}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={`px-4 py-1 rounded-md transition-colors ${timeframe === 'year' ? 'bg-white dark:bg-[#1c1a16] shadow-sm text-black dark:text-white' : 'text-neutral-500'}`}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>

          {/* Table */}
          <div className="max-w-xl mx-auto bg-white dark:bg-[#1c1a16] rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="grid grid-cols-2 px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase text-left">
              <span>Name</span>
              <span className="text-right">Total Referrals</span>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {leaderboardData[timeframe].map((item, idx) => (
                <div key={idx} className="grid grid-cols-2 px-6 py-3.5 items-center text-xs text-left">
                  <div className="flex items-center gap-3 font-semibold">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                      {item.initials}
                    </div>
                    <span>{item.name}</span>
                  </div>
                  <span className="text-right font-bold">{item.referrals}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
