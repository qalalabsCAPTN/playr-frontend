/* eslint-disable no-unused-vars */
'use client';

import { createContext, useContext, useMemo, useState, useEffect, useCallback, ReactNode } from 'react';
import { BluorngProduct } from '@/lib/bluorng-data';

export interface CartLineItem {
  key: string;
  product: BluorngProduct;
  size: string;
  qty: number;
  customName?: string;
  customNumber?: string;
  customImage?: string;
}

interface CartContextType {
  items: CartLineItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen(open: boolean): void;
  addItem(product: BluorngProduct, size?: string, qty?: number, customization?: { name?: string; number?: string; image?: string }): void;
  updateQty(key: string, delta: number): void;
  removeItem(key: string): void;
  toast: string;
  showToast(msg: string): void;

  clearCart(): void;
  wishlist: BluorngProduct[];
  wishlistCount: number;
  toggleWishlist(product: BluorngProduct): void;
  isInWishlist(handle: string): boolean;
  removeFromWishlist(handle: string): void;
  addAllWishlistToCart(): void;
}

const CartCtx = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [wishlist, setWishlist] = useState<BluorngProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);

  // Load cart & wishlist from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const storedCart = localStorage.getItem('playr_cart_items');
      if (storedCart) setItems(JSON.parse(storedCart));
      
      const storedWishlist = localStorage.getItem('playr_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch (e) {
      console.error('Failed to load stored cart/wishlist', e);
    }
  }, []);

  // Save cart & wishlist to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('playr_cart_items', JSON.stringify(items));
      const commerceCart = items.map((i) => ({
        id: i.key,
        productId: i.product.handle,
        variantId: i.key,
        title: i.product.title,
        imageSrc: i.customImage || i.product.images[0] || '',
        colorName: i.product.colors?.[0] || 'Default',
        price: i.product.price,
        quantity: i.qty,
        size: i.size || 'One Size',
        customName: i.customName,
        customNumber: i.customNumber,
      }));
      localStorage.setItem('playr_cart', JSON.stringify(commerceCart));
      localStorage.setItem('playr_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save cart/wishlist', e);
    }
  }, [items, wishlist, mounted]);

  const addItem = useCallback((
    product: BluorngProduct, 
    size: string = 'M', 
    qtyAdd: number = 1,
    customization?: { name?: string; number?: string; image?: string }
  ) => {
    setItems((prev) => {
      const customKeySuffix = customization?.name || customization?.number 
        ? `|${customization.name || ''}_${customization.number || ''}` 
        : '';
      const key = product.handle + '|' + size + customKeySuffix;
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qtyAdd } : i));
      }
      return [...prev, { 
        key, 
        product, 
        size, 
        qty: qtyAdd,
        customName: customization?.name,
        customNumber: customization?.number,
        customImage: customization?.image,
      }];
    });
    setOpen(true);
  }, []);

  const updateQty = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }, []);

  const toggleWishlist = useCallback((product: BluorngProduct) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.handle === product.handle);
      if (exists) {
        setToast('Removed from wishlist');
        setTimeout(() => setToast(''), 2400);
        return prev.filter((p) => p.handle !== product.handle);
      } else {
        setToast('Saved to wishlist');
        setTimeout(() => setToast(''), 2400);
        return [...prev, product];
      }
    });
  }, []);

  const isInWishlist = useCallback((handle: string) => {
    return wishlist.some((p) => p.handle === handle);
  }, [wishlist]);

  const removeFromWishlist = useCallback((handle: string) => {
    setWishlist((prev) => prev.filter((p) => p.handle !== handle));
    setToast('Removed from wishlist');
    setTimeout(() => setToast(''), 2400);
  }, []);

  const addAllWishlistToCart = useCallback(() => {
    wishlist.forEach((product) => {
      addItem(product, 'One Size', 1);
    });
    setToast('All items added to bag!');
    setTimeout(() => setToast(''), 2400);
  }, [wishlist, addItem]);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + i.qty * i.product.price, 0);
    const wishlistCount = wishlist.length;

    return {
      items,
      count,
      total,
      open,
      setOpen,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      toast,
      showToast,
      wishlist,
      wishlistCount,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      addAllWishlistToCart,
    };
  }, [items, open, addItem, updateQty, removeItem, clearCart, toast, showToast, wishlist, toggleWishlist, isInWishlist, removeFromWishlist, addAllWishlistToCart]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
