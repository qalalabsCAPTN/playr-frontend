'use client';

import Link from 'next/link';
import ProductCard from '@/components/bluorng/ProductCard';
import { useCart } from '@/components/bluorng/CartContext';
import { products } from '@/lib/bluorng-data';

export default function WishlistPage() {
  const cart = useCart();
  const { wishlist, removeFromWishlist, addAllWishlistToCart, addItem } = cart;

  const suggestedProducts = products.filter(
    (p) => !wishlist.some((w) => w.handle === p.handle)
  ).slice(0, 4);

  if (wishlist.length === 0) {
    return (
      <main className="min-h-[70vh] pt-32 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6 text-neutral-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-3">YOUR WISHLIST IS EMPTY</h1>
        <p className="text-sm text-neutral-500 max-w-md mb-8 leading-relaxed">
          Save your favorite gear here and they will be waiting for you whenever you're ready to play.
        </p>
        <Link 
          href="/collections/all-products"
          className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
        >
          EXPLORE SHOP
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      {/* Wishlist Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
            MY WISHLIST <span className="text-neutral-400 font-normal">({wishlist.length})</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Products you saved for later</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={addAllWishlistToCart}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-full hover:opacity-90 transition-opacity shadow-md"
          >
            ADD ALL TO BAG
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
        {wishlist.map((product) => (
          <div key={product.handle} className="relative group">
            <ProductCard product={product} gallery={true} />
            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => {
                  addItem(product, 'One Size', 1);
                  cart.showToast('Added to bag!');
                }}
                className="flex-1 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
              >
                ADD TO CART
              </button>
              <button 
                onClick={() => removeFromWishlist(product.handle)}
                className="px-3 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-red-500 hover:border-red-500 rounded-lg transition-colors"
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      {suggestedProducts.length > 0 && (
        <section className="pt-12 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">YOU MIGHT ALSO LIKE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {suggestedProducts.map((p) => (
              <ProductCard key={p.handle} product={p} gallery={true} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
