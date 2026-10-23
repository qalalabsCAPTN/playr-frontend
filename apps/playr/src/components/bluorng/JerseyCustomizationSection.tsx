'use client';

import React from 'react';
import Link from 'next/link';

interface JerseyCustomizationSectionProps {
  videoSrc?: string;
  imageSrc?: string;
  videoHref?: string;
  imageHref?: string;
}

export default function JerseyCustomizationSection({
  videoSrc = '/videos/jersey-custom.mp4',
  imageSrc = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_a7d3a318-96f0-4525-a1b5-0d4974c9baa4.jpg?v=1756796308',
  videoHref = '/collections/csk',
  imageHref = '/collections/jersey',
}: JerseyCustomizationSectionProps) {
  return (
    <section className="my-6 mx-3 md:mx-6">
      {/* 1x2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        
        {/* Left Box: Video Box with Overlayed Hyperlinked Button */}
        <div className="relative group overflow-hidden rounded-2xl border border-[var(--line)] bg-black shadow-sm aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
            poster="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/csk_web_banner__jpg.jpg"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-5 md:p-7 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-black shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                Customisation Studio
              </span>
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest hidden sm:inline">
                Live Preview
              </span>
            </div>

            <div>
              <span className="text-[11px] md:text-xs uppercase font-bold tracking-wider text-amber-300 block">
                Official Squad Kits
              </span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Customise Your Jersey
              </h3>
              <p className="text-xs md:text-sm text-white/80 mt-1.5 max-w-md line-clamp-2">
                Personalise with your name, squad number, and authentic tournament badges with tournament-grade heat print.
              </p>

              {/* Hyperlinked CTA Button */}
              <div className="mt-4">
                <Link
                  href={videoHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all duration-200 transform group-hover:translate-x-1 shadow-lg"
                >
                  Customise Jersey Now
                  <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Box: Image Box with Overlayed Hyperlinked Button */}
        <div className="relative group overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10]">
          <img
            src={imageSrc}
            alt="Customizable Official Team Jersey"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-5 md:p-7 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                Official Match Edition
              </span>
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest hidden sm:inline">
                AERODRY Fabric
              </span>
            </div>

            <div>
              <span className="text-[11px] md:text-xs uppercase font-bold tracking-wider text-white/70 block">
                IPL 2026 Collection
              </span>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Make It Truly Yours
              </h3>
              <p className="text-xs md:text-sm text-white/80 mt-1.5 max-w-md line-clamp-2">
                Engineered with high-tensile technical poly-mesh for ventilation, sweat-resistance, and championship style.
              </p>

              {/* Hyperlinked CTA Button */}
              <div className="mt-4">
                <Link
                  href={imageHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-white/90 text-black font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all duration-200 transform group-hover:translate-x-1 shadow-lg"
                >
                  Explore All Matchwear
                  <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
