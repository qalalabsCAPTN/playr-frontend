'use client';

import { useState } from 'react';
import { stories } from '@/lib/bluorng-data';
import StoryViewer from './StoryViewer';

export default function StoriesBar() {
  const [open, setOpen] = useState(false);

  if (!stories.length) return null;

  return (
    <>
      <div className="stories">
        {stories.map((s) => (
          <button key={s.label} className="story" onClick={() => setOpen(true)} aria-label={s.label}>
            <span className="story__ring">
              <img src={s.image} alt={s.label} loading="lazy" />
            </span>
            <span className="story__label">{s.label}</span>
          </button>
        ))}
      </div>
      {open && <StoryViewer onClose={() => setOpen(false)} />}
    </>
  );
}
