import * as React from 'react';
import type { Metadata } from 'next';
import CollectionView from '@/components/bluorng/CollectionView';

export const metadata: Metadata = {
  title: 'Full Product Catalogue — playR',
  description: 'Explore the complete playR product catalogue: performance athleticwear, official IPL & MLC merchandise, gear, and accessories.',
  alternates: {
    canonical: '/catalogue',
  },
};

export default function CataloguePage() {
  return <CollectionView handle="all-products" />;
}
