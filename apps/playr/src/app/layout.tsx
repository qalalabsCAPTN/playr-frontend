import React from 'react';
import type { Metadata } from 'next';
import { Chivo, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/components/layout/Providers';

const chivo = Chivo({ subsets: ['latin'], variable: '--font-chivo' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://playr.in'),
  title: {
    default: 'playR | Engineered for Elite Performance',
    template: '%s | playR'
  },
  description: 'High-performance athletic gear, official IPL merchandise, and technical lifestyle apparel.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://playr.in',
    title: 'playR | Engineered for Elite Performance',
    description: 'High-performance athletic gear, official IPL merchandise, and technical lifestyle apparel.',
    siteName: 'playR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'playR | Engineered for Elite Performance',
    description: 'High-performance athletic gear, official IPL merchandise, and technical lifestyle apparel.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${chivo.variable} ${inter.variable} font-body-md min-h-screen flex flex-col bg-surface text-on-surface`}>
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
