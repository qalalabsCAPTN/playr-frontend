"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { CartItem, WishlistItem, MockCartService, NECTARAnalytics } from "@playr/nectar-core"
import { CartDrawer } from "@playr/ui"
import { useRouter } from "next/navigation"

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

  // Load from local storage
  useEffect(() => {
    setMounted(true)
    const storedCart = localStorage.getItem("playr_cart")
    const storedWishlist = localStorage.getItem("playr_wishlist")
    
    if (storedCart) {
      try { setCartItems(JSON.parse(storedCart)) } catch(e) { console.error(e) }
    } else {
      // Mock defaults if empty (as per Phase 3 requirements to have some data, but let's let empty state shine)
      setCartItems([])
    }
    
    if (storedWishlist) {
      try { setWishlistItems(JSON.parse(storedWishlist)) } catch(e) { console.error(e) }
    } else {
      setWishlistItems([])
    }
  }, [])

  // Save to local storage
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
    setIsCartDrawerOpen(true)
    NECTARAnalytics.trackAddToCart(
      { id: item.productId, title: item.title, price: item.price, category: 'Apparel' } as any,
      item.quantity
    )
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const updateCartQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
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
    setWishlistItems([]) // Clear wishlist after adding
    setIsCartDrawerOpen(true)
  }

  const cartSubtotal = MockCartService.calculateSubtotal(cartItems)

  const handleCheckout = () => {
    setIsCartDrawerOpen(false)
    router.push('/cart')
  }

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
      {mounted && (
        <CartDrawer 
          isOpen={isCartDrawerOpen}
          onClose={() => setIsCartDrawerOpen(false)}
          items={cartItems}
          subtotal={cartSubtotal}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={handleCheckout}
        />
      )}
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
