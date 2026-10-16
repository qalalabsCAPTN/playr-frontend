'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/bluorng/CartContext';
import LoginModal from '@/components/auth/LoginModal';
import { products } from '@/lib/bluorng-data';

const Icon = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </svg>
  ),
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
  bag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M5 8h14l-1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H8a1.8 1.8 0 0 1-1.8-1.8L5 8Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  ),
  b2b: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  ),
};

export function MobileNavDock() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useCart();

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.type && p.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <nav className="mobilenav-dock" aria-label="Mobile Navigation Dock">
        {/* 1. Account Nav Button */}
        <button
          className="mobilenav-dock__item mobilenav__item"
          onClick={() => setLoginOpen(true)}
          aria-label="Account"
        >
          {Icon.user}
          <span>Account</span>
        </button>

        {/* 2. Stores Pin Nav Button */}
        <Link
          href="/collections/seattle-orcas"
          className="mobilenav-dock__item mobilenav__item"
          aria-label="Stores"
        >
          {Icon.pin}
          <span>Stores</span>
        </Link>

        {/* 3. B2B Nav Button */}
        <Link
          href="/b2b"
          className="mobilenav-dock__item mobilenav__item"
          aria-label="B2B"
        >
          {Icon.b2b}
          <span>B2B</span>
        </Link>

        {/* 4. Search Nav Button */}
        <button
          className="mobilenav-dock__item mobilenav__item"
          onClick={() => {
            setSearchOpen(true);
            setSearchQuery('');
          }}
          aria-label="Search"
        >
          {Icon.search}
          <span>Search</span>
        </button>

        {/* 5. Bag Nav Button */}
        <button
          className="mobilenav-dock__item mobilenav__item"
          onClick={() => cart.setOpen(true)}
          aria-label="Bag"
        >
          {Icon.bag}
          <span>Bag</span>
          {cart.count > 0 && (
            <span className="mobilenav-dock__badge">{cart.count}</span>
          )}
        </button>
      </nav>

      {/* Mobile Search Overlay Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col justify-start p-4 pt-16"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-lg mx-auto bg-[var(--panel)] border border-[var(--line)] rounded-[var(--radius-lg)] p-4 shadow-2xl relative text-[var(--fg)] max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--line)]">
              <span className="text-[var(--muted)]">{Icon.search}</span>
              <input
                type="text"
                id="mobile-search-input"
                name="q"
                autoComplete="off"
                aria-label="Search catalog"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, caps, jerseys..."
                className="w-full bg-transparent text-base md:text-sm font-medium text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-lg font-bold text-[var(--muted)] hover:text-[var(--fg)] p-1"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 mt-3 space-y-2">
              {searchQuery ? (
                filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 10).map((p) => (
                    <Link
                      key={p.handle}
                      href={`/products/${p.handle}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-[var(--radius-sm)] hover:bg-[var(--chip)] transition-colors"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-12 h-12 rounded-[var(--radius-sm)] object-cover bg-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate">{p.title}</div>
                        <div className="text-[11px] text-[var(--muted)]">₹{p.price}</div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-[var(--muted)]">
                    No products found for &quot;{searchQuery}&quot;
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-xs text-[var(--muted)]">
                  Start typing to search catalog...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
