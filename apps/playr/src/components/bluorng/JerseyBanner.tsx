'use client';

import Link from 'next/link';

const JERSEY_IMAGE = 'https://cdn.shopify.com/s/files/1/0679/5939/0427/files/1_a7d3a318-96f0-4525-a1b5-0d4974c9baa4.jpg?v=1756796308';

export default function JerseyBanner() {
  return (
    <section className="jerseybanner">
      <img src={JERSEY_IMAGE} alt="CSK Official Jersey" loading="lazy" />
      <div className="jerseybanner__overlay">
        <span className="jerseybanner__label">Official CSK IPL Jersey</span>
        <h2 className="jerseybanner__title">Customize Now</h2>
        <Link href="/collections/chennai-super-kings" className="pill pill--light">
          Shop the drop
        </Link>
      </div>
    </section>
  );
}
