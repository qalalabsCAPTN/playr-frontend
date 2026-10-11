'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@playr/ui';

export function MobileNav({ scrolled }: { scrolled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "p-2 -ml-2 transition-colors duration-300",
          scrolled ? "text-zinc-900" : "text-white"
        )}
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-[#fdf9f0] z-50 p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-extrabold text-2xl tracking-tighter font-[var(--font-sora)]">playR</span>
                <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-zinc-500 hover:text-zinc-900">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-sm text-[#867b5d] uppercase mb-3 tracking-wider">Category</h3>
                  <div className="flex flex-col gap-2.5">
                    <Link href="/collections/apparel" onClick={() => setIsOpen(false)} className="text-base font-semibold text-zinc-900">Apparel</Link>
                    <div className="pl-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600 mb-1">
                      <Link href="/collections/topwear" onClick={() => setIsOpen(false)}>Topwear</Link>
                      <Link href="/collections/bottomwear" onClick={() => setIsOpen(false)}>Bottomwear</Link>
                      <Link href="/collections/suit" onClick={() => setIsOpen(false)}>Suit</Link>
                      <Link href="/collections/innerwear" onClick={() => setIsOpen(false)}>Innerwear</Link>
                    </div>
                    <Link href="/collections/equipment" onClick={() => setIsOpen(false)} className="text-base font-semibold text-zinc-900">Equipment</Link>
                    <div className="pl-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600 mb-1">
                      <Link href="/collections/bat" onClick={() => setIsOpen(false)}>Bats</Link>
                      <Link href="/collections/ball" onClick={() => setIsOpen(false)}>Balls</Link>
                      <Link href="/collections/paddle-raquet" onClick={() => setIsOpen(false)}>Paddles</Link>
                      <Link href="/collections/guard" onClick={() => setIsOpen(false)}>Guards &amp; Gear</Link>
                    </div>
                    <Link href="/collections/accessories" onClick={() => setIsOpen(false)} className="text-base font-semibold text-zinc-900">Accessories</Link>
                    <div className="pl-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600 mb-1">
                      <Link href="/collections/bag" onClick={() => setIsOpen(false)}>Bags</Link>
                      <Link href="/collections/caps" onClick={() => setIsOpen(false)}>Headwear</Link>
                      <Link href="/collections/drinkware" onClick={() => setIsOpen(false)}>Drinkware</Link>
                      <Link href="/collections/socks" onClick={() => setIsOpen(false)}>Socks</Link>
                    </div>
                    <div className="pt-2 border-t border-zinc-200/60 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-[#867b5d]">
                      <Link href="/collections/men" onClick={() => setIsOpen(false)}>Men</Link>
                      <Link href="/collections/women" onClick={() => setIsOpen(false)}>Women</Link>
                      <Link href="/collections/unisex" onClick={() => setIsOpen(false)}>Unisex</Link>
                      <Link href="/collections/kids" onClick={() => setIsOpen(false)}>Kids</Link>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-sm text-[#867b5d] uppercase mb-3 tracking-wider">Sports &amp; Functions</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-zinc-800">
                    <Link href="/collections/cricket" onClick={() => setIsOpen(false)}>Cricket</Link>
                    <Link href="/collections/running-training" onClick={() => setIsOpen(false)}>Running &amp; Training</Link>
                    <Link href="/collections/gym-fitness-yoga" onClick={() => setIsOpen(false)}>Gym Fitness Yoga</Link>
                    <Link href="/collections/cycling" onClick={() => setIsOpen(false)}>Cycling</Link>
                    <Link href="/collections/pickleball" onClick={() => setIsOpen(false)}>Pickleball</Link>
                    <Link href="/collections/swimming" onClick={() => setIsOpen(false)}>Swimming</Link>
                    <Link href="/collections/outdoor-adventure" onClick={() => setIsOpen(false)}>Outdoor &amp; Adventure</Link>
                    <Link href="/collections/lifestyle-after-sports" onClick={() => setIsOpen(false)}>Lifestyle After Sports</Link>
                    <Link href="/collections/football" onClick={() => setIsOpen(false)}>Football</Link>
                    <Link href="/collections/basketball" onClick={() => setIsOpen(false)}>Basketball</Link>
                    <Link href="/collections/golf" onClick={() => setIsOpen(false)}>Golf</Link>
                    <Link href="/collections/kabaddi" onClick={() => setIsOpen(false)}>Kabaddi</Link>
                    <Link href="/collections/home-office" onClick={() => setIsOpen(false)}>Home &amp; Office</Link>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#867b5d] uppercase mb-3 tracking-wider">Official Brands</h3>
                  <div className="flex flex-col gap-2 text-sm text-zinc-800">
                    <Link href="/collections/playr" onClick={() => setIsOpen(false)}>playR</Link>
                    <Link href="/collections/playr-street" onClick={() => setIsOpen(false)}>playR STREET</Link>
                    <Link href="/collections/chennai-super-kings" onClick={() => setIsOpen(false)}>playR x Chennai Super Kings</Link>
                    <Link href="/collections/lucknow-super-giants" onClick={() => setIsOpen(false)}>playR x Lucknow Super Giants</Link>
                    <Link href="/collections/sunrisers-hyderabad" onClick={() => setIsOpen(false)}>playR x Sunrisers Hyderabad</Link>
                    <Link href="/collections/seattle-orcas" onClick={() => setIsOpen(false)}>playR x Seattle Orcas</Link>
                    <Link href="/collections/up-yoddha" onClick={() => setIsOpen(false)}>playR x UP Yoddha</Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
