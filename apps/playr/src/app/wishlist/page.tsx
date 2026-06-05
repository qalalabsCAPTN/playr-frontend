"use client"

import * as React from "react"
import { useCommerce } from "@/components/commerce/CommerceProvider"
import { EmptyState } from "@playr/ui"
import Link from "next/link"
import Image from "next/image"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, addAllWishlistToCart } = useCommerce()

  if (wishlistItems.length === 0) {
    return (
      <main className="mt-32 px-container-margin-mobile md:px-container-margin-desktop max-w-[1440px] mx-auto min-h-[60vh] flex items-center justify-center">
        <EmptyState 
          title="YOUR BAG IS LIGHT." 
          description="Save your favorite gear here and they will be waiting for you whenever you're ready to play."
          actionLabel="EXPLORE SHOP"
          onAction={() => window.location.href = '/collections/premium-polos'} 
        />
      </main>
    )
  }

  return (
    <main className="mt-32 px-container-margin-mobile md:px-container-margin-desktop max-w-[1440px] mx-auto min-h-[70vh]">
      {/* Wishlist Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg tracking-tighter uppercase">
          MY WISHLIST <span className="text-primary opacity-50 font-normal">({wishlistItems.length} ITEMS)</span>
        </h1>
        <div className="flex gap-4">
          <button className="text-label-lg font-label-lg px-6 py-3 border border-secondary/20 rounded-lg hover:bg-surface-container transition-colors">
            SHARE WISHLIST
          </button>
          <button 
            onClick={addAllWishlistToCart}
            className="text-label-lg font-label-lg px-6 py-3 bg-on-background text-background rounded-lg hover:opacity-90 transition-opacity uppercase"
          >
            ADD ALL TO BAG
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-12">
        {wishlistItems.map((item) => (
          <div key={item.productId} className="group relative flex flex-col product-card-hover transition-transform duration-300">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container">
              <Link href={`/products/${item.productId}`}>
                <Image fill alt={item.title} className="object-cover transition-transform duration-700 group-hover:scale-110" src={item.imageSrc} />
              </Link>
              <button 
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center text-on-background hover:bg-error/10 hover:text-error transition-all duration-200 z-10"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/20 to-transparent">
                <button 
                  onClick={addAllWishlistToCart} 
                  className="w-full bg-primary-container text-on-background py-3 rounded-lg text-label-lg font-label-lg shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="text-headline-md font-headline-md uppercase tracking-tight">{item.title}</h3>
              <p className="text-label-sm font-label-sm text-secondary uppercase">{item.category}</p>
              <p className="text-label-lg font-label-lg mt-2">₹{item.price.toLocaleString('en-IN')}</p>
            </div>
            <div className="md:hidden mt-3 flex gap-2">
              <button onClick={addAllWishlistToCart} className="flex-1 bg-primary-container text-on-background py-2 rounded-lg text-[12px] font-bold">ADD TO CART</button>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations Section */}
      <section className="mt-20 border-t border-secondary/10 pt-16 pb-20">
        <h2 className="text-headline-lg font-black mb-8 uppercase">PEOPLE ALSO LIKED</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[3/4] bg-surface-container rounded-xl flex items-center justify-center border border-dashed border-secondary/30">
              <span className="text-label-sm font-bold opacity-30">SUGGESTED ITEM</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
