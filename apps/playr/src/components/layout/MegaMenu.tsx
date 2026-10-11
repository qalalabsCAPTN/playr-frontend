'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@playr/ui';

const MEGA_MENU_DATA = [
  {
    title: 'Category',
    columns: [
      {
        heading: 'Apparel',
        links: [
          { name: 'Topwear (Tees, Polos, Jerseys)', href: '/collections/topwear' },
          { name: 'Bottomwear (Shorts, Joggers)', href: '/collections/bottomwear' },
          { name: 'Suits & Track Sets', href: '/collections/suit' },
          { name: 'Innerwear & Skin Layers', href: '/collections/innerwear' },
        ],
      },
      {
        heading: 'Equipment',
        links: [
          { name: 'Bats (English & Kashmir)', href: '/collections/bat' },
          { name: 'Balls (Leather & Tennis)', href: '/collections/ball' },
          { name: 'Paddle Raquets', href: '/collections/paddle-raquet' },
          { name: 'Guards, Gloves & Kitbags', href: '/collections/guard' },
        ],
      },
      {
        heading: 'Accessories',
        links: [
          { name: 'Caps & Hats', href: '/collections/headwear' },
          { name: 'Bags (Backpacks, Slings, Gym)', href: '/collections/bag' },
          { name: 'Drinkware (Sippers, Shakers)', href: '/collections/drinkware' },
          { name: 'Socks & Towels', href: '/collections/socks' },
        ],
      },
      {
        heading: 'Gender & Age',
        links: [
          { name: 'Men', href: '/collections/men' },
          { name: 'Women', href: '/collections/women' },
          { name: 'Unisex', href: '/collections/unisex' },
          { name: 'Kids & Ageless', href: '/collections/kids' },
        ],
      },
    ],
  },
  {
    title: 'Sports',
    columns: [
      {
        heading: 'Popular',
        links: [
          { name: 'Cricket', href: '/collections/cricket' },
          { name: 'Running & Training', href: '/collections/running-training' },
          { name: 'Gym Fitness Yoga', href: '/collections/gym-fitness-yoga' },
          { name: 'Cycling', href: '/collections/cycling' },
        ],
      },
      {
        heading: 'Performance & Outdoor',
        links: [
          { name: 'Pickleball', href: '/collections/pickleball' },
          { name: 'Swimming', href: '/collections/swimming' },
          { name: 'Outdoor & Adventure', href: '/collections/outdoor-adventure' },
          { name: 'Lifestyle After Sports', href: '/collections/lifestyle-after-sports' },
        ],
      },
      {
        heading: 'Court, Field & Daily',
        links: [
          { name: 'Football', href: '/collections/football' },
          { name: 'Basketball', href: '/collections/basketball' },
          { name: 'Golf', href: '/collections/golf' },
          { name: 'Kabaddi', href: '/collections/kabaddi' },
          { name: 'Home & Office', href: '/collections/home-office' },
        ],
      },
      {
        heading: 'All Gear',
        links: [
          { name: 'All Products', href: '/collections/all-products' },
          { name: 'Latest Drops', href: '/collections/new-in' },
        ],
      },
    ],
  },
  {
    title: 'Brand',
    columns: [
      {
        heading: 'playR Lines',
        links: [
          { name: 'playR', href: '/collections/playr' },
          { name: 'playR STREET', href: '/collections/playr-street' },
        ],
      },
      {
        heading: 'IPL Collaborations',
        links: [
          { name: 'playR x CSK', href: '/collections/chennai-super-kings' },
          { name: 'playR x LSG', href: '/collections/lucknow-super-giants' },
          { name: 'playR x SRH', href: '/collections/sunrisers-hyderabad' },
        ],
      },
      {
        heading: 'Leagues',
        links: [
          { name: 'playR x Seattle Orcas', href: '/collections/seattle-orcas' },
          { name: 'playR x UP Yoddha', href: '/collections/up-yoddha' },
        ],
      },
      {
        heading: 'Explore',
        links: [
          { name: 'About playR', href: '/about' },
          { name: 'B2B Partnerships', href: '/b2b' },
        ],
      },
    ],
  },
  {
    title: 'Club',
    columns: [
      {
        heading: 'IPL Teams',
        links: [
          { name: 'Chennai Super Kings', href: '/collections/chennai-super-kings' },
          { name: 'Lucknow Super Giants', href: '/collections/lucknow-super-giants' },
          { name: 'Sunrisers Hyderabad', href: '/collections/sunrisers-hyderabad' },
        ],
      },
      {
        heading: 'Franchises',
        links: [
          { name: 'UP Yoddhas', href: '/collections/up-yoddha' },
          { name: 'Seattle Orcas', href: '/collections/seattle-orcas' },
        ],
      },
      {
        heading: 'Player Club',
        links: [
          { name: 'Overview & Rewards', href: '/earn-points' },
          { name: 'Special Offers', href: '/offer' },
        ],
      },
      {
        heading: 'Enterprise',
        links: [
          { name: 'B2B Desk', href: '/b2b' },
          { name: 'Bulk Merchandise', href: '/b2b' },
        ],
      },
    ],
  },
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
            className="absolute top-[100%] left-0 w-[860px] bg-white shadow-2xl rounded-b-xl border border-t-0 p-8 z-50 grid grid-cols-4 gap-6"
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
