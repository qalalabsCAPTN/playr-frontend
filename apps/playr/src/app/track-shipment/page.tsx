'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, Headphones, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function TrackShipmentPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [trackingResult, setTrackingResult] = useState<null | {
    status: string;
    carrier: string;
    awb: string;
    expectedDate: string;
    currentLocation: string;
    steps: Array<{ title: string; date: string; done: boolean; current?: boolean }>;
  }>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    // Simulate or route to tracking details
    const cleanId = orderId.trim().toUpperCase();
    setTrackingResult({
      status: 'In Transit',
      carrier: 'BlueDart Air Express / Delhivery Logistics',
      awb: cleanId.startsWith('PR-') ? `AWB-${cleanId.replace('PR-', '')}` : cleanId,
      expectedDate: '3-4 Business Days',
      currentLocation: 'Hub Sort Facility — Delhi Logistics Hub',
      steps: [
        { title: 'Order Verified & Packed at playR Warehouse', date: 'Order Confirmed', done: true },
        { title: 'Handed Over to Courier Partner', date: 'Dispatched', done: true },
        { title: 'In Transit to Destination Hub', date: 'Active', done: true, current: true },
        { title: 'Out for Delivery', date: 'Expected Soon', done: false },
        { title: 'Delivered', date: 'Doorstep Delivery', done: false }
      ]
    });
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">
          Logistics Telemetry
        </span>
        <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-tighter text-[var(--fg)] mb-4">
          Track Your Shipment
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base max-w-xl mx-auto">
          Enter your playR order number or logistics AWB to receive live shipment telemetry and estimated delivery updates.
        </p>
      </div>

      {/* Tracker Card */}
      <div className="bg-[var(--panel)] border border-[var(--border)] rounded-3xl p-6 sm:p-10 shadow-sm mb-12">
        <form onSubmit={handleTrack} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                Order ID or AWB *
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. PR-882931 or AWB-109283"
                className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-2xl px-5 py-3.5 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                Email or Phone (Optional)
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. athlete@playr.in"
                className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-2xl px-5 py-3.5 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[var(--fg)] text-[var(--panel)] py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <Truck className="w-4 h-4 shrink-0" />
            Track Order Live
          </button>
        </form>

        {trackingResult && (
          <div className="mt-10 pt-8 border-t border-[var(--border)] animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-[var(--chip)] p-5 rounded-2xl">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold block">Status</span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 uppercase">
                  {trackingResult.status}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold block">Partner</span>
                <span className="text-sm font-bold text-[var(--fg)]">{trackingResult.carrier}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold block">AWB</span>
                <span className="text-sm font-bold text-[var(--fg)] font-mono">{trackingResult.awb}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold block">Delivery Window</span>
                <span className="text-sm font-bold text-[var(--fg)]">{trackingResult.expectedDate}</span>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4">
              {trackingResult.steps.map((st, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    st.current
                      ? 'bg-[var(--accent)] text-white ring-4 ring-[var(--accent)]/20'
                      : st.done
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[var(--chip)] text-[var(--muted)]'
                  }`}>
                    {st.done ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${st.current ? 'font-bold text-[var(--fg)]' : st.done ? 'font-medium text-[var(--fg)]' : 'text-[var(--muted)]'}`}>
                      {st.title}
                    </p>
                    <span className="text-[11px] text-[var(--muted)]">{st.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Support Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl">
          <Clock className="w-6 h-6 mx-auto mb-2 text-[var(--muted)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Dispatch Speed</h4>
          <p className="text-xs text-[var(--muted)]">Orders dispatched within 24-48 business hours</p>
        </div>
        <div className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl">
          <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-[var(--muted)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Authentic Guarantee</h4>
          <p className="text-xs text-[var(--muted)]">100% Genuine IPL &amp; Performance Teamwear</p>
        </div>
        <div className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl">
          <Headphones className="w-6 h-6 mx-auto mb-2 text-[var(--muted)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Need Assistance?</h4>
          <Link href="/support" className="text-xs font-bold text-[var(--accent)] hover:underline">
            Contact Support &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
