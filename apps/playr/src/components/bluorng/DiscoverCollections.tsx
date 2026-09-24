'use client';

import Link from 'next/link';
import Reveal from './Reveal';
import { discoverCollections } from '@/lib/bluorng-data';

export default function DiscoverCollections() {
  if (!discoverCollections.length) return null;

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Discover Collections</h2>
      </div>
      <Reveal stagger className="discover" as="div">
        {discoverCollections.map((c) => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="discover__panel">
            <img src={c.image} alt={c.title} loading="lazy" />
            <div className="discover__overlay">
              <span className="discover__label">Shop the</span>
              <span className="discover__title">{c.title}</span>
            </div>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
