"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCommerce } from "@/components/commerce/CommerceProvider"
import { motion, AnimatePresence } from "framer-motion"

export default function AccountWishlistPage() {
  const { wishlistItems, removeFromWishlist, addToCart } = useCommerce()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  
  // Notification states per product
  const [restockAlerts, setRestockAlerts] = useState<Record<string, boolean>>({})
  const [priceAlerts, setPriceAlerts] = useState<Record<string, boolean>>({})

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleMoveToCart = async (item: any) => {
    try {
      await addToCart({
        id: `${item.productId}-${item.colorName || 'Default'}-${item.size || 'M'}`,
        productId: item.productId,
        variantId: "default",
        title: item.title,
        price: item.price,
        imageSrc: item.imageSrc,
        quantity: 1,
        colorName: item.colorName || "Default",
        size: item.size || "M"
      })
      await removeFromWishlist(item.productId)
      triggerToast(`Moved ${item.title} to bag!`)
    } catch (e) {
      triggerToast("Failed to move item to bag.")
    }
  }

  const toggleRestockAlert = (id: string) => {
    const newVal = !restockAlerts[id]
    setRestockAlerts(prev => ({ ...prev, [id]: newVal }))
    triggerToast(newVal ? "Restock notifications enabled!" : "Restock notifications disabled.")
  }

  const togglePriceAlert = (id: string) => {
    const newVal = !priceAlerts[id]
    setPriceAlerts(prev => ({ ...prev, [id]: newVal }))
    triggerToast(newVal ? "Price drop alerts enabled!" : "Price drop alerts disabled.")
  }

  const handleShareWishlist = () => {
    navigator.clipboard.writeText(window.location.href)
    triggerToast("Wishlist link copied to clipboard!")
  }

  return (
    <div className="space-y-10">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-on-background text-background px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl border border-outline/10 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm text-primary-fixed-dim">favorite</span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-baseline sm:items-end border-b border-outline-variant/30 pb-4 gap-4">
        <h1 className="font-black text-3xl uppercase tracking-tighter text-on-surface font-headline">My Wishlist</h1>
        {wishlistItems.length > 0 && (
          <button 
            onClick={handleShareWishlist}
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-on-surface transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">share</span> Share Wishlist
          </button>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.productId} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-primary/20 transition-all">
              <div className="relative aspect-square bg-surface-container overflow-hidden">
                <Link href={`/products/pro-training-tee`}>
                  <Image fill alt={item.title} className="object-cover group-hover:scale-105 transition-transform duration-500" src={item.imageSrc} />
                </Link>
                <button 
                  onClick={() => {
                    removeFromWishlist(item.productId)
                    triggerToast(`Removed ${item.title} from wishlist.`)
                  }}
                  className="absolute top-4 right-4 w-9 h-9 bg-surface/80 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">{item.category}</span>
                  <h4 className="font-black text-md text-on-surface uppercase tracking-tight mt-1 line-clamp-1 font-headline">{item.title}</h4>
                  <span className="font-black text-sm text-on-surface mt-2 block">₹{item.price.toLocaleString()}</span>
                </div>

                {/* Alerts Settings */}
                <div className="space-y-2.5 pt-3 border-t border-outline-variant/10">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={!!restockAlerts[item.productId]}
                        onChange={() => toggleRestockAlert(item.productId)}
                        className="peer appearance-none w-4 h-4 border-2 border-outline/50 rounded bg-transparent checked:bg-primary checked:border-primary transition-colors cursor-pointer" 
                      />
                      <span className="material-symbols-outlined text-[10px] text-on-primary absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Notify on Restock</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={!!priceAlerts[item.productId]}
                        onChange={() => togglePriceAlert(item.productId)}
                        className="peer appearance-none w-4 h-4 border-2 border-outline/50 rounded bg-transparent checked:bg-primary checked:border-primary transition-colors cursor-pointer" 
                      />
                      <span className="material-symbols-outlined text-[10px] text-on-primary absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Price Drop Alerts</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    Move to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-16 text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">favorite</span>
          <h3 className="font-black text-2xl uppercase tracking-tighter text-on-surface font-headline mb-2">Your wishlist is empty</h3>
          <p className="text-on-surface-variant text-xs font-semibold mb-8 max-w-sm leading-relaxed">Save your favorite gear here and they will be waiting for you whenever you are ready to play.</p>
          <Link href="/collections" className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
            Start Browsing
          </Link>
        </div>
      )}

      {/* Recently Viewed Products */}
      <section className="pt-10 border-t border-outline-variant/20">
        <h3 className="font-black text-lg uppercase tracking-tight text-on-surface font-headline mb-6">Recently Viewed</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-70 hover:opacity-100 transition-all duration-300">
          {[
            { id: 'prod_shorts', title: 'Aero Performance Shorts', category: 'Men', price: 1499, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjouFQ28x8bApWh17osf6EXy609J0xjqv0bAUoW8Don2jNiASe2nKXvZemMWFNGASPDoSOfyaeME5THgNINutFeTQfn165pFBf_JdLRG8KPljU6lo9nCajaRGNP-WpO_PMR1L-KLe-6xUXRWq-isuDd3Fznxy3ZtL9TsifYAc9L4KiEY_a4_3bYEwPVbwOnyDoF-9T-3GKBHBPgkT-026mCbJjXCCEK6K8mu1B1voPtj-QAEABZmm0zdW2CjzdqW-sNzxhX7AflHI' },
            { id: 'prod_pro_tee', title: 'Pro Training Tee', category: 'Men', price: 1299, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQgn4RT5qaIGU-406eP9WRJHcCBy-t_nPVirj9buuKofJtj0y8fzNQJpDAdv9M-LqlOCGWqYWRwylnFuEGqje0FDTIJmuEOUx_UXIFbkeFzXRmiRfP9IQ9gtrxf-DLbNNqyPIlcA3iPI2H0jnEDvl1ZHj0NCw29MJ0XrCVULpb_ZMzAx6s69UdWHsXUWqV74kIFpwqpoZ-eTUP9SqtWHVOi8EW4-rZbcioiXJWUfLq7pAukB8hoJvvrPUUjUfcIX9QUa_fh6GmqE0' }
          ].map((prod) => (
            <div key={prod.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative aspect-square bg-surface-container overflow-hidden">
                <Image fill alt={prod.title} className="object-cover" src={prod.img} />
              </div>
              <div className="p-4">
                <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">{prod.category}</span>
                <h4 className="font-bold text-xs text-on-surface uppercase tracking-tight line-clamp-1 mt-0.5">{prod.title}</h4>
                <div className="flex justify-between items-center mt-3">
                  <span className="font-black text-xs text-on-surface">₹{prod.price.toLocaleString()}</span>
                  <Link href={`/products/pro-training-tee`} className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {[1, 2].map((i) => (
            <div key={i} className="aspect-square bg-surface-container/50 rounded-2xl flex items-center justify-center border border-dashed border-outline-variant/30 opacity-40">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Suggested Gear</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
