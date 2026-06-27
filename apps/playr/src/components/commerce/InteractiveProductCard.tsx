"use client"

import React from 'react'
import Link from 'next/link'
import { ProductCard } from '@playr/ui'
import { useCommerce } from '@/components/commerce/CommerceProvider'

interface ProductProps {
  id: string
  title: string
  price: number
  compareAtPrice?: number
  imageSrc: string
  hoverImageSrc?: string
  colors?: any[]
  badge?: string
  slug: string
  category?: string
}

export function InteractiveProductCard({ id, title, price, compareAtPrice, imageSrc, hoverImageSrc, colors, badge, slug, category = "Apparel" }: ProductProps) {
  const { wishlistItems, addToWishlist, removeFromWishlist, addToCart } = useCommerce()
  
  const isWishlisted = wishlistItems.some(item => item.productId === id)
  
  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist({
        productId: id,
        title,
        price,
        imageSrc,
        category
      })
    }
  }

  const handleQuickAdd = () => {
    addToCart({
      id: `${id}-default-m`,
      productId: id,
      variantId: "default",
      title,
      price,
      imageSrc,
      colorName: "Default",
      size: "M",
      quantity: 1
    })
  }

  return (
    <Link href={`/products/${slug}`} className="block">
      <ProductCard
        id={id}
        title={title}
        price={price}
        compareAtPrice={compareAtPrice}
        imageSrc={imageSrc}
        hoverImageSrc={hoverImageSrc}
        colors={colors}
        badge={badge}
        isWishlisted={isWishlisted}
        onWishlistToggle={handleWishlistToggle}
        onQuickAdd={handleQuickAdd}
      />
    </Link>
  )
}
