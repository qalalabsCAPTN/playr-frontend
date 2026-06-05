"use client"

import React, { useState } from "react"

export default function B2BPage() {
  const [status, setStatus] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Your corporate inquiry has been submitted. Our B2B team will contact you within 24 hours.")
  }

  return (
    <div className="bg-[#fdf9f0] min-h-screen text-on-surface">
      {/* Hero Section */}
      <section className="relative py-24 bg-on-surface overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="inline-block px-4 py-1 bg-action-yellow text-on-surface rounded-full mb-6 font-label-bold uppercase tracking-widest">
            Corporate & Bulk
          </span>
          <h1 className="font-headline-xl text-4xl md:text-6xl text-white uppercase tracking-tighter font-black mb-6">
            Equip Your Team
          </h1>
          <p className="font-body-lg text-white/80 max-w-2xl mx-auto mb-10 text-lg">
            From professional sporting franchises to corporate wellness programs, playR delivers high-performance teamwear and bulk equipment at scale.
          </p>
          <a href="#inquiry" className="inline-block bg-action-yellow text-on-surface font-label-bold uppercase px-10 py-4 rounded-full hover:scale-105 transition-transform tracking-widest shadow-xl">
            Request Catalogue
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant/30 text-center shadow-sm hover:shadow-xl transition-shadow group">
            <div className="w-20 h-20 mx-auto bg-surface-container rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">styler</span>
            </div>
            <h3 className="font-headline-md text-2xl uppercase tracking-tight font-bold mb-4">Custom Teamwear</h3>
            <p className="text-secondary font-body-md">
              Fully customized jerseys, training gear, and travel kits engineered with our AERODRY technology for your specific squad.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant/30 text-center shadow-sm hover:shadow-xl transition-shadow group">
            <div className="w-20 h-20 mx-auto bg-surface-container rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">inventory_2</span>
            </div>
            <h3 className="font-headline-md text-2xl uppercase tracking-tight font-bold mb-4">Bulk Equipment</h3>
            <p className="text-secondary font-body-md">
              Wholesale pricing on official cricket, pickleball, and fitness equipment for academies and corporate tournaments.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-10 rounded-2xl border border-outline-variant/30 text-center shadow-sm hover:shadow-xl transition-shadow group">
            <div className="w-20 h-20 mx-auto bg-surface-container rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">corporate_fare</span>
            </div>
            <h3 className="font-headline-md text-2xl uppercase tracking-tight font-bold mb-4">Corporate Gifting</h3>
            <p className="text-secondary font-body-md">
              Premium co-branded merchandise perfect for employee wellness initiatives, client gifts, and event giveaways.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="inquiry" className="py-24 bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="bg-surface-container-lowest p-10 md:p-16 rounded-3xl border border-outline-variant/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-action-yellow"></div>
            
            <div className="text-center mb-10">
              <h2 className="font-headline-xl text-3xl uppercase tracking-tight font-black mb-4">Corporate Inquiry</h2>
              <p className="text-secondary font-body-md">Fill out the form below to download our B2B catalogue and receive a custom quote.</p>
            </div>

            {status && (
              <div className="mb-8 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 font-label-bold text-center">
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Company / Team Name</label>
                  <input type="text" required className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Contact Person</label>
                  <input type="text" required className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Email Address</label>
                  <input type="email" required className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Phone Number</label>
                  <input type="tel" className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Inquiry Type</label>
                <select className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all">
                  <option>Custom Teamwear (Jerseys, Kits)</option>
                  <option>Bulk Equipment Order</option>
                  <option>Corporate Gifting / Wellness</option>
                  <option>Franchise / Academy Partnership</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label-bold text-sm uppercase tracking-wider text-secondary">Additional Requirements</label>
                <textarea rows={4} className="w-full bg-surface-container px-4 py-3 rounded-lg border-transparent focus:border-primary focus:ring-0 outline-none transition-all resize-none" placeholder="Tell us about quantities, specific timelines, etc."></textarea>
              </div>

              <button type="submit" className="w-full bg-action-yellow text-on-surface font-label-bold text-lg uppercase tracking-widest px-8 py-4 rounded-lg hover:scale-[1.02] transition-transform shadow-lg mt-4">
                Submit & Download Catalogue
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
