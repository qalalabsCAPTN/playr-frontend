'use client';

import { useEffect, useState, MouseEvent } from 'react';
import { useCart } from './CartContext';
import ProductSection from './ProductSection';
import RecentlyVisited, { pushRecentlyVisited } from './RecentlyVisited';
import { products, formatPrice, BluorngProduct } from '@/lib/bluorng-data';

const SIZE_SETS: Record<string, string[]> = {
  Caps: ['S/M', 'M/L', 'One Size'],
  Headwear: ['One Size'],
  Goggles: ['One Size'],
  'Swim Caps': ['Kids', 'Adult'],
};

const UNAVAILABLE: Record<string, string[]> = { Caps: ['One Size'], 'Swim Caps': [] };

const TINTS: Array<[string, string]> = [
  ['maroon', '#efe0e0'], ['red', '#f3e2df'], ['pink', '#f6e3ea'], ['orange', '#f5e8dc'],
  ['blue', '#e1e8f2'], ['green', '#e2ece4'], ['grey', '#e9e9e9'], ['silver', '#eaeaec'],
  ['black', '#e6e6e6'],
];

function pageTint(title: string) {
  const t = title.toLowerCase();
  const hit = TINTS.find(([k]) => t.includes(k));
  return hit ? hit[1] : '#ececec';
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 18 22" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
      <path d="M2 2.5A1.5 1.5 0 0 1 3.5 1h11A1.5 1.5 0 0 1 16 2.5V20l-7-4.5L2 20V2.5Z" />
    </svg>
  );
}

interface ProductViewProps {
  product: BluorngProduct;
}

export default function ProductView({ product }: ProductViewProps) {
  const cart = useCart();
  const sizes = SIZE_SETS[product.type] || ['One Size'];
  const unavailable = UNAVAILABLE[product.type] || [];
  const firstAvailable = sizes.find((s) => !unavailable.includes(s)) || 'One Size';
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : firstAvailable);
  const [tab, setTab] = useState<'details' | 'care' | 'shipping'>('details');
  const [guideOpen, setGuideOpen] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    pushRecentlyVisited(product.handle);
  }, [product.handle]);

  const related = products.filter((p) => p.type === product.type && p.handle !== product.handle).slice(0, 8);
  const onSale = product.compareAt && product.compareAt > product.price;

  const addToBag = () => {
    if (product.soldOut) return;
    cart.addItem(product, size);
  };
  const buyNow = () => {
    if (product.soldOut) return;
    cart.addItem(product, size);
    cart.showToast('Redirecting to checkout...');
  };

  const images = product.images || [];

  return (
    <div className="pdp-page" style={{ background: pageTint(product.title) }}>
      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__gallery-left">
            {images[0] && (
              <img 
                src={images[0]} 
                alt={`${product.title} — cover`} 
                onClick={() => setZoom(images[0])} 
                loading="eager" 
              />
            )}
          </div>
          <div className="pdp__gallery-right">
            {images.slice(1).map((src, i) => (
              <img 
                key={src} 
                src={src} 
                alt={`${product.title} — view ${i + 2}`} 
                onClick={() => setZoom(src)} 
                loading="lazy" 
              />
            ))}
          </div>
        </div>

        <aside className="pdp__side">
          <div className="pdp__panel">
            <div className="pdp__toprow">
              <div>
                <h1 className="pdp__title">
                  {product.title}
                  <button
                    onClick={() => {
                      setSaved((v) => !v);
                      cart.showToast(saved ? 'Removed from wishlist' : 'Saved to wishlist');
                    }}
                    aria-label="Save to wishlist"
                  >
                    <BookmarkIcon filled={saved} />
                  </button>
                </h1>
                <div className="pdp__price">
                  {onSale && product.compareAt && <s>{formatPrice(product.compareAt)}</s>}
                  <span>{formatPrice(product.price)}</span>
                </div>
              </div>
              <button className="sizeguide-btn" onClick={() => setGuideOpen(true)}>
                Size Guide
              </button>
            </div>

            <div className="sizes">
              {sizes.map((s) => {
                const off = unavailable.includes(s) || product.soldOut;
                return (
                  <button
                    key={s}
                    className={`size ${size === s && !off ? 'active' : ''} ${off ? 'disabled' : ''}`}
                    onClick={() => !off && setSize(s)}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            <div className="pdp__actions">
              <button className="pdp__atb" onClick={addToBag} disabled={product.soldOut}>
                {product.soldOut ? 'Sold out' : 'Add to Bag'}
              </button>
              <button className="pdp__buy" onClick={buyNow} disabled={product.soldOut}>
                Buy Now
              </button>
            </div>
          </div>

          <div className="pdp__panel">
            <div className="tabs">
              <button className={`tab ${tab === 'details' ? 'active' : ''}`} onClick={() => setTab('details')}>
                Details &amp; Description
              </button>
              <button className={`tab ${tab === 'care' ? 'active' : ''}`} onClick={() => setTab('care')}>
                Washcare
              </button>
              <button className={`tab ${tab === 'shipping' ? 'active' : ''}`} onClick={() => setTab('shipping')}>
                Shipping
              </button>
            </div>

            <div className="tabbody">
              {tab === 'details' && (
                <>
                  <h6>Details</h6>
                  <ul>
                    {product.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <h6>Description</h6>
                  <p>{product.description}</p>
                </>
              )}
              {tab === 'care' && (
                <ul>
                  <li>Rinse with fresh water after use</li>
                  <li>Air dry away from direct sunlight</li>
                  <li>Do not bleach</li>
                  <li>Do not tumble dry</li>
                  <li>Do not iron</li>
                </ul>
              )}
              {tab === 'shipping' && (
                <ul>
                  <li>Shipped within 24 hours</li>
                  <li>Free delivery pan-India</li>
                  <li>Cash on delivery available</li>
                  <li>Dispatch next day</li>
                </ul>
              )}
            </div>
          </div>
        </aside>
      </div>

      {guideOpen && (
        <div className="modal" onClick={() => setGuideOpen(false)}>
          <div className="modal__card" onClick={(e: MouseEvent) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setGuideOpen(false)}>
              ×
            </button>
            <h3>Size guide</h3>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Head circumference</th>
                  <th>Features</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>S/M</td>
                  <td>54 – 56 cm</td>
                  <td>Adjustable band</td>
                </tr>
                <tr>
                  <td>M/L</td>
                  <td>56 – 58 cm</td>
                  <td>Adjustable band</td>
                </tr>
                <tr>
                  <td>One Size</td>
                  <td>Fits most</td>
                  <td>Stretch / adjustable</td>
                </tr>
              </tbody>
            </table>
            <p style={{ fontSize: 12, color: '#757575', marginTop: 14, lineHeight: 1.6 }}>
              <b>How to measure:</b> wrap a measuring tape around your head, about 1 cm above your eyebrows
              and ears. The tape should be snug but not tight.
            </p>
          </div>
        </div>
      )}

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <img src={zoom} alt={product.title} />
        </div>
      )}

      {related.length > 0 && <ProductSection title="You may like" products={related} gallery={true} />}
      <RecentlyVisited excludeHandle={product.handle} />
    </div>
  );
}
