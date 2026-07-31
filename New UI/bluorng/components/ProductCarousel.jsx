'use client';

import { useRef } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import Reveal from './Reveal';

export default function ProductCarousel({ title, products, moreHref }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="section">
      <Reveal className="section__head" as="div">
        <h2 className="section__title">{title}</h2>
        {moreHref && (
          <Link href={moreHref} className="section__more">
            Discover more
          </Link>
        )}
      </Reveal>
      <div className="carousel">
        <button className="carousel__btn carousel__btn--prev" onClick={() => scrollBy(-1)} aria-label="Previous">
          ←
        </button>
        <button className="carousel__btn carousel__btn--next" onClick={() => scrollBy(1)} aria-label="Next">
          →
        </button>
        <Reveal stagger className="carousel__track" as="div">
          {products.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </Reveal>
      </div>
      {moreHref && (
        <div style={{ textAlign: 'center', paddingTop: 28 }}>
          <Link href={moreHref} className="btn btn--dark">
            View all
          </Link>
        </div>
      )}
    </section>
  );
}
