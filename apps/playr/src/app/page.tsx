import React from 'react';
import Link from 'next/link';
import { CMSService } from '@playr/nectar-core';

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
      <section className="relative w-full h-[819px] bg-surface-dim overflow-hidden">
        {/* We use the MP4 background instead of image for the visual parity MP4 requirement */}
        <video 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-50" 
          autoPlay 
          muted 
          loop 
          playsInline
        >
          <source src="/videos/best version 1, homepage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-gutter">
          <h1 className="font-display-lg text-display-lg text-white mb-lg uppercase">
            {cmsData.hero.heading1} <br/> {cmsData.hero.heading2}
          </h1>
          <Link href={cmsData.hero.primaryCta.href}>
            <button className="bg-primary-container text-on-primary-fixed rounded-3xl hover:scale-95 transition-transform px-xl py-md font-label-md text-label-md uppercase tracking-widest">
              {cmsData.hero.primaryCta.label}
            </button>
          </Link>
        </div>
      </section>

      {/* 3. New Arrivals */}
      <section className="max-w-[1200px] mx-auto py-xl px-gutter">
        <div className="flex justify-between items-baseline mb-lg">
          <h2 className="font-headline-lg text-headline-lg uppercase">New Arrivals</h2>
          <Link className="font-label-md uppercase tracking-widest text-on-primary-container border-b-2 border-on-primary-container w-max hover:opacity-80 transition-opacity" href="/collections/new/">
            Explore Collection
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Product 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl transition-transform hover:scale-[1.02] overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img alt="Pro-Series Gen II Bat" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSLCRbv4GTgLsrfuKRZjyPoO3OhkwnaIQ-d4k5MbUk6xzjxhqGyuC0NLtlos6olvM5pOLL8dTwcGXvLxzwfK9eUh_QOHnth2LX0-cYK68KYY3WZcJVV_1bJe-X5H_bbmn360RVToqNVGq86r6T4rx7wZ9tNabTeR_hmD1d_o34Z2KpsXG5EAMJSb3m93ol6NEV5nZNUt0r3zNsheVDz5JxtWH6E13iaSXP3lGgO3XnnLXELeCIfF2WbqUtMyymI2nf7bhYO0I32to" />
              <div className="absolute top-4 left-4">
                <span className="bg-primary text-on-primary font-label-sm px-2 py-1 uppercase rounded">Elite</span>
              </div>
            </div>
            <div className="p-md text-center">
              <span className="text-label-sm text-tertiary uppercase">Cricket</span>
              <h3 className="font-label-md text-label-md uppercase mt-1 mb-2">Pro-Series Gen II Bat</h3>
              <div className="text-primary font-bold">$499.00</div>
            </div>
          </div>
          {/* Product 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl transition-transform hover:scale-[1.02] overflow-hidden">
            <div className="aspect-square relative overflow-hidden bg-surface-container">
              <img alt="Stealth Trainers" className="w-full h-full object-contain p-gutter" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGv-R2pfkn9zKJ91kjt-kDuTOhe_BHcH-vyzsldoCeResmJE2CSXRfZFMc6f-deXcQJBtAE8n4F5XFaedVqBBr56Dt77eDFA3YZC9TIBoN6J3XexRXKAGLkGTKBBpiPCzikNYbsSSEmPX2kR388yZjyOYGooSLKBvkbvbBJstijME95OUBatdgHc1K8ClF09OwZe6woYeZ13TGNIo1ROeGlNs6n7w6qMKJlijTcXEPgbGr_XJjhutk_vYUGZf9v7Pkjx4VOQSea1s" />
            </div>
            <div className="p-md text-center">
              <span className="text-label-sm text-tertiary uppercase">Performance</span>
              <h3 className="font-label-md text-label-md uppercase mt-1 mb-2">Stealth Trainers</h3>
              <div className="text-primary font-bold">$185.00</div>
            </div>
          </div>
          {/* Product 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl transition-transform hover:scale-[1.02] overflow-hidden">
            <div className="aspect-square relative overflow-hidden">
              <img alt="Match Ball" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDalDIr3_fcbPHcAFzArlZ1A4a8MqbUnL37eQpSidMg-T2Kb3WncT9txV4DloaywhkKW3_FJnhb2hzfw1WcTd1tPnd9SY_qRl6BrpILugHFOGtw3loEFSJ0JUktbWlLI3pGr4eBhfaJPUiB74NF-BSM60RTlhtLrPHUaOeGHFYqNiXjZyVUritKSfk5XnvgpN1QOFVu41y0_6BQLtYQMG5DBWSh-bYhDOXEPsqg3xJI1i1yUyZa91WZ2Px1bl3KsTjCG5fL0pRnQjE" />
              <div className="absolute top-4 right-4">
                <span className="material-symbols-outlined text-on-surface cursor-pointer">favorite</span>
              </div>
            </div>
            <div className="p-md text-center">
              <span className="text-label-sm text-tertiary uppercase">Equipment</span>
              <h3 className="font-label-md text-label-md uppercase mt-1 mb-2">Pro Match Ball</h3>
              <div className="text-primary font-bold">$45.00</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Shop by Categories */}
      <section className="bg-surface-container py-xl">
        <div className="max-w-[1200px] mx-auto px-gutter">
          <h2 className="font-headline-lg text-headline-lg mb-lg uppercase text-center">Shop by Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-base">
            <Link href="/collections/top-wear" className="relative aspect-square overflow-hidden cursor-pointer group rounded-2xl">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Top wear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUUq8QdBqsUfy9D6XD9VxdMeZifNfq-hr2UkyJ38HKJF5Pb7Ktmjps4pH19OJyaWYnNBKrEc_SSdVrUk8wXRGvKnkuqsYZjMEDK1SXQoWAe6FW_EhBUM9aunVcHyt5gCgy9zw1pa-w69SchO40magSLrqUzIUcdrc5ww_WYmyr0Hb67raEgAR_xFkSRQ3XHsbMbP0zArBc9I-Ln1YkkTJZug0rcE77v_KnffLa8rYU69holkJUsuOcjQd6nQmXplF8ohDozuZyoLw" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white font-label-md text-label-md uppercase tracking-widest">Top Wear</span>
              </div>
            </Link>
            <Link href="/collections/accessories" className="relative aspect-square overflow-hidden cursor-pointer group rounded-2xl">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Accessories" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHnQtwR5L8FTSM8nZwnXrNkfFKKiHIQQEvWKMaSXEx2yp3s340yuJxw-nQHhIXUgm8mEgSGP_FhdoAgZsmVLv5mTaVp20sszZuAs6i70rclHJO8TWhQUokwfxWswqCkEIMo-j1C6b23j2FcsSBWUbSokWjV089O-4BcWpqaQVpy5VAgbiJiiKRmFquF-6ixcZAB5MkdX6d3IQJ3axJ6K5OVUI-5atLSvwOfx-o99FMJlXRdyPcRw7FojB5YgMAVzRCr1NtXbYf4HE" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white font-label-md text-label-md uppercase tracking-widest">Accessories</span>
              </div>
            </Link>
            <Link href="/collections/equipment" className="relative aspect-square overflow-hidden cursor-pointer group rounded-2xl">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Equipment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp5h7mciKzBYkNfCF45pAHMAD1pUrXVpdT44b6krLSugBt_zgmEyIDYmS_zw8W55jJXSttTmM68DFIs7JT0KEfasOFRXRNouqxBDs9XiqX6qcIEO6OtlsW9GgHwUb0Vd8MexYxHsx89E-8FzXtsI3-Iq5XVY-TdpV_iSj40G4CxpFqMs7cXd-aKUvCg1Noybt8Xtg-nzKLyqu8PZ3wIWRrUX41NQkqXhwC2NEg_Y-1XM95oo6RmKiX_1IWU734u6yH7YPDLeyUsw4" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white font-label-md text-label-md uppercase tracking-widest">Equipment</span>
              </div>
            </Link>
            <Link href="/collections/bottom-wear" className="relative aspect-square overflow-hidden cursor-pointer group rounded-2xl">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Bottom wear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQxyA_RMDwvGiBydSpYoiVATs7nmSWigvDJ7WjlQiEs7FATHhwxkfhDZ4aLudWKngT0o_b015luLEzeuM-YYj2hVgvguHHKF6iLuOYmv_jkiO2Ims-Q6LeZ2bcia-SSZ4AJJsF5P706BGpWVRxvOcXQTMcyr6VWqXdgFKPhYxYL2yozSlggJHO-CfMn4Hy1_uQVo8BRSTatW-mqH5mLXIxQo3S1s-2yH3Qg42zgX6ID3QFmcqqidnJWYRSt8qrbVLBpeHZ_B9zYYI" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="text-white font-label-md text-label-md uppercase tracking-widest">Bottom Wear</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CSK Banner */}
      <section className="w-full bg-[#FFFF00]/10 py-xl px-gutter border-y border-outline-variant">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-xl">
          <div className="md:w-1/2">
            <img className="w-full h-[400px] object-cover shadow-xl rounded-3xl" alt="CSK Jersey" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBh3ZMCBCd_Uj0ifR9UADSnepsSwxo-06o4Vbn28EjxTL2-fJMAUUc-Nt0mHP1DLbZj944R9QOdUknhY371dNaRQ3_FxVInE2O0yb59bpGyEV0Nle3tsJM5UJhRrv3QBlLdMpodxVFFszrKW77WoN49kdy5VVstlMP02A093vbCzrj-385NRyVWmmIdoLNdyspeObPc4MgMhmsKDpFlAe4zbHwaaFVfGziKFjGcVE4Ba_NYi7OHZIhEeeFtCjwisNkqwCAoheH4rPA" />
          </div>
          <div className="md:w-1/2 space-y-md">
            <h2 className="font-headline-lg text-headline-lg uppercase leading-tight">OFFICIAL CSK IPL JERSEY<br/>BEYOND THE BOUNDARY</h2>
            <p className="text-body-lg font-body-lg text-tertiary">Personalize your gear with your name and number. Experience the same quality as the pros on the field.</p>
            <button className="bg-on-background text-on-primary px-xl py-md font-label-md text-label-md uppercase tracking-widest hover:bg-tertiary transition-colors rounded-full">CUSTOMIZE NOW</button>
          </div>
        </div>
      </section>

      {/* 7. Official Collabs */}
      <section className="bg-inverse-surface py-xl">
        <div className="max-w-[1200px] mx-auto px-gutter">
          <h3 className="font-label-md text-label-md text-center text-white/50 mb-10 uppercase tracking-[0.3em]">OFFICIAL COLLABS</h3>
          <div className="ticker-container py-4">
            <div className="ticker-wrapper gap-20">
              {/* Note: We will use the local images instead of remote for the official collabs */}
              <img alt="Chennai Super Kings" className="h-20 w-auto object-contain hover:opacity-100 transition-opacity" src="/images/csk.png" />
              <img alt="Lucknow Super Giants" className="h-20 w-auto object-contain hover:opacity-100 transition-opacity" src="/images/lsg.png" />
              <img alt="Sunrisers Hyderabad" className="h-20 w-auto object-contain hover:opacity-100 transition-opacity" src="/images/sunriserss.png" />
              <img alt="UP Yoddhas" className="h-20 w-auto object-contain hover:opacity-100 transition-opacity" src="/images/UP_Yoddhas_logo.png" />
              <img alt="Seattle Orcas" className="h-20 w-auto object-contain hover:opacity-100 transition-opacity" src="/images/Seattle_Orcas_Logo.svg.png" />
              <img alt="Chennai Super Kings" className="h-20 w-auto object-contain hover:opacity-100 transition-opacity" src="/images/csk.png" />
              <img alt="Lucknow Super Giants" className="h-20 w-auto object-contain hover:opacity-100 transition-opacity" src="/images/lsg.png" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Video Banner */}
      <section className="w-full h-[614px] bg-black relative">
        <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay muted loop playsInline>
          <source src="/videos/3d render final view website homepage.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform bg-white/10 backdrop-blur-sm">
            <span className="material-symbols-outlined text-white text-display-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </div>
        </div>
      </section>

      {/* 13. Brand Video Section */}
      <section className="max-w-[1200px] mx-auto py-xl px-gutter">
        <div className="bg-inverse-surface text-white p-xl flex flex-col md:flex-row items-center gap-xl rounded-3xl">
          <div className="md:w-2/3 aspect-video bg-tertiary relative group cursor-pointer rounded-2xl overflow-hidden">
            <video className="w-full h-full object-cover opacity-50" autoPlay muted loop playsInline>
              <source src="/videos/playr homepage example.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-display-lg group-hover:scale-110 transition-transform">play_circle</span>
            </div>
          </div>
          <div className="md:w-1/3 space-y-md">
            <h2 className="font-headline-lg text-headline-lg uppercase">{cmsData.brandStory.heading}</h2>
            <p className="text-body-md opacity-80">{cmsData.brandStory.description1}</p>
            <Link href="/about">
              <button className="bg-primary-container text-on-primary-fixed mt-md px-lg py-sm font-label-md text-label-md uppercase tracking-widest w-full rounded-full">KNOW MORE</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
