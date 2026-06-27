"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[700px] overflow-hidden bg-background flex flex-col items-center justify-center"
    >
      {/* Background Banner Image */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ y: bgParallaxY }}
      >
        <Image
          src="/images/hero-banner-new.png"
          alt="Hero Banner"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-background" />
      </motion.div>
 
      {/* Hero Content Overlay */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 mt-10 pointer-events-none w-full h-full"
        style={{ opacity: textOpacity, y: textY }}
      >
        <div className="flex-1 flex flex-col items-center justify-center pt-[20vh]">
          <h1 className="font-black text-5xl md:text-7xl lg:text-[90px] text-white leading-[0.9] uppercase tracking-tighter drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] mb-6">
            LIMITLESS<br />PERFORMANCE
          </h1>
          <p className="text-zinc-200 font-bold text-lg md:text-xl max-w-2xl mb-12 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Built For Athletes,<br />Teams &amp; Champions
          </p>
 
          <div className="flex flex-col sm:flex-row items-center gap-6 pointer-events-auto">
            <Link href="/collections/new">
              <button className="bg-white text-zinc-950 px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-full shadow-2xl">
                Explore Collection
              </button>
            </Link>
            <Link href="/b2b">
              <button className="bg-transparent border-2 border-white text-white px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-zinc-950 transition-all duration-300 rounded-full">
                Customize Team Gear
              </button>
            </Link>
          </div>
        </div>
 
        {/* Scroll Indicator */}
        <div className="pb-12 mt-auto animate-bounce opacity-80">
          <span className="material-symbols-outlined text-white text-3xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">keyboard_arrow_down</span>
        </div>
      </motion.div>
    </section>
  );
}
