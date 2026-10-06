import React from "react"
import { Metadata } from "next"
import { NectarCommerce } from "@playr/nectar-core"

import { getProduct as getBluorngProduct } from "@/lib/bluorng-data"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const bluorngProduct = getBluorngProduct(resolvedParams.slug);
  const nectarProduct = await NectarCommerce.getProduct(resolvedParams.slug);
  
  if (!bluorngProduct && !nectarProduct) return { title: 'Product Not Found | playR' };

  const title = bluorngProduct?.seoTitle || bluorngProduct?.title || nectarProduct?.title || 'Product';
  const description = bluorngProduct?.seoDescription || bluorngProduct?.description?.slice(0, 160) || (nectarProduct ? `Buy ${nectarProduct.title} at playR. Premium athletic gear.` : 'playR - Premium athletic gear.');
  const image = bluorngProduct?.images?.[0] || nectarProduct?.imageSrc || '';

  return {
    title: title.includes('playR') ? title : `${title} | playR`,
    description,
    alternates: {
      canonical: `/products/${resolvedParams.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://playr.in/products/${resolvedParams.slug}`,
      images: image ? [
        {
          url: image,
          width: 800,
          height: 800,
          alt: title,
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    }
  }
}

export default async function ProductLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const bluorngProduct = getBluorngProduct(resolvedParams.slug);
  const nectarProduct = await NectarCommerce.getProduct(resolvedParams.slug);
  
  const title = bluorngProduct?.title || nectarProduct?.title;
  const image = bluorngProduct?.images?.[0] || nectarProduct?.imageSrc;
  const description = bluorngProduct?.seoDescription || bluorngProduct?.description?.slice(0, 200) || (nectarProduct ? `Buy ${nectarProduct.title} at playR.` : '');
  const price = bluorngProduct?.price || nectarProduct?.price;
  const sku = bluorngProduct?.handle || nectarProduct?.variants?.[0]?.sku || nectarProduct?.id;

  if (title && image) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": title,
      "image": image,
      "description": description,
      "sku": sku,
      "brand": {
        "@type": "Brand",
        "name": "playR"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://playr.in/products/${resolvedParams.slug}`,
        "priceCurrency": "INR",
        "price": price,
        "availability": bluorngProduct?.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
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
