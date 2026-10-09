'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';
const SLIDES = [
  { src: `${CDN}/amazon_3.jpg`, alt: 'playR Pickleball — Precision & Power', href: '/collections/pickleball' },
  { src: `${CDN}/amazon_5.jpg`, alt: 'playR Swim Gear — Engineered for the Water', href: '/collections/swimming' },
  { src: `${CDN}/amazon.jpg`, alt: 'playR Gym & Training — High Performance Activewear', href: '/collections/gym' },
  { src: `${CDN}/csk_web_banner__jpg.jpg`, alt: 'Official Chennai Super Kings Fanwear & Kit', href: '/collections/csk' },
  { src: `${CDN}/srh_web_banner__jpg.jpg`, alt: 'Official Sunrisers Hyderabad Fanwear', href: '/collections/srh' },
  { src: `${CDN}/lsg_available_now_banner.jpg`, alt: 'Official Lucknow Super Giants Fanwear', href: '/collections/lsg' },
  { src: `${CDN}/kikirt_banner.png`, alt: 'playR Cricket Gear & Equipment', href: '/collections/cricket' },
  { src: `${CDN}/Artboard_1.jpg_16.jpg?v=1782108677`, alt: 'Official Seattle Orcas Collection', href: '/collections/seattle-orcas' },
];

export default function Hero() {
  const [slides] = useState(SLIDES);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const step = useCallback((dir: number) => {
    setIdx((i) => (i + dir + slides.length) % slides.length);
  }, [slides.length]);

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
      className="hero hero--banner relative overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((s, i) => (
        <Link
          key={s.src}
          href={s.href}
          className={`hslide block w-full h-full ${i === idx ? 'active' : ''}`}
          aria-label={s.alt}
        >
          <img
            className="w-full h-full object-cover"
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </Link>
      ))}

      {slides.length > 1 && (
        <>
          <button 
            type="button"
            className="hero__arrow hero__arrow--prev" 
            onClick={(e) => { e.preventDefault(); step(-1); }} 
            aria-label="Previous banner"
          >
            ←
          </button>
          <button 
            type="button"
            className="hero__arrow hero__arrow--next" 
            onClick={(e) => { e.preventDefault(); step(1); }} 
            aria-label="Next banner"
          >
            →
          </button>
          <div className="hero__dots">
            {slides.map((_, i) => (
              <button 
                key={i} 
                type="button"
                className={`hero__dot ${i === idx ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); setIdx(i); }} 
                aria-label={`Banner slide ${i + 1}`} 
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
