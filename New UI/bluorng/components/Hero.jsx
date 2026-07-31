'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

// Homepage hero banner slider — the same slideshow banners as the live
// playr.in homepage, served from the playR Shopify CDN (plus the sub banner).
// Any slide whose image fails to load is skipped automatically.
const CDN = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files';
const SLIDES = [
  { src: `${CDN}/playR_sub_banner_jpg.jpg?v=1783589812`, alt: 'playR — Perform. Play. Repeat.', href: '/collections/all-products' },
  { src: `${CDN}/Artboard_8.jpg_2.jpg`, alt: 'Unmatched style. Unstoppable performance.', href: '/collections/all-products' },
  { src: `${CDN}/Artboard_1.jpg_16.jpg?v=1782108677`, alt: 'playR training range', href: '/collections/new-in' },
  { src: `${CDN}/Artboard_4.jpg_8.jpg?v=1779694962`, alt: 'Wear your new look — up to 50% off', href: '/collections/all-products' },
  { src: `${CDN}/Artboard_2.jpg_10.jpg?v=1779694962`, alt: 'Refined looks that always shine', href: '/collections/all-products' },
];

export default function Hero() {
  const [slides, setSlides] = useState(SLIDES);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const dropSlide = useCallback((src) => {
    setSlides((prev) => {
      const next = prev.filter((s) => s.src !== src);
      return next.length ? next : prev.slice(0, 1);
    });
    setIdx(0);
  }, []);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const step = (dir) => setIdx((i) => (i + dir + slides.length) % slides.length);
  const current = slides[Math.min(idx, slides.length - 1)];

  return (
    <section
      className="hero hero--banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          className={`hslide ${i === idx ? 'active' : ''}`}
          src={s.src}
          alt={s.alt}
          onError={() => dropSlide(s.src)}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button className="hero__arrow hero__arrow--prev" onClick={() => step(-1)} aria-label="Previous banner">
            ←
          </button>
          <button className="hero__arrow hero__arrow--next" onClick={() => step(1)} aria-label="Next banner">
            →
          </button>
          <div className="hero__dots">
            {slides.map((_, i) => (
              <button key={i} className={`hero__dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} aria-label={`Banner ${i + 1}`} />
            ))}
          </div>
        </>
      )}

      <Link href={current?.href || '/collections/all-products'} className="hero__shop hero__shop--dark">
        Shop now
      </Link>
    </section>
  );
}
