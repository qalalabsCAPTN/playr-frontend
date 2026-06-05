"use client"

import React from "react"
import { useAccount } from "@/components/account/AccountProvider"

export default function WalletPage() {
  const { wallet, isLoading } = useAccount()

  if (isLoading || !wallet) return <div className="animate-pulse h-64 bg-surface-container rounded-xl"></div>

  return (
    <div className="space-y-stack-lg">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-headline-md text-headline-md uppercase tracking-tight">NECTAR Wallet</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
        {/* Balance Card */}
        <section className="md:col-span-1 bg-on-surface text-background p-8 rounded-xl border-2 border-on-surface block-shadow flex flex-col justify-between relative overflow-hidden h-[300px]">
          <div className="relative z-10">
            <span className="font-label-sm uppercase opacity-70">Available Balance</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-headline-md uppercase text-2xl text-action-yellow">{wallet.currency}</span>
              <h2 className="font-display-xl text-5xl text-action-yellow">{wallet.balance.toLocaleString('en-IN')}</h2>
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <button className="bg-action-yellow text-on-surface w-full py-3 rounded-full font-label-bold uppercase tracking-widest hover:opacity-90">
              Add Funds
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <span className="material-symbols-outlined text-[200px]">account_balance_wallet</span>
          </div>
        </section>

        {/* Info Card */}
        <section className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl border-2 border-on-surface flex flex-col justify-center">
          <h4 className="font-headline-md uppercase mb-4">Fast & Secure Checkouts</h4>
          <p className="font-body-md text-on-surface-variant max-w-lg mb-6">
            Use your NECTAR Wallet for instant 1-click checkouts without waiting for bank OTPs. Funds never expire and can be instantly refunded to your original payment source upon request.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-primary font-label-bold">
              <span className="material-symbols-outlined text-sm">flash_on</span>
              Instant Refunds
            </div>
            <div className="flex items-center gap-2 text-primary font-label-bold">
              <span className="material-symbols-outlined text-sm">shield</span>
              Bank Grade Security
            </div>
          </div>
        </section>
      </div>

      {/* Transaction History */}
      <section className="bg-surface-container-lowest rounded-xl border-2 border-on-surface overflow-hidden">
        <div className="p-6 border-b-2 border-surface-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline-md uppercase">Transaction History</h3>
        </div>
        
        {wallet.transactions.length > 0 ? (
          <div className="divide-y-2 divide-surface-variant">
            {wallet.transactions.map(txn => (
              <div key={txn.id} className="p-6 flex justify-between items-center hover:bg-surface-container/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${txn.type === 'credit' ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface'}`}>
                    <span className="material-symbols-outlined">{txn.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}</span>
                  </div>
                  <div>
                    <h4 className="font-label-bold">{txn.description}</h4>
                    <span className="text-label-sm text-secondary">{new Date(txn.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`font-headline-sm ${txn.type === 'credit' ? 'text-primary' : 'text-on-surface'}`}>
                  {txn.type === 'credit' ? '+' : '-'} {wallet.currency} {txn.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-secondary">
            No transactions found.
          </div>
        )}
      </section>
    </div>
  )
}
