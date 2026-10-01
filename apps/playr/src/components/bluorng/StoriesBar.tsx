'use client';

import { useState } from 'react';
import { stories } from '@/lib/bluorng-data';
import StoryViewer from './StoryViewer';

export default function StoriesBar() {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  if (!stories.length) return null;

  return (
    <>
      <div className="stories">
        {stories.map((s, idx) => (
          <button key={s.label} className="story" onClick={() => setActiveStoryIndex(idx)} aria-label={s.label}>
            <span className="story__ring">
              <img src={s.image} alt={s.label} loading="lazy" />
            </span>
            <span className="story__label">{s.label}</span>
          </button>
        ))}
      </div>
      {activeStoryIndex !== null && (
        <StoryViewer initialIndex={activeStoryIndex} onClose={() => setActiveStoryIndex(null)} />
      )}
    </>
  );
}
