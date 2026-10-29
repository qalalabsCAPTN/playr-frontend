import NewsMediaView from '@/components/media/NewsMediaView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News & Media — playR',
  description: 'Official press releases, product drop announcements, and team partnership news from playR.',
  alternates: {
    canonical: '/news-media',
  },
};

export default function NewsMediaPage() {
  return <NewsMediaView />;
}
