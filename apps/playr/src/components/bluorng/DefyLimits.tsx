'use client';

import Link from 'next/link';

export default function DefyLimits() {
  return (
    <section className="defylimits">
      <div className="defylimits__overlay">
        <span className="defylimits__label">Engineered for Performance</span>
        <h2 className="defylimits__title">Defy Limits — Discover the Tech</h2>
        <p>AERODRY moisture management, four-way stretch, and UV protection built into every piece.</p>
        <Link href="/about" className="pill pill--light">
          Discover the tech
        </Link>
      </div>
    </section>
  );
}
