import { Product } from './index';

export interface AnalyticsEvent {
  eventName: string;
  timestamp: number;
  data?: Record<string, any>;
}

/**
 * NECTAR Analytics Abstraction
 * 
 * Provides a unified interface for tracking user interactions, page views, and e-commerce events.
 * This service currently logs to the console as a mock implementation, but is designed 
 * to be easily wired up to external providers (e.g., Google Analytics, Meta Pixel, Segment).
 */
export const NECTARAnalytics = {
  
  /**
   * Internal helper to dispatch events.
   * Can be hooked up to third-party providers here.
   */
  _track: (eventName: string, data?: Record<string, any>) => {
    const event: AnalyticsEvent = {
      eventName,
      timestamp: Date.now(),
      data
    };
    
    // MOCK IMPLEMENTATION - Logs to console in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.log(`[NECTAR Analytics] ${eventName}`, event);
    }
  },

  trackPageView: (path: string) => {
    NECTARAnalytics._track('page_view', { path });
  },

  trackProductView: (product: Product) => {
    NECTARAnalytics._track('product_view', { 
      productId: product.id, 
      productName: product.title, 
      category: product.category,
      price: product.price 
    });
  },

  trackCollectionView: (collectionSlug: string) => {
    NECTARAnalytics._track('collection_view', { collectionSlug });
  },

  trackAddToCart: (product: Product, quantity: number = 1) => {
    NECTARAnalytics._track('add_to_cart', { 
      productId: product.id, 
      productName: product.title, 
      quantity, 
      price: product.price 
    });
  },

  trackWishlistEvent: (action: 'add' | 'remove', product: Product) => {
    NECTARAnalytics._track(`wishlist_${action}`, { 
      productId: product.id, 
      productName: product.title 
    });
  },

  trackCheckoutStep: (step: number, label: string) => {
    NECTARAnalytics._track('checkout_step', { step, label });
  },

  trackPurchase: (orderId: string, total: number, items: Array<{id: string, quantity: number}>) => {
    NECTARAnalytics._track('purchase', { 
      orderId, 
      total,
      items
    });
  }
};
