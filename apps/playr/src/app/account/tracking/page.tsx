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
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface">Track Shipment</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden relative">
        {/* Background Graphic */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
          <span className="material-symbols-outlined text-[400px] absolute -right-20 -top-20">local_shipping</span>
        </div>

        <div className="p-8 md:p-12 relative z-10 max-w-2xl">
          <div className="bg-primary-container text-on-primary-container w-16 h-16 rounded-2xl flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-3xl">location_on</span>
          </div>
          
          <h2 className="font-black text-3xl uppercase tracking-tight text-on-surface mb-3">Where is my order?</h2>
          <p className="font-medium text-sm text-on-surface-variant mb-10 leading-relaxed">
            Enter your tracking number or order ID below to get real-time updates on your high-performance gear.
          </p>

          <form className="space-y-6" onSubmit={handleTrack}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Order ID / Tracking Number</label>
              <input 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                placeholder="e.g. PR-882931" 
                type="text"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email or Phone Number</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" 
                placeholder="athlete@playr.com" 
                type="text"
              />
            </div>
            <div className="pt-4">
              <button 
                className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity" 
                type="submit"
              >
                Track Shipment
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant/30">
            <p className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Need help? Contact our support team at <strong className="text-on-surface">support@playr.athletics</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
