"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, PerspectiveCamera, Html } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { InfinityLogo3D } from "./InfinityLogo3D";
import Link from "next/link";

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Html>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progression relative to the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scale down the logo as user scrolls down
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  // Move logo up slightly as user scrolls down
  const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  // Fade out text as user scrolls
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[100vh] min-h-[700px] overflow-hidden bg-zinc-950 flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(circle at center, #2a2a2a 0%, #0a0a0a 100%)'
      }}
    >
      {/* 3D Canvas Background Layer */}
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{ scale: logoScale, y: logoY }}
      >
        <Canvas shadows className="w-full h-full cursor-pointer">
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
          
          <Suspense fallback={<Loader />}>
            <InfinityLogo3D />
            
            {/* Soft shadow beneath floating logo */}
            <ContactShadows 
              position={[0, -3.5, 0]} 
              opacity={0.4} 
              scale={20} 
              blur={2} 
              far={10} 
              color="#000000"
            />
            
            {/* Luxury environment reflection */}
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Hero Content Overlay Layer */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-20 pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <h1 className="font-black text-5xl md:text-7xl lg:text-[100px] text-white leading-none uppercase tracking-tighter drop-shadow-2xl mb-4 font-[var(--font-sora)] mix-blend-overlay">
          LIMITLESS<br/>PERFORMANCE
        </h1>
        <p className="text-zinc-300 font-medium text-lg md:text-2xl max-w-2xl mb-10 drop-shadow-md tracking-wide">
          Built for Athletes. Teams. Champions.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6 pointer-events-auto">
          <Link href="/collections/new">
            <button className="bg-white text-black px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:scale-105 hover:bg-[#d4af37] transition-all duration-300 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              Explore Collection
            </button>
          </Link>
          <Link href="/b2b">
            <button className="bg-transparent border border-white text-white px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 rounded-full backdrop-blur-sm">
              Customize Your Team
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
