'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  sport: string;
  rating: number;
  quote: string;
  productReviewed: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  videoSrc?: string;
}

const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Rohan Sharma',
    role: 'Division 1 Club Cricketer',
    sport: 'Cricket',
    rating: 5,
    quote:
      'The balance and ping on the Kashmir Willow bat is unmatched at this price point. Clean pickup, massive sweet spot, and took my tournament strike rate to a new level.',
    productReviewed: 'CSK Match Kashmir Willow Bat',
    mediaType: 'image',
    mediaSrc: `${CDN}/Artboard1_bbb32292-afbc-41ee-b2f0-01fd96c5aabd.jpg?v=1787655480`,
  },
  {
    id: 't2',
    name: 'Ananya Deshmukh',
    role: 'National Competitive Swimmer',
    sport: 'Swimming',
    rating: 5,
    quote:
      'I swim 5,000 meters daily. These playR professional goggles have zero leak, zero fog even after intense 2-hour morning sets. The silicone seal is buttery soft on the eye sockets.',
    productReviewed: 'Pro Mirror Aquatic Goggles',
    mediaType: 'video',
    mediaSrc: `${CDN}/amazon_5.jpg`,
    videoSrc: '/videos/playr-promo.mp4',
  },
  {
    id: 't3',
    name: 'Vikram Mehta',
    role: 'Pickleball Tour Player',
    sport: 'Pickleball',
    rating: 5,
    quote:
      'The grit and spin generation on the Carbon Fiber paddle is insane. Great reset control at the kitchen line and explosive pop on overhead smashes.',
    productReviewed: 'Pro Spike Carbon Paddle',
    mediaType: 'image',
    mediaSrc: `${CDN}/amazon_3.jpg`,
  },
  {
    id: 't4',
    name: 'Kavita Nair',
    role: 'Marathoner & Fitness Coach',
    sport: 'Running & Gym',
    rating: 5,
    quote:
      'The AERODRY shirts stay ultralight and cool under scorching Mumbai heat. No chafing, moisture disappears in seconds, and the fit is tailored without restricting shoulder mobility.',
    productReviewed: 'Aero Performance Training Tee',
    mediaType: 'video',
    mediaSrc: `${CDN}/amazon.jpg`,
    videoSrc: '/videos/jersey-custom.mp4',
  },
];

export default function TestimonialsSection() {
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
      ? (container.firstElementChild as HTMLElement).clientWidth + 20
      : 360;
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
    }, 5500);

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
      <div className="flex items-center justify-between mb-5 md:mb-6 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-amber-600 dark:text-amber-400">
              Verified Athlete Reviews
            </span>
            <span className="text-[11px] font-semibold text-[var(--muted)]">
              ★ 4.9/5 Average Rating
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--fg)] mt-0.5">
            What Athletes Say
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
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDirection('right')}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-[var(--page-bg)] text-[var(--fg)] hover:scale-105 active:scale-95 shadow-sm transition-all duration-200"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>

      {/* Testimonials Slider (Text + Image/Video) */}
      <div
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="flex-[0_0_calc(100%-8px)] sm:flex-[0_0_calc(85%-8px)] md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(50%-12px)] min-w-[320px] snap-start"
          >
            {/* Boxed Testimonial Card with 1x2 media + text layout */}
            <div className="grid grid-cols-1 sm:grid-cols-12 rounded-2xl overflow-hidden border border-[var(--line)] bg-[var(--page-bg)] shadow-sm h-full">
              {/* Media Container (Image or Video) */}
              <div className="sm:col-span-5 relative aspect-square sm:aspect-auto min-h-[200px] bg-black overflow-hidden">
                {t.mediaType === 'video' && t.videoSrc ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-90"
                    poster={t.mediaSrc}
                  >
                    <source src={t.videoSrc} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={t.mediaSrc}
                    alt={t.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {t.sport}
                  </span>
                </div>

                {t.mediaType === 'video' && (
                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/90 text-white flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Video Review
                    </span>
                  </div>
                )}
              </div>

              {/* Text Review Container */}
              <div className="sm:col-span-7 p-4 sm:p-5 flex flex-col justify-between">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                    <span className="text-[10px] font-bold text-[var(--muted)] ml-1">
                      Verified Purchase
                    </span>
                  </div>

                  {/* Review Quote */}
                  <p className="text-xs sm:text-sm text-[var(--fg)] leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--line)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-[var(--fg)] leading-tight">
                        {t.name}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-[var(--muted)]">
                        {t.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                    Reviewed: {t.productReviewed}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
