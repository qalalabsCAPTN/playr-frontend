import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { collections, getCollectionProducts } from '@/lib/data';

export const metadata = { title: 'Collections — playR' };

export default function CollectionsIndex() {
  const entries = Object.entries(collections);
  return (
    <div className="listing">
      <div className="listing__head">
        <h1 className="listing__title">Collections</h1>
      </div>
      <Reveal stagger className="pgrid" as="div">
        {entries.map(([handle, col]) => {
          const items = getCollectionProducts(handle);
          if (items.length === 0) return null;
          return (
            <Link key={handle} href={`/collections/${handle}`} className="card">
              <div className="card__media">
                <img src={items[0].images[0]} alt={col.title} loading="lazy" className="active" />
              </div>
              <div className="card__info">
                <div>
                  <h3 className="card__title">{col.title}</h3>
                  <div className="card__price">{items.length} products</div>
                </div>
              </div>
            </Link>
          );
        })}
      </Reveal>
    </div>
  );
}
