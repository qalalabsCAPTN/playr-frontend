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
            <Link href="/">Make a return/Exchange</Link>
            <Link href="/">Refund/Exchange policy</Link>
            <Link href="/">Track your order</Link>
            <Link href="/">Shipping policy</Link>
            <Link href="/">FAQ&apos;s</Link>
            <Link href="/">Terms</Link>
          </div>
          <div>
            <h4>We are playR</h4>
            <Link href="/">Our story</Link>
            <Link href="/">Walk-in Stores</Link>
            <Link href="/">Collaborations</Link>
            <Link href="/">Careers</Link>
            <Link href="/">Media</Link>
            <Link href="/">Blogs</Link>
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
