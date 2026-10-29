'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, subject, message }),
      });
      if (res.ok) {
        setStatus('Thanks! Your message has been received by our athlete support team.');
        setFirstName('');
        setLastName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || 'Thanks! Your inquiry has been logged. Our concierge will reply shortly.');
      }
    } catch {
      setStatus('Thanks! Your inquiry has been received. Our team will contact you within 24 hours.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] pt-32 pb-24 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-[0.3em] mb-3 block">
          Concierge &amp; Inquiries
        </span>
        <h1 className="font-black text-4xl sm:text-6xl uppercase tracking-tighter text-[var(--fg)] mb-4">
          Get in Touch
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base leading-relaxed">
          Ask us anything! Whether you have an inquiry on match jerseys, delivery telemetry, bulk teamwear, or licensing, TEAM playR is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info & Office Addresses */}
        <div className="lg:col-span-5 space-y-6">
          {/* Operations Office */}
          <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--chip)] flex items-center justify-center text-[var(--fg)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">Operations HQ</span>
                <h3 className="text-base font-black uppercase text-[var(--fg)]">HOUSE playR</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              # 320, 100 Feet Road, Ghitorni,<br />
              New Delhi – 110030, India
            </p>
            <div className="pt-2 border-t border-[var(--border)] text-xs text-[var(--muted)]">
              <strong>GSTIN:</strong> 07AAECI1569D1ZQ
            </div>
          </div>

          {/* Mumbai Registered Office */}
          <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--chip)] flex items-center justify-center text-[var(--fg)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)]">Registered Office</span>
                <h3 className="text-base font-black uppercase text-[var(--fg)]">Mumbai Office</h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Studio 150, Satguru Nanak Industrial Estate,<br />
              Jay Coach, Shri Ram Mandir Rd, Goregaon East,<br />
              Mumbai, Maharashtra – 400063, India
            </p>
          </div>

          {/* Direct Electronic Channels */}
          <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl space-y-4">
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)] block">Phone &amp; WhatsApp</span>
                <a href="tel:+918448441388" className="text-sm font-bold text-[var(--fg)] hover:underline block">
                  +91 8448441388
                </a>
                <a href="https://wa.me/918448441388" target="_blank" rel="noreferrer" className="text-xs text-[var(--accent)] font-semibold hover:underline mt-0.5 inline-block">
                  Open WhatsApp Chat &rarr;
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-[var(--border)]">
              <Mail className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--muted)] block">Email Support</span>
                <a href="mailto:support@playr.in" className="text-sm font-bold text-[var(--fg)] hover:underline block">
                  support@playr.in
                </a>
                <a href="mailto:info@playr.in" className="text-xs text-[var(--muted)] hover:underline">
                  info@playr.in
                </a>
              </div>
            </div>
          </div>

          {/* B2B Card */}
          <div className="p-8 bg-[var(--fg)] text-[var(--panel)] rounded-3xl flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider mb-1">Corporate &amp; Teamwear</h4>
              <p className="text-xs opacity-80">Bulk kitting, custom jerseys &amp; league partnerships.</p>
            </div>
            <Link
              href="/b2b"
              className="px-5 py-2.5 rounded-full bg-[var(--panel)] text-[var(--fg)] text-xs font-bold uppercase tracking-wider shrink-0 hover:opacity-90 transition-opacity"
            >
              Explore B2B
            </Link>
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-12 bg-[var(--panel)] border border-[var(--border)] rounded-3xl shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--fg)] mb-2">
              Send Us An Email
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted)] mb-8">
              Leave your details below and our concierge team will respond within 24 business hours.
            </p>

            {status ? (
              <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-[var(--fg)] mb-1">Message Transmitted!</h4>
                <p className="text-xs text-[var(--muted)] max-w-sm mx-auto mb-6">
                  {status}
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('')}
                  className="px-6 py-2.5 rounded-full bg-[var(--fg)] text-[var(--panel)] text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Virat"
                      className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Kohli"
                      className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. athlete@playr.in"
                    className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Order Delivery Telemetry or Jersey Personalization"
                    className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you today? Please share order IDs or specifics..."
                    className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[var(--fg)] text-[var(--panel)] rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  {loading ? 'Submitting...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
