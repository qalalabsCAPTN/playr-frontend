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
    const loadStoredCart = () => {
      const storedCart = localStorage.getItem("playr_cart")
      const storedCartItems = localStorage.getItem("playr_cart_items")
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
      
      if (storedCartItems) {
        try {
          const parsed = JSON.parse(storedCartItems)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const converted: CartItem[] = parsed.map((item: any) => ({
              id: item.key || String(Math.random()),
              productId: item.product?.handle || item.key || "prod",
              variantId: item.key || "var",
              title: item.product?.title || "Product",
              imageSrc: item.product?.images?.[0] || "",
              colorName: item.product?.colors?.[0] || "Default",
              price: item.product?.price || 0,
              quantity: item.qty || 1,
              size: item.size || "One Size"
            }))
            setCartItems(converted)
            return
          }
        } catch(e) { console.error(e) }
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
