'use client';

import React from 'react';
import Link from 'next/link';

interface JerseyCustomizationSectionProps {
  leftImageSrc?: string;
  rightImageSrc?: string;
  ctaHref?: string;
  ctaText?: string;
}

export default function JerseyCustomizationSection({
  leftImageSrc = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_a7d3a318-96f0-4525-a1b5-0d4974c9baa4.jpg?v=1756796308',
  rightImageSrc = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/csk_web_banner__jpg.jpg',
  ctaHref = '/collections/csk',
  ctaText = 'Customise Jersey Now',
}: JerseyCustomizationSectionProps) {
  return (
    <section className="my-6 mx-3 md:mx-6 select-none">
      {/* 1 Unified Section divided into 2 Image Columns */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--line)] bg-black shadow-md">
        
        {/* 2 Image Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Left Image Column */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10] overflow-hidden group">
            <img
              src={leftImageSrc}
              alt="Official CSK Match Jersey Front"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient & Tag */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 flex flex-col justify-between p-4 md:p-6 text-white">
              <span className="self-start text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                Official Match Edition
              </span>
              <div>
                <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-amber-300 block">
                  playR Custom Lab
                </span>
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight text-white mt-0.5">
                  Customise Your Jersey
                </h3>
                <p className="text-xs text-white/80 mt-1 max-w-sm line-clamp-1">
                  Authentic team jerseys with AERODRY moisture management.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Column with the Single Button on the Right Side */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/10] overflow-hidden group">
            <img
              src={rightImageSrc}
              alt="Official CSK Match Kit Customization"
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Overlay with Content and Right-Aligned Button */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 flex flex-col justify-between p-4 md:p-6 text-white">
              <span className="self-start text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold shadow-sm">
                Name &amp; Number Printing
              </span>

              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-white/70 block">
                    Tournament-Grade Badges
                  </span>
                  <h4 className="text-base md:text-xl font-black uppercase tracking-tight text-white mt-0.5">
                    Make It Yours
                  </h4>
                </div>

                {/* Single Button on the Right Side */}
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all duration-200 transform hover:scale-105 shadow-xl shrink-0"
                >
                  {ctaText}
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
