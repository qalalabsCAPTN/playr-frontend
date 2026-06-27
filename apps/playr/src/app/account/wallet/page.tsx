"use client"

import React, { useState } from "react"
import { useAccount } from "@/components/account/AccountProvider"
import { motion, AnimatePresence } from "framer-motion"

export default function WalletPage() {
  const { wallet, profile, isLoading, refreshData } = useAccount()
  const [topupAmount, setTopupAmount] = useState(500)
  const [isToppingUp, setIsToppingUp] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  if (isLoading || !wallet || !profile) {
    return <div className="animate-pulse h-96 bg-surface-container rounded-3xl"></div>
  }

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleTopup = async () => {
    if (topupAmount <= 0) return;

    setIsToppingUp(true)
    try {
      const res = await fetch(`/api/identity/users/${profile.id}/wallet/topup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: topupAmount,
          description: `Added funds via sandbox simulation`
        })
      })

      if (res.ok) {
        await refreshData()
        triggerToast(`Successfully added ₹${topupAmount.toLocaleString()} to NECTAR Wallet!`)
      } else {
        triggerToast("Failed to top up wallet.")
      }
    } catch (err) {
      triggerToast("Network error. Please try again.")
    } finally {
      setIsToppingUp(false)
    }
  }

  const presets = [100, 500, 1000, 2000, 5000];

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
            <span className="material-symbols-outlined text-sm text-green-500">account_balance_wallet</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">NECTAR Wallet</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Balance Card & Simulated Topup Panel */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-container-low p-6 md:p-8 rounded-3xl border border-outline-variant/30 relative overflow-hidden flex flex-col sm:flex-row justify-between items-center gap-8 shadow-sm">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Available Balance</span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-black text-xl text-primary">{wallet.currency}</span>
                <h2 className="font-black text-5xl sm:text-6xl tracking-tighter text-on-surface leading-none">{wallet.balance.toLocaleString('en-IN')}</h2>
              </div>
              <p className="text-xs text-on-surface-variant font-medium mt-3">
                Fast, secure checkouts with 1-click execution.
              </p>
            </div>
            
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 border border-primary/20">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>

            <div className="absolute -right-10 -top-10 opacity-[0.02] pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">account_balance_wallet</span>
            </div>
          </section>

          {/* Top-up Funds Simulation Widget */}
          <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline">Top up Wallet</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Simulate adding credit balance to your account instantly.</p>
            </div>

            {/* Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline font-bold text-xs uppercase tracking-wider text-on-surface-variant">
                <span>Select Amount</span>
                <span className="text-on-surface font-black text-lg">₹{topupAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={topupAmount}
                onChange={(e) => setTopupAmount(Number(e.target.value))}
                className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTopupAmount(preset)}
                  className={`px-4 py-2 rounded-full font-bold text-xs border transition-all ${
                    topupAmount === preset 
                      ? 'bg-primary text-on-primary border-primary' 
                      : 'bg-surface-container text-on-surface border-outline-variant/20 hover:bg-on-surface/5'
                  }`}
                >
                  +₹{preset}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-outline-variant/25">
              <button
                onClick={handleTopup}
                disabled={isToppingUp || topupAmount <= 0}
                className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {isToppingUp ? (
                  "Processing Sim..."
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">payment</span>
                    Simulate Add Funds
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Perks & Features */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col justify-center">
            <h4 className="font-black text-md uppercase tracking-tight text-on-surface font-headline mb-4">Fast & Secure Checkouts</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">flash_on</span>
                <div>
                  <span className="font-bold text-xs text-on-surface uppercase tracking-wider block">1-Click Payment</span>
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">No bank OTP codes or cards required. Tap and go.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">restart_alt</span>
                <div>
                  <span className="font-bold text-xs text-on-surface uppercase tracking-wider block">Instant Refunds</span>
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">Refunds are immediately credited back to your wallet.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary shrink-0">shield</span>
                <div>
                  <span className="font-bold text-xs text-on-surface uppercase tracking-wider block">Protected Funds</span>
                  <span className="text-[11px] text-on-surface-variant leading-relaxed">Secured via multi-level token authentication logs.</span>
                </div>
              </div>
            </div>
          </section>
        </aside>

      </div>

      {/* Transaction History */}
      <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-variant/30 bg-surface-container/30">
          <h3 className="font-black text-md uppercase tracking-tight text-on-surface font-headline">Wallet Transactions</h3>
        </div>
        
        {wallet.transactions.length > 0 ? (
          <div className="divide-y divide-outline-variant/20">
            {wallet.transactions.map(txn => (
              <div key={txn.id} className="p-5 flex justify-between items-center hover:bg-surface-container/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    txn.type === 'credit' ? 'bg-green-500/10 text-green-600' : 'bg-on-surface/5 text-on-surface'
                  }`}>
                    <span className="material-symbols-outlined text-md">
                      {txn.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{txn.description}</h4>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      {new Date(txn.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className={`font-black text-md ${txn.type === 'credit' ? 'text-green-600' : 'text-on-surface'}`}>
                  {txn.type === 'credit' ? '+' : '-'} {wallet.currency} {txn.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center flex flex-col items-center">
             <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-4">receipt_long</span>
             <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">No transactions found.</p>
          </div>
        )}
      </section>
    </div>
  )
}
