import Link from 'next/link';

export function FeaturedCollections({ data }: { data: { heading: string, items: Array<{ id: string, title: string, img: string }> } }) {
  return (
    <section className="container max-w-7xl mx-auto px-4 py-24">
      <div className="flex justify-between items-end mb-10 border-b border-zinc-200 pb-4">
        <h2 className="text-3xl font-extrabold tracking-tight font-[var(--font-sora)]">{data.heading}</h2>
        <Link href="/collections" className="text-sm font-bold uppercase tracking-widest text-[#867b5d] hover:underline">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.items.map(col => (
          <Link href={`/collections/${col.id}`} key={col.id} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 block">
            <div className={`absolute inset-0 ${col.img} transition-transform duration-700 group-hover:scale-105`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-white text-2xl font-bold mb-2 font-playfair">{col.title}</h3>
              <span className="text-white/80 text-sm font-semibold uppercase tracking-wider group-hover:text-[#867b5d] transition-colors">Shop Now &rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
