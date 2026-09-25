import React from 'react';
import Hero from '@/components/bluorng/Hero';
import StoriesBar from '@/components/bluorng/StoriesBar';
import ProductSection from '@/components/bluorng/ProductSection';
import BannerSlider from '@/components/bluorng/BannerSlider';
import DiscoverCollections from '@/components/bluorng/DiscoverCollections';
import StoresSection from '@/components/bluorng/StoresSection';
import SeoBlock from '@/components/bluorng/SeoBlock';
import RecentlyVisited from '@/components/bluorng/RecentlyVisited';
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
      <ProductSection
        title="Latest drop"
        products={latest}
        moreHref="/collections/new-in"
        gallery={true}
        flat={true}
      />
      <ProductSection
        title="playR Caps"
        products={caps}
        moreHref="/collections/caps"
        gallery={true}
      />
      <BannerSlider />
      <DiscoverCollections />
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
      <StoresSection />
      <RecentlyVisited />
      <SeoBlock />
    </div>
  );
}
