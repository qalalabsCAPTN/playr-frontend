'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SubCategory {
  title: string;
  items: string[];
}

const CATEGORY_DATA: SubCategory[] = [
  {
    title: 'Apparels',
    items: ['Topwear', 'Bottomwear', 'Suit', 'Innerwear'],
  },
  {
    title: 'Equipment',
    items: [
      'Bat',
      'Ball',
      'Bag',
      'Band',
      'Gloves',
      'Guard',
      'Yoga Mat',
      'Eyewear',
      'Paddle Raquet',
      'Set',
    ],
  },
  {
    title: 'Accessories',
    items: ['Bag', 'Headwear', 'Drinkware', 'Socks', 'Cushion', 'Towel'],
  },
];

const SPORTS_DATA = [
  'Cricket',
  'Running & Training',
  'Gym Fitness Yoga',
  'Lifestyle After Sports',
  'Pickleball',
  'Swimming',
  'Outdoor & Adventure',
  'Cycling',
  'Football',
  'Basketball',
  'Golf',
  'Kabaddi',
  'Home & Office',
];

const BRAND_DATA = [
  'playR',
  'playR STREET',
  'playR x Chennai Super Kings',
  'playR x Lucknow Super Giants',
  'playR x Seattle Orcas',
  'playR x Sunrisers Hyderabad',
  'playR x UP Yoddha',
];

const CLUB_DATA = [
  'Chennai Super Kings',
  'Sunrisers Hyderabad',
  'Lucknow Super Giants',
  'UP Yoddhas',
  'Seattle Orcas',
];

function ChevronDown() {
  return (
    <svg className="w-3.5 h-3.5 inline-block ml-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg className="w-3.5 h-3.5 inline-block ml-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export default function DropdownNav() {
  const [activeMenu, setActiveMenu] = useState<'CATEGORY' | 'SPORTS' | 'BRAND' | 'CLUB' | null>(null);
  const [activeCategorySub, setActiveCategorySub] = useState<string>('Apparels');

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <nav className="header__nav header__nav--desktop flex items-center gap-4 text-xs md:text-sm font-bold tracking-wider relative">
      {/* 1. CATEGORY */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveMenu('CATEGORY')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button 
          className={`flex items-center px-3 py-2 border uppercase font-extrabold transition-colors ${
            activeMenu === 'CATEGORY' 
              ? 'border-neutral-900 bg-white text-neutral-900' 
              : 'border-transparent text-current hover:text-neutral-900'
          }`}
        >
          CATEGORY {activeMenu === 'CATEGORY' ? <ChevronUp /> : <ChevronDown />}
        </button>

        {activeMenu === 'CATEGORY' && (
          <div className="absolute left-0 top-full mt-0 flex z-50 shadow-2xl">
            {/* Level 1 Menu */}
            <div className="w-48 bg-white border border-neutral-300 text-neutral-900 py-3 shadow-md">
              {CATEGORY_DATA.map((sub) => {
                const isOpen = activeCategorySub === sub.title;
                return (
                  <div
                    key={sub.title}
                    onMouseEnter={() => setActiveCategorySub(sub.title)}
                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-xs font-semibold hover:bg-neutral-100 ${
                      isOpen ? 'bg-neutral-50 text-black font-bold' : 'text-neutral-700'
                    }`}
                  >
                    <span>{sub.title}</span>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                );
              })}
            </div>

            {/* Level 2 Sub-Menu Flyout */}
            {activeCategorySub && (
              <div className="w-56 bg-white border border-neutral-300 border-l-0 text-neutral-900 py-3 shadow-md max-h-[420px] overflow-y-auto">
                {CATEGORY_DATA.find((s) => s.title === activeCategorySub)?.items.map((item) => (
                  <Link
                    key={item}
                    href={`/collections/${slugify(item)}`}
                    className="block px-5 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. SPORTS */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveMenu('SPORTS')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button 
          className={`flex items-center px-3 py-2 border uppercase font-extrabold transition-colors ${
            activeMenu === 'SPORTS' 
              ? 'border-neutral-900 bg-white text-neutral-900' 
              : 'border-transparent text-current hover:text-neutral-900'
          }`}
        >
          SPORTS {activeMenu === 'SPORTS' ? <ChevronUp /> : <ChevronDown />}
        </button>

        {activeMenu === 'SPORTS' && (
          <div className="absolute left-0 top-full mt-0 w-64 bg-white border border-neutral-300 text-neutral-900 py-3 shadow-2xl z-50 max-h-[440px] overflow-y-auto">
            {SPORTS_DATA.map((sport) => (
              <Link
                key={sport}
                href={`/collections/${slugify(sport)}`}
                className="block px-5 py-2 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                {sport}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. BRAND */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveMenu('BRAND')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button 
          className={`flex items-center px-3 py-2 border uppercase font-extrabold transition-colors ${
            activeMenu === 'BRAND' 
              ? 'border-neutral-900 bg-white text-neutral-900' 
              : 'border-transparent text-current hover:text-neutral-900'
          }`}
        >
          BRAND {activeMenu === 'BRAND' ? <ChevronUp /> : <ChevronDown />}
        </button>

        {activeMenu === 'BRAND' && (
          <div className="absolute left-0 top-full mt-0 w-64 bg-white border border-neutral-300 text-neutral-900 py-3 shadow-2xl z-50">
            {BRAND_DATA.map((brand) => (
              <Link
                key={brand}
                href={`/collections/${slugify(brand)}`}
                className="block px-5 py-2.5 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 4. CLUB */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveMenu('CLUB')}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <button 
          className={`flex items-center px-3 py-2 border uppercase font-extrabold transition-colors ${
            activeMenu === 'CLUB' 
              ? 'border-neutral-900 bg-white text-neutral-900' 
              : 'border-transparent text-current hover:text-neutral-900'
          }`}
        >
          CLUB {activeMenu === 'CLUB' ? <ChevronUp /> : <ChevronDown />}
        </button>

        {activeMenu === 'CLUB' && (
          <div className="absolute left-0 top-full mt-0 w-64 bg-white border border-neutral-300 text-neutral-900 py-3 shadow-2xl z-50">
            {CLUB_DATA.map((club) => (
              <Link
                key={club}
                href={`/collections/${slugify(club)}`}
                className="block px-5 py-2.5 text-xs font-medium text-neutral-700 hover:text-black hover:bg-neutral-100 transition-colors"
              >
                {club}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
