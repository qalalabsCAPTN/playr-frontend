import * as React from "react"
import type { Metadata } from "next"
import CollectionView from "@/components/bluorng/CollectionView"
import { collections, formatCollectionTitle } from "@/lib/bluorng-data"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const title = formatCollectionTitle(resolvedParams.slug);
  const col = collections[resolvedParams.slug] || { title, description: `Shop the ${title} collection at playR.` };
  return {
    title: col.title,
    description: `Shop the ${col.title} collection at playR. Luxury sportwear & performance gear.`,
    alternates: {
      canonical: `/collections/${resolvedParams.slug}`,
    }
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  return <CollectionView handle={resolvedParams.slug} />;
}
