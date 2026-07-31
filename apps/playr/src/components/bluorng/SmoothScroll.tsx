'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up on component unmount
    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll to top on page transitions
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
