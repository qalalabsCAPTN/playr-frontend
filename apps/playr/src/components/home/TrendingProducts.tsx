import Link from 'next/link';

// Mocked data since we don't have the NECTAR SDK fully installed on disk
const MOCK_PRODUCTS = [
  { id: '1', slug: 'pro-training-tee', title: 'Pro Training Tee', price: 1299, category: 'Men' },
  { id: '2', slug: 'csk-match-jersey', title: 'CSK Match Jersey 2026', price: 1799, category: 'Club' },
  { id: '3', slug: 'performance-shorts', title: 'Aero Performance Shorts', price: 1499, category: 'Men' },
  { id: '4', slug: 'women-training-tight', title: 'Flex Training Tights', price: 1899, category: 'Women' },
];

export function TrendingProducts() {
  return (
    <section className="container max-w-7xl mx-auto px-4 py-24">
      <div className="flex justify-between items-end mb-10 border-b border-zinc-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight font-[var(--font-sora)]">Trending Now</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {MOCK_PRODUCTS.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} className="group flex flex-col">
            <div className="aspect-[4/5] bg-zinc-100 rounded-xl overflow-hidden mb-4 relative border border-zinc-200">
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 group-hover:scale-105 transition-transform duration-500 bg-zinc-50">
                {/* Second image on hover effect would be implemented here using Next/Image */}
                <span className="text-sm">Product Image</span>
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
