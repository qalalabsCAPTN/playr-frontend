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
      console.warn("CMSService.getHomePageBlocks fetch failed, returning db fallback");
    }

    const data = await getDbCmsData('homepage');
    return data as any;
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
      console.warn("CMSService.getAboutPageBlocks fetch failed, returning db fallback");
    }

    const data = await getDbCmsData('about');
    return data as any;
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
      console.warn("CMSService.getMediaPageBlocks fetch failed, returning db fallback");
    }

    const data = await getDbCmsData('media');
    return data as any;
  }
}
