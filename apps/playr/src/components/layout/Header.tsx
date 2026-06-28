"use client"

import Link from 'next/link';
import { Button } from '@playr/ui';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { XPHeader } from './XPHeader';
import { ShoppingBag, User, Heart } from 'lucide-react';
import { useCommerce } from '../commerce/CommerceProvider';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@playr/ui';

export function Header() {
  const { cartItems, wishlistItems, setIsCartDrawerOpen } = useCommerce()
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = pathname === '/';
  const isTransparent = isHomepage && !scrolled;

  return (
    <header 
      className={cn(
        "top-0 w-full transition-all duration-500 z-[100]",
        isTransparent
          ? "bg-transparent py-4"
          : "bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm py-2"
      )}
      style={{ position: isHomepage ? 'fixed' : 'sticky' }}
    >
      <div className="container max-w-[1400px] mx-auto flex items-center justify-between px-4 h-16">

        {/* Left: Mobile Nav Toggle & Logo */}
        <div className="flex items-center gap-4 lg:gap-12 h-full">
          <MobileNav scrolled={!isTransparent} />
          <Link href="/" className="flex items-center space-x-2 shrink-0 group">
            <span className={cn(
              "font-black text-4xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r transition-all duration-300",
              isTransparent
                ? "from-white to-white/80 group-hover:from-white group-hover:to-white/60"
                : "from-on-surface to-on-surface/60 group-hover:from-primary group-hover:to-primary-container"
            )}>
              playR
            </span>
          </Link>
          <div className="hidden lg:block">
            <MegaMenu scrolled={!isTransparent} />
          </div>
        </div>

        {/* Centre: XP progress (logged-in users, desktop only) */}
        <div className="hidden lg:flex items-center">
          <XPHeader scrolled={!isTransparent} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/wishlist" className="hidden sm:flex">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative rounded-full transition-all duration-300",
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-on-surface hover:text-primary hover:bg-surface-container"
              )}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-error text-on-error text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-surface">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/account">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full transition-all duration-300",
                isTransparent
                  ? "text-white hover:text-white/80 hover:bg-white/10"
                  : "text-on-surface hover:text-primary hover:bg-surface-container"
              )}
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Button
            onClick={() => setIsCartDrawerOpen(true)}
            className="bg-inverse-surface hover:bg-inverse-surface/90 hover:scale-105 active:scale-95 text-inverse-on-surface rounded-full px-5 sm:px-7 py-5 font-bold tracking-widest text-xs uppercase shadow-[0_4px_14px_0_rgb(0,0,0,25%)] transition-all duration-300 flex items-center gap-2 border border-inverse-on-surface/10"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">BAG ({cartItems.length})</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
