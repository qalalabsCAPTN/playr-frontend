'use client';

import { useState } from 'react';

export default function SeoBlock() {
  const [open, setOpen] = useState(false);

  return (
    <section className="seo">
      <div className={`seo__body ${open ? 'open' : ''}`}>
        <h2>playR — Performance Sportswear &amp; Official Team Merchandise</h2>
        <p>
          playR is built for movement — engineering breathable caps, swim gear, and performance essentials for
          athletes and fans alike. From official IPL and MLC franchise merchandise to everyday training gear,
          every piece is designed to keep up with the game.
        </p>
        {open && (
          <p>
            Explore our Latest Drop, browse official Seattle Orcas MLC collections, or gear up for swim season
            with UV-protected goggles and chlorine-resistant caps. playR — lifestyle, sports, services.
          </p>
        )}
      </div>
      <button className="seo__toggle" onClick={() => setOpen((v) => !v)}>
        {open ? 'Read less' : 'Read more...'}
      </button>
    </section>
  );
}
