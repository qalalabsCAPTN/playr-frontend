'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface BrandVideoSectionProps {
  videoSrc?: string;
  poster?: string;
  ctaHref?: string;
}

export default function BrandVideoSection({
  videoSrc = '/videos/playr-promo.mp4',
  poster = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/csk_web_banner__jpg.jpg',
  ctaHref = '/about',
}: BrandVideoSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <section className="panel mx-3 md:mx-6 p-4 md:p-8 rounded-2xl bg-[var(--panel)] border border-[var(--line)] shadow-sm my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Brand Video Player Container */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-[16/9] bg-black shadow-md border border-[var(--line)] group">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
            className="w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Player controls overlay */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-colors"
              aria-label={isPlaying ? 'Pause brand video' : 'Play brand video'}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-colors"
              aria-label={isMuted ? 'Unmute brand video' : 'Mute brand video'}
            >
              {isMuted ? '🔇 Unmute' : '🔊 Mute'}
            </button>
          </div>
        </div>

        {/* Brand Manifesto & CTA */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/50">
              The playR Movement
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[var(--fg)] leading-tight">
            Defy Limits. Play Bold.
          </h2>

          <p className="text-xs sm:text-sm text-[var(--muted)] mt-3 leading-relaxed">
            playR was born on the pitch, engineered for athletes and creators who refuse to settle.
            From official IPL match day jerseys to technical everyday activewear, every piece is built
            with AERODRY tech, high-tensile poly fibers, and tournament-grade craftsmanship.
          </p>

          <div className="mt-4 sm:mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-black font-black text-xs border-2 border-[var(--page-bg)]">
                IPL
              </span>
              <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs border-2 border-[var(--page-bg)]">
                MLC
              </span>
              <span className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-xs border-2 border-[var(--page-bg)]">
                PKL
              </span>
            </div>
            <span className="text-xs font-semibold text-[var(--muted)]">
              Trusted by 100K+ Athletes Worldwide
            </span>
          </div>

          {/* Prominent CTA Button with Hyperlink */}
          <div className="mt-6">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--fg)] text-[var(--page-bg)] hover:opacity-90 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 transform hover:translate-x-1 shadow-md"
            >
              Explore Our Heritage &amp; Tech
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
