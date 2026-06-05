import type { Config } from 'tailwindcss';

const config: Omit<Config, 'content'> = {
  theme: {
    extend: {
      colors: {
        "tertiary": "#5e5e5d",
        "secondary-container": "#e6dfce",
        "on-secondary": "#ffffff",
        "surface-dim": "#dedad0",
        "on-error-container": "#93000a",
        "on-tertiary-fixed": "#1b1c1b",
        "on-primary-container": "#6b6117",
        "surface-bright": "#fef9ef",
        "primary-fixed-dim": "#d4c874",
        "on-surface-variant": "#4a4739",
        "on-error": "#ffffff",
        "on-background": "#1d1c16",
        "background": "#fef9ef",
        "error": "#ba1a1a",
        "surface-container-low": "#f8f3e9",
        "surface": "#fef9ef",
        "on-tertiary-fixed-variant": "#464746",
        "primary-container": "#ebde87",
        "secondary-fixed-dim": "#cdc6b5",
        "surface-container-high": "#ede8de",
        "tertiary-container": "#dedcda",
        "surface-tint": "#685f15",
        "surface-container": "#f2ede3",
        "on-secondary-container": "#676255",
        "inverse-surface": "#32302a",
        "secondary-fixed": "#e9e2d1",
        "outline": "#7b7767",
        "on-primary-fixed": "#201c00",
        "tertiary-fixed": "#e4e2e0",
        "primary-fixed": "#f1e48d",
        "primary": "#685f15",
        "on-secondary-fixed": "#1e1c11",
        "surface-variant": "#e7e2d8",
        "tertiary-fixed-dim": "#c8c6c5",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#ccc6b4",
        "inverse-primary": "#d4c874",
        "surface-container-highest": "#e7e2d8",
        "inverse-on-surface": "#f5f0e6",
        "on-tertiary-container": "#61615f",
        "on-primary": "#ffffff",
        "on-secondary-fixed-variant": "#4a473a",
        "secondary": "#635e51",
        "error-container": "#ffdad6",
        "on-tertiary": "#ffffff",
        "on-surface": "#1d1c16",
        "on-primary-fixed-variant": "#4f4700",
        // Keeping legacy accent for older components temporarily until they are swapped out
        "accent": "#867b5d",
        "action-yellow": "#685f15", // mapping to primary
        "onyx-gray": "#7b7767", // mapping to outline
        "parchment-base": "#f8f3e9", // mapping to surface-container-low
      },
      boxShadow: {
        'block': '4px 4px 0px 0px rgba(29, 28, 22, 1)', // block-shadow using on-surface color
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        full: "9999px"
      },
      spacing: {
        sm: "12px",
        base: "8px",
        gutter: "24px",
        md: "24px",
        "margin-mobile": "16px",
        xs: "4px",
        "margin-desktop": "48px",
        xl: "64px",
        lg: "40px"
      },
      fontFamily: {
        "headline-md": ["Chivo", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-lg": ["Chivo", "sans-serif"],
        "display-lg": ["Chivo", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Chivo", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline": ["Chivo", "sans-serif"],
        "display": ["Chivo", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["24px", {lineHeight: "1.3", fontWeight: "700"}],
        "label-md": ["14px", {lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "600"}],
        "headline-lg": ["32px", {lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "800"}],
        "display-lg": ["48px", {lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "900"}],
        "label-sm": ["12px", {lineHeight: "1.2", fontWeight: "500"}],
        "headline-lg-mobile": ["28px", {lineHeight: "1.2", fontWeight: "800"}],
        "body-lg": ["18px", {lineHeight: "1.6", fontWeight: "400"}],
        "body-md": ["16px", {lineHeight: "1.5", fontWeight: "400"}]
      }
    },
  },
};

export default config;
