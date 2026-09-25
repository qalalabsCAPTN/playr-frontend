'use client';

import Link from 'next/link';
import Reveal from './Reveal';
import { categoryTiles } from '@/lib/bluorng-data';

export default function CategoryTiles() {
  if (!categoryTiles.length) return null;

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Shop by Category</h2>
      </div>
      <Reveal stagger className="cattiles" as="div">
        {categoryTiles.map((c) => (
          <Link key={c.handle} href={`/collections/${c.handle}`} className="cattile">
            <img src={c.image} alt={c.title} loading="lazy" />
            <span className="cattile__title">{c.title}</span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
