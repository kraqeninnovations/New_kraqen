import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-hero': '#0f0f0f',
        'bg-section': '#1a1a1a',
        cream: '#F3EBDD',
        text: 'var(--text)',
        'text-heading': 'var(--text-heading)',
        'text-hover': 'var(--text-hover)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        accent: '#FF3300',
        'on-accent': '#1a1a1a',
      },
      fontFamily: {
        tanker: ['Tanker', '"Arial Narrow"', 'Impact', 'sans-serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        'mono': '0.04em',
      },
      lineHeight: {
        'display': '0.88',
      },
    },
  },
  plugins: [],
};

export default config;
