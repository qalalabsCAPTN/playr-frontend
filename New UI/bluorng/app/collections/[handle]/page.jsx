import { notFound } from 'next/navigation';
import { collections } from '@/lib/data';
import CollectionView from '@/components/CollectionView';

export function generateStaticParams() {
  return Object.keys(collections).map((handle) => ({ handle }));
}

export function generateMetadata({ params }) {
  const col = collections[params.handle];
  return { title: col ? `${col.title} — playR` : 'Collection — playR' };
}

export default function CollectionPage({ params }) {
  const col = collections[params.handle];
  if (!col) notFound();
  return <CollectionView handle={params.handle} />;
}
