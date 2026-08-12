'use client';

import Link from 'next/link';

interface OfferCardProps {
  title: string;
  subtitle: string;
  tagline: string;
  ctaText?: string;
  href: string;
  bgGradient: string;
  accentColor?: string;
  badge?: string;
  image?: string;
  layout?: 'grid' | 'full';
}

const offers: OfferCardProps[] = [
  {
    title: '3 Training Tees at ₹749',
    tagline: 'ANY COLOR, ANY SIZE. GET 3 TRAINING TEES AT A SPECIAL PRICE.',
    subtitle: '3 TEES AT ₹749 FOR YOU',
    ctaText: 'Explore Now',
    href: '/collections/topwear',
    bgGradient: 'from-neutral-950 via-neutral-900 to-neutral-950',
    image: 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard6.png?v=1782909214',
  },
  {
    title: 'Pickleball Essential 20% OFF',
    tagline: 'SERVE IT RIGHT. SHOP THE BEST DISCOUNTED GEAR.',
    subtitle: 'SPECIAL 20% OFF JUST FOR YOU',
    ctaText: 'Explore Now',
    href: '/collections/paddle',
    bgGradient: 'from-slate-900 via-neutral-900 to-zinc-900',
    image: 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard33.png?v=1782909509',
  },
  {
    title: 'Buy any 3 Court Polo at ₹1,799',
    tagline: 'REFINED LOOKS THAT ALWAYS SHINE.',
    subtitle: '3 POLO FOR ₹1799',
    ctaText: 'Explore Now',
    href: '/collections/topwear',
    bgGradient: 'from-stone-900 via-neutral-900 to-amber-950/40',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Paris & Milan Jacket 30% OFF',
    tagline: 'OWN THE STREET.',
    subtitle: 'TAKE 30% OFF',
    ctaText: 'Explore Now',
    href: '/collections/topwear',
    bgGradient: 'from-zinc-950 via-neutral-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Run Shorts 38% OFF',
    tagline: 'LIGHTWEIGHT MATERIALS FOR SPEED, BREATHABILITY & CORE PERFORMANCE.',
    subtitle: 'FLAT 38% OFF YOUR OWN RUN SHORTS',
    ctaText: 'Explore Now',
    href: '/collections/bottomwear',
    bgGradient: 'from-neutral-900 via-zinc-900 to-stone-900',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Astor Tracksuit 40% OFF',
    tagline: "IT WASN'T DESIGNED AS A SUIT. IT BECAME ONE.",
    subtitle: 'SHINE LIKE STAR',
    ctaText: 'TAP TO SEE',
    href: '/collections/suit',
    bgGradient: 'from-slate-950 via-gray-900 to-neutral-950',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'CREW Tracksuit 42% OFF',
    tagline: 'WEAR YOUR NEW LOOK.',
    subtitle: 'FLAT 42% OFF',
    ctaText: 'Explore Now',
    href: '/collections/suit',
    bgGradient: 'from-emerald-950/60 via-neutral-900 to-neutral-950',
    image: 'https://images.unsplash.com/photo-1483721061986-fc1a69b04a95?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: "LET'S PLAY GAMES & EARN REWARDS",
    tagline: "LET'S PLAY",
    subtitle: 'GAMES & EARN REWARDS',
    ctaText: 'Play & Earn',
    href: '/earn-points',
    bgGradient: 'from-blue-950 via-black to-indigo-950',
    accentColor: 'text-cyan-400',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function ClubOffersPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f0] dark:bg-[#14120e] text-[#1c1a16] dark:text-[#f4f4f4] pt-24 pb-24 px-4 sm:px-6 lg:px-10 transition-colors duration-300">
      
      {/* Floating 0 Points Badge at Bottom Left */}
      <div className="fixed bottom-5 left-5 z-40">
        <div className="flex items-center gap-2 bg-[#1c1a16] text-white px-3.5 py-2 rounded-full shadow-2xl border border-white/20 text-xs font-bold tracking-wide">
          <div className="w-4 h-4 rounded-full bg-amber-400 text-[#1c1a16] flex items-center justify-center font-black text-[9px]">
            ⚡
          </div>
          <span>0 Points</span>
        </div>
      </div>

      {/* Floating WhatsApp Support Badge at Bottom Right */}
      <div className="fixed bottom-5 right-5 z-40">
        <a 
          href="https://wa.me/919999999999" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#00e676] hover:bg-[#00c853] text-[#1c1a16] font-bold px-4 py-2 rounded-full shadow-2xl text-xs transition-transform duration-200 hover:scale-105"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-.981z" />
          </svg>
          <span>playR Cares</span>
        </a>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-10">
        {/* Header */}
        <section className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight">Club Offers</h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Explore all current club offers below. Click the heading or banner to open the matching collection or product page.
          </p>
        </section>

        {/* 2-Column Banner Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offers.map((offer, idx) => (
            <div key={idx} className="space-y-3 group">
              <Link href={offer.href} className="block">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#1c1a16] dark:text-[#f4f4f4] group-hover:opacity-75 transition-opacity">
                  {offer.title}
                </h3>
              </Link>

              <Link href={offer.href} className="block">
                <div className={`relative overflow-hidden rounded-2xl aspect-[16/8] sm:aspect-[16/7] bg-gradient-to-r ${offer.bgGradient} p-6 sm:p-8 flex flex-col justify-between text-white shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.01]`}>
                  
                  {/* Background Image Layer with Dark Gradient Overlay */}
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={offer.image} 
                      alt={offer.title}
                      className="w-full h-full object-cover object-center opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </div>

                  {/* Top Badge / Brand Marker */}
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      playR Official
                    </span>
                  </div>

                  {/* Main Banner Text Overlay */}
                  <div className="relative z-10 space-y-2 max-w-lg">
                    <p className="text-xs sm:text-sm font-semibold tracking-wide text-neutral-300 uppercase">
                      {offer.tagline}
                    </p>
                    <h2 className={`text-2xl sm:text-3xl font-black tracking-tight uppercase leading-tight ${offer.accentColor || 'text-white'}`}>
                      {offer.subtitle}
                    </h2>

                    <div className="pt-2">
                      <span className="inline-block px-4 py-2 bg-white text-black font-bold text-xs rounded-full uppercase tracking-wider group-hover:bg-amber-400 transition-colors shadow-lg">
                        {offer.ctaText}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </section>

        {/* Full Width Bottom Banner: END OF SEASON SALE */}
        <section className="pt-6 space-y-3 group">
          <Link href="/collections/all-products" className="block">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1c1a16] dark:text-[#f4f4f4] group-hover:opacity-75 transition-opacity">
              END OF SEASON SALE
            </h3>
          </Link>

          <Link href="/collections/all-products" className="block">
            <div className="relative overflow-hidden rounded-2xl aspect-[21/7] sm:aspect-[21/6] bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-8 sm:p-12 flex items-center justify-between text-white shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-[1.005]">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard6.png?v=1782909214" 
                  alt="End of Season Sale"
                  className="w-full h-full object-cover opacity-25 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 via-transparent to-black/40" />
              </div>

              <div className="relative z-10 space-y-3 max-w-xl">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold uppercase tracking-widest border border-white/30">
                  Limited Time Only
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none text-white">
                  END OF SEASON SALE
                </h2>
                <p className="text-lg sm:text-2xl font-extrabold text-amber-300 tracking-tight">
                  UPTO 50% OFF
                </p>

                <div>
                  <span className="inline-block px-6 py-2.5 bg-white text-red-600 font-extrabold text-xs sm:text-sm rounded-full uppercase tracking-wider hover:bg-neutral-100 transition-colors shadow-lg">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
