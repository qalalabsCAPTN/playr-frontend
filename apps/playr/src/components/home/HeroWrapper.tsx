"use client";

import dynamic from 'next/dynamic';

export const HeroWrapper = dynamic(() => import('./Hero').then((mod) => mod.Hero), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-zinc-950 animate-pulse" />
});
