"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { NectarCommerce, NECTARAnalytics, loyaltyAdapter } from "@playr/nectar-core"
import type { GamificationProductContext } from "@playr/nectar-core"
import { useCommerce } from "@/components/commerce/CommerceProvider"
import { StockMeter, ProductCard } from "@playr/ui"

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  // We use React.use function for un-wrapping promises in Next.js 15 client components when fetching data this way, 
  // but to keep it simple and avoid async in use-client for this phase, we mock the fetch in useEffect.
  const [product, setProduct] = React.useState<any>(null)
  const [activeImage, setActiveImage] = React.useState("")
  const [activeAccordion, setActiveAccordion] = React.useState("desc")
  const { addToCart } = useCommerce()
  const [relatedProducts, setRelatedProducts] = React.useState<any[]>([])
  const [gamificationCtx, setGamificationCtx] = React.useState<GamificationProductContext | null>(null)

  React.useEffect(() => {
    NectarCommerce.getProduct(resolvedParams.slug).then(p => {
      if (p) {
        setProduct(p)
        setActiveImage(p.imageSrc)
        NECTARAnalytics.trackProductView(p)
        NectarCommerce.getRelatedProducts(p.specifications).then(related => setRelatedProducts(related))
        // Fetch XP context from NECTAR — never compute on frontend
        loyaltyAdapter.getProductGamificationContext(p.id).then(ctx => setGamificationCtx(ctx))
      }
    })
  }, [resolvedParams.slug])

  if (!product) return (
    <main className="max-w-screen-2xl mx-auto px-4 md:px-container-margin-desktop pt-32 pb-24 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-surface-container rounded-2xl" />
          <div className="flex gap-4">
            {[1,2,3,4].map(i => <div key={i} className="w-24 h-24 bg-surface-container rounded-xl shrink-0" />)}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-4 bg-surface-container rounded w-24" />
          <div className="h-10 bg-surface-container rounded w-3/4" />
          <div className="h-8 bg-surface-container rounded w-32" />
          <div className="flex gap-3">
            {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-surface-container" />)}
          </div>
          <div className="flex gap-3">
            {[1,2,3,4,5].map(i => <div key={i} className="w-14 h-14 rounded-full bg-surface-container" />)}
          </div>
          <div className="h-14 bg-surface-container rounded-full" />
          <div className="h-14 bg-surface-container rounded-full" />
        </div>
      </div>
    </main>
  )

  return (
    <main className="max-w-screen-2xl mx-auto px-container-margin-mobile md:px-container-margin-desktop py-section-gap-md pt-32">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-on-surface-variant font-label-md">
        <Link className="hover:text-primary" href="/">Home</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link className="hover:text-primary" href="/collections/premium-polos">{product.category}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-bold">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-section-gap-md items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="aspect-square bg-surface-container-low rounded-lg overflow-hidden shadow-sm group relative">
            {activeImage && (
              <Image
                fill
                alt={`${product.title} main view`}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src={activeImage}
              />
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {product.gallery.map((img: string, idx: number) => (
              <button
                key={idx}
                className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-surface-container-low shadow-sm border-2 transition-all ${
                  activeImage === img ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setActiveImage(img)}
              >
                <Image fill alt={`Thumbnail ${idx + 1}`} className="object-cover" src={img} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details */}
        <div className="lg:col-span-5 flex flex-col gap-8 sticky top-32">
          <div className="space-y-2">
            <span className="font-label-md text-primary tracking-widest uppercase">{product.category}</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{product.title}</h1>
            <div className="text-label-sm text-on-surface-variant font-medium mt-1">
              SKU: {product.variants[0]?.sku}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <span className="font-headline-md text-headline-md text-on-surface">
                ₹ {product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && (
                <span className="font-body-lg text-body-lg text-on-surface-variant line-through opacity-60">
                  ₹ {product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.badge && (
                <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-md font-bold">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <span className="font-label-md text-on-surface font-bold uppercase tracking-wider">
              Color: <span className="font-normal opacity-60">Blue Melange</span>
            </span>
            <div className="flex gap-3">
              {product.colors.map((c: any, i: number) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-surface ring-2 ring-transparent transition-all hover:scale-110 active:scale-95 focus:ring-primary"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface font-bold uppercase tracking-wider">Select Size</span>
              <button className="text-primary font-label-md hover:underline">Size Chart</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((s: string, i: number) => (
                <button
                  key={i}
                  className={`w-14 h-14 rounded-full border-2 font-bold transition-all active:scale-95 flex items-center justify-center ${
                    i === 2 ? "border-primary bg-primary text-on-primary" : "border-outline/20 hover:border-primary hover:text-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <StockMeter count={2} />

          {/* CTAs */}
          <div className="flex flex-col gap-4 pt-4">
            {/* XP context from NECTAR — render only, no calculations */}
            {gamificationCtx && gamificationCtx.totalXPEarned > 0 && (
              <div className="bg-surface-container-low border border-primary/20 rounded-lg p-4 flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">card_membership</span>
                  <span className="font-label-md text-on-surface">
                    Earn{' '}
                    <span className="font-bold text-primary">{gamificationCtx.totalXPEarned.toLocaleString()} XP</span>
                    {gamificationCtx.tierBonus > 0 && (
                      <span className="text-on-surface-variant text-xs ml-1">
                        (incl. {gamificationCtx.tierBonus} tier bonus)
                      </span>
                    )}
                    {' '}on this purchase
                  </span>
                </div>
                <Link href="/rewards" className="material-symbols-outlined text-on-surface-variant text-[20px] hover:text-primary transition-colors">help</Link>
              </div>
            )}
            {/* Loading state */}
            {!gamificationCtx && (
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-4 flex items-center gap-3 mb-2 animate-pulse">
                <span className="material-symbols-outlined text-on-surface-variant/40">card_membership</span>
                <div className="h-3 bg-surface-container rounded w-48" />
              </div>
            )}
            <button 
              onClick={() => {
                addToCart({
                  id: `${product.id}-default`,
                  productId: product.id,
                  variantId: "default",
                  title: product.title,
                  price: product.price,
                  imageSrc: product.imageSrc,
                  colorName: "Blue Melange",
                  size: "M",
                  quantity: 1
                })
              }}
              className="bg-primary-container text-on-primary-container font-bold text-headline-sm py-5 rounded-full shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Add to Cart
            </button>
            <button className="bg-transparent border-2 border-secondary text-on-surface font-bold text-headline-sm py-5 rounded-full hover:bg-surface-container transition-all active:scale-95 duration-200">
              Buy Now
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-8 border-t border-outline/10 divide-y divide-outline/10">
            <div className="py-4">
              <button className="flex justify-between items-center w-full group" onClick={() => setActiveAccordion(activeAccordion === "desc" ? "" : "desc")}>
                <span className="font-label-md font-bold text-on-surface uppercase tracking-wider">Description</span>
                <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: activeAccordion === "desc" ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
              </button>
              {activeAccordion === "desc" && (
                <div className="mt-4 text-on-surface-variant font-body-md leading-relaxed animate-fade-in">
                  {product.description}
                </div>
              )}
            </div>
            
            <div className="py-4">
              <button className="flex justify-between items-center w-full group" onClick={() => setActiveAccordion(activeAccordion === "specs" ? "" : "specs")}>
                <span className="font-label-md font-bold text-on-surface uppercase tracking-wider">Specifications</span>
                <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: activeAccordion === "specs" ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
              </button>
              {activeAccordion === "specs" && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {product.specifications.map((spec: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="py-4">
              <button className="flex justify-between items-center w-full group" onClick={() => setActiveAccordion(activeAccordion === "material" ? "" : "material")}>
                <span className="font-label-md font-bold text-on-surface uppercase tracking-wider">Material & Care</span>
                <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: activeAccordion === "material" ? "rotate(180deg)" : "rotate(0deg)" }}>expand_more</span>
              </button>
              {activeAccordion === "material" && (
                <div className="mt-4 text-on-surface-variant font-body-md space-y-2">
                  <p><strong>Material:</strong> {product.materialAndCare.material}</p>
                  <p><strong>Care:</strong> {product.materialAndCare.care}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products / Upsell Bento Grid */}
      <section className="mt-section-gap-lg pt-section-gap-md border-t border-outline/10">
        <h2 className="font-headline-lg text-headline-lg mb-8">Customer Reviews</h2>
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3 p-8 bg-surface-container-low rounded-lg shadow-sm border border-outline/10">
            <div className="text-center space-y-4">
              <div className="text-headline-xl font-bold">0.0</div>
              <div className="flex justify-center text-primary">
                {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined">star</span>)}
              </div>
              <p className="text-on-surface-variant font-label-md uppercase tracking-wider">0 Reviews</p>
              <button className="w-full bg-on-surface text-surface py-4 rounded-full font-bold hover:opacity-90 transition-opacity mt-4">
                Be the first to write a review
              </button>
            </div>
          </div>
          <div className="flex-1 space-y-4 w-full">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="flex items-center gap-4 w-full">
                <span className="font-label-md w-4">{star}</span>
                <span className="material-symbols-outlined text-primary text-[16px]">star</span>
                <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary/20 w-0"></div>
                </div>
                <span className="font-label-md w-8 text-right opacity-40">0%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-section-gap-lg">
        <h2 className="font-headline-lg text-headline-lg mb-12 text-center">Complete the Look</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="md:col-span-2 relative overflow-hidden rounded-lg group h-[400px]">
            <Image
              fill
              alt="Premium performance context"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/ADBb0ujLE56BLAvif6FN48FqWRK9SOl81LorZkCyrxWx5xMWuN_s7a1gIW42OlhEeXRMchiaXx0rG3xqC6kSOw151MzU9JEQTLahkm9dgFCaKS9eG7sNNHrg_yl3fLf-WwRbqiaF7JkqRqUe0UsHcrj-xhUYzrRVcWFw7re518CZbfBDXmjepYA2PNqMk5bOn_Ushcu2oOMv2bDC1bux8Xf3Xvdw2N-ArncR5KvjoPlWEzEnPSXZmhv-TeWOLAw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 to-transparent flex flex-col justify-end p-10">
              <span className="font-label-md text-primary-fixed mb-2">PRO PERFORMANCE</span>
              <h3 className="font-headline-md text-headline-md text-surface-container-lowest max-w-sm">
                Engineered for the elite athlete in you.
              </h3>
            </div>
          </div>
          
          <div className="space-y-gutter">
            {relatedProducts.slice(0, 1).map((related) => (
              <ProductCard
                key={related.id}
                id={related.id}
                title={related.title}
                price={related.price}
                compareAtPrice={related.compareAtPrice}
                imageSrc={related.imageSrc}
                hoverImageSrc={related.hoverImageSrc}
                colors={related.colors}
                badge={related.badge}
              />
            ))}
            <div className="bg-primary-container p-8 rounded-lg flex flex-col justify-between h-[180px]">
              <h4 className="font-headline-sm text-headline-sm text-on-primary-container leading-tight">
                Join playR Elite for 15% off your first order.
              </h4>
              <button className="font-label-md uppercase tracking-widest text-on-primary-container border-b-2 border-on-primary-container w-max">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
