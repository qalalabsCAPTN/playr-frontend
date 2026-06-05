"use client"

import React from "react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  return (
    <main className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-primary text-5xl">check_circle</span>
      </div>
      
      <h1 className="text-headline-xl font-headline-xl uppercase tracking-tighter mb-4">
        Order Confirmed!
      </h1>
      
      <p className="text-body-lg text-secondary max-w-lg mb-12">
        Thank you for your purchase. We&apos;ve received your order and are currently processing it. A confirmation email has been sent to your address.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/collections/premium-polos"
          className="bg-black text-white px-8 py-4 rounded-full font-label-lg uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/account"
          className="bg-transparent border border-on-surface text-on-surface px-8 py-4 rounded-full font-label-lg uppercase tracking-widest hover:bg-surface-container transition-colors"
        >
          View Order Status
        </Link>
      </div>
    </main>
  )
}
