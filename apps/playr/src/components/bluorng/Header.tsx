'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import StoryViewer from './StoryViewer';
import LoginModal from '@/components/auth/LoginModal';
import { stories, products } from '@/lib/bluorng-data';

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

const menuData = {
  category: {
    apparels: ['Bottomwear', 'Suit', 'Topwear', 'Innerwear'],
    equipment: ['Paddle', 'Band', 'Bag', 'Ball', 'Bat', 'Gloves', 'Guard', 'Yoga Mat', 'Swimming Goggles', 'Swimming caps', 'Swimming Accessories'],
    accessories: ['Bag', 'Cushion', 'Drinkware', 'Headwear', 'Socks'],
  },
  sports: {
    popular: ['Cricket', 'Running & Training', 'Cycling', 'Football', 'Pickleball', 'Swimming'],
    court: ['Badminton', 'Tennis', 'Volleyball', 'Squash', 'Basketball'],
    fitness: ['Fitness Gym & Yoga', 'Outdoor & Adventure', 'Golf', 'Baseball'],
    lifestyle: ['Lifestyle After Sports', 'Kabaddi', 'Home & Office'],
  },
  brand: {
    official: ['playR', 'playR Official Merchandise', 'New Arrivals'],
    ipl: ['playR x Chennai Super Kings', 'playR x Sunrisers Hyderabad', 'playR x Lucknow Super Giants'],
    otherLeagues: ['playR x UP Yoddhas', 'playR X Seattle Orcas'],
  },
  club: {
    ipl: ['Chennai Super Kings', 'Sunrisers Hyderabad', 'Lucknow Super Giants'],
    other: ['UP Yoddhas', 'Seattle Orcas'],
  },
};

type MenuTab = 'category' | 'sports' | 'brand' | 'club';

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MenuTab>('category');
  const [storyOpen, setStoryOpen] = useState(false);
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

  const solid = pathname !== '/' || scrolled || megaOpen || searchOpen;

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
    } else {
      setTheme('light');
      document.body.classList.remove('theme-dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('playr-theme', 'dark');
      document.body.classList.add('theme-dark');
    } else {
      setTheme('light');
      localStorage.setItem('playr-theme', 'light');
      document.body.classList.remove('theme-dark');
    }
  };

  useEffect(() => {
    document.body.classList.toggle('hdr-solid', solid);
  }, [solid]);

  const openTab = (tab: MenuTab) => {
    setActiveTab(tab);
    setMegaOpen(true);
  };

  return (
    <>
      <header className={`header ${solid ? 'header--solid' : ''}`} onMouseLeave={() => setMegaOpen(false)}>
        <div className="header__inner">
          <nav className="header__nav header__nav--desktop">
            <button 
              className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${activeTab === 'category' && megaOpen ? 'opacity-100 font-extrabold' : ''}`} 
              onMouseEnter={() => openTab('category')} 
              onClick={() => openTab('category')}
            >
              <span>Category</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${activeTab === 'category' && megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button 
              className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${activeTab === 'sports' && megaOpen ? 'opacity-100 font-extrabold' : ''}`} 
              onMouseEnter={() => openTab('sports')} 
              onClick={() => openTab('sports')}
            >
              <span>Sports</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${activeTab === 'sports' && megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button 
              className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${activeTab === 'brand' && megaOpen ? 'opacity-100 font-extrabold' : ''}`} 
              onMouseEnter={() => openTab('brand')} 
              onClick={() => openTab('brand')}
            >
              <span>Brand</span>
              <svg className={`w-3 h-3 transition-transform duration-200 ${activeTab === 'brand' && megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Club Nav Button with Dedicated Popover Dropdown */}
            <div className="relative" onMouseEnter={() => openTab('club')}>
              <button 
                className={`header__link uppercase font-bold tracking-wider flex items-center gap-1.5 ${activeTab === 'club' && megaOpen ? 'opacity-100 font-extrabold' : ''}`} 
                onClick={() => openTab('club')}
              >
                <span>Club</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${activeTab === 'club' && megaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Popover Dropdown under CLUB */}
              {activeTab === 'club' && megaOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-[#1c1a16] text-[#1c1a16] dark:text-[#f4f4f4] shadow-xl border border-black/10 dark:border-white/10 rounded-sm py-2 z-50"
                >
                  <Link 
                    href="/earn-points" 
                    className="block px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setMegaOpen(false)}
                  >
                    Player Club
                  </Link>
                  
                  {/* LET'S PLAY Item with Right Submenu */}
                  <div className="group/sub relative">
                    <div 
                      className="flex items-center justify-between w-full px-5 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <span>LET'S PLAY</span>
                      <svg className="w-3 h-3 transition-transform group-hover/sub:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Submenu flyout next to LET'S PLAY */}
                    <div 
                      className="hidden group-hover/sub:block absolute left-full top-0 ml-0.5 w-52 bg-white dark:bg-[#1c1a16] text-[#1c1a16] dark:text-[#f4f4f4] shadow-xl border border-black/10 dark:border-white/10 rounded-sm py-2 z-50"
                    >
                      <Link 
                        href="/earn-points" 
                        className="block px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={() => setMegaOpen(false)}
                      >
                        Win Giveaways
                      </Link>
                      <Link 
                        href="/earn-points" 
                        className="block px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        onClick={() => setMegaOpen(false)}
                      >
                        Earn points
                      </Link>
                    </div>
                  </div>

                  <Link 
                    href="/offer" 
                    className="block px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setMegaOpen(false)}
                  >
                    Offer
                  </Link>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button 
              className={`header__pill-plus ${megaOpen ? 'active' : ''}`}
              onClick={() => setMegaOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              +
            </button>
            <Link href="/" className="header__logo">
              <img src="/logo.png" alt="playR" />
            </Link>
          </div>

          <div className="header__right">
            <button className="iconbtn iconbtn--story" onClick={() => setStoryOpen(true)} aria-label="Stories">
              <img src={stories[0].image} alt="" />
            </button>
            <Link href="/collections/seattle-orcas" className="iconbtn" aria-label="Stores">
              {Icon.pin}
            </Link>
            <button 
              className={`iconbtn ${searchOpen ? 'active' : ''}`} 
              onClick={() => {
                setSearchOpen((v) => !v);
                setMegaOpen(false);
                setSearchQuery('');
              }} 
              aria-label="Search"
            >
              {Icon.search}
            </button>
            <button className="iconbtn" onClick={() => setLoginOpen(true)} aria-label="Account">
              {Icon.user}
            </button>
            <Link href="/wishlist" className="iconbtn relative" aria-label="Wishlist">
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
            <button className="iconbtn iconbtn--menu" onClick={() => setMegaOpen((v) => !v)} aria-label="Menu">
              {Icon.menu}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="header__search-bar">
            <div className="header__search-input-wrap">
              <input
                type="text"
                placeholder="Search here....."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                className="header__search-close" 
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                ×
              </button>
            </div>
            {searchQuery && (
              <div className="header__search-results">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <Link
                      key={p.handle}
                      href={`/products/${p.handle}`}
                      className="header__search-item"
                      onClick={() => setSearchOpen(false)}
                    >
                      <img src={p.images[0]} alt={p.title} />
                      <div>
                        <span className="title">{p.title}</span>
                        <span className="price">₹{p.price}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="header__search-empty">No products found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Original Sleek Mega Menu Panel (For Category, Sports, Brand) */}
        <div className={`mega ${megaOpen && activeTab !== 'club' ? 'open' : ''}`}>
          {activeTab === 'category' && (
            <>
              <div>
                <h4>Apparels</h4>
                {menuData.category.apparels.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>Equipment</h4>
                {menuData.category.equipment.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>Accessories</h4>
                {menuData.category.accessories.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>Shop All</h4>
                <Link href="/collections/all-products" onClick={() => setMegaOpen(false)}>All Products</Link>
                <Link href="/collections/new-in" onClick={() => setMegaOpen(false)}>New In</Link>
              </div>
            </>
          )}

          {activeTab === 'sports' && (
            <>
              <div>
                <h4>Popular Sports</h4>
                {menuData.sports.popular.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>Court &amp; Racket</h4>
                {menuData.sports.court.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>Fitness &amp; Outdoor</h4>
                {menuData.sports.fitness.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>Lifestyle</h4>
                {menuData.sports.lifestyle.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
            </>
          )}

          {activeTab === 'brand' && (
            <>
              <div>
                <h4>Official Brand</h4>
                {menuData.brand.official.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>IPL Collaborations</h4>
                {menuData.brand.ipl.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
              <div>
                <h4>Other Leagues</h4>
                {menuData.brand.otherLeagues.map((item) => (
                  <Link key={item} href={`/collections/${slugify(item)}`} onClick={() => setMegaOpen(false)}>
                    {item}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {storyOpen && <StoryViewer onClose={() => setStoryOpen(false)} />}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
