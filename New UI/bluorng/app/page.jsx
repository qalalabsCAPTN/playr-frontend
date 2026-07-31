import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import BannerSlider from '@/components/BannerSlider';
import RecentlyVisited from '@/components/RecentlyVisited';
import { getCollectionProducts } from '@/lib/data';

export default function Home() {
  const latest = getCollectionProducts('new-in');
  const caps = getCollectionProducts('caps');
  const goggles = getCollectionProducts('goggles').slice(0, 8);
  const swimCaps = getCollectionProducts('swim-caps').slice(0, 8);

  return (
    <>
      <Hero />
      <ProductSection title="Latest drop" products={latest} moreHref="/collections/new-in" gallery flat />
      <ProductSection title="playR Caps" products={caps} moreHref="/collections/caps" gallery />
      <BannerSlider />
      <ProductSection title="Swimming — Goggles" products={goggles} moreHref="/collections/goggles" gallery />
      <ProductSection title="Swim Caps" products={swimCaps} moreHref="/collections/swim-caps" gallery />
      <RecentlyVisited />
    </>
  );
}
