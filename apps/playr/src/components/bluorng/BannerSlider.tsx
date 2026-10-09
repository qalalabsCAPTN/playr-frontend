'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { banners } from '@/lib/bluorng-data';

export default function BannerSlider() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || banners.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  const step = useCallback((dir: number) => {
    setIdx((i) => (i + dir + banners.length) % banners.length);
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
      className="bslider select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {banners.map((b, i) => (
        <Link 
          key={b.title} 
          href={b.href}
          className={`bslide ${i === idx ? 'active' : ''}`} 
          style={{ background: b.bg }}
          aria-label={b.title}
        >
          <img 
            className="bslide__img" 
            src={b.image} 
            alt={b.title} 
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </Link>
      ))}

      {banners.length > 1 && (
        <>
          <button 
            type="button"
            className="bslider__arrow bslider__arrow--prev" 
            onClick={(e) => { e.preventDefault(); step(-1); }} 
            aria-label="Previous banner"
          >
            ←
          </button>
          <button 
            type="button"
            className="bslider__arrow bslider__arrow--next" 
            onClick={(e) => { e.preventDefault(); step(1); }} 
            aria-label="Next banner"
          >
            →
          </button>

          <div className="bslider__dots">
            {banners.map((_, i) => (
              <button 
                key={i} 
                type="button"
                className={`bslider__dot ${i === idx ? 'active' : ''}`} 
                onClick={(e) => { e.preventDefault(); setIdx(i); }} 
                aria-label={`Banner ${i + 1}`} 
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
