'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface SportCollectionItem {
  id: string;
  name: string;
  tagline: string;
  count: string;
  image: string;
  href: string;
}

const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';

const SPORT_COLLECTIONS: SportCollectionItem[] = [
  {
    id: 'cricket',
    name: 'Cricket',
    tagline: 'Bats, Matchwear, Balls & Protective Gear',
    count: '60+ Products',
    image: `${CDN}/kikirt_banner.png`,
    href: '/collections/cricket',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    tagline: 'Anti-Fog Goggles, Swim Caps & Fins',
    count: '35+ Products',
    image: `${CDN}/amazon_5.jpg`,
    href: '/collections/swimming',
  },
  {
    id: 'pickleball',
    name: 'Pickleball',
    tagline: 'Carbon Fiber Paddles & Match Balls',
    count: '15+ Products',
    image: `${CDN}/amazon_3.jpg`,
    href: '/collections/pickleball',
  },
  {
    id: 'running-training',
    name: 'Running & Training',
    tagline: 'AERODRY Activewear, Shorts & Tees',
    count: '45+ Products',
    image: `${CDN}/amazon.jpg`,
    href: '/collections/running-training',
  },
  {
    id: 'kabaddi',
    name: 'Kabaddi',
    tagline: 'Official UP Yoddhas Pro Kabaddi Gear',
    count: '12+ Products',
    image: `${CDN}/Artboard_1.jpg_16.jpg?v=1782108677`,
    href: '/collections/kabaddi',
  },
  {
    id: 'football',
    name: 'Football',
    tagline: 'Performance Kits, Shin Guards & Matchwear',
    count: '20+ Products',
    image: `${CDN}/cxzxc.jpg?v=1773746369`,
    href: '/collections/football',
  },
];

export default function ShopBySportSection() {
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
      className="panel mx-3 md:mx-6 p-4 md:p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-sm my-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div>
          <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-[var(--muted)]">
            Disciplines &amp; Arenas
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-0.5">
            Shop by Sport
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
            aria-label="Previous sport"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
            aria-label="Next sport"
          >
            →
          </button>
        </div>
      </div>

      {/* 4:3 Collection Boxed Slider */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SPORT_COLLECTIONS.map((sport) => (
          <Link
            key={sport.id}
            href={sport.href}
            className="group flex-[0_0_calc(85%-8px)] sm:flex-[0_0_calc(48%-8px)] md:flex-[0_0_calc(32%-8px)] lg:flex-[0_0_calc(33.333%-14px)] min-w-[260px] snap-start block"
          >
            {/* Boxed 4:3 Collection Card */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--page-bg)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
              <img
                src={sport.image}
                alt={sport.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
              />

              {/* Gradient & Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 flex flex-col justify-between p-4 md:p-5 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                    {sport.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    {sport.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-1">
                    {sport.tagline}
                  </p>
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 group-hover:translate-x-1 transition-transform">
                      Explore {sport.name} →
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
