import { notFound } from 'next/navigation';
import { products, getProduct } from '@/lib/data';
import ProductView from '@/components/ProductView';

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export function generateMetadata({ params }) {
  const p = getProduct(params.handle);
  return { title: p ? `${p.title} — playR` : 'Product — playR' };
}

export default function ProductPage({ params }) {
  const product = getProduct(params.handle);
  if (!product) notFound();
  return <ProductView product={product} />;
}
