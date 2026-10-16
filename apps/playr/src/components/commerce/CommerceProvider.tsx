"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { CartItem, WishlistItem, NECTARAnalytics } from "@playr/nectar-core"
import { CartDrawer } from "@playr/ui"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cartStore"

/* eslint-disable no-unused-vars */
interface CommerceContextType {
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]
  cartSubtotal: number
  isCartDrawerOpen: boolean
  setIsCartDrawerOpen: (open: boolean) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateCartQuantity: (id: string, qty: number) => void
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (productId: string) => void
  addAllWishlistToCart: () => void
}
/* eslint-enable no-unused-vars */

const CommerceContext = createContext<CommerceContextType | undefined>(undefined)

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const storeItems = useCartStore((s) => s.items)
  const storeAddItem = useCartStore((s) => s.addItem)
  const storeRemoveItem = useCartStore((s) => s.removeItem)
  const storeUpdateQty = useCartStore((s) => s.updateQuantity)

  // Load from local storage
  useEffect(() => {
    setMounted(true)
    const loadStoredCart = () => {
      const storedCart = localStorage.getItem("playr_cart")
      const storedWishlist = localStorage.getItem("playr_wishlist")

      if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCartItems(parsed)
            return
          }
        } catch(e) { console.error(e) }
      }

      if (storeItems && storeItems.length > 0) {
        const converted: CartItem[] = storeItems.map((i) => ({
          id: i.id,
          productId: i.productId,
          variantId: i.id,
          title: i.name,
          imageSrc: i.image,
          colorName: i.color,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
        }))
        setCartItems(converted)
        return
      }

      setCartItems([])

      if (storedWishlist) {
        try { setWishlistItems(JSON.parse(storedWishlist)) } catch(e) { console.error(e) }
      } else {
        setWishlistItems([])
      }
    }

    loadStoredCart()
    window.addEventListener('storage', loadStoredCart)
    return () => window.removeEventListener('storage', loadStoredCart)
  }, [storeItems])

  // Sync to local storage
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("playr_cart", JSON.stringify(cartItems))
    localStorage.setItem("playr_wishlist", JSON.stringify(wishlistItems))
  }, [cartItems, wishlistItems, mounted])

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, item]
    })

    storeAddItem({
      id: item.id,
      productId: item.productId,
      name: item.title,
      price: item.price,
      quantity: item.quantity,
      color: item.colorName || 'Default',
      size: item.size || 'M',
      image: item.imageSrc || '',
    })

    setIsCartDrawerOpen(true)
    NECTARAnalytics.trackAddToCart(
      { id: item.productId, title: item.title, price: item.price, category: 'Apparel' } as any,
      item.quantity
    )
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
    storeRemoveItem(id)
  }

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
    storeUpdateQty(id, qty)
  }

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prev => {
      if (prev.find(i => i.productId === item.productId)) return prev
      return [...prev, item]
    })
    NECTARAnalytics.trackWishlistEvent('add', { id: item.productId, title: item.title, price: item.price, category: 'Apparel' } as any)
  }

  const removeFromWishlist = (productId: string) => {
    const item = wishlistItems.find(i => i.productId === productId)
    if (item) {
      NECTARAnalytics.trackWishlistEvent('remove', { id: item.productId, title: item.title, price: item.price, category: 'Apparel' } as any)
    }
    setWishlistItems(prev => prev.filter(i => i.productId !== productId))
  }

  const addAllWishlistToCart = () => {
    const newCartItems = wishlistItems.map(item => ({
      id: `${item.productId}-default`,
      productId: item.productId,
      variantId: "default",
      title: item.title,
      price: item.price,
      imageSrc: item.imageSrc,
      colorName: "Default",
      size: "M",
      quantity: 1
    }))
    
    newCartItems.forEach(item => addToCart(item))
    setWishlistItems([])
    setIsCartDrawerOpen(true)
  }

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  return (
    <CommerceContext.Provider value={{
      cartItems,
      wishlistItems,
      cartSubtotal,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      addToWishlist,
      removeFromWishlist,
      addAllWishlistToCart
    }}>
      {children}
      <CartDrawer 
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
          setIsCartDrawerOpen(false)
          router.push("/cart")
        }}
      />
    </CommerceContext.Provider>
  )
}

export const useCommerce = () => {
  const context = useContext(CommerceContext)
  if (context === undefined) {
    throw new Error("useCommerce must be used within a CommerceProvider")
  }
  return context
}
