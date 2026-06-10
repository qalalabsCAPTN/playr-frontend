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

export const NectarCommerce = {
  getCollection: async (slug: string) => {
    const products = await fetchShopifyCollection(slug)
    
    // Format the title nicely
    const formatTitle = (s: string) => {
      if (s === 'all') return "All Products"
      return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }

    return {
      title: formatTitle(slug),
      productCount: products.length,
      products
    }
  },

  getProduct: async (slug: string): Promise<Product | null> => {
    return await fetchShopifyProduct(slug)
  },

  getRelatedProducts: async (tags: string[] = []): Promise<Product[]> => {
    // For related products, fetch all and return a random subset to simulate recommendations
    const allProducts = await fetchShopifyCollection('all')
    
    // If we have tags, try to prioritize products with matching tags
    let related = allProducts
    if (tags.length > 0) {
      const tagged = allProducts.filter(p => p.specifications.some(t => tags.includes(t)))
      if (tagged.length >= 4) {
        related = tagged
      }
    }

    // Shuffle and pick 4
    const shuffled = related.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    return await searchShopifyProducts(query)
  }
}
