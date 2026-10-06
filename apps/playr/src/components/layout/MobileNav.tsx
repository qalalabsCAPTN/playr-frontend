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
                  <h3 className="font-bold text-sm text-[#867b5d] uppercase mb-4 tracking-wider">Category</h3>
                  <div className="flex flex-col gap-3">
                    <Link href="/collections/apparel" className="text-lg font-medium">Apparel</Link>
                    <Link href="/collections/equipment" className="text-lg font-medium">Equipment</Link>
                    <Link href="/collections/accessories" className="text-lg font-medium">Accessories</Link>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-sm text-[#867b5d] uppercase mb-4 tracking-wider">Sports</h3>
                  <div className="flex flex-col gap-3">
                    <Link href="/collections/cricket" className="text-lg font-medium">Cricket</Link>
                    <Link href="/collections/running-training" className="text-lg font-medium">Running & Training</Link>
                    <Link href="/collections/gym-fitness-yoga" className="text-lg font-medium">Gym Fitness Yoga</Link>
                    <Link href="/collections/pickleball" className="text-lg font-medium">Pickleball</Link>
                    <Link href="/collections/swimming" className="text-lg font-medium">Swimming</Link>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#867b5d] uppercase mb-4 tracking-wider">Official Brands</h3>
                  <div className="flex flex-col gap-3">
                    <Link href="/collections/chennai-super-kings" className="text-lg font-medium">Chennai Super Kings</Link>
                    <Link href="/collections/lucknow-super-giants" className="text-lg font-medium">Lucknow Super Giants</Link>
                    <Link href="/collections/sunrisers-hyderabad" className="text-lg font-medium">Sunrisers Hyderabad</Link>
                    <Link href="/collections/up-yoddha" className="text-lg font-medium">UP Yoddhas</Link>
                    <Link href="/collections/seattle-orcas" className="text-lg font-medium">Seattle Orcas</Link>
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
