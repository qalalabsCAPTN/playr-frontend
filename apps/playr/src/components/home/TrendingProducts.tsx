import Link from 'next/link';
import Image from 'next/image';

import { DemoConfig } from '@playr/nectar-core/src/demo/config';

const DEMO_PRODUCTS = DemoConfig.isDemoMode ? DemoConfig.catalog.getTrendingProducts() : [];
export function TrendingProducts() {
  return (
    <section className="container max-w-7xl mx-auto px-4 py-24">
      <div className="flex justify-between items-end mb-10 border-b border-zinc-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight font-[var(--font-sora)]">Trending Now</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {DEMO_PRODUCTS.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col">
            <div className="aspect-[4/5] bg-zinc-100 rounded-xl overflow-hidden mb-4 relative border border-zinc-200">
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-500 bg-zinc-50">
                <Image src={product.image} alt={product.title} fill className="object-cover" />
              </div>
            </div>
            <span className="text-xs text-[#867b5d] font-bold uppercase tracking-wider mb-1">{product.category}</span>
            <h3 className="font-semibold text-lg leading-tight mb-1">{product.title}</h3>
            <p className="font-bold text-zinc-900">₹{product.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
