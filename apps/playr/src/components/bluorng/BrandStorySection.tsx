'use client';

import Link from 'next/link';

export default function BrandStorySection() {
  return (
    <section className="brandstory">
      <div className="brandstory__copy">
        <span className="brandstory__label">Our Story</span>
        <h2 className="brandstory__title">From the Pitch to the Streets</h2>
        <p>
          playR was built by athletes, for athletes — engineering performance sportswear that moves from the
          field to everyday life without compromise. Every stitch is tested on real match days, real training
          sessions, and real streets.
        </p>
        <Link href="/about" className="pill pill--dark">
          Our heritage
        </Link>
      </div>
      <div className="brandstory__media" />
    </section>
  );
}
