import type { Config } from 'tailwindcss';
import sharedConfig from '@playr/ui/tailwind.config';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [sharedConfig],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
