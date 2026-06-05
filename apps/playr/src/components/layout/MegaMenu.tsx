'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MEGA_MENU_DATA = [
  {
    title: 'Category',
    columns: [
      { heading: 'Apparel', links: [{ name: 'T-Shirts & Polos', href: '/collections/tshirts' }, { name: 'Shorts & Pants', href: '/collections/bottoms' }, { name: 'Jackets', href: '/collections/jackets' }] },
      { heading: 'Footwear', links: [{ name: 'Performance Trainers', href: '/collections/trainers' }, { name: 'Lifestyle Sneakers', href: '/collections/sneakers' }] },
      { heading: 'Accessories', links: [{ name: 'Caps & Hats', href: '/collections/headwear' }, { name: 'Bags & Backpacks', href: '/collections/bags' }] }
    ]
  },
  {
    title: 'Sports',
    columns: [
      { heading: 'Cricket', links: [{ name: 'Training Gear', href: '/collections/cricket-training' }, { name: 'Match Whites', href: '/collections/cricket-match' }] },
      { heading: 'Football', links: [{ name: 'Boots', href: '/collections/football-boots' }, { name: 'Kits', href: '/collections/football-kits' }] },
      { heading: 'Training', links: [{ name: 'Gym Wear', href: '/collections/gym' }, { name: 'Running', href: '/collections/running' }] }
    ]
  },
  {
    title: 'Brand',
    columns: [
      { heading: 'playR Lines', links: [{ name: 'Limitless Performance', href: '/collections/limitless' }, { name: 'Everyday Lifestyle', href: '/collections/lifestyle' }] },
      { heading: 'Editions', links: [{ name: 'Pro Issue', href: '/collections/pro-issue' }, { name: 'Basics', href: '/collections/basics' }] }
    ]
  },
  {
    title: 'Club',
    columns: [
      { heading: 'Official Merchandise', links: [{ name: 'Chennai Super Kings', href: '/collections/csk' }, { name: 'Mumbai Indians', href: '/collections/mi' }, { name: 'Seattle Orcas', href: '/collections/seattle-orcas' }, { name: 'UP Yoddhas', href: '/collections/up-yoddhas' }] }
    ]
  }
];

export function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center h-full gap-8 relative" onMouseLeave={() => setActiveMenu(null)}>
      {MEGA_MENU_DATA.map((item) => (
        <div key={item.title} className="h-full flex items-center" onMouseEnter={() => setActiveMenu(item.title)}>
          <button className="text-sm font-semibold tracking-wide uppercase hover:text-[#867b5d] transition-colors py-6 relative">
            {item.title}
            {activeMenu === item.title && (
              <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#867b5d]" />
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
