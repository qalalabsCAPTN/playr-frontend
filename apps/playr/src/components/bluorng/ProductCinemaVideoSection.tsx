'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface ProductCinemaVideoSectionProps {
  videoSrc?: string;
  poster?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function ProductCinemaVideoSection({
  videoSrc = '/videos/playr-promo.mp4',
  poster = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/csk_web_banner__jpg.jpg',
  badge = 'Category Spotlight — Pro Series',
  title = 'Engineered For The Arena',
  subtitle = 'Discover tournament-tested matchwear and gear engineered with AERODRY moisture management, four-way stretch, and tournament durability.',
  ctaText = 'Shop The Pro Series',
  ctaHref = '/collections/new-in',
}: ProductCinemaVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section className="my-6 mx-3 md:mx-6">
      {/* 21:9 Aspect Ratio Cinema Box */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--line)] bg-black shadow-lg aspect-[16/9] md:aspect-[21/9] min-h-[260px] md:min-h-[380px]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          className="w-full h-full object-cover opacity-85"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Cinematic letterbox / gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-between p-5 md:p-10 text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {badge}
            </span>

            {/* Mute/Unmute sound toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white text-xs transition-colors backdrop-blur-md flex items-center gap-1.5"
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
            </button>
          </div>

          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
              {title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 mt-2 sm:mt-3 leading-relaxed max-w-lg">
              {subtitle}
            </p>

            {/* Prominent CTA Button with Hyperlink */}
            <div className="mt-4 sm:mt-6">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white hover:bg-white/90 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                {ctaText}
                <span className="text-base leading-none">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
