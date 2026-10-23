'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { BluorngProduct } from '@/lib/bluorng-data';

interface NewArrivalsSliderProps {
  products: BluorngProduct[];
  title?: string;
  moreHref?: string;
  boxed?: boolean;
}

export default function NewArrivalsSlider({
  products,
  title = 'New Arrivals',
  moreHref = '/collections/new-in',
  boxed = true,
}: NewArrivalsSliderProps) {
  // Ensure exactly 10 cards
  const displayProducts = products.slice(0, 10);
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

    // Check if at the end to loop around smoothly
    if (direction === 'right' && container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction === 'left' && container.scrollLeft <= 10) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || displayProducts.length <= 4) return;
    const timer = setInterval(() => {
      scrollByDirection('right');
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, displayProducts.length, scrollByDirection]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, [checkScroll]);

  return (
    <section
      className={`relative my-6 select-none ${
        boxed
          ? 'panel mx-3 md:mx-6 p-4 md:p-6 rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-sm'
          : 'mx-3 md:mx-6 p-2 md:p-4'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
              Fresh Drop
            </span>
            <span className="text-[11px] font-semibold text-[var(--muted)]">
              {displayProducts.length} items
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-1">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {moreHref && (
            <Link
              href={moreHref}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[var(--fg)] text-[var(--page-bg)] hover:opacity-90 transition-opacity"
            >
              View all
              <span>→</span>
            </Link>
          )}

          {/* Scrolling controls */}
          <button
            type="button"
            onClick={() => scrollByDirection('left')}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollLeft
                ? 'border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm'
                : 'border-[var(--line)] opacity-40 text-[var(--muted)] cursor-not-allowed'
            }`}
            aria-label="Previous products"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
            aria-label="Next products"
          >
            →
          </button>
        </div>
      </div>

      {/* 1x4 Slider View (1:1 Product Cards) */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayProducts.map((product) => (
          <div
            key={product.handle}
            className="flex-[0_0_calc(85%-8px)] sm:flex-[0_0_calc(48%-8px)] md:flex-[0_0_calc(32%-8px)] lg:flex-[0_0_calc(25%-15px)] min-w-[240px] snap-start"
          >
            <ProductCard product={product} gallery={true} />
          </div>
        ))}
      </div>

      {/* Mobile Discover Link */}
      {moreHref && (
        <div className="mt-4 text-center sm:hidden">
          <Link
            href={moreHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full bg-[var(--fg)] text-[var(--page-bg)]"
          >
            View all {title} →
          </Link>
        </div>
      )}
    </section>
  );
}
