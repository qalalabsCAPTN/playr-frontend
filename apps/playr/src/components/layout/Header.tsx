"use client"

import Link from 'next/link';
import { Button } from '@playr/ui';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { ShoppingBag, User, Heart } from 'lucide-react';
import { useCommerce } from '../commerce/CommerceProvider';

export function Header() {
  const { cartItems, wishlistItems, setIsCartDrawerOpen } = useCommerce()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 transition-all duration-300">
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 h-20">
        
        {/* Left: Mobile Nav Toggle & Logo */}
        <div className="flex items-center gap-4 lg:gap-12 h-full">
          <MobileNav />
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <span className="font-extrabold text-3xl tracking-tighter font-[var(--font-sora)]">playR</span>
          </Link>
          <MegaMenu />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/wishlist" className="hidden sm:flex">
            <Button variant="ghost" size="icon" className="hover:text-[#867b5d] relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="ghost" size="icon" className="hover:text-[#867b5d]" aria-label="Account">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Button 
            onClick={() => setIsCartDrawerOpen(true)}
            className="bg-black hover:bg-zinc-800 text-white rounded-full px-4 sm:px-6 font-semibold shadow-md flex items-center gap-2"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag ({cartItems.length})</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
