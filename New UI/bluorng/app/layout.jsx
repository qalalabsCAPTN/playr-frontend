import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'playR — Stylish, sporty, and made for movement',
  description:
    'playR performance sportswear and gear: caps, official Seattle Orcas MLC merchandise, swimming goggles and swim caps. Made for movement.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <SmoothScroll />
          <Header />
          <div className="page-frame" aria-hidden />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
