'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import Reveal from './Reveal';
import { BluorngProduct } from '@/lib/bluorng-data';

interface ProductSectionProps {
  title: string;
  products: BluorngProduct[];
  moreHref?: string;
  gallery?: boolean;
  grid?: boolean;
  flat?: boolean;
}

export default function ProductSection({ title, products, moreHref, gallery = true, grid = false, flat = false }: ProductSectionProps) {
  return (
    <section className={`panel ${flat ? 'panel--flat' : ''}`}>
      <div className="panel__head">
        <h2 className="panel__title">{title}</h2>
        {moreHref && (
          <Link href={moreHref} className={`pill ${flat ? 'pill--ghost' : ''}`}>
            Discover more
          </Link>
        )}
      </div>
      <Reveal stagger className={grid ? 'pgrid' : 'prow'} as="div">
        {products.map((p) => (
          <ProductCard key={p.handle} product={p} gallery={gallery} />
        ))}
      </Reveal>
    </section>
  );
}
