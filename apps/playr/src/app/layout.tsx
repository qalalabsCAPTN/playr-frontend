import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { StorefrontShell } from '@/components/layout/StorefrontShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://playr.in'),
  title: {
    default: 'playR | Luxury Sportwear & Performance Gear',
    template: '%s | playR'
  },
  description: 'High-performance athletic gear, official IPL & MLC merchandise, and technical streetwear apparel.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://playr.in',
    title: 'playR | Luxury Sportwear & Performance Gear',
    description: 'High-performance athletic gear, official IPL & MLC merchandise, and technical streetwear apparel.',
    siteName: 'playR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'playR | Luxury Sportwear & Performance Gear',
    description: 'High-performance athletic gear, official IPL & MLC merchandise, and technical streetwear apparel.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('playr-theme');if(t==='dark'){document.documentElement.classList.add('theme-dark');document.body&&document.body.classList.add('theme-dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <StorefrontShell>
            {children}
          </StorefrontShell>
        </Providers>
      </body>
    </html>
  );
}
