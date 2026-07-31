'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import { formatPrice } from '@/lib/data';

function BookmarkIcon({ filled }) {
  return (
    <svg viewBox="0 0 18 22" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
      <path d="M2 2.5A1.5 1.5 0 0 1 3.5 1h11A1.5 1.5 0 0 1 16 2.5V20l-7-4.5L2 20V2.5Z" />
    </svg>
  );
}

export default function ProductCard({ product, gallery = true }) {
  const [idx, setIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const cart = useCart();
  const onSale = product.compareAt && product.compareAt > product.price;
  const imgs = gallery ? product.images : product.images.slice(0, 1);

  const step = (e, dir) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + dir + imgs.length) % imgs.length);
  };

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.soldOut) {
      cart.showToast('This product is sold out');
      return;
    }
    cart.addItem(product, 'One Size');
  };

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved((v) => !v);
    cart.showToast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <Link href={`/products/${product.handle}`} className="card">
      <div className="card__media">
        {imgs.map((src, i) => (
          <img key={src} src={src} alt={product.title} loading="lazy" className={i === idx ? 'active' : ''} />
        ))}

        <button className="card__wish" onClick={toggleSave} aria-label="Save to wishlist">
          <BookmarkIcon filled={saved} />
        </button>

        {product.soldOut && <span className="card__badge">Sold out</span>}
        {onSale && !product.soldOut && <span className="card__badge">Sale</span>}

        {gallery && imgs.length > 1 && (
          <>
            <button className="card__nav card__nav--prev" onClick={(e) => step(e, -1)} aria-label="Previous image">
              ←
            </button>
            <button className="card__nav card__nav--next" onClick={(e) => step(e, 1)} aria-label="Next image">
              →
            </button>
            <div className="card__dots">
              {imgs.map((_, i) => (
                <span key={i} className={`card__dot ${i === idx ? 'active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card__info">
        <div>
          <h3 className="card__title">{product.title}</h3>
          <div className="card__price">
            {onSale && <s>{formatPrice(product.compareAt)}</s>}
            <span>{formatPrice(product.price)}</span>
          </div>
        </div>
        <button className="card__add" onClick={quickAdd} aria-label="Quick add">
          +
        </button>
      </div>
    </Link>
  );
}
