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

export class CMSService {
  static async getHomePageBlocks(): Promise<CMSHomepageData> {
    return {
      hero: {
        id: "hero-home-1",
        heading1: "Limitless",
        heading2: "Performance",
        description: "Engineered for the elite. Explore the latest drop of technical gear, compression wear, and official IPL merchandise.",
        primaryCta: { label: "Shop The New Drop", href: "/collections/new" },
        secondaryCta: { label: "Explore IPL Gear", href: "/collections/csk" },
      },
      collections: {
        heading: "Shop By Category",
        items: [
          { id: 'training', title: 'Elite Training', img: 'bg-zinc-800' },
          { id: 'csk', title: 'CSK Official', img: 'bg-yellow-900' },
          { id: 'lifestyle', title: 'Everyday Lifestyle', img: 'bg-zinc-700' },
        ]
      },
      brandStory: {
        heading: "From the Pitch to the Streets.",
        description1: "Born from a passion for sports and engineered with cutting-edge fabric technology. playR is the bridge between elite athletic performance and everyday lifestyle.",
        description2: "As the official merchandise partner for top-tier franchises across the globe, we understand what it takes to perform under pressure."
      }
    };
  }

  static async getAboutPageBlocks(): Promise<CMSAboutPageData> {
    return {
      hero: {
        id: "hero-about-1",
        badge: "Luminous Performance",
        heading1: "LIMITLESS",
        heading2: "PERFORMANCE",
        description: "Designed for the elite, engineered for the athlete. We define the intersection of technical innovation and modern athletic lifestyle.",
        primaryCta: { label: "Explore The Core", href: "#" }
      },
      brandStory: {
        id: "story-about-1",
        heading: "Our Journey",
        timeline: [
          { year: "2021", title: "The Inception", description: "November 2021 marked the launch of playR Apparel, debuting as the Kitting & Clothing Partner for Bihar Cricket Association (BCA)." },
          { year: "2023", title: "Global Partnerships", description: "Strategic expansion with Chennai Super Kings (CSK) as Exclusive Global Player Wear Merchandise Partner and entry into the Rajasthan Royals fold." },
          { year: "2025", title: "Omni-Channel Future", description: "Scaling across Quick Commerce, Pickleball Associations, and expanding our footprint to USA, Middle East, and beyond." }
        ],
        vision: {
          heading: "VISION",
          description: "To inspire and empower individuals to lead healthier, more meaningful lives through sports, providing apparel, equipment, and accessories that enrich and enhance everyday life."
        },
        mission: {
          heading: "MISSION",
          description1: "To foster a global community that embraces an active lifestyle while staying true to authenticity and innovation.",
          description2: "Crafting value and performance-driven products that seamlessly integrate comfort and style for the elite player."
        },
        coreValues: [
          { title: "Player First", description: "Equip the player with the right tools to excel in their field, prioritizing performance above all else.", icon: "sports_handball" },
          { title: "LET'S PLAY", description: "Encourage a healthier, meaningful life through sports, making elite performance accessible to every aspiring athlete.", icon: "celebration" },
          { title: "Omni-Channel", description: "Value-driven offerings and accessibility across markets, ensuring playR is where the athlete is.", icon: "hub" }
        ],
        partners: ['MI', 'CSK', 'RR', 'PBKS', 'KKR', 'GT']
      }
    };
  }

  static async getMediaPageBlocks(): Promise<CMSMediaPageData> {
    return {
      hero: {
        id: "hero-media-1",
        badge: "Official Announcement",
        heading1: "playR Official Kitting Partner for Chennai Super Kings",
        description: "OCTOBER 24, 2024",
        primaryCta: { label: "Read the Story", href: "#" }
      },
      media: {
        id: "media-hub-1",
        headline: "Latest Headlines",
        mainArticle: {
          category: "Merchandise",
          title: "playR x Mumbai Indians: Official Merchandise Launch",
          description: "Celebrate the spirit of the game with the all-new Mumbai Indians fan gear, designed for maximum performance and ultimate comfort.",
          link: "#"
        },
        sidebarArticle: {
          category: "New Arrival",
          title: "New Pickleball Collection Release: Pro Series 2024",
          description: "Engineered for speed, our latest Pickleball range brings professional-grade gear to enthusiasts worldwide.",
          link: "#"
        },
        articles: [
          { category: "Global Footprint", title: "Expansion into International Markets: playR UAE & UK", description: "Taking Indian sports excellence to the world. We are officially live in the United Kingdom and United Arab Emirates.", link: "#" },
          { category: "Partnerships", title: "playR x Rajasthan Royals: Exclusive Player Wear", description: "Engineered with AERODRY technology for the desert heat.", link: "#" },
          { category: "Community", title: "The Future of Athletic Lifestyle Gear", description: "How playR is bridging the gap between field performance and street style.", link: "#" }
        ]
      }
    };
  }
}
