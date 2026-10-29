import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Award, Zap, Globe, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — playR',
  description: 'Learn about playR, our brand proposition, journey, partnerships with IPL teams (CSK, MI, SRH, GT, LSG), and our global omni-channel presence.',
  alternates: {
    canonical: '/about',
  },
};

const timelineData = [
  {
    year: 'Nov 2021',
    title: 'Launch of playR Apparel',
    desc: 'Kitting & Clothing Partner: Bihar Cricket Association (BCA).'
  },
  {
    year: 'Jan 2022',
    title: 'Launch of playR Cricket Gear',
    desc: 'Mumbai Indians (MI) Exclusive Player Wear Replica License (International Market).'
  },
  {
    year: 'Apr 2022',
    title: 'Launch of playR Bicycles & Accessories',
    desc: 'Mumbai Indians (MI) Global Exclusive Cricket Gear License Merchandise.'
  },
  {
    year: 'Jan 2023',
    title: 'Chennai Super Kings (CSK) Partnership',
    desc: 'CSK Exclusive Global Player Wear Merchandise Partner.'
  },
  {
    year: 'Feb 2023',
    title: 'Rajasthan Royals & GMR Legends League',
    desc: 'Rajasthan Royals (RR) Exclusive Player Wear Partner; GMR Legends League Exclusive Equipment Supplier.'
  },
  {
    year: 'Mar 2023',
    title: 'B2B Division & Punjab Kings',
    desc: 'Launch of playR B2B Corporate Sales Division; Punjab Kings (PBKS) Global Exclusive Cricket Gear License Merchandise.'
  },
  {
    year: 'Jan 2024',
    title: 'Kolkata Knight Riders & PBKS',
    desc: 'Punjab Kings (PBKS) & Kolkata Knight Riders (KKR) Exclusive Player Wear Merchandise Partner.'
  },
  {
    year: 'Feb 2024',
    title: 'D2C & Quick Commerce Rollout',
    desc: 'Launch of playR D2C Ecommerce Marketplace & nationwide Quick Commerce distribution.'
  },
  {
    year: 'Feb 2025',
    title: 'Gujarat Titans & Pickleball League',
    desc: 'Gujarat Titans (GT) Global Exclusive Player Wear Partner; Pickleball Association: Bengaluru Jawans & Chennai Super Champs.'
  },
  {
    year: 'Mar 2025',
    title: 'Sunrisers Hyderabad Partnership',
    desc: 'Sunrisers Hyderabad (SRH) Global Exclusive Fan Jersey Merchandise Partner.'
  },
  {
    year: 'Jun 2025',
    title: 'UP Yoddhas (Pro Kabaddi)',
    desc: 'UP Yoddhas (UPY) Kitting, Clothing & Merchandise Partner.'
  },
  {
    year: 'Nov 2025',
    title: 'Global Cricket Tournaments & Leagues',
    desc: 'Dubai Capitals Kitting Supplier; Alleppey Ripples Kitting & Clothing Supplier; BnW Legends Cup & OGPL Clothing Supplier.'
  },
  {
    year: '2026',
    title: 'STREET playR & Fitness Gear',
    desc: 'Upcoming launches: Gym & Fitness Gear, Pickleball Lines, STREET playR Luxury Streetwear, Swimming Gear, and Lucknow Super Giants (LSG).'
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)] pt-32 pb-24 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="mb-20 text-center max-w-4xl mx-auto">
        <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-[0.3em] mb-3 block">
          Official Brand Story
        </span>
        <h1 className="font-black text-5xl sm:text-6xl md:text-7xl uppercase tracking-tighter text-[var(--fg)] mb-6 leading-tight">
          About playR
        </h1>
        <p className="text-[var(--muted)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          playR is built to equip the Player with high-performance tools, world-class athletic teamwear, and authentic sportswear engineered to excel on the field and rule the street.
        </p>
      </section>

      {/* Brand Proposition / Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-[var(--chip)] flex items-center justify-center mb-6 text-[var(--fg)] font-black text-lg">
            01
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight mb-2">Player First</h3>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Equip the Player with the right tools to excel in their field through advanced ergonomic engineering and zero-compromise materials.
          </p>
        </div>

        <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-[var(--chip)] flex items-center justify-center mb-6 text-[var(--fg)] font-black text-lg">
            02
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight mb-2">LET&apos;S PLAY</h3>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Encourage a healthier, more meaningful life through sports, inspiring a global community to embrace active movement.
          </p>
        </div>

        <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-[var(--chip)] flex items-center justify-center mb-6 text-[var(--fg)] font-black text-lg">
            03
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight mb-2">Omni-Channel</h3>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Value-driven offerings and effortless accessibility across 150+ offline stores, major marketplaces, quick-commerce, and global shipping.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        <div className="p-10 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2 block">Our Vision</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">Empower Every Player</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            To inspire and empower individuals to lead healthier, more meaningful lives through sports, providing apparel, equipment, and accessories that enrich and elevate everyday life.
          </p>
        </div>

        <div className="p-10 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-2 block">Our Mission</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">Authenticity &amp; Innovation</h2>
          <ul className="space-y-3 text-sm text-[var(--muted)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold">✓</span>
              <span>Foster a global community that embraces an active lifestyle while staying true to authenticity and innovation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold">✓</span>
              <span>Craft value- and performance-driven products that seamlessly integrate the comfort and style of the Player.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--accent)] font-bold">✓</span>
              <span>Promote emerging athletic talent and community service through continuous education across TEAM playR.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="mb-24">
        <div className="text-center mb-16">
          <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">
            Milestones &amp; Evolution
          </span>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Our Journey</h2>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {timelineData.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-6 bg-[var(--panel)] border border-[var(--border)] rounded-2xl hover:border-[var(--fg)] transition-all">
              <div className="sm:w-36 shrink-0">
                <span className="text-xs font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--chip)] px-3 py-1.5 rounded-full inline-block">
                  {item.year}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[var(--fg)] mb-1">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Team Partnerships */}
      <section className="mb-24 p-10 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-[0.3em] mb-2 block">
            Official Alliances
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-3">Partnering with Champions</h2>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            playR proudly partners with premier Indian and international cricket franchises, leagues, and tournaments.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
          {[
            { team: 'Chennai Super Kings (CSK)', role: 'Exclusive Merchandise Partner 2023–2027' },
            { team: 'Mumbai Indians (MI)', role: 'Exclusive Replica & Gear Partner 2022–2024' },
            { team: 'Sunrisers Hyderabad (SRH)', role: 'Global Fan Jersey Partner 2025–2026' },
            { team: 'Gujarat Titans (GT)', role: 'Global Player Wear Partner 2025' },
            { team: 'Lucknow Super Giants (LSG)', role: 'Official Merchandise Partner 2026' },
            { team: 'Kolkata Knight Riders (KKR)', role: 'Exclusive Player Wear Partner 2024' },
            { team: 'Punjab Kings (PBKS)', role: 'Exclusive Merchandise Partner 2023–2024' },
            { team: 'Rajasthan Royals (RR)', role: 'Exclusive Player Wear Partner 2023–2024' },
            { team: 'UP Yoddhas (Pro Kabaddi)', role: 'Kitting & Merchandise Partner 2025–2026' },
            { team: 'Dubai Capitals', role: 'Official Kitting Supplier 2025' },
            { team: 'Bengaluru Jawans & Chennai Super Champs', role: 'Pickleball League Partners 2025–2026' },
            { team: 'Seattle Orcas (MLC)', role: 'Exclusive Apparel Partner' },
          ].map((item, idx) => (
            <div key={idx} className="p-5 bg-[var(--chip)] rounded-2xl border border-[var(--border)] flex flex-col justify-center">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide mb-1 text-[var(--fg)]">{item.team}</h4>
              <p className="text-[11px] text-[var(--muted)] leading-tight">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Omni-Channel & Global Footprint */}
      <section className="mb-24 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
          <Globe className="w-8 h-8 text-[var(--accent)] mb-4" />
          <h3 className="text-xl font-black uppercase tracking-tight mb-3">Omni-Channel Distribution</h3>
          <div className="space-y-3 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            <p><strong>Offline Retail:</strong> 150+ partner retail stores across India, stadium concessionaires, and dedicated brand counters.</p>
            <p><strong>E-Commerce Marketplaces:</strong> Official brand stores on Amazon, Flipkart, Myntra, AJIO, and Nykaa.</p>
            <p><strong>Quick Commerce:</strong> Same-day athletic essentials delivered through Blinkit, Swiggy Instamart, BigBasket, and Zepto.</p>
          </div>
        </div>

        <div className="p-8 bg-[var(--panel)] border border-[var(--border)] rounded-3xl">
          <ShieldCheck className="w-8 h-8 text-[var(--accent)] mb-4" />
          <h3 className="text-xl font-black uppercase tracking-tight mb-3">Global Presence</h3>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed mb-4">
            Active distribution operations and international athlete shipments across:
          </p>
          <div className="flex flex-wrap gap-2">
            {['India', 'United States', 'Middle East', 'United Kingdom', 'South Africa', 'East Asia', 'Australia'].map((c, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-[var(--chip)] border border-[var(--border)] text-xs font-bold">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Registered Office & Trademark Notice */}
      <section className="p-8 bg-[var(--chip)] border border-[var(--border)] rounded-3xl text-center max-w-3xl mx-auto text-xs text-[var(--muted)] space-y-3">
        <p className="font-bold text-[var(--fg)]">
          playR is a registered trademark of iCOREts Private Limited
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <div>
            <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Operations Office</span>
            <p>HOUSE playR, #320, 100 Feet Road, Ghitorni, New Delhi – 110030, India</p>
            <p className="mt-1"><strong>GST:</strong> 07AAECI1569D1ZQ</p>
          </div>
          <div>
            <span className="font-bold uppercase tracking-widest text-[10px] block mb-1">Registered Office</span>
            <p>Studio 150, Satguru Nanak Industrial Estate, Jay Coach, Goregaon East, Mumbai – 400063, Maharashtra, India</p>
            <p className="mt-1"><strong>Inquiries:</strong> info@playr.in | support@playr.in</p>
          </div>
        </div>
      </section>
    </main>
  );
}
