'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import LoginModal from '@/components/auth/LoginModal';
import StoryViewer from './StoryViewer';
import { products } from '@/lib/bluorng-data';

const Icon = {
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z" />
    </svg>
  ),
  bag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 8h14l-1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H8a1.8 1.8 0 0 1-1.8-1.8L5 8Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 8h16M4 16h16" />
    </svg>
  ),
};

const ThemeIcon = {
  sun: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  ),
};

function CornerCutouts({ className }: { className: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="corner corner--left">
        <path d="M 0 0 L 24 0 A 24 24 0 0 0 0 24 Z" />
      </svg>
      <svg viewBox="0 0 24 24" className="corner corner--right">
        <path d="M 0 0 L 24 0 A 24 24 0 0 0 0 24 Z" />
      </svg>
    </div>
  );
}

const menuData = {
  category: {
    apparel: {
      title: 'Apparel',
      href: '/collections/apparel',
      groups: [
        {
          title: 'Topwear',
          href: '/collections/topwear',
          items: [
            { name: 'T-Shirts & Tees', href: '/collections/t-shirt-tee' },
            { name: 'Polo T-Shirts', href: '/collections/t-shirt-polo' },
            { name: 'Jerseys', href: '/collections/jersey' },
            { name: 'Hoodies', href: '/collections/hoodie' },
            { name: 'Jackets', href: '/collections/jacket' },
            { name: 'Singlets', href: '/collections/singlet' },
          ],
        },
        {
          title: 'Bottomwear',
          href: '/collections/bottomwear',
          items: [
            { name: 'Joggers', href: '/collections/jogger' },
            { name: 'Shorts', href: '/collections/shorts' },
            { name: 'Pants', href: '/collections/pants' },
          ],
        },
        {
          title: 'Suit',
          href: '/collections/suit',
          items: [
            { name: 'Track Sets', href: '/collections/track-set' },
          ],
        },
        {
          title: 'Innerwear',
          href: '/collections/innerwear',
          items: [
            { name: 'Skin Pants', href: '/collections/skin-pants' },
            { name: 'Skin Shorts', href: '/collections/skin-shorts' },
            { name: 'Skin Singlets', href: '/collections/skin-singlet' },
            { name: 'Skin Tees', href: '/collections/skin-tee' },
          ],
        },
      ],
    },
    equipment: {
      title: 'Equipment',
      href: '/collections/equipment',
      groups: [
        {
          title: 'Bats',
          href: '/collections/bat',
          items: [
            { name: 'English Willow', href: '/collections/english-willow' },
            { name: 'Kashmir Willow', href: '/collections/kashmir-willow' },
            { name: 'Popular Willow', href: '/collections/popular-willow' },
          ],
        },
        {
          title: 'Balls',
          href: '/collections/ball',
          items: [
            { name: 'Leather Balls', href: '/collections/leather-ball' },
            { name: 'Tennis Balls', href: '/collections/tennis-ball' },
          ],
        },
        {
          title: 'Paddle & Raquets',
          href: '/collections/paddle-raquet',
          items: [
            { name: 'Carbon Fiber', href: '/collections/carbon-fiber' },
            { name: 'Glass Fiber', href: '/collections/glass-fiber' },
          ],
        },
        {
          title: 'Gear & Protection',
          href: '/collections/guard',
          items: [
            { name: 'Gloves', href: '/collections/gloves' },
            { name: 'Guards', href: '/collections/guard' },
            { name: 'Kitbags', href: '/collections/kitbag' },
            { name: 'Resistance Bands', href: '/collections/band' },
            { name: 'Yoga Mats', href: '/collections/yoga-mat' },
            { name: 'Eyewear & Goggles', href: '/collections/goggles' },
            { name: 'Caps & Headwear', href: '/collections/caps' },
            { name: 'Sets & Combos', href: '/collections/combo' },
          ],
        },
      ],
    },
    accessories: {
      title: 'Accessories',
      href: '/collections/accessories',
      groups: [
        {
          title: 'Bags',
          href: '/collections/bag',
          items: [
            { name: 'Sling Bags', href: '/collections/sling' },
            { name: 'Backpacks', href: '/collections/backpack' },
            { name: 'Gym Bags', href: '/collections/gym' },
            { name: 'Trolley Bags', href: '/collections/trolley' },
          ],
        },
        {
          title: 'Headwear',
          href: '/collections/headwear',
          items: [
            { name: 'Caps', href: '/collections/caps' },
            { name: 'Hats', href: '/collections/hat' },
          ],
        },
        {
          title: 'Drinkware',
          href: '/collections/drinkware',
          items: [
            { name: 'Mugs', href: '/collections/mug' },
            { name: 'Sippers', href: '/collections/sipper' },
            { name: 'Shakers', href: '/collections/shaker' },
          ],
        },
        {
          title: 'Socks & Comfort',
          href: '/collections/socks',
          items: [
            { name: 'Crew Socks', href: '/collections/crew-socks' },
            { name: 'Ankle Socks', href: '/collections/ankle-socks' },
            { name: 'Back Cushions', href: '/collections/cushion' },
            { name: 'Bath Set Towels', href: '/collections/towel' },
          ],
        },
      ],
    },
    genderAge: {
      title: 'Gender & Age',
      gender: [
        { name: 'Men', href: '/collections/men' },
        { name: 'Women', href: '/collections/women' },
        { name: 'Unisex', href: '/collections/unisex' },
        { name: 'Boys', href: '/collections/boys' },
        { name: 'Girls', href: '/collections/girls' },
      ],
      age: [
        { name: 'Adult', href: '/collections/adult' },
        { name: 'Kids', href: '/collections/kids' },
        { name: 'Ageless', href: '/collections/all-products' },
      ],
    },
  },
  sports: {
    popular: [
      { name: 'Cricket', href: '/collections/cricket' },
      { name: 'Running & Training', href: '/collections/running-training' },
      { name: 'Gym Fitness Yoga', href: '/collections/gym-fitness-yoga' },
      { name: 'Cycling', href: '/collections/cycling' },
    ],
    performance: [
      { name: 'Pickleball', href: '/collections/pickleball' },
      { name: 'Swimming', href: '/collections/swimming' },
      { name: 'Outdoor & Adventure', href: '/collections/outdoor-adventure' },
      { name: 'Lifestyle After Sports', href: '/collections/lifestyle-after-sports' },
    ],
    courtField: [
      { name: 'Football', href: '/collections/football' },
      { name: 'Basketball', href: '/collections/basketball' },
      { name: 'Golf', href: '/collections/golf' },
      { name: 'Kabaddi', href: '/collections/kabaddi' },
      { name: 'Home & Office', href: '/collections/home-office' },
    ],
  },
  brand: {
    official: [
      { name: 'playR', href: '/collections/playr' },
      { name: 'playR STREET', href: '/collections/playr-street' },
      { name: 'All Official Lines', href: '/collections/all-products' },
    ],
    ipl: [
      { name: 'playR x Chennai Super Kings', href: '/collections/chennai-super-kings' },
      { name: 'playR x Lucknow Super Giants', href: '/collections/lucknow-super-giants' },
      { name: 'playR x Sunrisers Hyderabad', href: '/collections/sunrisers-hyderabad' },
    ],
    otherLeagues: [
      { name: 'playR x Seattle Orcas', href: '/collections/seattle-orcas' },
      { name: 'playR x UP Yoddha', href: '/collections/up-yoddha' },
    ],
  },
  club: {
    ipl: [
      'Chennai Super Kings',
      'Mumbai Indians',
      'Rajasthan Royals',
      'Punjab Kings',
      'Kolkata Knight Riders',
      'Gujarat Titans',
      'Lucknow Super Giants',
      'Sunrisers Hyderabad',
    ],
    other: ['UP Yoddhas', 'Seattle Orcas'],
  },
};

type MenuTab = 'category' | 'sports' | 'brand' | 'club';

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MenuTab>('category');
  const [clubOpen, setClubOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useCart();
  const pathname = usePathname();

  const slugify = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.type && p.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const solid = pathname !== '/' || scrolled || megaOpen || clubOpen || searchOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('playr-theme') as 'light' | 'dark' | null;
    if (saved === 'dark') {
      setTheme('dark');
      document.body.classList.add('theme-dark');
      document.documentElement.classList.add('theme-dark', 'dark');
    } else {
      setTheme('light');
      document.body.classList.remove('theme-dark');
      document.documentElement.classList.remove('theme-dark', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('playr-theme', 'dark');
      document.body.classList.add('theme-dark');
      document.documentElement.classList.add('theme-dark', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('playr-theme', 'light');
      document.body.classList.remove('theme-dark');
      document.documentElement.classList.remove('theme-dark', 'dark');
    }
  };

  useEffect(() => {
    document.body.classList.toggle('hdr-solid', solid);
  }, [solid]);

  const [storyOpen, setStoryOpen] = useState(false);

  const openTab = (tab: MenuTab, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setClubOpen(false);
    setActiveTab(tab);
    setMegaOpen(true);
  };

  const toggleClub = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMegaOpen(false);
    setClubOpen((prev) => !prev);
  };

  return (
    <>
      <header 
        className={`header ${scrolled ? 'header--scrolled' : ''} ${solid ? 'header--solid' : ''}`} 
        onMouseLeave={() => { 
          if (typeof window !== 'undefined' && window.innerWidth < 768) return;
          setMegaOpen(false); 
          setClubOpen(false); 
        }}
      >
        <div className="header__inner">
          <nav className="header__nav header__nav--desktop">
            <button 
              className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${activeTab === 'category' && megaOpen ? 'opacity-100 font-extrabold' : ''}`} 
              onMouseEnter={(e) => openTab('category', e)} 
              onClick={(e) => openTab('category', e)}
            >
              <span>Category</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${activeTab === 'category' && megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button 
              className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${activeTab === 'sports' && megaOpen ? 'opacity-100 font-extrabold' : ''}`} 
              onMouseEnter={(e) => openTab('sports', e)} 
              onClick={(e) => openTab('sports', e)}
            >
              <span>Sports</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${activeTab === 'sports' && megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button 
              className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${activeTab === 'brand' && megaOpen ? 'opacity-100 font-extrabold' : ''}`} 
              onMouseEnter={(e) => openTab('brand', e)} 
              onClick={(e) => openTab('brand', e)}
            >
              <span>Brand</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${activeTab === 'brand' && megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Club Nav Button with Dedicated Popover Dropdown */}
            <div className="relative">
              <button 
                type="button"
                className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${clubOpen ? 'opacity-100 font-extrabold' : ''}`} 
                onClick={(e) => toggleClub(e)}
                onMouseEnter={() => { setMegaOpen(false); setClubOpen(true); }}
              >
                <span>Club</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${clubOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Popover Dropdown under CLUB: Offers > Lets PlayR > Power players */}
              {clubOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1c1a16] text-[#1c1a16] dark:text-[#f4f4f4] shadow-xl border border-black/10 dark:border-white/10 rounded-xl py-2 z-50 backdrop-blur-md"
                  onMouseLeave={() => setClubOpen(false)}
                >
                  {/* 1. Offers */}
                  <Link 
                    href="/offers" 
                    className="block px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between"
                    onClick={() => { setClubOpen(false); setMegaOpen(false); }}
                  >
                    <span>Offers</span>
                    <span className="text-[10px] bg-red-500/10 text-red-600 font-extrabold px-1.5 py-0.5 rounded">HOT</span>
                  </Link>

                  {/* 2. Lets PlayR Item with Submenu */}
                  <div className="group/sub relative">
                    <div 
                      className="flex items-center justify-between w-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <span>Lets PlayR</span>
                      <svg className="w-3 h-3 transition-transform group-hover/sub:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Submenu flyout next to Lets PlayR */}
                    <div 
                      className="hidden group-hover/sub:block absolute left-full top-0 ml-0.5 w-52 bg-white dark:bg-[#1c1a16] text-[#1c1a16] dark:text-[#f4f4f4] shadow-xl border border-black/10 dark:border-white/10 rounded-xl py-2 z-50"
                    >
                      <Link 
                        href="/earn-points" 
                        className="block px-5 py-2 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={() => { setClubOpen(false); setMegaOpen(false); }}
                      >
                        Player Club Overview
                      </Link>
                      <Link 
                        href="/earn-points" 
                        className="block px-5 py-2 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={() => { setClubOpen(false); setMegaOpen(false); }}
                      >
                        Win Giveaways
                      </Link>
                      <Link 
                        href="/earn-points" 
                        className="block px-5 py-2 text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={() => { setClubOpen(false); setMegaOpen(false); }}
                      >
                        Earn Points
                      </Link>
                    </div>
                  </div>

                  {/* 3. Power players */}
                  <Link 
                    href="/leaderboard" 
                    className="block px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between"
                    onClick={() => { setClubOpen(false); setMegaOpen(false); }}
                  >
                    <span>Power players</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 font-extrabold px-1.5 py-0.5 rounded">XP</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="header__center">
            {/* The + on Desktop removed per client request */}
            <Link href="/" className="header__logo flex-shrink-0" style={{ maxWidth: '180px' }}>
              <img 
                src="/logo.png" 
                alt="playR" 
                className="h-[34px] sm:h-[38px] md:h-[42px] w-auto object-contain flex-shrink-0 transition-transform duration-200 hover:scale-105"
              />
            </Link>
          </div>

          <div className="header__right">
            <button
              type="button"
              className="iconbtn iconbtn--story iconbtn--desktop-only"
              aria-label="Open lookbook stories"
              onClick={(e) => {
                e.stopPropagation();
                setMegaOpen(false);
                setClubOpen(false);
                setStoryOpen(true);
              }}
            >
              <img src="/lookbook/artboard-1.jpg" alt="" />
            </button>
            {/* Location Button removed per client request */}
            <button 
              className={`iconbtn ${searchOpen ? 'active' : ''}`} 
              onClick={() => {
                setSearchOpen((v) => !v);
                setMegaOpen(false);
                setClubOpen(false);
                setSearchQuery('');
              }} 
              aria-label="Search"
            >
              {Icon.search}
            </button>
            <button className="iconbtn iconbtn--desktop-only" onClick={() => setLoginOpen(true)} aria-label="Account">
              {Icon.user}
            </button>
            <Link href="/wishlist" className="iconbtn relative iconbtn--desktop-only" aria-label="Wishlist">
              {Icon.bookmark}
              {cart.wishlistCount > 0 && <span className="iconbtn__count">{cart.wishlistCount}</span>}
            </Link>
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              <span className="theme-toggle__thumb">
                {theme === 'light' ? ThemeIcon.sun : ThemeIcon.moon}
              </span>
            </button>
            <button className="iconbtn" onClick={() => cart.setOpen(true)} aria-label="Bag">
              {Icon.bag}
              {cart.count > 0 && <span className="iconbtn__count">{cart.count}</span>}
            </button>
            {/* Hamburger menu strictly hidden on desktop (md:hidden) */}
            <button className="iconbtn iconbtn--menu md:hidden" onClick={() => { setMegaOpen((v) => !v); setClubOpen(false); }} aria-label="Menu">
              {Icon.menu}
            </button>
          </div>
        </div>

        {/* Side Screen Search Drawer (Replaces Full-Screen Search Bar) */}
        {searchOpen && (
          <div className="fixed inset-0 z-[200]">
            {/* Backdrop Scrim */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSearchOpen(false)}
            />

            {/* Slide-over Right Side Panel */}
            <div
              className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--panel)] shadow-2xl border-l border-[var(--line)] flex flex-col z-[201] animate-in slide-in-from-right duration-300"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[var(--line)] flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold uppercase tracking-wider text-base text-[var(--fg)]">
                    Search Store
                  </h3>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">
                    Search official jerseys, equipment, &amp; collections
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--chip)] text-[var(--fg)] text-lg font-bold hover:bg-[var(--line)] transition-colors cursor-pointer"
                  aria-label="Close search"
                >
                  ✕
                </button>
              </div>

              {/* Search Input Field */}
              <div className="p-6 border-b border-[var(--line)] bg-[var(--chip)]">
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[var(--muted)] pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" strokeWidth="2" />
                      <path d="m20 20-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="header-side-search-input"
                    name="q"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search jerseys, bats, caps, teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-3 text-xs font-semibold rounded-xl bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--fg)]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-xs font-bold text-[var(--muted)] hover:text-[var(--fg)]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Popular Search Suggestions */}
                {!searchQuery && (
                  <div className="mt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] block mb-2">
                      Popular Searches
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['CSK Jersey', 'Mumbai Indians', 'Bat', 'Cap', 'Rajasthan Royals'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSearchQuery(s)}
                          className="px-3 py-1 rounded-full text-xs bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] hover:border-[var(--fg)] transition-colors cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {searchQuery ? (
                  filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <Link
                        key={p.handle}
                        href={`/products/${p.handle}`}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--chip)] border border-transparent hover:border-[var(--line)] transition-all group"
                        onClick={() => setSearchOpen(false)}
                      >
                        <div className="w-16 h-16 rounded-lg bg-[var(--chip)] overflow-hidden shrink-0 border border-[var(--line)]">
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[var(--fg)] uppercase tracking-tight truncate group-hover:text-primary">
                            {p.title}
                          </h4>
                          <p className="text-[11px] text-[var(--muted)] mt-0.5">{p.type || 'Equipment'}</p>
                          <span className="text-xs font-black text-red-600 dark:text-red-500 font-mono mt-1 block">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-12 text-center text-xs text-[var(--muted)]">
                      No products found matching &quot;{searchQuery}&quot;
                    </div>
                  )
                ) : (
                  <div className="py-8 text-center text-[11px] text-[var(--muted)]">
                    Type a query above to see instant search results.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Original Sleek Mega Menu Panel with Responsive Mobile Drawer Support */}
        <div className={`mega ${megaOpen ? 'open' : ''}`}>
          {/* Mobile-Only Drawer Header */}
          <div className="mega__mobile-header md:hidden flex items-center justify-between pb-3 mb-3 border-b border-[var(--line)]">
            <span className="font-extrabold uppercase tracking-wider text-base text-[var(--fg)]">Navigation Menu</span>
            <button
              type="button"
              onClick={() => setMegaOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--chip)] text-[var(--fg)] text-lg font-bold hover:bg-[var(--line)] transition-colors"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Mobile-Only Tab Switcher */}
          <div className="mega__mobile-tabs md:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 scrollbar-none">
            {(['category', 'sports', 'brand', 'club'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[var(--fg)] text-[var(--panel)]'
                    : 'bg-[var(--chip)] text-[var(--fg)] hover:bg-[var(--line)]'
                }`}
              >
                {tab}
              </button>
            ))}
            <Link
              href="/b2b"
              onClick={() => setMegaOpen(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            >
              B2B
            </Link>
          </div>

          <div className="mega__content-inner">
            {activeTab === 'category' && (
              <>
                {/* 1. APPAREL */}
                <div className="mega__column">
                  <div className="flex items-center justify-between mb-3 border-b border-[var(--line)] pb-1.5">
                    <Link
                      href={menuData.category.apparel.href}
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-black uppercase tracking-wider text-[var(--fg)] hover:opacity-75 !p-0"
                    >
                      {menuData.category.apparel.title}
                    </Link>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Apparel
                    </span>
                  </div>
                  <div className="space-y-3">
                    {menuData.category.apparel.groups.map((group) => (
                      <div key={group.title}>
                        <Link
                          href={group.href}
                          onClick={() => setMegaOpen(false)}
                          className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider !p-0 block hover:text-[var(--fg)] mb-1"
                        >
                          {group.title}
                        </Link>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMegaOpen(false)}
                              className="text-[12px] sm:text-[13px] !py-0.5 text-[var(--fg)]/80 hover:text-[var(--fg)] truncate"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. EQUIPMENT */}
                <div className="mega__column">
                  <div className="flex items-center justify-between mb-3 border-b border-[var(--line)] pb-1.5">
                    <Link
                      href={menuData.category.equipment.href}
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-black uppercase tracking-wider text-[var(--fg)] hover:opacity-75 !p-0"
                    >
                      {menuData.category.equipment.title}
                    </Link>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Equipment
                    </span>
                  </div>
                  <div className="space-y-3">
                    {menuData.category.equipment.groups.map((group) => (
                      <div key={group.title}>
                        <Link
                          href={group.href}
                          onClick={() => setMegaOpen(false)}
                          className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider !p-0 block hover:text-[var(--fg)] mb-1"
                        >
                          {group.title}
                        </Link>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMegaOpen(false)}
                              className="text-[12px] sm:text-[13px] !py-0.5 text-[var(--fg)]/80 hover:text-[var(--fg)] truncate"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ACCESSORIES */}
                <div className="mega__column">
                  <div className="flex items-center justify-between mb-3 border-b border-[var(--line)] pb-1.5">
                    <Link
                      href={menuData.category.accessories.href}
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-black uppercase tracking-wider text-[var(--fg)] hover:opacity-75 !p-0"
                    >
                      {menuData.category.accessories.title}
                    </Link>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Accessories
                    </span>
                  </div>
                  <div className="space-y-3">
                    {menuData.category.accessories.groups.map((group) => (
                      <div key={group.title}>
                        <Link
                          href={group.href}
                          onClick={() => setMegaOpen(false)}
                          className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider !p-0 block hover:text-[var(--fg)] mb-1"
                        >
                          {group.title}
                        </Link>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMegaOpen(false)}
                              className="text-[12px] sm:text-[13px] !py-0.5 text-[var(--fg)]/80 hover:text-[var(--fg)] truncate"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. GENDER & AGE */}
                <div className="mega__column">
                  <div className="flex items-center justify-between mb-3 border-b border-[var(--line)] pb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--fg)]">
                      {menuData.category.genderAge.title}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      All Fits
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider !p-0 block mb-1">
                        Gender
                      </span>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {menuData.category.genderAge.gender.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMegaOpen(false)}
                            className="text-[12px] sm:text-[13px] !py-0.5 text-[var(--fg)]/80 hover:text-[var(--fg)]"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider !p-0 block mb-1">
                        Age
                      </span>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                        {menuData.category.genderAge.age.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMegaOpen(false)}
                            className="text-[12px] sm:text-[13px] !py-0.5 text-[var(--fg)]/80 hover:text-[var(--fg)]"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[var(--line)]">
                      <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider !p-0 block mb-1">
                        Quick Explore
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href="/collections/all-products"
                          onClick={() => setMegaOpen(false)}
                          className="text-[13px] !py-1 font-semibold text-[var(--fg)] hover:opacity-75"
                        >
                          All Products
                        </Link>
                        <Link
                          href="/collections/new-in"
                          onClick={() => setMegaOpen(false)}
                          className="text-[13px] !py-1 font-semibold text-[var(--fg)] hover:opacity-75"
                        >
                          New In Drops
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sports' && (
              <>
                <div>
                  <h4>Popular Sports</h4>
                  {menuData.sports.popular.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}>
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4>Performance &amp; Outdoor</h4>
                  {menuData.sports.performance.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}>
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4>Field, Court &amp; Daily</h4>
                  {menuData.sports.courtField.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}>
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4>Shop All Sports</h4>
                  <Link href="/collections/all-products" onClick={() => setMegaOpen(false)}>All Gear</Link>
                  <Link href="/collections/new-in" onClick={() => setMegaOpen(false)}>Latest Drops</Link>
                </div>
              </>
            )}

            {activeTab === 'brand' && (
              <>
                <div>
                  <h4>Official Brand</h4>
                  {menuData.brand.official.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}>
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4>IPL Collaborations</h4>
                  {menuData.brand.ipl.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}>
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4>League Collaborations</h4>
                  {menuData.brand.otherLeagues.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}>
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <h4>Explore Brand</h4>
                  <Link href="/about" onClick={() => setMegaOpen(false)}>Brand Story</Link>
                  <Link href="/b2b" onClick={() => setMegaOpen(false)}>Partnerships</Link>
                </div>
              </>
            )}

            {activeTab === 'club' && (
              <>
                <div>
                  <h4>Offers</h4>
                  <Link href="/offers" onClick={() => setMegaOpen(false)}>Exclusive Offers &amp; Discounts</Link>
                  <Link href="/offers" onClick={() => setMegaOpen(false)}>Jersey Customization Bundles</Link>
                  <Link href="/offers" onClick={() => setMegaOpen(false)}>Member Free Shipping Codes</Link>
                </div>
                <div>
                  <h4>Lets PlayR</h4>
                  <Link href="/earn-points" onClick={() => setMegaOpen(false)}>Player Club Hub</Link>
                  <Link href="/earn-points" onClick={() => setMegaOpen(false)}>Win Giveaways &amp; Kits</Link>
                  <Link href="/earn-points" onClick={() => setMegaOpen(false)}>Earn XP Points</Link>
                  <Link href="/challenges" onClick={() => setMegaOpen(false)}>Daily Sports Challenges</Link>
                </div>
                <div>
                  <h4>Power players</h4>
                  <Link href="/leaderboard" onClick={() => setMegaOpen(false)}>Global Athlete Leaderboard</Link>
                  <Link href="/leaderboard" onClick={() => setMegaOpen(false)}>Elite Hall of Fame</Link>
                  <Link href="/community" onClick={() => setMegaOpen(false)}>Community Challenges</Link>
                </div>
                <div>
                  <h4>Official Franchise Clubs</h4>
                  {menuData.club.ipl.slice(0, 5).map((item) => (
                    <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                      {item}
                    </Link>
                  ))}
                  {menuData.club.other.map((item) => (
                    <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                      {item}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile-Only Drawer Footer with Quick Shortcuts */}
          <div className="mega__mobile-footer md:hidden mt-auto pt-4 border-t border-[var(--line)] grid grid-cols-2 gap-2 text-center">
            <Link
              href="/b2b"
              onClick={() => setMegaOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-[var(--chip)] text-xs font-bold uppercase tracking-wider text-[var(--fg)] border border-[var(--line)]"
            >
              B2B Desk
            </Link>
            <Link
              href="/collections/seattle-orcas"
              onClick={() => setMegaOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-[var(--chip)] text-xs font-bold uppercase tracking-wider text-[var(--fg)] border border-[var(--line)]"
            >
              Stores
            </Link>
            <button
              type="button"
              onClick={() => { setMegaOpen(false); setLoginOpen(true); }}
              className="py-2.5 px-3 rounded-lg bg-[var(--chip)] text-xs font-bold uppercase tracking-wider text-[var(--fg)] border border-[var(--line)]"
            >
              Account
            </button>
            <Link
              href="/wishlist"
              onClick={() => setMegaOpen(false)}
              className="py-2.5 px-3 rounded-lg bg-[var(--chip)] text-xs font-bold uppercase tracking-wider text-[var(--fg)] border border-[var(--line)]"
            >
              Wishlist {cart.wishlistCount > 0 && `(${cart.wishlistCount})`}
            </Link>
          </div>

          <CornerCutouts className="mega__corners hidden md:block" />
        </div>
        <CornerCutouts className="header__corners" />
      </header>

      {storyOpen && <StoryViewer onClose={() => setStoryOpen(false)} />}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
