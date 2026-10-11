'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { products, formatPrice } from '@/lib/bluorng-data';

export default function CartDrawer() {
  const router = useRouter();
  const cart = useCart();
  const suggestions = products.slice(0, 6);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    try {
      const savedNote = localStorage.getItem('playr_order_note');
      if (savedNote) setNote(savedNote);
    } catch (e) {
      console.debug('Failed to read saved note', e);
    }
  }, []);

  return (
    <>
      <div className={`scrim ${cart.open ? 'open' : ''}`} onClick={() => cart.setOpen(false)} />
      <aside className={`drawer ${cart.open ? 'open' : ''}`}>
        <div className="drawer__head">
          <h3>Your bag ({cart.count})</h3>
          <button onClick={() => cart.setOpen(false)} aria-label="Close cart" style={{ fontSize: 22 }}>
            ×
          </button>
        </div>

        <div className="drawer__body">
          {cart.items.length === 0 ? (
            <div className="drawer__empty">
              <h2>Your bag is empty!</h2>
              <p>Let&apos;s get started</p>
              <Link href="/collections/all-products" className="pill" onClick={() => cart.setOpen(false)}>
                Shop now
              </Link>
              <div className="drawer__suggest">
                <h4>Products you may like</h4>
                <div className="drawer__suggest-track">
                  {suggestions.map((p) => (
                    <Link key={p.handle} href={`/products/${p.handle}`} onClick={() => cart.setOpen(false)}>
                      <img src={p.images[0]} alt={p.title} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            cart.items.map((line) => (
              <div key={line.key} className="cartline">
                <img src={line.customImage || line.product.images[0]} alt={line.product.title} />
                <div className="cartline__info">
                  <div className="cartline__title">{line.product.title}</div>
                  <div className="cartline__meta">
                    Size: {line.size} · {formatPrice(line.product.price)}
                    {(line.customName || line.customNumber) && (
                      <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                        Custom: #{line.customNumber || '0'} {line.customName || ''}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="qty">
                      <button onClick={() => cart.updateQty(line.key, -1)}>−</button>
                      <span>{line.qty}</span>
                      <button onClick={() => cart.updateQty(line.key, 1)}>+</button>
                    </div>
                    <button className="cartline__remove" onClick={() => cart.removeItem(line.key)}>
                      Remove
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{formatPrice(line.product.price * line.qty)}</div>
              </div>
            ))
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="drawer__foot">
            {/* Special Instructions / Order Note */}
            <div className="border-t border-[var(--line)] pt-2 pb-1">
              <button
                type="button"
                className="flex items-center justify-between w-full text-xs font-semibold text-[var(--muted)] hover:text-[var(--fg)] py-1.5 transition-colors"
                onClick={() => setShowNote((v) => !v)}
              >
                <span>Special instructions / Order note</span>
                <span className="text-sm font-bold">{showNote ? '−' : '+'}</span>
              </button>
              {showNote && (
                <div className="mt-1.5 mb-2">
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value);
                      try {
                        localStorage.setItem('playr_order_note', e.target.value);
                      } catch (err) {
                        console.debug('Failed to persist order note', err);
                      }
                    }}
                    placeholder="Add special instructions or delivery note..."
                    className="w-full p-2 text-xs bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[var(--fg)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--fg)] resize-none"
                  />
                </div>
              )}
            </div>

            {/* Coupon Code Toggle */}
            <div className="border-t border-[var(--line)] pt-1 pb-2">
              <button
                type="button"
                className="flex items-center justify-between w-full text-xs font-semibold text-[var(--muted)] hover:text-[var(--fg)] py-1.5 transition-colors"
                onClick={() => setShowCoupon((v) => !v)}
              >
                <span>Have a discount code?</span>
                <span className="text-sm font-bold">{showCoupon ? '−' : '+'}</span>
              </button>
              {showCoupon && (
                <div className="mt-1.5 mb-2 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="PROMO CODE"
                    className="flex-1 px-2.5 py-1.5 text-xs bg-[var(--chip)] border border-[var(--line)] rounded-[var(--radius-sm)] text-[var(--fg)] placeholder-[var(--muted)] font-semibold uppercase focus:outline-none focus:border-[var(--fg)]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!couponCode.trim()) return;
                      cart.showToast(`Coupon "${couponCode}" applied!`);
                    }}
                    className="px-3 py-1.5 bg-[var(--fg)] text-[var(--panel)] text-xs font-bold rounded-[var(--radius-sm)] hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* NECTAR Digital Wallet Credit Toggle */}
            <div className="border-t border-[var(--line)] py-2">
              <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-[var(--fg)]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>NECTAR Wallet Credit (₹250 available)</span>
                </div>
                <input
                  type="checkbox"
                  checked={showCoupon && couponCode === 'NECTAR250'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCouponCode('NECTAR250');
                      setShowCoupon(true);
                      cart.showToast('NECTAR ₹250 wallet credit applied!');
                    } else {
                      setCouponCode('');
                    }
                  }}
                  className="rounded border-[var(--line)] text-[var(--fg)] focus:ring-0 cursor-pointer"
                />
              </label>
            </div>

            <div className="drawer__total">
              <span>Estimated total</span>
              <span>{formatPrice(couponCode === 'NECTAR250' ? Math.max(0, cart.total - 250) : cart.total)}</span>
            </div>
            {couponCode === 'NECTAR250' && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold -mt-2 mb-2">
                Includes ₹250 NECTAR loyalty wallet deduction
              </p>
            )}
            <p className="drawer__note">Taxes included. Discounts and shipping calculated at checkout.</p>
            <button className="drawer__checkout" onClick={() => { cart.setOpen(false); router.push('/checkout'); }}>
              Check out
            </button>
          </div>
        )}
      </aside>
      <div className={`toast ${cart.toast ? 'show' : ''}`}>{cart.toast}</div>
    </>
  );
}
