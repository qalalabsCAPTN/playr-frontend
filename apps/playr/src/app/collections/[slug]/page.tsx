import * as React from "react"
import Image from "next/image"
import type { Metadata } from "next"
import { NectarCommerce } from "@playr/nectar-core"
import { ProductCard, ProductGrid } from "@playr/ui"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const collection = await NectarCommerce.getCollection(resolvedParams.slug)
  return {
    title: collection.title,
    description: `Shop the ${collection.title} collection at playR. Engineered for elite performance.`,
    alternates: {
      canonical: `/collections/${resolvedParams.slug}`,
    }
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const collection = await NectarCommerce.getCollection(resolvedParams.slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": collection.title,
    "description": `Shop the ${collection.title} collection at playR. Engineered for elite performance.`,
    "url": `https://playr.in/collections/${resolvedParams.slug}`
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden mt-20">
        <Image
          fill
          alt="Premium Polos Collection Hero"
          className="object-cover"
          src="https://lh3.googleusercontent.com/aida/ADBb0uhTzYlWwYy0PWWwN0zWKVPqkplcOSMPpMnJW1DWxh6sKc7J1Iq1bYz5LMtTVLhgYCvttgal648bHN-z_UOHhwWOvzSqEE-HAWJ_BV_XmVgy3na8TggQ17xpXjgoL_pV1HCIg_cp4MdjU6oC65dzOQahZ0GlI3x4mpey97mgIXJuBT_f7Le-vVrlup0Ak3XgBf1oN6hmmHUhFDhQXVj5otQxNFNRYDCiLTX9Z07V2v2CGh-AuApbviNIORc"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop">
          <h1 className="text-white font-headline-lg text-4xl md:text-6xl uppercase tracking-widest mb-4">
            {collection.title}
          </h1>
          <p className="text-white/90 font-body-lg text-lg md:text-xl max-w-2xl mb-8">
            Performance engineered for the modern athlete.
          </p>
          <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-md text-label-md tracking-wider hover:bg-primary/90 transition-all uppercase shadow-xl">
            SHOP THE COLLECTION
          </button>
        </div>
      </section>

      <main className="pb-24 md:pb-12 max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-12">
        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-xl">
              <div>
                <h3 className="font-headline-md text-headline-md mb-md">Categories</h3>
                <ul className="space-y-sm">
                  <li>
                    <label className="flex items-center gap-sm cursor-pointer hover:text-primary transition-colors">
                      <input className="rounded-sm border-outline/30 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-label-md">T-Shirts</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-sm cursor-pointer text-primary font-bold">
                      <input defaultChecked className="rounded-sm border-outline/30 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-label-md">Polos</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-sm cursor-pointer hover:text-primary transition-colors">
                      <input className="rounded-sm border-outline/30 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-label-md">Shorts</span>
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center gap-sm cursor-pointer hover:text-primary transition-colors">
                      <input className="rounded-sm border-outline/30 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-label-md">Joggers</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div className="border-t border-outline/10 pt-xl">
                <h3 className="font-headline-md text-headline-md mb-md">Price Range</h3>
                <div className="space-y-sm">
                  <input className="w-full accent-primary h-1 bg-surface-container-highest rounded-full" max="2000" min="200" type="range" />
                  <div className="flex justify-between text-label-sm text-outline">
                    <span>₹ 200</span>
                    <span>₹ 2,000</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-outline/10 pt-xl">
                <h3 className="font-headline-md text-headline-md mb-md">Size</h3>
                <div className="grid grid-cols-3 gap-xs">
                  <button className="border border-outline/30 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-colors">XS</button>
                  <button className="border border-outline/30 py-2 rounded-lg text-label-sm bg-primary text-on-primary">S</button>
                  <button className="border border-outline/30 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-colors">M</button>
                  <button className="border border-outline/30 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-colors">L</button>
                  <button className="border border-outline/30 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-colors">XL</button>
                  <button className="border border-outline/30 py-2 rounded-lg text-label-sm hover:bg-primary hover:text-on-primary transition-colors">2XL</button>
                </div>
              </div>
              <div className="border-t border-outline/10 pt-xl">
                <h3 className="font-headline-md text-headline-md mb-md">Color</h3>
                <div className="flex flex-wrap gap-sm">
                  <div className="w-8 h-8 rounded-full bg-white border border-outline/20 cursor-pointer ring-2 ring-primary ring-offset-2"></div>
                  <div className="w-8 h-8 rounded-full bg-black cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-blue-900 cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-[#5c5c5b] cursor-pointer"></div>
                  <div className="w-8 h-8 rounded-full bg-red-600 cursor-pointer"></div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 space-y-xl">
            {/* Sorting & Info Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface-container-low p-md rounded-xl">
              <div>
                <h1 className="font-headline-lg text-headline-lg">{collection.title}</h1>
                <p className="text-label-md text-outline">Showing {collection.productCount} products</p>
              </div>
              <div className="flex items-center gap-md w-full md:w-auto">
                <span className="text-label-md font-bold text-outline whitespace-nowrap">Sort by</span>
                <select className="w-full md:w-48 bg-surface-container border-outline/20 rounded-lg text-label-md focus:ring-primary focus:border-primary">
                  <option>Featured</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Bento Grid */}
            <ProductGrid>
              {collection.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice}
                  imageSrc={product.imageSrc}
                  hoverImageSrc={product.hoverImageSrc}
                  colors={product.colors}
                  badge={product.badge}
                />
              ))}
            </ProductGrid>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-md py-xl">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline/20 hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="flex gap-sm">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary font-bold">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">3</button>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-outline/20 hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
