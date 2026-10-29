'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface BestSellerCollectionItem {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  image: string;
  href: string;
}

const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';

const BEST_SELLER_COLLECTIONS: BestSellerCollectionItem[] = [
  {
    id: 'csk-collection',
    title: 'CSK Match Edition Kit',
    tagline: 'Official 5X Champions Fanwear & Jerseys',
    badge: 'IPL 2026',
    image: `${CDN}/moving_carousel_ad_csk__jpg.jpg`,
    href: '/collections/csk',
  },
  {
    id: 'pickleball-pro',
    title: 'Carbon Pro Pickleball',
    tagline: 'T700 Carbon Fiber & Honeycomb Core',
    badge: 'Pro Tier',
    image: `${CDN}/amazon_3.jpg`,
    href: '/collections/pickleball',
  },
  {
    id: 'cricket-willow',
    title: 'Pro Willow Cricket Bats',
    tagline: 'Hand-crafted Grade 1 Kashmir & English Willow',
    badge: 'Tournament Ready',
    image: `${CDN}/Artboard1_bbb32292-afbc-41ee-b2f0-01fd96c5aabd.jpg?v=1787655480`,
    href: '/collections/cricket',
  },
  {
    id: 'hydro-swim',
    title: 'Hydro-Speed Swim Series',
    tagline: 'Anti-Fog Panoramic Lenses & Silicone Caps',
    badge: 'Aquatic Speed',
    image: `${CDN}/amazon_5.jpg`,
    href: '/collections/swimming',
  },
  {
    id: 'mesh-caps',
    title: 'Street Mesh Caps',
    tagline: 'Structured Crown & Airflow Ventilation',
    badge: 'Everyday Street',
    image: `${CDN}/Artboard6.png?v=1782909214`,
    href: '/collections/caps',
  },
  {
    id: 'gym-active',
    title: 'AERODRY Gym & Training',
    tagline: 'Anti-Odor & 4-Way Stretch Performance',
    badge: 'Active Tech',
    image: `${CDN}/amazon.jpg`,
    href: '/collections/gym',
  },
];

export default function BestSellerCollectionsSection() {
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
      : 300;
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
      className="my-6 mx-3 md:mx-6 px-1 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div>
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-[var(--muted)]">
            Curated Lines
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-0.5">
            1:1 Best Seller Collections
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByDirection('left')}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollLeft
                ? 'border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm'
                : 'border-[var(--line)] opacity-40 text-[var(--muted)] cursor-not-allowed'
            }`}
            aria-label="Previous collection"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-[var(--panel)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
            aria-label="Next collection"
          >
            →
          </button>
        </div>
      </div>

      {/* 1:1 Square Collection Cards Slider (No White Outer Box) */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {BEST_SELLER_COLLECTIONS.map((col) => (
          <Link
            key={col.id}
            href={col.href}
            className="group flex-[0_0_calc(85%-8px)] sm:flex-[0_0_calc(48%-8px)] md:flex-[0_0_calc(32%-8px)] lg:flex-[0_0_calc(25%-15px)] min-w-[240px] snap-start block"
          >
            {/* Strictly 1:1 Aspect Ratio Card */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--line)] bg-black shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <img
                src={col.image}
                alt={col.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />

              {/* Gradient & Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 flex flex-col justify-between p-4 md:p-5 text-white">
                <div className="flex justify-start">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {col.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-white/75 mt-0.5 line-clamp-1">
                    {col.tagline}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 group-hover:translate-x-1 transition-transform">
                      View Collection →
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
