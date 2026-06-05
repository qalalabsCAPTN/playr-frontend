import Link from 'next/link';

const BUDGET_TIERS = [
  { id: '1399', label: '₹1399', desc: 'Everyday Basics', bg: 'bg-zinc-100', color: 'text-zinc-900' },
  { id: '1599', label: '₹1599', desc: 'Training Essentials', bg: 'bg-zinc-200', color: 'text-zinc-900' },
  { id: '1799', label: '₹1799', desc: 'Official Fan Gear', bg: 'bg-zinc-900', color: 'text-white' },
  { id: '11199', label: '₹11199', desc: 'Elite Kits', bg: 'bg-[#867b5d]', color: 'text-white' },
];

export function BudgetDiscovery() {
  return (
    <section className="bg-white py-24">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-[var(--font-sora)] mb-4">Shop the Best Deals</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">Find premium performance gear that fits your budget without compromising on quality.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {BUDGET_TIERS.map((tier) => (
            <Link 
              key={tier.id} 
              href={`/collections/deals?priceMax=${tier.id}`}
              className={`${tier.bg} ${tier.color} rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-black/5`}
            >
              <span className="text-xs font-bold tracking-widest uppercase opacity-70 mb-3">{tier.desc}</span>
              <span className="text-2xl md:text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform duration-300">
                Under {tier.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
