import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/bluorng/Reveal';
import { collections, getCollectionProducts } from '@/lib/bluorng-data';

export const metadata: Metadata = {
  title: 'Collections — playR',
  description: 'Explore the full spectrum of playR performance athletic gear, official IPL & MLC merchandise, and sport essentials.',
  alternates: {
    canonical: '/collections',
  },
};

export default function CollectionsIndex() {
  const entries = Object.entries(collections);

  return (
    <div className="listing w-full max-w-[1720px] mx-auto px-6 sm:px-10 py-8 md:py-10">
      <nav className="flex items-center gap-2 text-xs text-[var(--muted)] mb-4">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="text-[var(--fg)] font-medium">Collections</span>
      </nav>

      <div className="listing__head mb-8">
        <h1 className="listing__title text-3xl md:text-4xl font-extrabold tracking-tight">Collections</h1>
        <p className="text-xs text-[var(--muted)] mt-1.5 max-w-xl">
          Discover all official sports categories, IPL and MLC team collections, high-performance headwear, and swim gear.
        </p>
      </div>

      <Reveal stagger className="pgrid pgrid--4col" as="div">
        {entries.map(([handle, col]) => {
          const items = getCollectionProducts(handle);
          if (items.length === 0) return null;
          const coverImage = items[0].images[0];

          return (
            <Link key={handle} href={`/collections/${handle}`} className="card group">
              <div className="card__media overflow-hidden rounded-[var(--radius)]">
                <img
                  src={coverImage}
                  alt={col.title}
                  loading="lazy"
                  className="active transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="card__info mt-3 flex items-start justify-between">
                <div>
                  <h3 className="card__title text-sm font-bold tracking-tight text-[var(--fg)]">{col.title}</h3>
                  <div className="card__price text-xs text-[var(--muted)] mt-0.5">{items.length} products</div>
                </div>
              </div>
            </Link>
          );
        })}
      </Reveal>
    </div>
  );
}
