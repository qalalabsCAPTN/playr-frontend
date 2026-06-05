"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function TrackingDashboard() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId) {
      router.push(`/account/tracking/${orderId}`)
    }
  }

  return (
    <div className="space-y-stack-lg">
      <div className="flex justify-between items-center px-2">
        <h3 className="font-headline-md text-headline-md uppercase tracking-tight">Track Your Shipment</h3>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[300px] rounded-xl flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-on-surface">
          {/* We use a solid color here, mimicking the athletic brand identity */}
        </div>
        <div className="relative z-10 text-white">
          <p className="font-body-lg text-body-lg text-surface-variant max-w-lg mx-auto">Get real-time updates on your high-performance gear. Enter your details below to see where your journey stands.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <span className="material-symbols-outlined text-[200px]" data-icon="local_shipping">local_shipping</span>
        </div>
      </section>

      {/* Tracking Form Section */}
      <section className="max-w-2xl mx-auto -mt-16 relative z-20">
        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-xl border border-accent-grey/20 shadow-sm h-full">
          <h2 className="font-headline-md text-headline-md mb-8">Search Details</h2>
          <form className="space-y-6" onSubmit={handleTrack}>
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold block uppercase">Order ID / Tracking Number</label>
              <input 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-surface px-6 py-4 rounded-lg border border-accent-grey/30 focus:border-on-surface focus:ring-0 transition-all outline-none font-body-md" 
                placeholder="e.g. PR-882931" 
                type="text"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-bold text-label-bold block uppercase">Email or Phone Number</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface px-6 py-4 rounded-lg border border-accent-grey/30 focus:border-on-surface focus:ring-0 transition-all outline-none font-body-md" 
                placeholder="athlete@playr.com" 
                type="text"
              />
            </div>
            <button 
              className="w-full bg-action-yellow text-on-surface font-label-bold text-label-bold py-5 rounded-lg hover:scale-[1.01] active:scale-95 transition-all shadow-md uppercase tracking-widest" 
              type="submit"
            >
              Track Shipment
            </button>
          </form>
          <div className="mt-8 pt-8 border-t border-outline-variant/30">
            <p className="font-label-sm text-label-sm text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Need help? Contact our support team at support@playr.athletics
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
