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
            <a href="tel:+918448441388">Call</a>
            <a href="https://wa.me/918448441388">Text (WhatsApp)</a>
            <a href="https://www.instagram.com/playr.in" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.playr.in" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
          <div>
            <h4>Order Support</h4>
            <Link href="/pages/returns">Make a return/Exchange</Link>
            <Link href="/pages/returns">Refund/Exchange policy</Link>
            <Link href="/account/orders">Track your order</Link>
            <Link href="/pages/terms">Shipping policy</Link>
            <Link href="/pages/faq">FAQ&apos;s</Link>
            <Link href="/pages/terms">Terms</Link>
          </div>
          <div>
            <h4>We are playR</h4>
            <Link href="/about">Our story</Link>
            <Link href="/collections/seattle-orcas">Walk-in Stores</Link>
            <Link href="/b2b">Collaborations</Link>
            <Link href="/contact">Careers</Link>
            <Link href="/media">Media</Link>
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
        <p className="footer__bottom">© {new Date().getFullYear()} playR — All rights reserved</p>
      </footer>
    </>
  );
}
