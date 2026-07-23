'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getProduct, BluorngProduct } from '@/lib/bluorng-data';

export function pushRecentlyVisited(handle: string) {
  try {
    const key = 'playr-recently-visited';
    const list: string[] = JSON.parse(localStorage.getItem(key) || '[]').filter((h: string) => h !== handle);
    list.unshift(handle);
    localStorage.setItem(key, JSON.stringify(list.slice(0, 8)));
  } catch (_e) {
    // ignore
  }
}

interface RecentlyVisitedProps {
  excludeHandle?: string;
}

export default function RecentlyVisited({ excludeHandle }: RecentlyVisitedProps) {
  const [items, setItems] = useState<BluorngProduct[]>([]);

  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem('playr-recently-visited') || '[]');
      const found = list
        .filter((h) => h !== excludeHandle)
        .map(getProduct)
        .filter((p): p is BluorngProduct => Boolean(p))
        .slice(0, 4);
      setItems(found);
    } catch (_e) {
    // ignore
  }
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
