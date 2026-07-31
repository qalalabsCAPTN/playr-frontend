'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/bluorng/CartContext';
import LoginModal from '@/components/auth/LoginModal';

const Icon = {
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
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
};

export function MobileNavDock() {
  const [loginOpen, setLoginOpen] = useState(false);
  const cart = useCart();

  return (
    <>
      <nav className="mobilenav-dock" aria-label="Mobile Navigation Dock">
        <Link href="/" className="mobilenav-dock__item">
          {Icon.compass}
          <span>Explore</span>
        </Link>
        <button className="mobilenav-dock__item" onClick={() => setLoginOpen(true)}>
          {Icon.user}
          <span>Account</span>
        </button>
        <Link href="/collections/seattle-orcas" className="mobilenav-dock__item">
          {Icon.pin}
          <span>Stores</span>
        </Link>
        <Link href="/collections/all-products" className="mobilenav-dock__item">
          {Icon.search}
          <span>Search</span>
        </Link>
        <button className="mobilenav-dock__item" onClick={() => cart.setOpen(true)}>
          {Icon.bag}
          <span>Bag</span>
          {cart.count > 0 && (
            <span className="mobilenav-dock__badge">{cart.count}</span>
          )}
        </button>
      </nav>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
