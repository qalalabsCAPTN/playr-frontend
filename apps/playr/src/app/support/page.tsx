'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Headphones, Phone, Mail, MessageSquare, Truck, RotateCcw, HelpCircle, Send, CheckCircle2 } from 'lucide-react';

export default function SupportHubPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">
          Customer Care &amp; Assistance
        </span>
        <h1 className="font-black text-4xl sm:text-5xl uppercase tracking-tighter text-[var(--fg)] mb-4">
          playR Help Center
        </h1>
        <p className="text-[var(--muted)] text-sm sm:text-base max-w-xl mx-auto">
          Need help with your order, product sizing, or jersey personalization? Our dedicated customer care team is here to assist.
        </p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Link
          href="/track-shipment"
          className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl hover:border-[var(--fg)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--chip)] flex items-center justify-center mb-4 text-[var(--fg)] group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">Track Order</h3>
          <p className="text-xs text-[var(--muted)]">Check real-time logistical status of your delivery</p>
        </Link>

        <Link
          href="/pages/returns"
          className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl hover:border-[var(--fg)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--chip)] flex items-center justify-center mb-4 text-[var(--fg)] group-hover:scale-110 transition-transform">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">7-Day Returns</h3>
          <p className="text-xs text-[var(--muted)]">Hassle-free doorstep exchange &amp; return policy</p>
        </Link>

        <a
          href="https://wa.me/918448441388"
          target="_blank"
          rel="noreferrer"
          className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl hover:border-[var(--fg)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">WhatsApp Us</h3>
          <p className="text-xs text-[var(--muted)]">Instant support with our dedicated concierge</p>
        </a>

        <Link
          href="/pages/faq"
          className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl hover:border-[var(--fg)] transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--chip)] flex items-center justify-center mb-4 text-[var(--fg)] group-hover:scale-110 transition-transform">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-1">FAQ&apos;s</h3>
          <p className="text-xs text-[var(--muted)]">Answers to shipping, sizes, and care instructions</p>
        </Link>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Contact Info Column */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-6 bg-[var(--panel)] border border-[var(--border)] rounded-3xl space-y-6">
            <h3 className="text-base font-black uppercase tracking-wider text-[var(--fg)]">Direct Contacts</h3>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 mt-0.5 text-[var(--accent)] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold block">Phone</span>
                <a href="tel:+918448441388" className="text-sm font-bold text-[var(--fg)] hover:underline">
                  +91 8448441388
                </a>
                <span className="text-[11px] text-[var(--muted)] block">Mon-Sat, 10 AM - 7 PM IST</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 mt-0.5 text-[var(--accent)] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold block">Email</span>
                <a href="mailto:support@playr.in" className="text-sm font-bold text-[var(--fg)] hover:underline">
                  support@playr.in
                </a>
                <span className="text-[11px] text-[var(--muted)] block">Replies within 24 hours</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 mt-0.5 text-[var(--accent)] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold block">WhatsApp Concierge</span>
                <a href="https://wa.me/918448441388" target="_blank" rel="noreferrer" className="text-sm font-bold text-[var(--fg)] hover:underline">
                  +91 8448441388
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-2">
          <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
            <h3 className="text-lg font-black uppercase tracking-wider text-[var(--fg)] mb-2">Send Us a Message</h3>
            <p className="text-xs text-[var(--muted)] mb-6">
              Have a question about an existing order or need customized team gear? Leave your details below.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-bold text-[var(--fg)] mb-1">Message Received!</h4>
                <p className="text-xs text-[var(--muted)] max-w-sm mx-auto mb-6">
                  Thank you for reaching out. Our support team will get in touch with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[var(--fg)] text-[var(--panel)] text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Virat"
                      className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. virat@playr.in"
                      className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Order Tracking or Jersey Sizing Question"
                    className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] block mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about your query or order number..."
                    className="w-full bg-[var(--chip)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm font-semibold text-[var(--fg)] focus:outline-none focus:border-[var(--accent)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[var(--fg)] text-[var(--panel)] rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 shrink-0" />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
