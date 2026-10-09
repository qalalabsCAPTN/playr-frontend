'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';

const PARTNERSHIPS = [
  {
    title: 'Chennai Super Kings',
    subtitle: 'Official Merchandise Partner',
    image: `${CDN}/moving_carousel_ad_csk__jpg.jpg`,
    href: '/collections/csk',
    tag: 'IPL 2026',
  },
  {
    title: 'Seattle Orcas',
    subtitle: 'Official Merchandise Partner',
    image: `${CDN}/moving_carousel_ad_seattle_jpg.jpg`,
    href: '/collections/seattle-orcas',
    tag: 'MLC Champions',
  },
  {
    title: 'Sunrisers Hyderabad',
    subtitle: 'Official Merchandise Partner',
    image: `${CDN}/moving_carousel_ad_srh_jpg.jpg`,
    href: '/collections/srh',
    tag: 'IPL 2026',
  },
];

export default function PartnershipBanners() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % PARTNERSHIPS.length);
    }, 4500);
    return () => clearInterval(t);
  }, [paused]);

  const step = useCallback((dir: number) => {
    setIdx((i) => (i + dir + PARTNERSHIPS.length) % PARTNERSHIPS.length);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      step(diff > 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  return (
    <section 
      className="my-3 px-4 md:px-5 max-w-[1440px] mx-auto select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--muted)]">
            Collaborations &amp; Alliances
          </span>
          <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-[var(--fg)] mt-0.5">
            Official Partnerships
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => step(-1)} 
            className="w-8 h-8 rounded-full border border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] hover:bg-[var(--chip)] flex items-center justify-center transition-colors text-xs font-bold"
            aria-label="Previous partner"
          >
            ←
          </button>
          <button 
            type="button"
            onClick={() => step(1)} 
            className="w-8 h-8 rounded-full border border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] hover:bg-[var(--chip)] flex items-center justify-center transition-colors text-xs font-bold"
            aria-label="Next partner"
          >
            →
          </button>
        </div>
      </div>

      {/* Featured Moving Sub Banner Showcase */}
      <div className="relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--panel)] border border-[var(--line)] aspect-[16/9] sm:aspect-[21/9] md:aspect-[3/1] min-h-[160px] md:min-h-[200px]">
        {PARTNERSHIPS.map((p, i) => (
          <Link
            key={p.title}
            href={p.href}
            className={`absolute inset-0 block transition-opacity duration-700 ${
              i === idx ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-label={`${p.title} - ${p.subtitle}`}
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          </Link>
        ))}

        {/* Carousel indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {PARTNERSHIPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === idx ? 'bg-white scale-125' : 'bg-white/50'
              }`}
              aria-label={`Partner slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Access Partner Tiles (Desktop, Tablet & Mobile) */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mt-2.5">
        {PARTNERSHIPS.map((p, i) => (
          <button
            key={p.title}
            type="button"
            onClick={() => setIdx(i)}
            className={`text-left p-2 sm:p-2.5 rounded-[var(--radius)] border transition-all ${
              i === idx 
                ? 'border-[var(--fg)] bg-[var(--chip)] shadow-sm' 
                : 'border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--chip)]'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-[var(--muted)] truncate">
                {p.tag}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === idx ? 'bg-emerald-500' : 'bg-transparent'}`} />
            </div>
            <div className="text-[10px] sm:text-xs md:text-sm font-extrabold uppercase text-[var(--fg)] truncate mt-0.5">
              {p.title}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
