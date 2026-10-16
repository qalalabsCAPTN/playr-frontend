"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Truck, MapPin, Headphones, ArrowRight } from "lucide-react"

export default function TrackingDashboard() {
  const router = useRouter()
  const [orderId, setOrderId] = useState("")
  const [email, setEmail] = useState("")

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (orderId.trim()) {
      router.push(`/account/tracking/${orderId.trim()}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">Track Shipment</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden relative shadow-sm">
        <div className="p-8 md:p-12 relative z-10 max-w-2xl">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20">
            <Truck className="w-7 h-7 shrink-0" />
          </div>
          
          <h2 className="font-black text-3xl uppercase tracking-tight text-on-surface mb-3 font-headline">Where is my order?</h2>
          <p className="font-medium text-xs sm:text-sm text-on-surface-variant mb-8 leading-relaxed">
            Enter your order ID or AWB tracking number below to get real-time logistical telemetry on your playR athletic shipment.
          </p>

          <form className="space-y-5" onSubmit={handleTrack}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Order ID / Tracking Number</label>
              <input 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-surface-container/40 border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-on-surface-variant/40" 
                placeholder="e.g. PR-882931 or SHP-882931" 
                type="text"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email or Mobile Number</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container/40 border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-sm font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-on-surface-variant/40" 
                placeholder="e.g. athlete@playr.in" 
                type="text"
              />
            </div>
            <div className="pt-2">
              <button 
                className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm" 
                type="submit"
              >
                <span>Track Shipment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/20">
            <p className="text-xs font-medium text-on-surface-variant flex items-center gap-2">
              <Headphones className="w-4 h-4 text-primary shrink-0" />
              Need help? Contact concierge at <strong className="text-on-surface">support@playr.in</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
