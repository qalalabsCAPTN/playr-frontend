'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@playr/ui';

const MEGA_MENU_DATA = [
  {
    title: 'Category',
    columns: [
      { heading: 'Apparel', links: [{ name: 'Topwear', href: '/collections/topwear' }, { name: 'Bottomwear', href: '/collections/bottomwear' }, { name: 'Tracksuits', href: '/collections/suit' }, { name: 'Innerwear', href: '/collections/innerwear' }] },
      { heading: 'Equipment', links: [{ name: 'Cricket Bats', href: '/collections/bat' }, { name: 'Pickleball Paddles', href: '/collections/paddle-raquet' }, { name: 'Protective Guards', href: '/collections/guard' }, { name: 'Resistance Bands', href: '/collections/band' }] },
      { heading: 'Accessories', links: [{ name: 'Caps & Hats', href: '/collections/headwear' }, { name: 'Sports Bags', href: '/collections/bag' }, { name: 'Sippers & Bottles', href: '/collections/drinkware' }, { name: 'Athletic Socks', href: '/collections/socks' }] }
    ]
  },
  {
    title: 'Sports',
    columns: [
      { heading: 'Popular', links: [{ name: 'Cricket', href: '/collections/cricket' }, { name: 'Running & Training', href: '/collections/running-training' }, { name: 'Gym Fitness Yoga', href: '/collections/gym-fitness-yoga' }] },
      { heading: 'Performance', links: [{ name: 'Pickleball', href: '/collections/pickleball' }, { name: 'Swimming', href: '/collections/swimming' }, { name: 'Outdoor & Adventure', href: '/collections/outdoor-adventure' }] },
      { heading: 'Active', links: [{ name: 'Cycling', href: '/collections/cycling' }, { name: 'Football', href: '/collections/football' }, { name: 'Golf', href: '/collections/golf' }, { name: 'Kabaddi', href: '/collections/kabaddi' }] }
    ]
  },
  {
    title: 'Brand',
    columns: [
      { heading: 'playR Lines', links: [{ name: 'playR Core', href: '/collections/playr' }, { name: 'playR STREET', href: '/collections/playr-street' }] },
      { heading: 'IPL Merchandise', links: [{ name: 'Chennai Super Kings', href: '/collections/chennai-super-kings' }, { name: 'Lucknow Super Giants', href: '/collections/lucknow-super-giants' }, { name: 'Sunrisers Hyderabad', href: '/collections/sunrisers-hyderabad' }] },
      { heading: 'Leagues', links: [{ name: 'UP Yoddha (PKL)', href: '/collections/up-yoddha' }, { name: 'Seattle Orcas (MLC)', href: '/collections/seattle-orcas' }] }
    ]
  },
  {
    title: 'Club',
    columns: [
      { heading: 'Official Merchandise', links: [{ name: 'Chennai Super Kings', href: '/collections/chennai-super-kings' }, { name: 'Lucknow Super Giants', href: '/collections/lucknow-super-giants' }, { name: 'Sunrisers Hyderabad', href: '/collections/sunrisers-hyderabad' }, { name: 'UP Yoddhas', href: '/collections/up-yoddha' }, { name: 'Seattle Orcas', href: '/collections/seattle-orcas' }] }
    ]
  }
];

export function MegaMenu({ scrolled }: { scrolled: boolean }) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center h-full gap-8 relative" onMouseLeave={() => setActiveMenu(null)}>
      {MEGA_MENU_DATA.map((item) => (
        <div key={item.title} className="h-full flex items-center" onMouseEnter={() => setActiveMenu(item.title)}>
          <button className={cn(
            "text-sm font-semibold tracking-wide uppercase transition-colors py-6 relative duration-300",
            scrolled
              ? "text-on-surface hover:text-[#867b5d]"
              : "text-white/80 hover:text-white"
          )}>
            {item.title}
            {activeMenu === item.title && (
              <motion.div
                layoutId="nav-indicator"
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5",
                  scrolled ? "bg-[#867b5d]" : "bg-white"
                )}
              />
            )}
          </button>
        </div>
      ))}

      <AnimatePresence>
        {activeMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
            className="absolute top-[100%] left-0 w-[600px] bg-white shadow-2xl rounded-b-xl border border-t-0 p-8 z-50 grid grid-cols-3 gap-8"
          >
            {MEGA_MENU_DATA.find(m => m.title === activeMenu)?.columns.map(col => (
              <div key={col.heading}>
                <h3 className="font-bold text-sm text-[#867b5d] uppercase mb-4 tracking-wider">{col.heading}</h3>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-zinc-600 hover:text-black font-medium transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
