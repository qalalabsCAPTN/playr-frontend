'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { collections, getCollectionProducts, filterChips, formatCollectionTitle } from '@/lib/bluorng-data';
import { useCart } from './CartContext';

interface CollectionViewProps {
  handle: string;
}

export default function CollectionView({ handle }: CollectionViewProps) {
  const collectionTitle = formatCollectionTitle(handle);
  const col = collections[handle] || { title: collectionTitle, description: `Explore playR ${collectionTitle} products` };
  const all = getCollectionProducts(handle);
  const [chip, setChip] = useState('View all');
  const [gridCols, setGridCols] = useState<2 | 4>(4);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const cart = useCart();

  let items = chip === 'View all' ? [...all] : all.filter((p) => p.type === chip);

  if (sortOrder === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'name') {
    items.sort((a, b) => a.title.localeCompare(b.title));
  }

  const coverImage = all[0]?.images[0];

  return (
    <div className="listing w-full max-w-[1720px] mx-auto px-6 sm:px-10 py-6 md:py-8">
      {/* Collection Header Banner (1920:400) */}
      <div className="cat-banner relative w-full aspect-[1920/400] min-h-[160px] md:min-h-[220px] rounded-[var(--radius-lg)] overflow-hidden mb-6 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
        {coverImage && (
          <img
            src={coverImage}
            alt={collectionTitle}
            className="absolute inset-0 w-full h-full object-cover -z-10 brightness-[0.55]"
          />
        )}
        <nav className="flex items-center gap-2 text-xs text-white/70 mb-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:underline">Collections</Link>
          <span>/</span>
          <span className="text-white font-medium">{collectionTitle}</span>
        </nav>
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">{collectionTitle}</h1>
        <p className="text-xs md:text-sm text-white/80 mt-1 max-w-xl">{col.description}</p>
      </div>

      <div className="listing__head flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">{items.length} Products Available</div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-1.5 bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-xs font-medium text-[var(--fg)] focus:outline-none cursor-pointer"
          >
            <option value="default">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Title: A - Z</option>
          </select>

          {/* Grid Layout Density Toggles */}
          <div className="hidden sm:flex items-center bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] p-1 gap-1">
            <button
              onClick={() => setGridCols(2)}
              className={`px-2 py-1 text-xs font-bold rounded ${gridCols === 2 ? 'bg-[var(--fg)] text-[var(--panel)]' : 'text-[var(--muted)]'}`}
              aria-label="2 Columns Grid"
            >
              2 Col
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`px-2 py-1 text-xs font-bold rounded ${gridCols === 4 ? 'bg-[var(--fg)] text-[var(--panel)]' : 'text-[var(--muted)]'}`}
              aria-label="4 Columns Grid"
            >
              4 Col
            </button>
          </div>

          <button className="listing__adv" onClick={() => cart.showToast('Filters menu active')}>
            Advance Filters
          </button>
        </div>
      </div>

      {/* Category Chips */}
      <div className="chips mb-6">
        {filterChips.map((c) => (
          <button key={c} className={`chip ${chip === c ? 'active' : ''}`} onClick={() => setChip(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <Reveal stagger className={`pgrid ${gridCols === 2 ? 'pgrid--2col' : 'pgrid--4col'}`} as="div">
        {items.map((p) => (
          <ProductCard key={p.handle} product={p} gallery={true} />
        ))}
      </Reveal>

      {items.length === 0 && (
        <p style={{ padding: '40px 4px', color: '#757575', fontSize: 13 }}>No products in this filter yet.</p>
      )}
    </div>
  );
}
