'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export interface CategoryCardItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  tag?: string;
}

const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: 'jerseys',
    title: 'Match & Fan Jerseys',
    subtitle: 'IPL & National Kits',
    image: `${CDN}/1_a7d3a318-96f0-4525-a1b5-0d4974c9baa4.jpg?v=1756796308`,
    href: '/collections/jersey',
    tag: 'Customizable',
  },
  {
    id: 'cricket',
    title: 'Cricket Bats & Gear',
    subtitle: 'Grade 1 Willow & Protection',
    image: `${CDN}/Artboard1_bbb32292-afbc-41ee-b2f0-01fd96c5aabd.jpg?v=1787655480`,
    href: '/collections/cricket',
    tag: 'Pro Series',
  },
  {
    id: 'pickleball',
    title: 'Pickleball Paddles',
    subtitle: 'Carbon Fiber & Honeycomb',
    image: `${CDN}/amazon_3.jpg`,
    href: '/collections/pickleball',
    tag: 'Trending',
  },
  {
    id: 'caps',
    title: 'Caps & Headwear',
    subtitle: 'Breathable Mesh & Street',
    image: `${CDN}/Artboard6.png?v=1782909214`,
    href: '/collections/caps',
    tag: 'Bestseller',
  },
  {
    id: 'swimming',
    title: 'Swim Gear & Goggles',
    subtitle: 'Anti-fog & Chlorine Proof',
    image: `${CDN}/amazon_5.jpg`,
    href: '/collections/swimming',
    tag: 'Aquatics',
  },
  {
    id: 'gym',
    title: 'Gym & Activewear',
    subtitle: 'AERODRY Performance',
    image: `${CDN}/amazon.jpg`,
    href: '/collections/gym',
    tag: 'Core Athletic',
  },
  {
    id: 'tracksuits',
    title: 'Tracksuits & Hoodies',
    subtitle: 'Warmups & Streetwear',
    image: `${CDN}/cxzxc.jpg?v=1773746369`,
    href: '/collections/suit',
    tag: 'Lifestyle',
  },
  {
    id: 'shorts',
    title: 'Performance Shorts',
    subtitle: 'Four-way Stretch Comfort',
    image: `${CDN}/Artboard18.png?v=1782909337`,
    href: '/collections/shorts',
    tag: 'Daily Sport',
  },
  {
    id: 'bags',
    title: 'Kitbags & Duffels',
    subtitle: 'Heavy-Duty Storage',
    image: `${CDN}/kikirt_banner.png`,
    href: '/collections/bag',
    tag: 'Travel Gear',
  },
  {
    id: 'accessories',
    title: 'Bottles & Accessories',
    subtitle: 'Hydration & Essentials',
    image: `${CDN}/Artboard_1.jpg_16.jpg?v=1782108677`,
    href: '/collections/accessories',
    tag: 'Gear Essentials',
  },
];

export default function CategorySlider() {
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
            Explore The Range
          </span>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-0.5">
            Shop by Category
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/collections"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[var(--fg)] text-[var(--page-bg)] hover:opacity-90 transition-opacity"
          >
            All Categories →
          </Link>

          <button
            type="button"
            onClick={() => scrollByDirection('left')}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollLeft
                ? 'border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm'
                : 'border-[var(--line)] opacity-40 text-[var(--muted)] cursor-not-allowed'
            }`}
            aria-label="Previous category"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
            aria-label="Next category"
          >
            →
          </button>
        </div>
      </div>

      {/* 1x4 4:3 Boxed Category Cards Slider (10 cards) */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORY_CARDS.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group flex-[0_0_calc(85%-8px)] sm:flex-[0_0_calc(48%-8px)] md:flex-[0_0_calc(32%-8px)] lg:flex-[0_0_calc(25%-15px)] min-w-[240px] snap-start block"
          >
            {/* Boxed card with 4:3 aspect ratio */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--page-bg)] shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md">
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-3.5 md:p-4 text-white">
                <div className="flex justify-end">
                  {cat.tag && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {cat.tag}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">
                    {cat.subtitle}
                  </span>
                  <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white mt-0.5 group-hover:text-amber-300 transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
