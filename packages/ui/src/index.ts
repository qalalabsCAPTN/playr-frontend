export * from './components/Button';
export * from './components/commerce/OptimizedImage';
export * from './components/commerce/ProductCard';
export * from './components/commerce/ProductGrid';
export * from './components/commerce/StockMeter';
export * from './components/commerce/EmptyState';
export * from './components/commerce/CartDrawer';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
