"use client"

import React, { use } from "react"
import Link from "next/link"
import ProductView from "@/components/bluorng/ProductView"
import { getProduct as getBluorngProduct } from "@/lib/bluorng-data"

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const bluorngProduct = getBluorngProduct(resolvedParams.slug);

  if (bluorngProduct) {
    return <ProductView product={bluorngProduct} />;
  }

  // Consistent brand 404 for non-existent products
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--chip)] flex items-center justify-center text-[var(--muted)] mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold text-[var(--fg)] tracking-tight mb-3">Product Not Found</h1>
      <p className="text-[var(--muted)] max-w-md mb-8 text-sm">
        The item you are searching for may have been retired, moved, or is temporarily out of stock.
      </p>
      <Link 
        href="/"
        className="h-12 px-8 rounded-full bg-[var(--fg)] text-[var(--panel)] font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        Explore Collections
      </Link>
    </div>
  );
}
