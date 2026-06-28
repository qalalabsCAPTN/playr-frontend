"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useCommerce } from "@/components/commerce/CommerceProvider"
import { useAccount } from "@/components/account/AccountProvider"
import { EmptyState } from "@playr/ui"

export default function CartPage() {
  const { cartItems, cartSubtotal, updateCartQuantity, removeFromCart } = useCommerce()
  const { xpState } = useAccount()

  if (cartItems.length === 0) {
    return (
      <main className="mt-32 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pb-32 min-h-[60vh] flex items-center justify-center">
        <EmptyState 
          title="YOUR BAG IS LIGHT." 
          description="Looks like you haven't added anything to your cart yet. Explore our latest gear and elevate your performance."
          actionLabel="EXPLORE SHOP"
          onAction={() => window.location.href = '/collections/premium-polos'} 
        />
      </main>
    )
  }

  return (
    <main className="mt-32 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto pb-32">
      {/* Cart Header */}
      <header className="mb-12">
        <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl uppercase">
          Your Cart ({cartItems.length} items)
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-6 p-4 border border-on-surface rounded-xl hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="relative w-full md:w-48 aspect-square bg-surface-container rounded-lg overflow-hidden shrink-0">
                <Image fill alt={item.title} className="object-cover" src={item.imageSrc} />
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-headline-md uppercase">{item.title}</h3>
                    <p className="text-secondary font-label-md mt-1">Color: {item.colorName}</p>
                    <p className="text-secondary font-label-md">Size: {item.size}</p>
                    {item.isPersonalized && (
                      <p className="text-[12px] text-green-600 font-bold uppercase tracking-wider mt-1">
                        Personalized: {item.playerName} ({item.playerNumber})
                      </p>
                    )}
                  </div>
                  <span className="font-headline-md text-headline-md">₹{item.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <div className="flex items-center border border-on-surface rounded-full px-4 py-2 gap-4">
                    <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="hover:text-primary transition-colors">-</button>
                    <span className="font-bold">{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="hover:text-primary transition-colors">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-secondary font-label-md uppercase tracking-widest hover:text-error transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-4">
          <div className="p-8 rounded-xl border border-on-surface sticky top-28 bg-surface-container">
            <h2 className="font-headline-lg text-headline-lg uppercase mb-8">Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center font-body-lg text-body-lg">
                <span>Subtotal</span>
                <span className="font-bold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center font-body-lg text-body-lg">
                <span>Estimated Shipping & Handling</span>
                <span className="text-secondary">Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center font-body-lg text-body-lg">
                <span>Estimated Tax</span>
                <span>—</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-on-surface mb-8">
              <div className="flex justify-between items-center">
                <span className="font-headline-md text-headline-md uppercase">Total</span>
                <span className="font-headline-md text-headline-md">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-label-sm text-secondary mt-1">(Taxes included)</p>
            </div>
            
            <div className="mb-8">
              <label className="block font-label-md uppercase tracking-widest mb-2">Promo Code</label>
              <div className="flex gap-2">
                <input className="flex-grow bg-surface-container-low border border-on-surface rounded-lg px-4 py-2 focus:ring-0 focus:border-primary" placeholder="Enter code" type="text" />
                <button className="px-6 py-2 border border-on-surface rounded-full font-label-md uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors">Apply</button>
              </div>
            </div>
            
            {/* XP teaser — reads from NECTAR via AccountContext, no calculations */}
            {xpState ? (
              <div className="mb-4 bg-primary-container/20 border border-primary-container/40 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">bolt</span>
                <div>
                  <p className="font-bold text-on-surface text-sm">Earn XP on this order</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">
                    {xpState.currentTier.name} members earn bonus XP •{' '}
                    <Link href="/rewards" className="text-primary hover:underline">View rewards</Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-4 bg-surface-container rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">bolt</span>
                <div>
                  <p className="font-bold text-on-surface text-sm">Sign in to earn XP</p>
                  <p className="text-on-surface-variant text-xs mt-0.5">
                    <Link href="/account" className="text-primary hover:underline">Log in</Link>
                    {' '}to track your XP on this purchase.
                  </p>
                </div>
              </div>
            )}

            <Link href="/checkout" className="block w-full">
              <button className="w-full py-5 bg-primary-container text-on-surface font-headline-md uppercase rounded-full hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-[0.98] transition-all">
                Checkout
              </button>
            </Link>
          </div>
        </aside>
      </div>

      {/* You Might Also Like Section */}
      <section className="mt-32">
        <h2 className="font-headline-xl-mobile md:font-headline-lg text-headline-xl-mobile md:text-headline-lg uppercase mb-12">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <Link href="/products/golfer-polo" className="group cursor-pointer rounded-xl">
            <div className="relative aspect-square bg-surface-container overflow-hidden mb-4 border border-transparent group-hover:border-on-surface transition-colors rounded-xl">
              <Image fill alt="Golfer Polo" className="object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida/ADBb0uhcVgIzrw2pRlI6mCrCuE32GcKKpn9OJ5iislNwsqyrnqo5uUXLmHmUpn28v7bPhTDGMcBOVM2q9y5TLfIvx7LcoHi6w8_Owi3q8FwAWQ_JUWNRq1LYVzB_YSdd5rAJ94hS92bcGIhfyu6zf8cD-b0ryG2_QdzDbi4RI54gvzSaoZITcMDuMkhJ-EfkZyGwKVHCzcLn7OtBm3WA3S1n0bYuv1vRkIG6O6mUEdQOhq2N77Z6XonHutwqtCg" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline-md text-headline-md uppercase">Golfer Polo</h4>
                <p className="text-secondary font-label-sm uppercase">New Collection</p>
              </div>
              <span className="font-bold">₹649</span>
            </div>
          </Link>
          <Link href="/products/club-polo" className="group cursor-pointer rounded-xl">
            <div className="relative aspect-square bg-surface-container overflow-hidden mb-4 border border-transparent group-hover:border-on-surface transition-colors rounded-xl">
              <Image fill alt="Club Polo" className="object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida/ADBb0ug5hr_RtQDn0qkK0-Lw9rVCi_xCNfqjBHnnR29vl4JkFDigvGMTLYX20Ms9LtO3lcjeUclARGv-ot_kRzkbGqWO3d0dVqhlMRIPKsaCtIRLBb3_s7YYOwPAQhPyW-tx1nNSAv_rTAqfVosL3I2n3jYnLRLxTGOq9TNsjWi7FrpaL9-4k7UDykOywL83W_4XeSq8n7X9SSk7ZhHKoF0caMiCszpluIvCJbkw3fV_UAnZ6Ibwyp0oNr2zYw" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline-md text-headline-md uppercase">Club Polo</h4>
                <p className="text-secondary font-label-sm uppercase">Elite Fit</p>
              </div>
              <span className="font-bold">₹799</span>
            </div>
          </Link>
          <Link href="/products/method-polo" className="group cursor-pointer rounded-xl">
            <div className="relative aspect-square bg-surface-container overflow-hidden mb-4 border border-transparent group-hover:border-on-surface transition-colors rounded-xl">
              <Image fill alt="Method Polo" className="object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida/ADBb0uj7USYJna3mpeAJyOB2NSIv75J_HwKOj-G8HECzuEeb6Y0k3PRN4H3svb8PdRg_zz3_49_DYQZmv9DMo_aezYzOTUuPyonjvNmmGwX6t0BPv9xW6UDQCUJeibE541Nuy_xSbTHpUBZIbBmFAQKXpMPB25rAzjDtoMaoei9SAJuGCwv0gyfTdO2TcWjxkvy5zEhr70Hob5rv-5VhcRtiBwL1PAwlLIA_AjObNs9GK-xnRBiLcVUpp8vVd-8" />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-headline-md text-headline-md uppercase">Method Polo</h4>
                <p className="text-secondary font-label-sm uppercase">Athletic Core</p>
              </div>
              <span className="font-bold">₹599</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  )
}
