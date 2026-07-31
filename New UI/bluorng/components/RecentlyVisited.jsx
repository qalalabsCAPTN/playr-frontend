'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getProduct } from '@/lib/data';

export function pushRecentlyVisited(handle) {
  try {
    const key = 'playr-recently-visited';
    const list = JSON.parse(localStorage.getItem(key) || '[]').filter((h) => h !== handle);
    list.unshift(handle);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 8)));
  } catch {}
}

export default function RecentlyVisited({ excludeHandle }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('playr-recently-visited') || '[]');
      setItems(
        list
          .filter((h) => h !== excludeHandle)
          .map(getProduct)
          .filter(Boolean)
          .slice(0, 4)
      );
    } catch {}
  }, [excludeHandle]);

  if (items.length === 0) return null;

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Recently visited</h2>
      </div>
      <div className="prow">
        {items.map((p) => (
          <ProductCard key={p.handle} product={p} gallery={true} />
        ))}
      </div>
    </section>
  );
}
