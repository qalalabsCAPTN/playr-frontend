import React from "react"
import { Metadata } from "next"
import { NectarCommerce } from "@playr/nectar-core"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await NectarCommerce.getProduct(resolvedParams.slug)
  
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.title,
    description: `Buy ${product.title} at playR. Premium athletic gear.`,
    alternates: {
      canonical: `/products/${resolvedParams.slug}`,
    },
    openGraph: {
      title: product.title,
      description: `Buy ${product.title} at playR. Premium athletic gear.`,
      url: `https://playr.in/products/${resolvedParams.slug}`,
      images: [
        {
          url: product.imageSrc,
          width: 800,
          height: 800,
          alt: product.title,
        }
      ]
    }
  }
}

export default async function ProductLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await NectarCommerce.getProduct(resolvedParams.slug)
  
  if (product) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "image": product.imageSrc,
      "description": `Buy ${product.title} at playR. Premium athletic gear.`,
      "sku": product.variants?.[0]?.sku || product.id,
      "offers": {
        "@type": "Offer",
        "url": `https://playr.in/products/${resolvedParams.slug}`,
        "priceCurrency": "INR",
        "price": product.price,
        "availability": "https://schema.org/InStock"
      }
    }

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </>
    )
  }

  return children
}
