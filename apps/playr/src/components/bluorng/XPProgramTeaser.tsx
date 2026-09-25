'use client';

import Link from 'next/link';

const TIERS = [
  { name: 'Bronze', min: '0' },
  { name: 'Silver', min: '1,000' },
  { name: 'Gold', min: '5,000' },
  { name: 'Elite', min: '10,000' },
];

export default function XPProgramTeaser() {
  return (
    <section className="xpteaser">
      <div className="panel__head">
        <h2 className="panel__title">playR XP Program</h2>
        <Link href="/challenges" className="pill">
          Play. Earn. Dominate.
        </Link>
      </div>
      <div className="xpteaser__tiers">
        {TIERS.map((t) => (
          <div key={t.name} className="xpteaser__tier">
            <span className="xpteaser__tier-name">{t.name}</span>
            <span className="xpteaser__tier-min">{t.min}+ XP</span>
          </div>
        ))}
      </div>
    </section>
  );
}
