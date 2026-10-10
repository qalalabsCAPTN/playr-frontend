'use client';

import { useEffect, useRef, ReactNode, ElementType } from 'react';

interface RevealProps {
  children: ReactNode;
  stagger?: boolean;
  className?: string;
  as?: ElementType;
}

export default function Reveal({ children, stagger = false, className = '', as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check immediately on mount so items in or near viewport appear without delay
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150 && rect.bottom > -150) {
      el.classList.add('visible');
    }

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('visible');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: '150px 0px 150px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as any;

  return (
    <Component ref={ref} className={`${stagger ? 'reveal-stagger' : 'reveal'} ${className}`}>
      {children}
    </Component>
  );
}
