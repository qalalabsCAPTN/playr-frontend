import Link from 'next/link';
import { Button } from '@playr/ui';
import { CMSHeroModule } from '@playr/nectar-core';

export function Hero({ data }: { data: CMSHeroModule }) {
  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-zinc-950 flex items-center justify-center text-white overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl px-4 mt-20">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter font-playfair leading-[1.1]">
          {data.heading1} <br/><span className="text-[#867b5d] italic">{data.heading2}</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 font-[var(--font-sora)] max-w-2xl mt-4">
          {data.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
          <Link href={data.primaryCta.href} className="w-full sm:w-auto">
            <Button size="lg" className="w-full bg-[#867b5d] hover:bg-[#867b5d]/90 text-white rounded-full font-bold">
              {data.primaryCta.label}
            </Button>
          </Link>
          {data.secondaryCta && (
            <Link href={data.secondaryCta.href} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white hover:text-black rounded-full font-bold">
                {data.secondaryCta.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
