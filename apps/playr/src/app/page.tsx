import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CMSService } from '@playr/nectar-core';
import { Hero } from '../components/home/Hero';

export default async function HomePage() {
  const cmsData = await CMSService.getHomePageBlocks();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } 
        .ticker-container { display: flex; overflow: hidden; white-space: nowrap; mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); } 
        .ticker-wrapper { display: flex; animation: ticker-scroll 30s linear infinite; flex-shrink: 0; }
      `}} />

      {/* 2. Hero Banner */}
      <Hero />

      {/* 3. New Arrivals */}
      <section className="max-w-[1200px] mx-auto py-24 px-4 md:px-gutter">
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tight">New Arrivals</h2>
          <Link className="font-bold text-sm uppercase tracking-[0.2em] text-zinc-900 border-b-2 border-zinc-900 w-max hover:opacity-70 transition-opacity" href="/collections/new/">
            Explore Collection
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="group relative bg-white transition-all duration-500 hover:shadow-2xl overflow-hidden cursor-pointer">
            <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
              <Image alt="Pro-Series Gen II Bat" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSLCRbv4GTgLsrfuKRZjyPoO3OhkwnaIQ-d4k5MbUk6xzjxhqGyuC0NLtlos6olvM5pOLL8dTwcGXvLxzwfK9eUh_QOHnth2LX0-cYK68KYY3WZcJVV_1bJe-X5H_bbmn360RVToqNVGq86r6T4rx7wZ9tNabTeR_hmD1d_o34Z2KpsXG5EAMJSb3m93ol6NEV5nZNUt0r3zNsheVDz5JxtWH6E13iaSXP3lGgO3XnnLXELeCIfF2WbqUtMyymI2nf7bhYO0I32to" />
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-black text-white font-bold text-[10px] tracking-widest px-3 py-1.5 uppercase">Elite</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button className="w-full bg-black text-white py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">Quick Add</button>
              </div>
            </div>
            <div className="p-6 text-center">
              <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Cricket</span>
              <h3 className="font-bold text-base uppercase mt-2 mb-1">Pro-Series Gen II Bat</h3>
              <div className="text-zinc-900 font-medium">$499.00</div>
            </div>
          </div>
          {/* Product 2 */}
          <div className="group relative bg-white transition-all duration-500 hover:shadow-2xl overflow-hidden cursor-pointer">
            <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
              <Image alt="Stealth Trainers" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-8 transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGv-R2pfkn9zKJ91kjt-kDuTOhe_BHcH-vyzsldoCeResmJE2CSXRfZFMc6f-deXcQJBtAE8n4F5XFaedVqBBr56Dt77eDFA3YZC9TIBoN6J3XexRXKAGLkGTKBBpiPCzikNYbsSSEmPX2kR388yZjyOYGooSLKBvkbvbBJstijME95OUBatdgHc1K8ClF09OwZe6woYeZ13TGNIo1ROeGlNs6n7w6qMKJlijTcXEPgbGr_XJjhutk_vYUGZf9v7Pkjx4VOQSea1s" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button className="w-full bg-black text-white py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">Quick Add</button>
              </div>
            </div>
            <div className="p-6 text-center">
              <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Performance</span>
              <h3 className="font-bold text-base uppercase mt-2 mb-1">Stealth Trainers</h3>
              <div className="text-zinc-900 font-medium">$185.00</div>
            </div>
          </div>
          {/* Product 3 */}
          <div className="group relative bg-white transition-all duration-500 hover:shadow-2xl overflow-hidden cursor-pointer">
            <div className="aspect-[4/5] relative overflow-hidden bg-zinc-100">
              <Image alt="Match Ball" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDalDIr3_fcbPHcAFzArlZ1A4a8MqbUnL37eQpSidMg-T2Kb3WncT9txV4DloaywhkKW3_FJnhb2hzfw1WcTd1tPnd9SY_qRl6BrpILugHFOGtw3loEFSJ0JUktbWlLI3pGr4eBhfaJPUiB74NF-BSM60RTlhtLrPHUaOeGHFYqNiXjZyVUritKSfk5XnvgpN1QOFVu41y0_6BQLtYQMG5DBWSh-bYhDOXEPsqg3xJI1i1yUyZa91WZ2Px1bl3KsTjCG5fL0pRnQjE" />
              <div className="absolute top-4 right-4 z-10">
                <span className="material-symbols-outlined text-zinc-900 cursor-pointer hover:text-red-500 transition-colors bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">favorite</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button className="w-full bg-black text-white py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors">Quick Add</button>
              </div>
            </div>
            <div className="p-6 text-center">
              <span className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Equipment</span>
              <h3 className="font-bold text-base uppercase mt-2 mb-1">Pro Match Ball</h3>
              <div className="text-zinc-900 font-medium">$45.00</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shop by Categories */}
      <section className="bg-zinc-50 py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-gutter">
          <h2 className="font-black text-3xl md:text-5xl mb-12 uppercase text-center tracking-tight">Shop by Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/collections/top-wear" className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-pointer group rounded-sm shadow-sm">
              <Image fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" alt="Top wear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUUq8QdBqsUfy9D6XD9VxdMeZifNfq-hr2UkyJ38HKJF5Pb7Ktmjps4pH19OJyaWYnNBKrEc_SSdVrUk8wXRGvKnkuqsYZjMEDK1SXQoWAe6FW_EhBUM9aunVcHyt5gCgy9zw1pa-w69SchO40magSLrqUzIUcdrc5ww_WYmyr0Hb67raEgAR_xFkSRQ3XHsbMbP0zArBc9I-Ln1YkkTJZug0rcE77v_KnffLa8rYU69holkJUsuOcjQd6nQmXplF8ohDozuZyoLw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-white font-bold text-lg uppercase tracking-[0.2em] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Top Wear</span>
              </div>
            </Link>
            <Link href="/collections/accessories" className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-pointer group rounded-sm shadow-sm">
              <Image fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" alt="Accessories" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHnQtwR5L8FTSM8nZwnXrNkfFKKiHIQQEvWKMaSXEx2yp3s340yuJxw-nQHhIXUgm8mEgSGP_FhdoAgZsmVLv5mTaVp20sszZuAs6i70rclHJO8TWhQUokwfxWswqCkEIMo-j1C6b23j2FcsSBWUbSokWjV089O-4BcWpqaQVpy5VAgbiJiiKRmFquF-6ixcZAB5MkdX6d3IQJ3axJ6K5OVUI-5atLSvwOfx-o99FMJlXRdyPcRw7FojB5YgMAVzRCr1NtXbYf4HE" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-white font-bold text-lg uppercase tracking-[0.2em] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Accessories</span>
              </div>
            </Link>
            <Link href="/collections/equipment" className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-pointer group rounded-sm shadow-sm">
              <Image fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" alt="Equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp5h7mciKzBYkNfCF45pAHMAD1pUrXVpdT44b6krLSugBt_zgmEyIDYmS_zw8W55jJXSttTmM68DFIs7JT0KEfasOFRXRNouqxBDs9XiqX6qcIEO6OtlsW9GgHwUb0Vd8MexYxHsx89E-8FzXtsI3-Iq5XVY-TdpV_iSj40G4CxpFqMs7cXd-aKUvCg1Noybt8Xtg-nzKLyqu8PZ3wIWRrUX41NQkqXhwC2NEg_Y-1XM95oo6RmKiX_1IWU734u6yH7YPDLeyUsw4" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-white font-bold text-lg uppercase tracking-[0.2em] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Equipment</span>
              </div>
            </Link>
            <Link href="/collections/bottom-wear" className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden cursor-pointer group rounded-sm shadow-sm">
              <Image fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" alt="Bottom wear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQxyA_RMDwvGiBydSpYoiVATs7nmSWigvDJ7WjlQiEs7FATHhwxkfhDZ4aLudWKngT0o_b015luLEzeuM-YYj2hVgvguHHKF6iLuOYmv_jkiO2Ims-Q6LeZ2bcia-SSZ4AJJsF5P706BGpWVRxvOcXQTMcyr6VWqXdgFKPhYxYL2yozSlggJHO-CfMn4Hy1_uQVo8BRSTatW-mqH5mLXIxQo3S1s-2yH3Qg42zgX6ID3QFmcqqidnJWYRSt8qrbVLBpeHZ_B9zYYI" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-white font-bold text-lg uppercase tracking-[0.2em] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">Bottom Wear</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CSK Banner */}
      <section className="w-full bg-yellow-400/10 py-24 px-4 md:px-gutter border-y border-yellow-400/20">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 w-full">
            <div className="relative w-full h-[400px] shadow-2xl rounded-sm overflow-hidden">
              <Image fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt="CSK Jersey" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA" />
            </div>
          </div>
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h2 className="font-black text-4xl md:text-5xl uppercase leading-tight tracking-tight text-zinc-900">OFFICIAL CSK IPL JERSEY<br/>BEYOND THE BOUNDARY</h2>
            <p className="text-lg text-zinc-600 max-w-md mx-auto md:mx-0">Personalize your gear with your name and number. Experience the same quality as the pros on the field.</p>
            <button className="bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:bg-yellow-400 hover:text-black">CUSTOMIZE NOW</button>
          </div>
        </div>
      </section>

      {/* 7. Official Collabs */}
      <section className="bg-zinc-950 py-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-gutter">
          <h3 className="font-bold text-sm text-center text-zinc-500 mb-12 uppercase tracking-[0.3em]">OFFICIAL COLLABS</h3>
          <div className="ticker-container py-4">
            <div className="ticker-wrapper gap-20">
              <Image width={120} height={80} alt="Chennai Super Kings" className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="/images/csk.png" />
              <Image width={120} height={80} alt="Lucknow Super Giants" className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="/images/lsg.png" />
              <Image width={120} height={80} alt="Sunrisers Hyderabad" className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="/images/sunriserss.png" />
              <Image width={120} height={80} alt="UP Yoddhas" className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="/images/UP_Yoddhas_logo.png" />
              <Image width={120} height={80} alt="Seattle Orcas" className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="/images/Seattle_Orcas_Logo.svg.png" />
              <Image width={120} height={80} alt="Chennai Super Kings" className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="/images/csk.png" />
              <Image width={120} height={80} alt="Lucknow Super Giants" className="object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" src="/images/lsg.png" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Visual Banner */}
      <section className="w-full h-[60vh] min-h-[400px] bg-black relative">
        <Image 
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" 
          alt="Action Shot" 
          fill 
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-white font-black text-4xl md:text-6xl uppercase tracking-tighter drop-shadow-xl">Defy Limits</h2>
        </div>
      </section>

      {/* 13. Brand Story Section */}
      <section className="max-w-[1200px] mx-auto py-24 px-4 md:px-gutter">
        <div className="bg-zinc-950 text-white p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 rounded-sm shadow-2xl">
          <div className="md:w-2/3 aspect-[16/9] bg-zinc-900 relative group cursor-pointer overflow-hidden">
            <Image 
              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop" 
              alt="Brand Story" 
              fill 
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-7xl opacity-80 group-hover:scale-110 transition-transform duration-300 group-hover:opacity-100" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            </div>
          </div>
          <div className="md:w-1/3 space-y-6">
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight">{cmsData.brandStory.heading}</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">{cmsData.brandStory.description1}</p>
            <Link href="/about">
              <button className="bg-white text-black mt-4 px-8 py-4 font-bold text-sm uppercase tracking-widest w-full rounded-full hover:bg-zinc-200 transition-colors">KNOW MORE</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
