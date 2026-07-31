'use client';

import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  const addItem = useCallback((product, size) => {
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

  const updateQty = useCallback((key, delta) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const showToast = useCallback((msg) => {
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
  return useContext(CartCtx);
}
