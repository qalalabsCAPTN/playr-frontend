import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/storefront-auth-profile.css';
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.png', type: 'image/png', sizes: '200x200' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.png',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
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
