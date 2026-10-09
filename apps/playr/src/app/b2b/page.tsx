'use client';

import React, { useState } from 'react';

export default function B2BPage() {
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    inquiryType: 'Custom Teamwear (Jerseys, Kits)',
    requirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Thank you! Your corporate inquiry has been submitted. Our B2B partnership team will contact you within 24 hours.');
  };

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--fg)] pb-20">
      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 md:px-8 border-b border-[var(--line)] overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[var(--chip)] text-[var(--fg)] border border-[var(--line)] mb-4">
            B2B &amp; Corporate Partnerships
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
            Equip Your Team With playR
          </h1>
          <p className="text-sm md:text-base text-[var(--muted)] max-w-2xl mx-auto mb-8 leading-relaxed">
            From premier sporting franchises and academies to corporate wellness programs, playR delivers high-performance teamwear, customized kits, and bulk equipment at scale.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#inquiry"
              className="px-6 py-3 rounded-md bg-[var(--fg)] text-[var(--panel)] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Request Catalogue &amp; Quote
            </a>
            <a
              href="mailto:corporate@playr.in"
              className="px-6 py-3 rounded-md border border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] font-bold text-xs uppercase tracking-widest hover:bg-[var(--chip)] transition-colors"
            >
              corporate@playr.in
            </a>
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="py-14 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
            Our Enterprise Capabilities
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tight mt-1">
            Solutions Tailored For Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-[var(--radius)] bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[var(--chip)] border border-[var(--line)] flex items-center justify-center font-black text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-tight mb-2">
                Custom Teamwear &amp; Kits
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Full-sublimation match jerseys, training tees, tracksuits, and travel kits engineered with moisture-wicking AERODRY fabrics and official federation standards.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Min. Order: 25 Units
            </div>
          </div>

          <div className="p-6 rounded-[var(--radius)] bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[var(--chip)] border border-[var(--line)] flex items-center justify-center font-black text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-tight mb-2">
                Bulk Equipment &amp; Academies
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Wholesale pricing on professional-grade cricket bats, balls, protective pads, pickleball paddles, and swim training gear for institutions and tournament organizers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Tiered Wholesale Pricing
            </div>
          </div>

          <div className="p-6 rounded-[var(--radius)] bg-[var(--panel)] border border-[var(--line)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[var(--chip)] border border-[var(--line)] flex items-center justify-center font-black text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-tight mb-2">
                Corporate Gifting &amp; Co-Branding
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Premium co-branded merchandise, caps, hydration bottles, and fitness kits tailored for employee welcome boxes, annual sports days, and executive gifting.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--line)] text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Custom Packaging Available
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="py-10 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="p-6 md:p-10 rounded-[var(--radius-lg)] bg-[var(--panel)] border border-[var(--line)] shadow-xl">
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">
              Direct B2B Desk
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight mt-1">
              Submit Corporate Inquiry
            </h2>
            <p className="text-xs text-[var(--muted)] mt-1">
              Complete the form below to receive our digital B2B catalog, size charts, and wholesale price sheets.
            </p>
          </div>

          {status ? (
            <div className="p-4 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold text-center mb-6">
              {status}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Company / Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Acme Corp / Elite Cricket Club"
                  className="w-full h-11 px-3.5 rounded-md bg-[var(--chip)] border border-[var(--line)] text-sm text-[var(--fg)] outline-none focus:border-[var(--fg)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Full Name"
                  className="w-full h-11 px-3.5 rounded-md bg-[var(--chip)] border border-[var(--line)] text-sm text-[var(--fg)] outline-none focus:border-[var(--fg)] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full h-11 px-3.5 rounded-md bg-[var(--chip)] border border-[var(--line)] text-sm text-[var(--fg)] outline-none focus:border-[var(--fg)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full h-11 px-3.5 rounded-md bg-[var(--chip)] border border-[var(--line)] text-sm text-[var(--fg)] outline-none focus:border-[var(--fg)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Inquiry Type *
              </label>
              <select
                value={formData.inquiryType}
                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                className="w-full h-11 px-3.5 rounded-md bg-[var(--chip)] border border-[var(--line)] text-sm text-[var(--fg)] outline-none focus:border-[var(--fg)] transition-colors"
              >
                <option>Custom Teamwear (Jerseys, Kits)</option>
                <option>Bulk Equipment Order (Cricket, Pickleball, Swim)</option>
                <option>Corporate Gifting &amp; Employee Wellness</option>
                <option>Franchise / Academy Distribution</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Requirements &amp; Estimated Quantity
              </label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Mention estimated quantities, target delivery date, customization requirements..."
                className="w-full p-3.5 rounded-md bg-[var(--chip)] border border-[var(--line)] text-sm text-[var(--fg)] outline-none focus:border-[var(--fg)] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-md bg-[var(--fg)] text-[var(--panel)] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity mt-4 cursor-pointer"
            >
              Submit Inquiry &amp; Download B2B Deck
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
