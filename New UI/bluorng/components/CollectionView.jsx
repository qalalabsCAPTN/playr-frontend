'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { collections, getCollectionProducts, filterChips } from '@/lib/data';
import { useCart } from './CartContext';

export default function CollectionView({ handle }) {
  const col = collections[handle];
  const all = getCollectionProducts(handle);
  const [chip, setChip] = useState('View all');
  const cart = useCart();

  const items = chip === 'View all' ? all : all.filter((p) => p.type === chip);

  return (
    <div className="listing">
      <div className="listing__head">
        <h1 className="listing__title">{col.title}</h1>
        <button className="listing__adv" onClick={() => cart.showToast('Advance filters are a demo in this replica')}>
          Advance Filters
        </button>
      </div>

      <div className="chips">
        {filterChips.map((c) => (
          <button key={c} className={`chip ${chip === c ? 'active' : ''}`} onClick={() => setChip(c)}>
            {c}
          </button>
        ))}
      </div>

      <Reveal stagger className="pgrid" as="div">
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
