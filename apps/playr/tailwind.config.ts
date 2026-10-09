import type { Config } from 'tailwindcss';
import sharedConfig from '@playr/ui/tailwind.config';

const calibriFont = ['Calibri', "'Segoe UI'", 'Candara', 'Arial', 'sans-serif'];

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [sharedConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: calibriFont,
        headline: calibriFont,
        display: calibriFont,
        body: calibriFont,
        label: calibriFont,
        'headline-xl': calibriFont,
        'headline-lg': calibriFont,
        'headline-md': calibriFont,
        'headline-sm': calibriFont,
        'display-xl': calibriFont,
        'display-lg': calibriFont,
        'label-xl': calibriFont,
        'label-lg': calibriFont,
        'label-md': calibriFont,
        'label-sm': calibriFont,
        'label-bold': calibriFont,
        'body-lg': calibriFont,
        'body-md': calibriFont,
        'body-sm': calibriFont,
      },
    },
  },
  plugins: [],
};

export default config;
