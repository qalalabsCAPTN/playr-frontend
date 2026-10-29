'use client';

import React, { useEffect, useState } from 'react';
import { CMSService, CMSMediaPageData } from '@playr/nectar-core';

export default function NewsMediaView() {
  const [data, setData] = useState<CMSMediaPageData | null>(null);

  useEffect(() => {
    CMSService.getMediaPageBlocks().then(setData);
  }, []);

  if (!data) return <div className="min-h-screen bg-[var(--bg)]"></div>;

  const { hero, media } = data;

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--fg)] pt-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 md:px-12 py-12 max-w-[1440px] mx-auto">
        <div className="relative w-full h-[500px] md:h-[650px] rounded-3xl overflow-hidden group cursor-pointer bg-[var(--panel)] border border-[var(--border)]">
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <span className="material-symbols-outlined text-9xl text-white/20">newspaper</span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8 md:p-16">
            {hero.badge && (
              <span className="bg-[var(--accent)] text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-4">
                {hero.badge}
              </span>
            )}
            <h1 className="font-black text-3xl md:text-5xl text-white max-w-4xl mb-4 tracking-tight">
              {hero.heading1}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <p className="text-white/80 font-medium max-w-xl text-sm md:text-base">
                {hero.description}
              </p>
              <button className="bg-white text-black font-extrabold uppercase px-8 py-3.5 rounded-full hover:scale-105 transition-transform active:scale-95 flex items-center gap-2 w-fit shadow-lg text-xs tracking-wider">
                {hero.primaryCta.label} <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Magazine Grid Section */}
      <section className="px-4 sm:px-6 md:px-12 py-16 max-w-[1440px] mx-auto">
        <div className="flex items-baseline justify-between mb-12 border-b border-[var(--border)] pb-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--fg)]">
            News &amp; Media
          </h2>
          <div className="hidden md:flex gap-6 font-bold text-[var(--muted)] uppercase tracking-wider text-xs">
            <span className="text-[var(--fg)] border-b-2 border-[var(--fg)] pb-1">All News</span>
            <span className="hover:text-[var(--fg)] cursor-pointer transition-colors pb-1">Partnerships</span>
            <span className="hover:text-[var(--fg)] cursor-pointer transition-colors pb-1">Product Drops</span>
            <span className="hover:text-[var(--fg)] cursor-pointer transition-colors pb-1">Global Expansion</span>
          </div>
        </div>

        {/* Bento-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Secondary Article */}
          <article className="md:col-span-8 flex flex-col md:flex-row gap-6 bg-[var(--panel)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] group hover:shadow-xl transition-shadow">
            <div className="md:w-1/2 overflow-hidden rounded-2xl bg-[var(--chip)] aspect-video md:aspect-auto flex items-center justify-center">
               <span className="material-symbols-outlined text-6xl text-[var(--muted)]">sports_cricket</span>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <span className="text-[var(--accent)] font-bold text-xs uppercase mb-2">
                {media.mainArticle.category}
              </span>
              <h3 className="text-2xl font-black mb-4 group-hover:text-[var(--accent)] transition-colors tracking-tight text-[var(--fg)]">
                {media.mainArticle.title}
              </h3>
              <p className="text-[var(--muted)] text-sm mb-6 leading-relaxed">
                {media.mainArticle.description}
              </p>
              <a href={media.mainArticle.link} className="font-bold text-xs uppercase tracking-wider text-[var(--fg)] flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Read Story <span className="material-symbols-outlined text-sm">trending_flat</span>
              </a>
            </div>
          </article>

          {/* Sidebar News */}
          <article className="md:col-span-4 bg-[var(--panel)] p-6 sm:p-8 rounded-3xl border border-[var(--border)] flex flex-col group hover:shadow-xl transition-shadow">
            <div className="overflow-hidden rounded-2xl mb-4 bg-[var(--chip)] h-48 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-[var(--muted)]">sports_tennis</span>
            </div>
            <span className="text-[var(--accent)] font-bold text-xs uppercase mb-2">
              {media.sidebarArticle.category}
            </span>
            <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors leading-tight text-[var(--fg)]">
              {media.sidebarArticle.title}
            </h3>
            <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2">
              {media.sidebarArticle.description}
            </p>
            <a href={media.sidebarArticle.link} className="font-bold text-xs uppercase tracking-wider text-[var(--fg)] mt-auto">
              Read Story &rarr;
            </a>
          </article>

          {/* Small Grid Items */}
          {media.articles.map((article, idx) => (
            <article key={idx} className={`md:col-span-4 p-6 sm:p-8 rounded-3xl border border-[var(--border)] group hover:shadow-xl transition-shadow ${idx === 0 ? 'bg-[var(--fg)] text-[var(--panel)] flex flex-col justify-between' : 'bg-[var(--panel)]'}`}>
              {idx === 0 ? (
                <>
                  <div>
                    <span className="text-action-yellow font-bold text-xs uppercase mb-4 block">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold mb-4 leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-sm opacity-80 mb-6 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center self-end group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-sm">north_east</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-40 overflow-hidden rounded-2xl mb-4 bg-[var(--chip)] flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-[var(--muted)]">{idx === 1 ? 'sports_baseball' : 'checkroom'}</span>
                  </div>
                  <span className="text-[var(--accent)] font-bold text-xs uppercase mb-2 block">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold mb-2 text-[var(--fg)]">
                    {article.title}
                  </h3>
                  <p className="text-[var(--muted)] text-sm">
                    {article.description}
                  </p>
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
