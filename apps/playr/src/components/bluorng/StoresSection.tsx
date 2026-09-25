'use client';

import Reveal from './Reveal';
import { stores } from '@/lib/bluorng-data';

export default function StoresSection() {
  if (!stores.length) return null;

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Find playR across India</h2>
      </div>
      <Reveal stagger className="stores" as="div">
        {stores.map((s) => (
          <div key={s.city} className="store">
            <img src={s.image} alt={s.city} loading="lazy" />
            <span className="store__open">Open now</span>
            <div className="store__meta">
              <h3 className="store__city">{s.city}</h3>
              <p className="store__addr">
                {s.address}
                <br />
                {s.phone}
              </p>
              <a href={s.map} target="_blank" rel="noreferrer">
                Get direction
              </a>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
