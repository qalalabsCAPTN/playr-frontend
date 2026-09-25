'use client';

const PARTNERS = [
  'OFFICIAL PARTNER — CHENNAI SUPER KINGS',
  'OFFICIAL PARTNER — SUNRISERS HYDERABAD',
  'OFFICIAL PARTNER — LUCKNOW SUPER GIANTS',
  'OFFICIAL PARTNER — UP YODDHAS',
  'OFFICIAL PARTNER — SEATTLE ORCAS MLC',
];

export default function CollabMarquee() {
  const items = [...PARTNERS, ...PARTNERS];
  return (
    <div className="marquee">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
            <span className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
