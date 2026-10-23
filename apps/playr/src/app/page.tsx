import React from 'react';
import Hero from '@/components/bluorng/Hero';
import NewArrivalsSlider from '@/components/bluorng/NewArrivalsSlider';
import CategorySlider from '@/components/bluorng/CategorySlider';
import JerseyCustomizationSection from '@/components/bluorng/JerseyCustomizationSection';
import IPLCollabSection from '@/components/bluorng/IPLCollabSection';
import ShopBySportSection from '@/components/bluorng/ShopBySportSection';
import ProductCinemaVideoSection from '@/components/bluorng/ProductCinemaVideoSection';
import BestSellerProductsSection from '@/components/bluorng/BestSellerProductsSection';
import BestSellerCollectionsSection from '@/components/bluorng/BestSellerCollectionsSection';
import TestimonialsSection from '@/components/bluorng/TestimonialsSection';
import BrandVideoSection from '@/components/bluorng/BrandVideoSection';
import RecentlyVisited from '@/components/bluorng/RecentlyVisited';
import SeoBlock from '@/components/bluorng/SeoBlock';
import NewsletterSection from '@/components/bluorng/NewsletterSection';
import { getCollectionProducts, products } from '@/lib/bluorng-data';

export default function HomePage() {
  // Section 2: 10 New Arrivals Cards
  const newArrivalsRaw = getCollectionProducts('new-in');
  const newArrivals = (
    newArrivalsRaw.length >= 10
      ? newArrivalsRaw
      : [...newArrivalsRaw, ...products.filter((p) => !newArrivalsRaw.some((n) => n.handle === p.handle))]
  ).slice(0, 10);

  // Section 8: 10 Best Seller Products (1:1 cards)
  const bestSellersRaw = products.filter(
    (p) =>
      p.compareAt ||
      p.collections.includes('caps') ||
      p.collections.includes('csk') ||
      p.collections.includes('swimming') ||
      p.collections.includes('cricket')
  );
  const bestSellers = (
    bestSellersRaw.length >= 10
      ? bestSellersRaw
      : products
  ).slice(0, 10);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Section 1: Multiple Banner (Auto Scroll) */}
      <Hero />

      {/* Section 2: New Arrivals (Slider Product Card view) (Auto Scroll + Scrolling option) (1:1 Product Cards) (1x4) 10 cards */}
      <NewArrivalsSlider
        products={newArrivals}
        title="New Arrivals"
        moreHref="/collections/new-in"
        boxed={true}
      />

      {/* Section 3: Shop by category: (1x4) (4:3 aspect ratio), 4:3 Category cards, (Auto Scroll + Scrolling option) total 10 cards (boxed) */}
      <CategorySlider />

      {/* Section 4: 1x2 video + image box overlayed with a button that can be hyperlinked (Customisation of jersey) */}
      <JerseyCustomizationSection
        videoSrc="/videos/jersey-custom.mp4"
        imageSrc="https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_a7d3a318-96f0-4525-a1b5-0d4974c9baa4.jpg?v=1756796308"
        videoHref="/collections/csk"
        imageHref="/collections/jersey"
      />

      {/* Section 5: Official collaboration: 1:1 banner of IPL collaboration */}
      <IPLCollabSection />

      {/* Section 6: Shop by sport: 4:3 collection boxed */}
      <ShopBySportSection />

      {/* Section 7: Category/product video, 21:9 with a CTA button */}
      <ProductCinemaVideoSection
        videoSrc="/videos/playr-promo.mp4"
        badge="Category Spotlight — Pro Series"
        title="Engineered For The Arena"
        subtitle="Discover tournament-tested matchwear and gear engineered with AERODRY moisture management, four-way stretch, and tournament durability."
        ctaText="Shop The Pro Series"
        ctaHref="/collections/new-in"
      />

      {/* Section 8: Best seller products || 1:1 || */}
      <BestSellerProductsSection
        products={bestSellers}
        title="Best Seller Products"
        moreHref="/collections/all-products"
      />

      {/* Section 9: 1:1 best seller collection */}
      <BestSellerCollectionsSection />

      {/* Section 10: Testimonial section (text + image/video) */}
      <TestimonialsSection />

      {/* Section 11: Brand Video Section with a CTA Button */}
      <BrandVideoSection
        videoSrc="/videos/playr-promo.mp4"
        ctaHref="/about"
      />

      {/* Auxiliary Storefront Support Blocks */}
      <RecentlyVisited />
      <SeoBlock />
      <NewsletterSection />
    </div>
  );
}
