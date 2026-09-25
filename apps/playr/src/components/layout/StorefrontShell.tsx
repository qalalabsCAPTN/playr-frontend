'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/components/bluorng/CartContext';
import Header from '@/components/bluorng/Header';
import CartDrawer from '@/components/bluorng/CartDrawer';
import Footer from '@/components/bluorng/Footer';
import SmoothScroll from '@/components/layout/SmoothScroll';
import { MobileNavDock } from '@/components/layout/MobileNavDock';

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <SmoothScroll />
      <Header />
      <div className="page-frame" />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <MobileNavDock />
      <Footer />
    </CartProvider>
  );
}
