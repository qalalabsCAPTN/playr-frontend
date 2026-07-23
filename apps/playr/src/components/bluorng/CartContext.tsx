/* eslint-disable no-unused-vars */
'use client';

import { createContext, useContext, useMemo, useState, useCallback, ReactNode } from 'react';
import { BluorngProduct } from '@/lib/bluorng-data';

export interface CartLineItem {
  key: string;
  product: BluorngProduct;
  size: string;
  qty: number;
}

interface CartContextType {
  items: CartLineItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen(open: boolean): void;
  addItem(product: BluorngProduct, size?: string): void;
  updateQty(key: string, delta: number): void;
  removeItem(key: string): void;
  toast: string;
  showToast(msg: string): void;
}

const CartCtx = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  const addItem = useCallback((product: BluorngProduct, size: string = 'M') => {
    setItems((prev) => {
      const key = product.handle + '|' + size;
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { key, product, size, qty: 1 }];
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

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }, []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + i.qty * i.product.price, 0);
    return { items, count, total, open, setOpen, addItem, updateQty, removeItem, toast, showToast };
  }, [items, open, addItem, updateQty, removeItem, toast, showToast]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
