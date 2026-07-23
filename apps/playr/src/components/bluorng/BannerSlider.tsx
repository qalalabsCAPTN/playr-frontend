'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { banners } from '@/lib/bluorng-data';

export default function BannerSlider() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, []);

  const step = (dir: number) => setIdx((i) => (i + dir + banners.length) % banners.length);

  return (
    <section className="bslider">
      {banners.map((b, i) => (
        <div key={b.title} className={`bslide ${i === idx ? 'active' : ''}`} style={{ background: b.bg }}>
          <img className="bslide__img" src={b.image} alt="" aria-hidden />
          <div className="bslide__content">
            <h2 className="bslide__title">{b.title}</h2>
            <Link href={b.href} className="bslide__cta">
              {b.cta}
            </Link>
          </div>
        </div>
      ))}

      <button className="bslider__arrow bslider__arrow--prev" onClick={() => step(-1)} aria-label="Previous banner">
        ←
      </button>
      <button className="bslider__arrow bslider__arrow--next" onClick={() => step(1)} aria-label="Next banner">
        →
      </button>

      <div className="bslider__dots">
        {banners.map((_, i) => (
          <button key={i} className={`bslider__dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} aria-label={`Banner ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
