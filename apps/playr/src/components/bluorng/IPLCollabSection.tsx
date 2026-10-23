'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface IPLCollabItem {
  id: string;
  team: string;
  tagline: string;
  badge: string;
  image: string;
  href: string;
  accentColor: string;
}

const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';

const IPL_COLLABS: IPLCollabItem[] = [
  {
    id: 'csk',
    team: 'Chennai Super Kings',
    tagline: 'Official Merchandise & Kit Partner',
    badge: 'IPL 5X Champions',
    image: `${CDN}/moving_carousel_ad_csk__jpg.jpg`,
    href: '/collections/csk',
    accentColor: '#FDB913',
  },
  {
    id: 'srh',
    team: 'Sunrisers Hyderabad',
    tagline: 'Official Merchandise Partner',
    badge: 'Orange Army Official Gear',
    image: `${CDN}/moving_carousel_ad_srh_jpg.jpg`,
    href: '/collections/srh',
    accentColor: '#FF822A',
  },
  {
    id: 'lsg',
    team: 'Lucknow Super Giants',
    tagline: 'Official Team Merchandise',
    badge: 'Official Matchwear',
    image: `${CDN}/lsg_available_now_banner.jpg`,
    href: '/collections/lsg',
    accentColor: '#0057B8',
  },
  {
    id: 'seattle',
    team: 'Seattle Orcas',
    tagline: 'Official MLC Merchandise',
    badge: 'Major League Cricket',
    image: `${CDN}/moving_carousel_ad_seattle_jpg.jpg`,
    href: '/collections/seattle-orcas',
    accentColor: '#00A3E0',
  },
];

export default function IPLCollabSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  const scrollByDirection = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = container.firstElementChild
      ? (container.firstElementChild as HTMLElement).clientWidth + 16
      : 320;
    const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;

    if (direction === 'right' && container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === 'left' && container.scrollLeft <= 10) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      scrollByDirection('right');
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, scrollByDirection]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  return (
    <section
      className="panel mx-3 md:mx-6 p-4 md:p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-sm my-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div>
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-amber-600 dark:text-amber-400">
            Official Alliances
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-0.5">
            Official Collaborations: IPL &amp; Leagues
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByDirection('left')}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollLeft
                ? 'border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm'
                : 'border-[var(--line)] opacity-40 text-[var(--muted)] cursor-not-allowed'
            }`}
            aria-label="Previous partner"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
            aria-label="Next partner"
          >
            →
          </button>
        </div>
      </div>

      {/* 1:1 Banner Slider of IPL Collaboration */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {IPL_COLLABS.map((collab) => (
          <Link
            key={collab.id}
            href={collab.href}
            className="group flex-[0_0_calc(85%-8px)] sm:flex-[0_0_calc(48%-8px)] md:flex-[0_0_calc(32%-8px)] lg:flex-[0_0_calc(25%-15px)] min-w-[260px] snap-start block"
          >
            {/* Strictly 1:1 Aspect Ratio Banner */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--line)] bg-black shadow-md transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-xl">
              <img
                src={collab.image}
                alt={collab.team}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Overlay & Team Tag */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 flex flex-col justify-between p-4 md:p-5 text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {collab.badge}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: collab.accentColor }} />
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    {collab.team}
                  </h3>
                  <p className="text-xs text-white/75 mt-0.5 line-clamp-1">
                    {collab.tagline}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 group-hover:translate-x-1 transition-transform">
                      Shop Team Store →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
