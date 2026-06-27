export interface CMSHeroModule {
  id: string;
  badge?: string;
  heading1: string;
  heading2?: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  backgroundImageUrl?: string;
}

export interface CMSBrandStoryModule {
  id: string;
  heading: string;
  timeline: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  vision: {
    heading: string;
    description: string;
  };
  mission: {
    heading: string;
    description1: string;
    description2: string;
  };
  coreValues: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  partners: string[];
}

export interface CMSMediaModule {
  id: string;
  headline: string;
  mainArticle: {
    category: string;
    title: string;
    description: string;
    link: string;
  };
  sidebarArticle: {
    category: string;
    title: string;
    description: string;
    link: string;
  };
  articles: Array<{
    category: string;
    title: string;
    description: string;
    link: string;
  }>;
}

export interface CMSHomepageData {
  hero: CMSHeroModule;
  collections: {
    heading: string;
    items: Array<{ id: string; title: string; img: string }>;
  };
  brandStory: { heading: string; description1: string; description2: string; };
}

export interface CMSAboutPageData {
  hero: CMSHeroModule;
  brandStory: CMSBrandStoryModule;
}

export interface CMSMediaPageData {
  hero: CMSHeroModule;
  media: CMSMediaModule;
}

const FALLBACK_HOMEPAGE_DATA: CMSHomepageData = {
  hero: {
    id: "hero-1",
    badge: "playR XP Program",
    heading1: "LIMITLESS PERFORMANCE",
    description: "Built For Athletes, Teams & Champions",
    primaryCta: { label: "Explore Collection", href: "/collections/new" },
    secondaryCta: { label: "Customize Team Gear", href: "/b2b" }
  },
  collections: {
    heading: "Explore Collections",
    items: [
      { id: "col-1", title: "IPL Fan Gear", img: "" },
      { id: "col-2", title: "Athletic Wear", img: "" }
    ]
  },
  brandStory: {
    heading: "Our Story",
    description1: "Engineering high performance apparel.",
    description2: "Crafted for maximum comfort."
  }
};

const FALLBACK_ABOUT_DATA: CMSAboutPageData = {
  hero: {
    id: "about-hero",
    heading1: "We Are playR",
    description: "Uniting sports and apparel.",
    primaryCta: { label: "Learn More", href: "#" }
  },
  brandStory: {
    id: "story-1",
    heading: "The Journey",
    timeline: [],
    vision: { heading: "Vision", description: "Global sports brand." },
    mission: { heading: "Mission", description1: "Create the best athletic gear.", description2: "Empower everyday champions." },
    coreValues: [],
    partners: []
  }
};

const FALLBACK_MEDIA_DATA: CMSMediaPageData = {
  hero: {
    id: "media-hero",
    heading1: "playR Media Center",
    description: "Latest news and headlines.",
    primaryCta: { label: "Browse News", href: "#" }
  },
  media: {
    id: "media-1",
    headline: "Headlines",
    mainArticle: { category: "Launch", title: "New Season Gear Live", description: "Get the latest official fan wear.", link: "#" },
    sidebarArticle: { category: "News", title: "Expansion", description: "Live in UAE and UK.", link: "#" },
    articles: []
  }
};

import { getDbCmsData } from '../db/db';

export class CMSService {
  static async getHomePageBlocks(): Promise<CMSHomepageData> {
    if (typeof window === 'undefined') {
      const data = await getDbCmsData('homepage');
      if (data) return data as any;
    }

    try {
      const res = await fetch('/api/cms/homepage');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("CMSService.getHomePageBlocks fetch failed, returning client fallback");
    }

    return FALLBACK_HOMEPAGE_DATA;
  }

  static async getAboutPageBlocks(): Promise<CMSAboutPageData> {
    if (typeof window === 'undefined') {
      const data = await getDbCmsData('about');
      if (data) return data as any;
    }

    try {
      const res = await fetch('/api/cms/about');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("CMSService.getAboutPageBlocks fetch failed, returning client fallback");
    }

    return FALLBACK_ABOUT_DATA;
  }

  static async getMediaPageBlocks(): Promise<CMSMediaPageData> {
    if (typeof window === 'undefined') {
      const data = await getDbCmsData('media');
      if (data) return data as any;
    }

    try {
      const res = await fetch('/api/cms/media');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("CMSService.getMediaPageBlocks fetch failed, returning client fallback");
    }

    return FALLBACK_MEDIA_DATA;
  }
}
