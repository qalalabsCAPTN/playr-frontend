import React from 'react';
import Hero from '@/components/bluorng/Hero';
import ProductSection from '@/components/bluorng/ProductSection';
import BannerSlider from '@/components/bluorng/BannerSlider';
import { products } from '@/lib/bluorng-data';

export default function HomePage() {
  const latestDrop = products.slice(0, 8);
  const seattleOrcas = products.filter((p) => p.collections.includes('seattle-orcas')).slice(0, 8);
  const swimmingGear = products.filter((p) => p.collections.includes('swimming')).slice(0, 8);

  return (
    <div>
      <Hero />
      <ProductSection
        title="Latest drop"
        products={latestDrop}
        moreHref="/collections/new-in"
        gallery={true}
        flat={true}
      />
      <ProductSection
        title="Seattle Orcas x MLC 2026"
        products={seattleOrcas}
        moreHref="/collections/seattle-orcas"
        gallery={true}
      />
      <BannerSlider />
      <ProductSection
        title="Swimming & Performance Gear"
        products={swimmingGear}
        moreHref="/collections/swimming"
        gallery={true}
      />
    </div>
  );
}
