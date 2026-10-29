'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="popstrip">
        <b>Popular searches</b>
        <Link href="/collections/caps">Shop by category</Link>
        <Link href="/collections/new-in">Shop by style</Link>
        <Link href="/collections/all-products">Shop by color</Link>
      </div>

      <footer className="footer">
        <div className="footer__grid">
          <div>
            <h4>Connect with us</h4>
            <a href="tel:+919599370409">Call (+91 95993 70409)</a>
            <a href="https://wa.me/919599370409" target="_blank" rel="noreferrer">
              WhatsApp (+91 95993 70409)
            </a>
            <a href="mailto:orders@playr.in">Email: orders@playr.in</a>
            <a href="https://www.instagram.com/playr.in" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.youtube.com/@playr_in" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a href="https://www.linkedin.com/company/playr-in" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <div>
            <h4>Order Support</h4>
            <Link href="/pages/returns">Make a return/Exchange</Link>
            <Link href="/pages/returns">Refund/Exchange policy</Link>
            <Link href="/track-shipment">Track your order</Link>
            <Link href="/pages/terms">Shipping policy</Link>
            <Link href="/pages/faq">FAQ&apos;s</Link>
            <Link href="/support">Help &amp; Support</Link>
          </div>
          <div>
            <h4>We are playR</h4>
            <Link href="/about">Our story</Link>
            <Link href="/catalogue">Download Catalogues</Link>
            <Link href="/contact#offices">Our Offices &amp; Stores</Link>
            <Link href="/b2b">B2B &amp; Teamwear</Link>
            <Link href="/b2b#inquiry">Bulk &amp; custom orders</Link>
            <Link href="/b2b">Official Collabs</Link>
            <Link href="/contact">Careers</Link>
            <Link href="/news-media">News &amp; Media</Link>
            <Link href="/community">Blogs</Link>
          </div>
          <div className="footer__bag" aria-hidden>
            <div className="footer__bag-shape">
              <span>
                play<i>R</i>
              </span>
            </div>
          </div>
        </div>

        {/* Official Collabs Mission Blurb from Shopify Export */}
        <div className="max-w-4xl mx-auto px-6 py-6 text-center text-xs opacity-75 border-t border-[var(--border)] mt-8">
          <p className="leading-relaxed">
            Recognizing the integral role sports play in our daily routines, work, and lifestyles, we aspire to become the world&apos;s most beloved, efficient, and profitable omni-channel company. playR is positioned as a global leader in lifestyle, sports, and service management, driven by our unwavering dedication to customer satisfaction and excellence.
          </p>
        </div>

        <p className="footer__bottom">© 2026 playR All rights reserved by iCOREts Private Ltd.</p>
      </footer>
    </>
  );
}
