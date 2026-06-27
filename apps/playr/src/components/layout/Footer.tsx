"use client"

import React, { useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('Subscribed successfully!');
        setEmail('');
      } else {
        const data = await res.json();
        setStatus(data.error || 'Failed to subscribe.');
      }
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-inverse-surface text-inverse-on-surface pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-container/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-[1400px] mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">

        {/* Brand + Newsletter */}
        <div className="md:col-span-4 pr-8">
          <span className="font-black text-5xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-inverse-on-surface to-inverse-on-surface/50 mb-6 block">
            playR
          </span>
          <p className="text-inverse-on-surface/50 mb-8 max-w-sm leading-relaxed">
            Engineered for elite performance. Designed for everyday greatness. Join the movement of champions.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
            <div className="flex gap-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Join the newsletter"
                className="bg-inverse-on-surface/5 border border-inverse-on-surface/15 rounded-full px-6 py-3 w-full text-sm text-inverse-on-surface placeholder:text-inverse-on-surface/30 focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-inverse-on-surface text-inverse-surface font-bold uppercase text-xs tracking-widest px-6 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {status && (
              <p className="text-xs text-primary-container font-medium mt-1">{status}</p>
            )}
          </form>
        </div>

        {/* Shop */}
        <div className="md:col-span-2 md:col-start-6">
          <h4 className="text-inverse-on-surface font-bold mb-6 uppercase tracking-widest text-xs">Shop</h4>
          <ul className="space-y-4 text-sm font-medium text-inverse-on-surface/40">
            <li><Link href="/collections/new" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">New Arrivals</Link></li>
            <li><Link href="/collections/men" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Men&apos;s Gear</Link></li>
            <li><Link href="/collections/women" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Women&apos;s Gear</Link></li>
            <li><Link href="/collections/accessories" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Accessories</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="md:col-span-2">
          <h4 className="text-inverse-on-surface font-bold mb-6 uppercase tracking-widest text-xs">Support</h4>
          <ul className="space-y-4 text-sm font-medium text-inverse-on-surface/40">
            <li><Link href="/pages/faq" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">FAQ &amp; Help</Link></li>
            <li><Link href="/account/tracking" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Track Order</Link></li>
            <li><Link href="/pages/returns" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Returns Policy</Link></li>
            <li><Link href="/contact" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Contact Us</Link></li>
          </ul>
        </div>

        {/* Corporate */}
        <div className="md:col-span-2">
          <h4 className="text-inverse-on-surface font-bold mb-6 uppercase tracking-widest text-xs">Corporate</h4>
          <ul className="space-y-4 text-sm font-medium text-inverse-on-surface/40">
            <li><Link href="/b2b" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">B2B &amp; Teamwear</Link></li>
            <li><Link href="/about" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Our Story</Link></li>
            <li><Link href="/media" className="hover:text-inverse-on-surface hover:translate-x-1 inline-block transition-all">Media</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container max-w-[1400px] mx-auto px-4 mt-20 pt-8 border-t border-inverse-on-surface/10 text-xs text-inverse-on-surface/30 flex flex-col md:flex-row justify-between items-center relative z-10">
        <p className="font-medium tracking-wide">© 2026 playR. Powered by NECTAR Ecosystem.</p>
        <div className="flex gap-8 mt-6 md:mt-0 font-medium tracking-wide">
          <Link href="/pages/privacy" className="hover:text-inverse-on-surface transition-colors">Privacy Policy</Link>
          <Link href="/pages/terms" className="hover:text-inverse-on-surface transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
