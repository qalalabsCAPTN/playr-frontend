'use client';

import { useCallback, useEffect, useState } from 'react';
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
  const [slides, setSlides] = useState(SLIDES);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const dropSlide = useCallback((src: string) => {
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

  const step = (dir: number) => setIdx((i) => (i + dir + slides.length) % slides.length);
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
