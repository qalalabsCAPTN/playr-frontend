import { Product, ProductVariant } from "../commerce/index"

function mapColorToHex(colorName: string): string {
  if (!colorName) return "#1a1a1a"
  const c = colorName.toLowerCase()
  if (c.includes("black")) return "#1a1a1a"
  if (c.includes("white")) return "#ffffff"
  if (c.includes("grey") || c.includes("gray")) return "#808080"
  if (c.includes("red")) return "#d32f2f"
  if (c.includes("blue")) return "#1976d2"
  if (c.includes("teal")) return "#009688"
  if (c.includes("yellow")) return "#fbc02d"
  if (c.includes("green")) return "#388e3c"
  if (c.includes("pink")) return "#c2185b"
  if (c.includes("/")) return "#4a4a4a"
  return "#1a1a1a"
}

// Protocol fallback for images starting with //cdn.shopify.com
function fixUrl(url: string | null | undefined): string {
  if (!url) return ""
  if (url.startsWith("//")) return `https:${url}`
  return url
}

// General purpose mapper for Shopify JSON data structure
function mapShopifyProduct(data: any): Product {
  const isSearchData = !data.options || !data.variants
  
  // Extract variants if available
  const variants: ProductVariant[] = (data.variants || []).map((v: any) => {
    // Determine option indices
    const colorOptionIndex = (data.options || []).findIndex((o: any) => o.name.toLowerCase() === "color")
    const sizeOptionIndex = (data.options || []).findIndex((o: any) => o.name.toLowerCase() === "size")

    const colorName = colorOptionIndex !== -1 ? v[`option${colorOptionIndex + 1}`] : undefined
    const sizeName = sizeOptionIndex !== -1 ? v[`option${sizeOptionIndex + 1}`] : undefined

    return {
      id: v.id ? v.id.toString() : "unknown",
      name: v.title || data.title,
      sku: v.sku || `${data.handle}-${v.id}`,
      price: v.price ? (typeof v.price === "string" ? parseFloat(v.price) : v.price / 100) : 0,
      compareAtPrice: v.compare_at_price ? (typeof v.compare_at_price === "string" ? parseFloat(v.compare_at_price) : v.compare_at_price / 100) : undefined,
      inventory: v.available !== false ? 10 : 0,
      color: colorName ? { name: colorName, hex: mapColorToHex(colorName), isWhite: colorName.toLowerCase().includes("white") } : undefined,
      size: sizeName || undefined
    }
  })

  // Extract available colors
  const colorsOption = (data.options || []).find((o: any) => o.name.toLowerCase() === "color")
  const colors = colorsOption 
    ? colorsOption.values.map((name: string) => ({ 
        name, 
        hex: mapColorToHex(name),
        isWhite: name.toLowerCase().includes("white")
      }))
    : []

  // Extract available sizes
  const sizesOption = (data.options || []).find((o: any) => o.name.toLowerCase() === "size")
  const sizes = sizesOption ? sizesOption.values : []

  // Base price (handle format difference between .js and search/collection APIs)
  let rawPrice = data.price
  if (typeof rawPrice === "string") {
    rawPrice = parseFloat(rawPrice) * 100 // Temporarily scale up if it's already a float string
  }
  
  let rawCompareAtPrice = data.compare_at_price || data.compare_at_price_max
  if (typeof rawCompareAtPrice === "string") {
    rawCompareAtPrice = parseFloat(rawCompareAtPrice) * 100
  }

  const price = rawPrice ? rawPrice / 100 : 0
  const compareAtPrice = rawCompareAtPrice ? rawCompareAtPrice / 100 : undefined

  let badge = undefined
  if (compareAtPrice && compareAtPrice > price) {
    const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    badge = `${discount}% OFF`
  }

  // Handle images array differences
  let images = []
  if (Array.isArray(data.images)) {
    // If elements are objects (like in products.json) use .src, else if strings use directly
    images = data.images.map((img: any) => typeof img === "string" ? img : (img.src || img))
  }
  
  const mainImage = data.featured_image ? (typeof data.featured_image === "string" ? data.featured_image : data.featured_image.src || data.featured_image.url) : (images[0] || "")
  const hoverImage = images.length > 1 ? images[1] : undefined

  return {
    id: data.id ? data.id.toString() : "unknown",
    slug: data.handle,
    title: data.title,
    description: data.description || data.body_html || data.body || "",
    category: data.type || data.product_type || "Apparel",
    badge,
    price: price,
    compareAtPrice: compareAtPrice,
    imageSrc: fixUrl(mainImage),
    hoverImageSrc: hoverImage ? fixUrl(hoverImage) : undefined,
    gallery: images.map(fixUrl),
    variants,
    colors,
    sizes,
    specifications: data.tags || [],
    materialAndCare: {
      material: "Check product description for details.",
      care: "Machine wash cold. Check label for details."
    },
    loyaltyPoints: 0 // NECTAR BFF computes actual XP — never calculated in frontend
  }
}

// Global fetch config for aggressive caching to prevent duplicate API hits
const FETCH_CONFIG = {
  next: { revalidate: 3600 } // Cache for 1 hour
} as any

export async function fetchShopifyProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://playr.in/products/${slug}.js`, FETCH_CONFIG)
    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Shopify API error: ${res.statusText}`)
    }
    const data = await res.json()
    return mapShopifyProduct(data)
  } catch (error) {
    console.error("Failed to fetch Shopify product:", error)
    return null
  }
}

export async function fetchShopifyCollection(slug: string, limit: number = 250): Promise<Product[]> {
  try {
    const targetUrl = slug === 'all' || slug === 'new-arrivals' || !slug 
      ? `https://playr.in/products.json?limit=${limit}` 
      : `https://playr.in/collections/${slug}/products.json?limit=${limit}`
      
    const res = await fetch(targetUrl, FETCH_CONFIG)
    if (!res.ok) {
      // Fallback to all products if specific collection doesn't exist via JSON API
      if (res.status === 404 && slug !== 'all') {
        return await fetchShopifyCollection('all', limit)
      }
      return []
    }
    const data = await res.json()
    if (!data.products || !Array.isArray(data.products)) return []
    
    return data.products.map((p: any) => mapShopifyProduct(p))
  } catch (error) {
    console.error(`Failed to fetch Shopify collection [${slug}]:`, error)
    return []
  }
}

export async function searchShopifyProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(`https://playr.in/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`, FETCH_CONFIG)
    if (!res.ok) return []
    const data = await res.json()
    const products = data?.resources?.results?.products || []
    return products.map((p: any) => mapShopifyProduct(p))
  } catch (error) {
    console.error(`Failed to search Shopify products for [${query}]:`, error)
    return []
  }
}
