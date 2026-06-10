"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, PerspectiveCamera, Html } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlayRLogo3D } from "./PlayRLogo3D";
import Link from "next/link";

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Html>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const logoY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[700px] overflow-hidden bg-background flex flex-col items-center justify-center"
    >
      {/* Background ambient glow */}
      <motion.div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40"
        style={{ y: bgParallaxY }}
      >
        <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-on-surface/10 to-transparent blur-[120px]" />
      </motion.div>

      {/* 3D Canvas */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ scale: logoScale, y: logoY }}
      >
        <Canvas shadows className="w-full h-full cursor-pointer">
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={2.0} color="#d4c874" />
          <Suspense fallback={<Loader />}>
            <PlayRLogo3D />
            <ContactShadows
              position={[0, -3.0, 0]}
              opacity={0.3}
              scale={25}
              blur={2.5}
              far={10}
              color="#1d1c16"
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Hero Content Overlay */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 mt-10 pointer-events-none w-full h-full"
        style={{ opacity: textOpacity, y: textY }}
      >
        <div className="flex-1 flex flex-col items-center justify-center pt-[20vh]">
          <h1 className="font-black text-5xl md:text-7xl lg:text-[90px] text-on-background leading-[0.9] uppercase tracking-tighter drop-shadow-sm mb-6">
            LIMITLESS<br />PERFORMANCE
          </h1>
          <p className="text-on-surface-variant font-semibold text-lg md:text-xl max-w-2xl mb-12 tracking-wide uppercase">
            Built For Athletes,<br />Teams &amp; Champions
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 pointer-events-auto">
            <Link href="/collections/new">
              <button className="bg-on-background text-background px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-full shadow-2xl">
                Explore Collection
              </button>
            </Link>
            <Link href="/b2b">
              <button className="bg-transparent border-2 border-on-background text-on-background px-10 py-5 font-bold text-sm uppercase tracking-[0.2em] hover:bg-on-background hover:text-background transition-all duration-300 rounded-full">
                Customize Team Gear
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="pb-12 mt-auto animate-bounce opacity-60">
          <span className="material-symbols-outlined text-on-background text-3xl">keyboard_arrow_down</span>
        </div>
      </motion.div>
    </section>
  );
}
