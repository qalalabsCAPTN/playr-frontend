'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import StoryViewer from './StoryViewer';
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
      <path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V22l-6-4-6 4V3.5Z" />
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

const menu = {
  featured: [
    { label: 'Latest Drop', href: '/collections/new-in' },
    { label: 'Caps & Headwear', href: '/collections/caps' },
    { label: 'Swimming', href: '/collections/swimming' },
    { label: 'Seattle Orcas', href: '/collections/seattle-orcas' },
    { label: 'Kids', href: '/collections/kids' },
  ],
  headwear: [
    { label: 'Mesh Caps', href: '/collections/caps' },
    { label: 'Match Caps', href: '/collections/seattle-orcas' },
    { label: 'Bucket Hats', href: '/collections/caps' },
  ],
  swim: [
    { label: 'Goggles', href: '/collections/goggles' },
    { label: 'Swim Caps', href: '/collections/swim-caps' },
    { label: 'Kids Swim', href: '/collections/kids' },
  ],
  shop: [
    { label: 'All Products', href: '/collections/all-products' },
    { label: 'New In', href: '/collections/new-in' },
  ],
};

export default function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useCart();
  const pathname = usePathname();

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

  useEffect(() => {
    document.body.classList.toggle('hdr-solid', solid);
  }, [solid]);

  return (
    <>
      <header className={`header ${solid ? 'header--solid' : ''}`} onMouseLeave={() => setMegaOpen(false)}>
        <div className="header__inner">
          <nav className="header__nav header__nav--desktop">
            <Link href="/collections/new-in" className="header__link">
              New in
            </Link>
            <button className="header__link" onMouseEnter={() => setMegaOpen(true)} onClick={() => setMegaOpen((v) => !v)}>
              Collections
            </button>
          </nav>

          <Link href="/" className="header__logo">
            <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: '0.05em', color: solid ? '#000' : '#fff' }}>
              play<span style={{ color: '#e63946' }}>R</span>
            </span>
          </Link>

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
            <Link href="/account" className="iconbtn" aria-label="Account">
              {Icon.user}
            </Link>
            <Link href="/wishlist" className="iconbtn" aria-label="Wishlist">
              {Icon.bookmark}
            </Link>
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
              <span className="header__search-icon-inside">{Icon.search}</span>
            </div>
            <button className="header__search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
              &times;
            </button>
          </div>
        )}

        {searchOpen && (
          <div className="header__search-dropdown">
            {searchQuery.trim() === '' ? (
              <div className="header__search-results-inner">
                <div className="header__search-title">Collections</div>
                <div className="header__search-list">
                  <Link href="/collections/new-in" className="header__search-item" onClick={() => setSearchOpen(false)}>
                    <img src="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard1_db8669c2-f8f1-4854-99a3-3b6342fbe6d7.jpg?v=1782909214" alt="" />
                    <span>Latest Drop</span>
                  </Link>
                  <Link href="/collections/caps" className="header__search-item" onClick={() => setSearchOpen(false)}>
                    <img src="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard28.png?v=1782909395" alt="" />
                    <span>Caps &amp; Headwear</span>
                  </Link>
                  <Link href="/collections/swimming" className="header__search-item" onClick={() => setSearchOpen(false)}>
                    <img src="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard96.jpg?v=1782800549" alt="" />
                    <span>Swimming Gear</span>
                  </Link>
                  <Link href="/collections/seattle-orcas" className="header__search-item" onClick={() => setSearchOpen(false)}>
                    <img src="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard12.png?v=1782821928" alt="" />
                    <span>Seattle Orcas MLC</span>
                  </Link>
                  <Link href="/collections/kids" className="header__search-item" onClick={() => setSearchOpen(false)}>
                    <img src="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/Artboard32_a56263d0-f386-480b-b80d-18254dc75f14.jpg?v=1782802430" alt="" />
                    <span>Kids Collection</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="header__search-results-inner">
                <div className="header__search-title">Products</div>
                <div className="header__search-list">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.slice(0, 5).map((p) => (
                      <Link key={p.handle} href={`/products/${p.handle}`} className="header__search-item" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                        <img src={p.images[0]} alt="" />
                        <div className="header__search-item-info">
                          <span className="header__search-item-title">{p.title}</span>
                          <span className="header__search-item-price">Rs. {p.price}</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="header__search-no-results">No products found matching &quot;{searchQuery}&quot;</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={`mega ${megaOpen ? 'open' : ''}`}>
          <div>
            <h4>Featured</h4>
            {menu.featured.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setMegaOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Headwear</h4>
            {menu.headwear.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setMegaOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Swimming</h4>
            {menu.swim.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setMegaOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Shop</h4>
            {menu.shop.map((l) => (
              <Link key={l.label} href={l.href} onClick={() => setMegaOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <h4>Support</h4>
            <Link href="/">Track your order</Link>
            <Link href="/">Returns & exchange</Link>
            <Link href="/">Shipping policy</Link>
          </div>
        </div>
      </header>

      {storyOpen && <StoryViewer onClose={() => setStoryOpen(false)} />}
    </>
  );
}
