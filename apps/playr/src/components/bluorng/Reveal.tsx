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
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
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
