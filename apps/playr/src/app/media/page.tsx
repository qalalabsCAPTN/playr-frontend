"use client"

import React, { useEffect, useState } from "react"
import { CMSService, CMSMediaPageData } from "@playr/nectar-core"

export default function MediaPage() {
  const [data, setData] = useState<CMSMediaPageData | null>(null)

  useEffect(() => {
    CMSService.getMediaPageBlocks().then(setData)
  }, [])

  if (!data) return <div className="min-h-screen bg-[#fdf9f0]"></div>;

  const { hero, media } = data;

  return (
    <div className="bg-[#fdf9f0] min-h-screen text-on-surface">
      {/* Hero Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto">
        <div className="relative w-full h-[500px] md:h-[700px] rounded-xl overflow-hidden group cursor-pointer bg-surface-container-highest">
          {/* Placeholder for high impact image */}
          <div className="absolute inset-0 bg-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-9xl text-surface-variant">newspaper</span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16">
            {hero.badge && (
              <span className="bg-athletic-red text-white font-label-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">{hero.badge}</span>
            )}
            <h1 className="font-headline-xl text-3xl md:text-5xl text-white max-w-4xl mb-6">{hero.heading1}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <p className="text-white/80 font-label-bold">{hero.description}</p>
              <button className="bg-action-yellow text-on-surface font-label-bold uppercase px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 w-fit shadow-lg">
                {hero.primaryCta.label} <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Magazine Grid Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-16 max-w-container-max mx-auto">
        <div className="flex items-baseline justify-between mb-12 border-b-4 border-on-surface pb-4">
          <h2 className="font-headline-md text-3xl uppercase tracking-tighter">{media.headline}</h2>
          <div className="hidden md:flex gap-6 font-label-bold text-secondary uppercase tracking-wider text-sm">
            <span className="text-athletic-red border-b-2 border-athletic-red pb-1">All News</span>
            <span className="hover:text-on-surface cursor-pointer transition-colors pb-1">Partnerships</span>
            <span className="hover:text-on-surface cursor-pointer transition-colors pb-1">Product Drops</span>
            <span className="hover:text-on-surface cursor-pointer transition-colors pb-1">Global Expansion</span>
          </div>
        </div>

        {/* Bento-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Secondary Article */}
          <article className="md:col-span-8 flex flex-col md:flex-row gap-6 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 group hover:shadow-xl transition-shadow">
            <div className="md:w-1/2 overflow-hidden rounded-lg bg-surface-container aspect-video md:aspect-auto flex items-center justify-center">
               <span className="material-symbols-outlined text-6xl text-secondary">sports_cricket</span>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <span className="text-athletic-red font-label-bold text-xs uppercase mb-2">{media.mainArticle.category}</span>
              <h3 className="font-headline-md text-2xl mb-4 group-hover:text-athletic-red transition-colors">{media.mainArticle.title}</h3>
              <p className="text-secondary font-body-md mb-6 leading-relaxed">{media.mainArticle.description}</p>
              <a href={media.mainArticle.link} className="font-label-bold text-on-surface flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                READ MORE <span className="material-symbols-outlined text-sm">trending_flat</span>
              </a>
            </div>
          </article>

          {/* Sidebar News 1 */}
          <article className="md:col-span-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 flex flex-col group hover:shadow-xl transition-shadow">
            <div className="overflow-hidden rounded-lg mb-4 bg-surface-container h-48 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-secondary">sports_tennis</span>
            </div>
            <span className="text-athletic-red font-label-bold text-xs uppercase mb-2">{media.sidebarArticle.category}</span>
            <h3 className="font-headline-md text-xl mb-2 group-hover:text-athletic-red transition-colors leading-tight">{media.sidebarArticle.title}</h3>
            <p className="text-secondary font-body-md text-sm mb-4 line-clamp-2">{media.sidebarArticle.description}</p>
            <a href={media.sidebarArticle.link} className="font-label-bold text-xs mt-auto">READ STORY</a>
          </article>

          {/* Small Grid Items */}
          {media.articles.map((article, idx) => (
            <article key={idx} className={`md:col-span-4 p-6 rounded-xl group hover:shadow-xl transition-shadow ${idx === 0 ? 'bg-on-surface text-white flex flex-col justify-between hover:shadow-2xl' : 'bg-surface-container-lowest border border-outline-variant/30'}`}>
              {idx === 0 ? (
                <>
                  <div>
                    <span className="text-action-yellow font-label-bold text-xs uppercase mb-4 block">{article.category}</span>
                    <h3 className="font-headline-md text-xl mb-4 leading-tight">{article.title}</h3>
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">{article.description}</p>
                  </div>
                  <button className="bg-action-yellow text-on-surface w-12 h-12 rounded-full flex items-center justify-center self-end group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">north_east</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="h-40 overflow-hidden rounded-lg mb-4 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-secondary">{idx === 1 ? 'sports_baseball' : 'checkroom'}</span>
                  </div>
                  <span className="text-athletic-red font-label-bold text-xs uppercase mb-2">{article.category}</span>
                  <h3 className="font-headline-md text-xl mb-2">{article.title}</h3>
                  <p className="text-secondary font-body-md text-sm">{article.description}</p>
                </>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-20 bg-on-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-headline-xl text-3xl md:text-5xl text-white uppercase mb-6 font-black tracking-tighter">Stay in the Game</h2>
          <p className="text-surface-variant font-body-lg mb-10">Get exclusive updates on product launches, athlete stories, and behind-the-scenes content.</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input className="flex-grow bg-surface-container-lowest text-on-surface px-6 py-4 rounded-full border-none outline-none focus:ring-2 focus:ring-action-yellow" placeholder="Your email address" type="email" required />
            <button className="bg-action-yellow text-on-surface font-label-bold px-10 py-4 rounded-full hover:scale-105 transition-transform uppercase tracking-widest">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}
