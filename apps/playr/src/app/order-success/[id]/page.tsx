'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = (params?.id as string) || 'PR-CONFIRMED';

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--fg)] pt-24 pb-32 px-6 sm:px-12 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="border border-[var(--line)] bg-[var(--panel)] p-8 md:p-12 rounded-[var(--radius-lg)] shadow-xl"
        >
          <div className="w-14 h-14 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            ✓
          </div>

          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] block mb-2">
            Payment &amp; Allocation Verified
          </span>

          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3">
            Order Confirmed
          </h1>

          <p className="font-mono text-xs text-[var(--muted)] mb-6">
            Order Reference: <span className="text-[var(--fg)] font-bold">{id}</span>
          </p>

          <div className="p-4 rounded-[var(--radius)] bg-[var(--chip)] border border-[var(--line)] mb-6 text-xs text-left space-y-2">
            <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-bold">
              <span>✦ SP-RR Loyalty Points Accrued</span>
              <span>NECTAR Active</span>
            </div>
            <p className="text-[var(--muted)] text-[11px] leading-relaxed">
              Your purchase has been verified through the Easebuzz payment gateway and registered with Unicommerce logistics.
            </p>
          </div>

          <p className="text-xs text-[var(--muted)] leading-relaxed mb-8">
            An order confirmation receipt and consignment tracking updates will be dispatched via SMS &amp; Email once processed at our facility.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/collections/all-products"
              className="px-8 py-3.5 bg-[var(--fg)] text-[var(--panel)] text-xs font-bold uppercase tracking-widest rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="px-8 py-3.5 border border-[var(--line)] text-xs font-bold uppercase tracking-widest rounded-[var(--radius-sm)] hover:bg-[var(--chip)] transition-colors"
            >
              Back Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
