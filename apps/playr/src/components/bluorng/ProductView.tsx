'use client';

import { useEffect, useState, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import ProductSection from './ProductSection';
import RecentlyVisited, { pushRecentlyVisited } from './RecentlyVisited';
import { products, formatPrice, BluorngProduct } from '@/lib/bluorng-data';

// HTML5 Canvas Jersey Customization Engine (1:1 Ratio)
const drawJersey = (
  canvas: HTMLCanvasElement, 
  name: string, 
  number: string, 
  themeColor: string, 
  teamName: string,
  isHighRes: boolean = false
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  if (!isHighRes) {
    // Subtle athletic studio backdrop
    const bgGrad = ctx.createRadialGradient(width/2, height/2, width/10, width/2, height/2, width/2);
    bgGrad.addColorStop(0, '#1c1b18');
    bgGrad.addColorStop(1, '#0e0d0b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Grid mesh texture
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = width / 20;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Draw T-shirt jersey shape
  const cx = width / 2;
  const cy = height / 2 + (isHighRes ? 20 : 10);
  const scale = width * 0.75;

  let accentColor = '#ffffff';
  let fontColor = '#ffffff';
  let stripeColor = '#ffffff';
  const teamNameLower = teamName.toLowerCase();
  
  if (teamNameLower.includes('csk') || themeColor === '#FFFF00') {
    accentColor = '#005ea6'; // CSK Blue
    fontColor = '#005ea6';
    stripeColor = '#ff6c00'; // CSK Orange
  } else if (teamNameLower.includes('rr') || themeColor === '#FF69B4') {
    accentColor = '#111e38'; // RR Navy
    fontColor = '#ffffff';
    stripeColor = '#e0a96d'; // RR Gold
  } else if (teamNameLower.includes('mi') || themeColor === '#0000FF') {
    accentColor = '#e0a96d'; // MI Gold
    fontColor = '#e0a96d';
    stripeColor = '#003b7a'; // MI Navy
  } else if (teamNameLower.includes('srh')) {
    accentColor = '#111111';
    fontColor = '#ffffff';
    stripeColor = '#ff5a1f'; // SRH Orange
  } else if (teamNameLower.includes('lsg')) {
    accentColor = '#0057b8';
    fontColor = '#ffffff';
    stripeColor = '#e0a96d';
  } else {
    accentColor = '#222222';
    fontColor = '#ffffff';
    stripeColor = '#888888';
  }

  ctx.save();
  ctx.translate(cx, cy - scale * 0.05);

  // Body Outline Path
  ctx.beginPath();
  ctx.moveTo(-scale * 0.15, -scale * 0.35); // Left collar
  ctx.lineTo(-scale * 0.38, -scale * 0.28); // Left shoulder
  ctx.lineTo(-scale * 0.46, -scale * 0.08); // Left sleeve end
  ctx.lineTo(-scale * 0.34, -scale * 0.02); // Left sleeve bottom
  ctx.lineTo(-scale * 0.26, -scale * 0.12); // Left armpit
  ctx.lineTo(-scale * 0.24, scale * 0.35);  // Left side
  ctx.quadraticCurveTo(0, scale * 0.38, scale * 0.24, scale * 0.35); // Bottom curve
  ctx.lineTo(scale * 0.26, -scale * 0.12);  // Right armpit
  ctx.lineTo(scale * 0.34, -scale * 0.02);  // Right sleeve bottom
  ctx.lineTo(scale * 0.46, -scale * 0.08);  // Right sleeve end
  ctx.lineTo(scale * 0.38, -scale * 0.28);  // Right shoulder
  ctx.lineTo(scale * 0.15, -scale * 0.35);   // Right collar
  ctx.quadraticCurveTo(0, -scale * 0.31, -scale * 0.15, -scale * 0.35); // Collar curve
  ctx.closePath();

  // Draw main body shading/mesh gradient
  const jerseyGrad = ctx.createLinearGradient(0, -scale * 0.4, 0, scale * 0.4);
  jerseyGrad.addColorStop(0, themeColor);
  jerseyGrad.addColorStop(1, adjustColorBrightness(themeColor, -25));
  ctx.fillStyle = jerseyGrad;
  ctx.fill();

  // Raglan seams shadows
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.lineWidth = scale * 0.005;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(-scale * 0.2, -scale * 0.2, -scale * 0.26, -scale * 0.12);
  ctx.moveTo(scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(scale * 0.2, -scale * 0.2, scale * 0.26, -scale * 0.12);
  ctx.stroke();

  // Collar collar trim
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(0, -scale * 0.31, scale * 0.15, -scale * 0.35);
  ctx.quadraticCurveTo(0, -scale * 0.34, -scale * 0.15, -scale * 0.35);
  ctx.closePath();
  ctx.fill();

  // Sleeve cuffs trim
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = scale * 0.025;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.46, -scale * 0.08);
  ctx.lineTo(-scale * 0.34, -scale * 0.02);
  ctx.moveTo(scale * 0.46, -scale * 0.08);
  ctx.lineTo(scale * 0.34, -scale * 0.02);
  ctx.stroke();

  // Sleeve stripes accent
  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = scale * 0.012;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.44, -scale * 0.09);
  ctx.lineTo(-scale * 0.35, -scale * 0.04);
  ctx.moveTo(scale * 0.44, -scale * 0.09);
  ctx.lineTo(scale * 0.35, -scale * 0.04);
  ctx.stroke();

  // Side panels stripes
  ctx.fillStyle = stripeColor;
  ctx.beginPath();
  ctx.moveTo(-scale * 0.25, -scale * 0.05);
  ctx.lineTo(-scale * 0.24, scale * 0.35);
  ctx.lineTo(-scale * 0.21, scale * 0.35);
  ctx.lineTo(-scale * 0.23, -scale * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(scale * 0.25, -scale * 0.05);
  ctx.lineTo(scale * 0.24, scale * 0.35);
  ctx.lineTo(scale * 0.21, scale * 0.35);
  ctx.lineTo(scale * 0.23, -scale * 0.05);
  ctx.closePath();
  ctx.fill();

  // Render player name along arc path
  if (name && name.length >= 2) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let nameFontSize = Math.round(scale * 0.065);
    if (name.length > 12) {
      nameFontSize = Math.round(scale * (0.065 - (name.length - 12) * 0.002));
    }
    
    ctx.font = `900 ${nameFontSize}px Impact, "Oswald", "Arial Black", sans-serif`;
    ctx.fillStyle = fontColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = scale * 0.015;

    const radius = scale * 0.8;
    const centerArcY = scale * 0.48;
    const chars = name.split('');
    const charSpacingAngle = name.length > 10 ? 0.03 : 0.042;
    const totalAngle = (chars.length - 1) * charSpacingAngle;
    const startAngle = -Math.PI / 2 - totalAngle / 2;

    chars.forEach((char, index) => {
      const angle = startAngle + index * charSpacingAngle;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius + centerArcY;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.strokeText(char, 0, 0);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }

  // Render player number
  if (number) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const numFontSize = Math.round(scale * 0.32);
    ctx.font = `900 ${numFontSize}px Impact, "Oswald", "Arial Black", sans-serif`;
    ctx.fillStyle = fontColor;
    
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = scale * 0.05;
    ctx.strokeText(number, 0, scale * 0.06);
    ctx.fillText(number, 0, scale * 0.06);

    if (teamNameLower.includes('csk') || teamNameLower.includes('mi')) {
      ctx.strokeStyle = stripeColor;
      ctx.lineWidth = scale * 0.018;
      ctx.strokeText(number, 0, scale * 0.06);
      ctx.fillText(number, 0, scale * 0.06);
    }
  }

  ctx.restore();
};

const adjustColorBrightness = (hex: string, percent: number) => {
  let R = parseInt(hex.substring(1, 3), 16) || 0;
  let G = parseInt(hex.substring(3, 5), 16) || 0;
  let B = parseInt(hex.substring(5, 7), 16) || 0;

  R = Math.max(0, Math.min(255, R + (R * percent / 100)));
  G = Math.max(0, Math.min(255, G + (G * percent / 100)));
  B = Math.max(0, Math.min(255, B + (B * percent / 100)));

  const rHex = Math.round(R).toString(16).padStart(2, '0');
  const gHex = Math.round(G).toString(16).padStart(2, '0');
  const bHex = Math.round(B).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

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

const COLOR_HEX: Record<string, string> = {
  black: '#111111', white: '#f4f4f4', grey: '#9a9a9a', gray: '#9a9a9a', 'dark grey': '#4a4a4a',
  silver: '#cbcdd0', red: '#c0392b', maroon: '#7b2233', pink: '#e79ab4', orange: '#e07b39',
  yellow: '#f5c518', green: '#3f7d4f', 'bottle green': '#1f4d3a', teal: '#1c8a8a', blue: '#2f5fce',
  navy: '#1c2a4a', 'india blue': '#274b8f', cyan: '#2bb7c6', 'sky blue': '#78b6e6', 'light blue': '#9cc5e8',
  khaki: '#8a7a52', brown: '#6b4a2f',
};

function colorSwatch(name: string) {
  const key = name.trim().toLowerCase();
  if (COLOR_HEX[key]) return COLOR_HEX[key];
  const parts = key.split(/[/&]| and /).map((p) => p.trim()).filter(Boolean);
  const hexes = parts.map((p) => COLOR_HEX[p] || COLOR_HEX[p.split(' ')[0]]).filter(Boolean) as string[];
  if (hexes.length >= 2) return `linear-gradient(135deg, ${hexes[0]} 0 50%, ${hexes[1]} 50% 100%)`;
  if (hexes.length === 1) return hexes[0];
  return '#c8c8c8';
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
  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : (SIZE_SETS[product.type] || ['S', 'M', 'L', 'XL']);
  const unavailable = UNAVAILABLE[product.type] || [];
  const firstAvailable = sizes.find((s) => !unavailable.includes(s)) || sizes[0] || 'One Size';
  const [size, setSize] = useState<string>(sizes.length === 1 ? sizes[0] : firstAvailable);
  const [sizeShake, setSizeShake] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'details' | 'care' | 'shipping'>('details');
  const [guideOpen, setGuideOpen] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLElement>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const saved = cart.isInWishlist(product.handle);

  // Customization State
  const isCustomizableProduct = product.customizable || (product.type && ['Jersey', 'T-Shirt', 'Polo', 'Sportswear'].includes(product.type));
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    pushRecentlyVisited(product.handle);
  }, [product.handle]);

  // Sync canvas redraw on name/number/color change
  useEffect(() => {
    if (!isCustomizing || !canvasRef.current) return;
    const themeColor = colorSwatch(selectedColor || product.colors?.[0] || 'black');
    drawJersey(canvasRef.current, playerName, playerNumber, themeColor, product.title);
  }, [isCustomizing, playerName, playerNumber, selectedColor, product]);

  const related = products.filter((p) => p.type === product.type && p.handle !== product.handle).slice(0, 8);
  const onSale = Boolean(product.compareAt && product.compareAt > product.price);
  const discountPercentage = onSale && product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  const router = useRouter();

  const getCustomizationPayload = () => {
    if (!isCustomizing || (!playerName && !playerNumber)) return undefined;
    let customImage: string | undefined;
    if (canvasRef.current) {
      try {
        customImage = canvasRef.current.toDataURL('image/png');
      } catch (e) {
        // Fallback silently if canvas export fails
      }
    }
    return {
      name: playerName.trim() || undefined,
      number: playerNumber.trim() || undefined,
      image: customImage,
    };
  };

  const triggerSizePrompt = () => {
    setSizeShake(true);
    setTimeout(() => setSizeShake(false), 500);
  };

  const addToBag = () => {
    if (product.soldOut) return;
    if (!size) {
      triggerSizePrompt();
      return;
    }
    const customPayload = getCustomizationPayload();
    cart.addItem(product, size, quantity, customPayload);
  };

  const buyNow = () => {
    if (product.soldOut) return;
    if (!size) {
      triggerSizePrompt();
      return;
    }
    const customPayload = getCustomizationPayload();
    cart.addItem(product, size, quantity, customPayload);
    router.push('/checkout');
  };

  useEffect(() => {
    const el = sideRef.current;
    if (!el) return;
    const update = () => {
      const header = 58 + 16;
      const top = Math.min(header, window.innerHeight - el.offsetHeight - 16);
      el.style.setProperty('--side-top', `${Math.round(top)}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  const images = product.images || [];
  const slideCount = images.length + (isCustomizing ? 1 : 0);
  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el || !el.clientWidth) return;
    setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="pdp-page" style={{ background: pageTint(product.title) }}>
      <div className="pdp">
        <div className="pdp__gallery-wrap">
        <div className="pdp__gallery" ref={galleryRef} onScroll={onGalleryScroll}>
          <div className="pdp__gallery-left">
            {isCustomizing ? (
              <canvas
                ref={canvasRef}
                width={700}
                height={700}
                className="w-full aspect-square rounded-[20px] object-cover bg-[#16181d] shadow-lg cursor-default"
                aria-label="Live customized jersey preview"
              />
            ) : images[0] ? (
              <img 
                src={images[0]} 
                alt={`${product.title} — cover`} 
                onClick={() => setZoom(images[0])} 
                loading="eager" 
              />
            ) : null}
          </div>
          <div className="pdp__gallery-right">
            {images.slice(isCustomizing ? 0 : 1).map((src, i) => (
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
        {slideCount > 1 && (
          <div className="pdp__dots" aria-hidden>
            {Array.from({ length: slideCount }).map((_, i) => (
              <span key={i} className={i === slide ? 'active' : ''} />
            ))}
          </div>
        )}
        </div>

        <aside className="pdp__side" ref={sideRef}>
          <div className="pdp__panel">
            <div className="pdp__toprow">
              <div>
                <h1 className="pdp__title">
                  {product.title}
                  <button 
                    className="pdp__wish" 
                    onClick={() => cart.toggleWishlist(product)}
                    aria-label="Save to wishlist"
                  >
                    <BookmarkIcon filled={saved} />
                  </button>
                </h1>
                <div className="pdp__price">
                  <span className="pdp__selling-price text-red-600 dark:text-red-500 font-bold">
                    {formatPrice(product.price)}
                  </span>
                  {onSale && product.compareAt && (
                    <>
                      <span className="pdp__mrp text-[var(--muted)] flex items-center gap-1 text-xs">
                        <span>MRP:</span>
                        <s>{formatPrice(product.compareAt)}</s>
                      </span>
                      <span className="pdp__discount font-bold text-xs text-orange-600 dark:text-orange-500">
                        ({discountPercentage}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold flex items-center gap-2">
                  <span className="text-[var(--muted)] font-normal text-[11px]">(Incl. of all taxes)</span>
                  <span className="text-[var(--muted)]">·</span>
                  {product.soldOut ? (
                    <span className="text-red-500 bg-red-100 dark:bg-red-950/40 px-2 py-0.5 rounded">Sold Out</span>
                  ) : (
                    <span className="text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded">In Stock</span>
                  )}
                </div>
              </div>
              <button className="sizeguide-btn" onClick={() => setGuideOpen(true)}>
                Size Guide
              </button>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="swatches">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`swatch ${selectedColor === c ? 'active' : ''}`}
                    style={{ background: colorSwatch(c) }}
                    onClick={() => setSelectedColor(c)}
                    aria-label={c}
                    title={c}
                  />
                ))}
              </div>
            )}

            <div className={`sizes ${sizeShake ? 'sizes--shake' : ''}`}>
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

            {/* Customization Toggle & Controls */}
            {isCustomizableProduct && (
              <div className="my-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--chip)] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-[var(--fg)]">
                      Customize Your Jersey
                    </span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      Live 1:1 Preview
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomizing((v) => !v)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                      isCustomizing 
                        ? 'bg-[var(--fg)] text-[var(--panel)]' 
                        : 'border border-[var(--line)] text-[var(--fg)] hover:bg-[var(--panel)]'
                    }`}
                  >
                    {isCustomizing ? 'Disable' : 'Customize'}
                  </button>
                </div>

                {isCustomizing && (
                  <div className="space-y-3 pt-2 border-t border-[var(--line)]">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                        Player Name ({playerName.length}/14)
                      </label>
                      <input
                        type="text"
                        maxLength={14}
                        placeholder="e.g. DHONI, KOHLI, YOUR NAME"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                        Squad Number (0 - 99)
                      </label>
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="e.g. 7, 18, 10"
                        value={playerNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPlayerNumber(val);
                        }}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-[var(--panel)] border border-[var(--line)] text-[var(--fg)] focus:outline-none focus:border-[var(--fg)]"
                      />
                    </div>
                    <p className="text-[11px] text-[var(--muted)] italic">
                      ✓ Real-time render updates directly in the 1:1 square jersey studio preview above.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Box-Aligned Actions */}
            <div className="pdp__actions-box space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)] uppercase tracking-wider py-1 border-t border-[var(--line)]">
                <span>Quantity</span>
                <div className="qty-stepper">
                  <button 
                    type="button"
                    className="qty-stepper__btn" 
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="qty-stepper__val">{quantity}</span>
                  <button 
                    type="button"
                    className="qty-stepper__btn" 
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="pdp__actions">
                <button className="pdp__atb" onClick={addToBag} disabled={product.soldOut}>
                  {product.soldOut ? 'Sold out' : isCustomizing && (playerName || playerNumber) ? 'Add Custom Jersey' : 'Add to Bag'}
                </button>
                <button className="pdp__buy" onClick={buyNow} disabled={product.soldOut}>
                  Buy Now
                </button>
              </div>
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
