export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  compareAtPrice?: number
  inventory: number
  color?: { name: string; hex: string; isWhite?: boolean }
  size?: string
}

export interface Product {
  id: string
  slug: string
  title: string
  description: string
  category: string
  badge?: string
  price: number
  compareAtPrice?: number
  imageSrc: string
  hoverImageSrc?: string
  gallery: string[]
  variants: ProductVariant[]
  colors: Array<{ name: string; hex: string; isWhite?: boolean }>
  sizes: string[]
  specifications: string[]
  materialAndCare: { material: string; care: string }
  loyaltyPoints: number
}

import { fetchShopifyProduct, fetchShopifyCollection, searchShopifyProducts } from "../adapters/shopify"
import { getDbProducts, getDbProductBySlug } from '../db/db'

export const NectarCommerce = {
  getCollection: async (slug: string) => {
    let shopifyProducts = await fetchShopifyCollection(slug)
    
    // If shopify fails or returns empty, fetch all
    if (!shopifyProducts || shopifyProducts.length === 0) {
      shopifyProducts = await fetchShopifyCollection('all')
    }

    // Merge with DB products
    let dbProducts: Product[] = [];
    if (typeof window === 'undefined') {
      try {
        dbProducts = await getDbProducts() as any[];
      } catch (e) {}
    } else {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          dbProducts = await res.json();
        }
      } catch (e) {}
    }

    // Filter DB products by collection/category if slug is specific
    let filteredDb = dbProducts;
    if (slug && slug !== 'all' && slug !== 'new-arrivals' && slug !== 'new') {
      filteredDb = dbProducts.filter(p => 
        p.category.toLowerCase().includes(slug.toLowerCase().replace('-', ' '))
      );
    }

    const mergedProducts = [...filteredDb, ...shopifyProducts];

    const formatTitle = (s: string) => {
      if (s === 'all') return "All Products"
      return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    return {
      title: formatTitle(slug),
      productCount: mergedProducts.length,
      products: mergedProducts
    }
  },

  getProduct: async (slug: string): Promise<Product | null> => {
    // Check DB first
    if (typeof window === 'undefined') {
      const dbProduct = await getDbProductBySlug(slug);
      if (dbProduct) return dbProduct as any;
    } else {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {}
    }

    // Fallback to Shopify
    const shopifyProduct = await fetchShopifyProduct(slug);
    if (shopifyProduct) return shopifyProduct;

    // Check DB final if on server
    if (typeof window === 'undefined') {
      const dbProduct = await getDbProductBySlug(slug);
      return dbProduct as any;
    }
    return null;
  },

  getRelatedProducts: async (tags: string[] = []): Promise<Product[]> => {
    const coll = await NectarCommerce.getCollection('all');
    const allProducts = coll.products;
    
    let related = allProducts
    if (tags.length > 0) {
      const tagged = allProducts.filter(p => p.specifications.some(t => tags.includes(t)))
      if (tagged.length >= 4) {
        related = tagged
      }
    }

    const shuffled = related.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    // Query Shopify
    const shopifySearch = await searchShopifyProducts(query);

    // Query DB
    let dbProducts: Product[] = [];
    if (typeof window === 'undefined') {
      try {
        const all = await getDbProducts();
        dbProducts = all.filter((p: any) => 
          p.title.toLowerCase().includes(query.toLowerCase()) || 
          p.description.toLowerCase().includes(query.toLowerCase())
        ) as any[];
      } catch (e) {}
    }

    return [...dbProducts, ...shopifySearch];
  }
}
