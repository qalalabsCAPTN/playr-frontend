import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/orders/', '/checkout/success/'],
      },
    ],
    sitemap: 'https://playr.in/sitemap.xml',
    host: 'https://playr.in',
  };
}
