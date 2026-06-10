import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CMSService, NectarCommerce, loyaltyAdapter } from '@playr/nectar-core';
import { ProductCard } from '@playr/ui';
import { HeroWrapper as Hero } from '../components/home/HeroWrapper';
import { AnimatedSection } from '../components/home/AnimatedSection';

export default async function HomePage() {
  const cmsData = await CMSService.getHomePageBlocks();
  const newArrivalsCollection = await NectarCommerce.getCollection('new-arrivals');
  const newArrivals = newArrivalsCollection.products.slice(0, 3);
  // Public challenge list — no userId → NECTAR returns program-level data only
  const publicChallenges = await loyaltyAdapter.getChallenges();

  return (
    <div className="bg-background selection:bg-primary-container selection:text-on-primary-container">

      {/* Hero */}
      <Hero />

      {/* New Arrivals */}
      <AnimatedSection className="max-w-[1400px] mx-auto py-section-gap-md px-4 md:px-container-margin-desktop relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="flex justify-between items-baseline mb-16">
          <h2 className="font-black text-4xl md:text-6xl uppercase tracking-tighter text-on-surface">
            New Arrivals
          </h2>
          <Link
            className="font-bold text-sm uppercase tracking-[0.2em] text-on-surface relative group overflow-hidden"
            href="/collections/new/"
          >
            <span className="relative z-10">Explore Collection</span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary transform origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-300" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              imageSrc={product.imageSrc}
              hoverImageSrc={product.hoverImageSrc}
              colors={product.colors}
              badge={product.badge}
            />
          ))}
        </div>
      </AnimatedSection>

      {/* Shop by Category */}
      <AnimatedSection className="bg-surface-container/40 py-section-gap-md relative">
        <div className="max-w-[1400px] mx-auto px-4 md:px-container-margin-desktop">
          <h2 className="font-black text-4xl md:text-6xl mb-16 uppercase text-center tracking-tighter text-on-surface">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Top Wear', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUUq8QdBqsUfy9D6XD9VxdMeZifNfq-hr2UkyJ38HKJF5Pb7Ktmjps4pH19OJyaWYnNBKrEc_SSdVrUk8wXRGvKnkuqsYZjMEDK1SXQoWAe6FW_EhBUM9aunVcHyt5gCgy9zw1pa-w69SchO40magSLrqUzIUcdrc5ww_WYmyr0Hb67raEgAR_xFkSRQ3XHsbMbP0zArBc9I-Ln1YkkTJZug0rcE77v_KnffLa8rYU69holkJUsuOcjQd6nQmXplF8ohDozuZyoLw', link: '/collections/top-wear' },
              { title: 'Accessories', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHnQtwR5L8FTSM8nZwnXrNkfFKKiHIQQEvWKMaSXEx2yp3s340yuJxw-nQHhIXUgm8mEgSGP_FhdoAgZsmVLv5mTaVp20sszZuAs6i70rclHJO8TWhQUokwfxWswqCkEIMo-j1C6b23j2FcsSBWUbSokWjV089O-4BcWpqaQVpy5VAgbiJiiKRmFquF-6ixcZAB5MkdX6d3IQJ3axJ6K5OVUI-5atLSvwOfx-o99FMJlXRdyPcRw7FojB5YgMAVzRCr1NtXbYf4HE', link: '/collections/accessories' },
              { title: 'Equipment', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBp5h7mciKzBYkNfCF45pAHMAD1pUrXVpdT44b6krLSugBt_zgmEyIDYmS_zw8W55jJXSttTmM68DFIs7JT0KEfasOFRXRNouqxBDs9XiqX6qcIEO6OtlsW9GgHwUb0Vd8MexYxHsx89E-8FzXtsI3-Iq5XVY-TdpV_iSj40G4CxpFqMs7cXd-aKUvCg1Noybt8Xtg-nzKLyqu8PZ3wIWRrUX41NQkqXhwC2NEg_Y-1XM95oo6RmKiX_1IWU734u6yH7YPDLeyUsw4', link: '/collections/equipment' },
              { title: 'Bottom Wear', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQxyA_RMDwvGiBydSpYoiVATs7nmSWigvDJ7WjlQiEs7FATHhwxkfhDZ4aLudWKngT0o_b015luLEzeuM-YYj2hVgvguHHKF6iLuOYmv_jkiO2Ims-Q6LeZ2bcia-SSZ4AJJsF5P706BGpWVRxvOcXQTMcyr6VWqXdgFKPhYxYL2yozSlggJHO-CfMn4Hy1_uQVo8BRSTatW-mqH5mLXIxQo3S1s-2yH3Qg42zgX6ID3QFmcqqidnJWYRSt8qrbVLBpeHZ_B9zYYI', link: '/collections/bottom-wear' }
            ].map((cat, i) => (
              <Link
                key={i}
                href={cat.link}
                className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-pointer group rounded-2xl shadow-lg ring-1 ring-on-surface/5"
              >
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  alt={cat.title}
                  src={cat.img}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-end justify-center pb-10">
                  <span className="text-background font-bold text-xl uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 opacity-80 group-hover:opacity-100 transition-all duration-500">
                    {cat.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CSK Banner */}
      <AnimatedSection className="w-full bg-gradient-to-r from-primary-container/25 to-primary-fixed/15 py-section-gap-md px-4 md:px-container-margin-desktop border-y border-primary-container/30 relative overflow-hidden">
        <div className="absolute -top-[50%] -right-[10%] w-[800px] h-[800px] bg-primary-container/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2 w-full">
            <div className="relative w-full h-[500px] shadow-2xl rounded-3xl overflow-hidden group">
              <Image
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                alt="CSK Jersey"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-background/20 rounded-3xl pointer-events-none" />
            </div>
          </div>
          <div className="md:w-1/2 space-y-8 text-center md:text-left">
            <h2 className="font-black text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter text-on-surface">
              OFFICIAL CSK <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-inverse-primary">
                IPL JERSEY
              </span>
            </h2>
            <p className="text-xl text-on-surface-variant max-w-md mx-auto md:mx-0 font-medium">
              Personalize your gear with your name and number. Experience the same quality as the pros on the field.
            </p>
            <button className="bg-on-surface text-background px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300 rounded-full shadow-2xl hover:shadow-primary-container/30 ring-1 ring-on-surface/80">
              CUSTOMIZE NOW
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Official Collaborations */}
      <AnimatedSection className="bg-inverse-surface py-section-gap-md border-b border-inverse-on-surface/10">
        <div className="max-w-[1400px] mx-auto px-4 md:px-container-margin-desktop">
          <h3 className="font-bold text-xs text-center text-inverse-on-surface/40 mb-16 uppercase tracking-[0.4em]">
            OFFICIAL COLLABORATIONS
          </h3>
          <div className="ticker-container py-8">
            <div className="ticker-wrapper gap-24 items-center">
              {[
                { src: '/images/csk.png', alt: 'Chennai Super Kings' },
                { src: '/images/lsg.png', alt: 'Lucknow Super Giants' },
                { src: '/images/sunriserss.png', alt: 'Sunrisers Hyderabad' },
                { src: '/images/UP_Yoddhas_logo.png', alt: 'UP Yoddhas' },
                { src: '/images/Seattle_Orcas_Logo.svg.png', alt: 'Seattle Orcas' }
              ].map((logo, i) => (
                <Image
                  key={i}
                  width={120}
                  height={80}
                  alt={logo.alt}
                  className="object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 scale-100 hover:scale-110 drop-shadow-xl"
                  src={logo.src}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {[
                { src: '/images/csk.png', alt: 'Chennai Super Kings' },
                { src: '/images/lsg.png', alt: 'Lucknow Super Giants' }
              ].map((logo, i) => (
                <Image
                  key={`dup-${i}`}
                  width={120}
                  height={80}
                  alt={logo.alt}
                  className="object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 scale-100 hover:scale-110 drop-shadow-xl"
                  src={logo.src}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ─── playR XP Program — data from NECTAR BFF ─── */}
      <AnimatedSection className="bg-inverse-surface py-section-gap-md relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 md:px-container-margin-desktop relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-inverse-primary font-bold text-xs uppercase tracking-[0.3em] mb-3 block">
                playR XP Program
              </span>
              <h2 className="font-black text-4xl md:text-6xl uppercase tracking-tighter text-inverse-on-surface leading-[0.9]">
                Play. Earn.<br />
                <span className="text-inverse-primary">Dominate.</span>
              </h2>
            </div>
            <Link
              href="/challenges"
              className="hidden md:flex items-center gap-2 text-inverse-on-surface/50 hover:text-inverse-on-surface font-bold text-sm uppercase tracking-widest group transition-colors"
            >
              All Challenges
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-lg">arrow_forward</span>
            </Link>
          </div>

          {/* Tier Overview — program-level, not user-specific */}
          <div className="bg-inverse-on-surface/5 border border-inverse-on-surface/10 rounded-2xl p-6 mb-8">
            <p className="text-inverse-on-surface/40 text-xs uppercase tracking-widest font-bold mb-5">Tier System</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'bronze', name: 'Bronze', icon: 'workspace_premium', range: '0 – 499 XP', color: 'text-[#cd7f32]', bg: 'bg-[#cd7f32]/10' },
                { id: 'silver', name: 'Silver', icon: 'military_tech', range: '500 – 1,999 XP', color: 'text-[#c0c0c0]', bg: 'bg-[#c0c0c0]/10' },
                { id: 'gold', name: 'Gold', icon: 'emoji_events', range: '2,000 – 4,999 XP', color: 'text-inverse-primary', bg: 'bg-primary-container/20' },
                { id: 'elite', name: 'Elite', icon: 'verified', range: '5,000+ XP', color: 'text-[#e5c07b]', bg: 'bg-[#e5c07b]/10' },
              ].map((tier) => (
                <div key={tier.id} className={`${tier.bg} rounded-xl p-4 flex flex-col gap-2`}>
                  <span className={`material-symbols-outlined ${tier.color} text-2xl`}>{tier.icon}</span>
                  <p className={`font-black text-base uppercase tracking-tight ${tier.color}`}>{tier.name}</p>
                  <p className="text-inverse-on-surface/40 text-xs">{tier.range}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link
                href="/account"
                className="inline-flex items-center gap-2 text-inverse-primary hover:text-inverse-on-surface font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <span className="material-symbols-outlined text-base">login</span>
                Sign in to see your XP progress
              </Link>
            </div>
          </div>

          {/* Challenge Cards — rendered from NECTAR public challenge list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicChallenges.slice(0, 3).map((challenge, i) => {
              const accentClasses = [
                { accent: 'bg-primary-container', accentText: 'text-on-primary-container' },
                { accent: 'bg-secondary-container', accentText: 'text-on-secondary-container' },
                { accent: 'bg-tertiary-container', accentText: 'text-on-tertiary-container' },
              ][i] ?? { accent: 'bg-surface-container', accentText: 'text-on-surface' };

              return (
                <Link
                  key={challenge.id}
                  href="/challenges"
                  className="border border-inverse-on-surface/10 hover:border-primary-container/50 rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-inverse-on-surface/[0.03] block"
                >
                  <div className={`${accentClasses.accent} w-12 h-12 rounded-xl flex items-center justify-center mb-5`}>
                    <span className={`material-symbols-outlined ${accentClasses.accentText} text-xl`}>{challenge.badgeIcon}</span>
                  </div>
                  <h4 className="text-inverse-on-surface font-bold text-lg mb-2">{challenge.title}</h4>
                  <p className="text-inverse-on-surface/50 text-sm mb-6 leading-relaxed">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-inverse-primary font-black text-xl">+{challenge.xpReward.toLocaleString()} XP</span>
                    <span className="bg-inverse-on-surface/10 text-inverse-on-surface/50 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="mt-8 md:hidden text-center">
            <Link
              href="/challenges"
              className="inline-flex items-center gap-2 text-inverse-on-surface/60 hover:text-inverse-on-surface font-bold text-sm uppercase tracking-widest group"
            >
              View All Challenges
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Visual Banner */}
      <AnimatedSection className="w-full h-[80vh] min-h-[600px] bg-on-surface relative group overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"
          alt="Action Shot"
          fill
          className="object-cover opacity-50 group-hover:scale-105 transition-transform duration-[3s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <h2 className="text-background font-black text-6xl md:text-8xl uppercase tracking-tighter drop-shadow-2xl mb-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
            Defy Limits
          </h2>
          <button className="glass-panel text-background px-8 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:bg-background hover:text-on-background transition-colors duration-300">
            Discover the Tech
          </button>
        </div>
      </AnimatedSection>

      {/* Brand Story */}
      <AnimatedSection className="max-w-[1400px] mx-auto py-section-gap-md px-4 md:px-container-margin-desktop">
        <div className="bg-inverse-surface text-inverse-on-surface p-10 md:p-20 flex flex-col md:flex-row items-center gap-16 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-inverse-on-surface/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-container/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="md:w-7/12 aspect-[16/9] bg-inverse-on-surface/5 relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl ring-1 ring-inverse-on-surface/10 z-10">
            <Image
              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop"
              alt="Brand Story"
              fill
              className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-on-surface/20 group-hover:bg-transparent transition-colors duration-500">
              <div className="w-24 h-24 rounded-full bg-inverse-on-surface/10 backdrop-blur-md flex items-center justify-center ring-1 ring-inverse-on-surface/30 group-hover:scale-110 group-hover:bg-inverse-on-surface transition-all duration-300">
                <span className="material-symbols-outlined text-inverse-on-surface group-hover:text-inverse-surface text-5xl ml-2">play_arrow</span>
              </div>
            </div>
          </div>

          <div className="md:w-5/12 space-y-8 z-10">
            <h2 className="font-black text-4xl md:text-5xl uppercase tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-br from-inverse-on-surface to-inverse-on-surface/50">
              {cmsData.brandStory.heading}
            </h2>
            <p className="text-inverse-on-surface/60 text-lg leading-relaxed font-light">
              {cmsData.brandStory.description1}
            </p>
            <Link href="/about" className="inline-block mt-4">
              <button className="bg-inverse-on-surface text-inverse-surface px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:bg-surface-container-high hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(245,240,230,0.2)]">
                Our Heritage
              </button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
