import React from 'react';
import Hero from '@/components/bluorng/Hero';
import StoriesBar from '@/components/bluorng/StoriesBar';
import CategoryTiles from '@/components/bluorng/CategoryTiles';
import ProductSection from '@/components/bluorng/ProductSection';
import JerseyBanner from '@/components/bluorng/JerseyBanner';
import CollabMarquee from '@/components/bluorng/CollabMarquee';
import BannerSlider from '@/components/bluorng/BannerSlider';
import DiscoverCollections from '@/components/bluorng/DiscoverCollections';
import XPProgramTeaser from '@/components/bluorng/XPProgramTeaser';
import DefyLimits from '@/components/bluorng/DefyLimits';
import BrandStorySection from '@/components/bluorng/BrandStorySection';
import StoresSection from '@/components/bluorng/StoresSection';
import RecentlyVisited from '@/components/bluorng/RecentlyVisited';
import SeoBlock from '@/components/bluorng/SeoBlock';
import NewsletterSection from '@/components/bluorng/NewsletterSection';
import { getCollectionProducts } from '@/lib/bluorng-data';

export default function HomePage() {
  const latest = getCollectionProducts('new-in');
  const caps = getCollectionProducts('caps');
  const goggles = getCollectionProducts('goggles').slice(0, 8);
  const swimCaps = getCollectionProducts('swim-caps').slice(0, 8);

  return (
    <div>
      <Hero />
      <StoriesBar />
      <CategoryTiles />
      <ProductSection
        title="Latest drop"
        products={latest}
        moreHref="/collections/new-in"
        gallery={true}
        flat={true}
      />
      <JerseyBanner />
      <CollabMarquee />
      <ProductSection
        title="playR Caps"
        products={caps}
        moreHref="/collections/caps"
        gallery={true}
      />
      <BannerSlider />
      <DiscoverCollections />
      <XPProgramTeaser />
      <DefyLimits />
      <ProductSection
        title="Swimming — Goggles"
        products={goggles}
        moreHref="/collections/goggles"
        gallery={true}
      />
      <ProductSection
        title="Swim Caps"
        products={swimCaps}
        moreHref="/collections/swim-caps"
        gallery={true}
      />
      <BrandStorySection />
      <StoresSection />
      <RecentlyVisited />
      <SeoBlock />
      <NewsletterSection />
    </div>
  );
}
