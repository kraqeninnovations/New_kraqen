// ============================================================
// KRAQEN INNOVATIONS LLP — WORK PAGE DATA
// Single source of truth for /work portfolio gallery
// ============================================================

export interface WorkProject {
  id: string;
  title: string;
  category: string;
  tags: string[];
  year: string;
  image: string;
  isVideo?: boolean;
  videoSrc?: string;
  aspect: string; // e.g. 'aspect-[16/9]' | 'aspect-[3/4]' | 'aspect-[3/5]'
  column: 'left' | 'right';
}

export const workCategories = [
  'ALL WORK',
  'PHOTOGRAPHY',
  'VIDEOGRAPHY',
  'CREATIVE DIRECTION',
  'POST-PRODUCTION',
  'SOCIAL CONTENT',
  'FILM PRODUCTION',
  'CAMPAIGN',
];

export const workPageData = {
  meta: {
    title: 'Kraqen Innovations LLP',
    description:
      'A selection of films, photographs, campaigns, and brand worlds created by Kraqen Innovations LLP.',
  },
  header: {
    title: 'WORK',
    countLabel: '10',
    totalLabel: '10',
  },
  projects: [
    // Left column items
    {
      id: 'rugby-bricks',
      title: 'RUGBY BRICKS',
      category: 'PHOTOGRAPHY + VIDEOGRAPHY',
      tags: ['PHOTOGRAPHY', 'VIDEOGRAPHY', 'CAMPAIGN'],
      year: '2026',
      image: '/images/hero-runner.jpg',
      aspect: 'aspect-[16/9]',
      column: 'left',
    },
    {
      id: 'smart-sweets-campaign',
      title: 'SMART SWEETS',
      category: 'CAMPAIGN + SOCIAL CONTENT',
      tags: ['CAMPAIGN', 'SOCIAL CONTENT', 'PHOTOGRAPHY'],
      year: '2026',
      image: '/images/hero-snacks.jpg',
      aspect: 'aspect-[16/9]',
      column: 'left',
    },
    {
      id: 'mug-co',
      title: 'MUG CO.',
      category: 'COMMERCIAL PHOTOGRAPHY',
      tags: ['PHOTOGRAPHY', 'CREATIVE DIRECTION'],
      year: '2026',
      image: '/images/hover-mug.jpg',
      aspect: 'aspect-[3/4]',
      column: 'left',
    },
    {
      id: 'snackish-food',
      title: 'SNACKISH',
      category: 'PHOTOGRAPHY + FILM',
      tags: ['PHOTOGRAPHY', 'FILM PRODUCTION', 'CAMPAIGN'],
      year: '2026',
      image: '/images/project-snackish.jpg',
      aspect: 'aspect-[16/9]',
      column: 'left',
    },
    {
      id: 'staffbase-cinema',
      title: 'STAFFBASE',
      category: 'BRAND FILM + EDITORIAL',
      tags: ['FILM PRODUCTION', 'CREATIVE DIRECTION', 'VIDEOGRAPHY'],
      year: '2026',
      image: '/images/hover-staffbase.jpg',
      aspect: 'aspect-[16/9]',
      column: 'left',
    },

    // Right column items
    {
      id: 'kodama-ice',
      title: 'KODAMA ICE CO.',
      category: 'PRODUCT PHOTOGRAPHY',
      tags: ['PHOTOGRAPHY', 'CREATIVE DIRECTION'],
      year: '2026',
      image: '/images/hero-ice.jpg',
      aspect: 'aspect-[3/5]',
      column: 'right',
    },
    {
      id: 'kraqen-showreel',
      title: 'KRAQEN SHOWREEL',
      category: 'FILM PRODUCTION',
      tags: ['FILM PRODUCTION', 'VIDEOGRAPHY', 'POST-PRODUCTION'],
      year: '2026',
      image: '/images/hero-city.jpg',
      isVideo: true,
      videoSrc: '/about/showreel-preview.mp4',
      aspect: 'aspect-[16/9]',
      column: 'right',
    },
    {
      id: 'snackish-packaging',
      title: 'SNACKISH VARIETY',
      category: 'PACKAGING + CAMPAIGN',
      tags: ['CAMPAIGN', 'PHOTOGRAPHY', 'CREATIVE DIRECTION'],
      year: '2026',
      image: '/images/snack-bags-yellow.jpg',
      aspect: 'aspect-[16/9]',
      column: 'right',
    },
    {
      id: 'cafe-kitsune',
      title: 'CAFÉ KITSUNÉ PARIS',
      category: 'BRAND FILM + EDITORIAL',
      tags: ['FILM PRODUCTION', 'PHOTOGRAPHY', 'VIDEOGRAPHY'],
      year: '2026',
      image: '/images/hover-kitsune.jpg',
      aspect: 'aspect-[3/4]',
      column: 'right',
    },
    {
      id: 'sweet-greens',
      title: 'SWEET GREENS',
      category: 'SOCIAL CONTENT + CAMPAIGN',
      tags: ['SOCIAL CONTENT', 'CAMPAIGN', 'PHOTOGRAPHY'],
      year: '2026',
      image: '/images/hover-smart-sweets.jpg',
      aspect: 'aspect-[16/9]',
      column: 'right',
    },
  ] as WorkProject[],
};

