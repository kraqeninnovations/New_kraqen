// ============================================================
// KRAQEN INNOVATIONS LLP — SINGLE SOURCE OF TRUTH
// All content, images, and data live here.
// Swap any value; the UI reflects it automatically.
// ============================================================

export type ProjectStyle = 'full-bleed' | 'inset';

export interface HeroImage {
  src: string;
  alt: string;
  position: 'top-center' | 'left' | 'left-center' | 'right';
}

export interface Project {
  id: string;
  name: string;
  services: string;
  year: string;
  image: string;
  imageStyle: ProjectStyle;
}

export interface Service {
  number: string;
  name: string;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string; // path to SVG/PNG in /public/logos/
  hoverImage: string; // path in /public/images/
}

export interface MarqueeItem {
  type: 'wordmark' | 'text' | 'badge' | 'separator' | 'pill' | 'star';
  content?: string;
}

// ============================================================
// NAVIGATION
// ============================================================
export const navData = {
  logo: 'kraqen',
  links: [
    { label: 'WORK', href: '/work' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ],
};

// ============================================================
// HERO SECTION
// ============================================================
export const heroData = {
  headline: ['WE GIVE', 'YOU A POINT', 'OF VIEW'],
  location: 'VANCOUVER — BC',
  description:
    "You're building a brand with something to say. We translate that story into cinematic work people feel, remember, and recognize as yours.",
  cta: { label: 'VIEW OUR WORK', href: '#work' },
  images: [
    {
      src: '/images/hero-snacks.jpg',
      alt: 'Smiling woman holding colorful snack packs',
      position: 'top-center',
    },
    {
      src: '/images/hero-runner.jpg',
      alt: 'Person running on grass field, motion blur',
      position: 'left',
    },
    {
      src: '/images/hero-ice.jpg',
      alt: 'Blue ice cube on deep blue background',
      position: 'left-center',
    },
    {
      src: '/images/hero-city.jpg',
      alt: 'City skyline at golden hour sunset',
      position: 'right',
    },
  ] as HeroImage[],
};

// ============================================================
// SELECTED WORK SECTION
// ============================================================
export const workData = {
  sectionLabel: 'SELECTED WORK',
  heading: ['SELECTED', 'WORK'],
  description: 'A selection of films, photographs, campaigns, and brand worlds.',
  projects: [
    {
      id: '01',
      name: 'RUGBY BRICKS',
      services: 'PHOTOGRAPHY + VIDEOGRAPHY',
      year: '2026',
      image: '/images/project-rugby.jpg',
      imageStyle: 'full-bleed',
    },
    {
      id: '02',
      name: 'SNACKISH',
      services: 'PHOTOGRAPHY + VIDEOGRAPHY',
      year: '2026',
      image: '/images/project-snackish.jpg',
      imageStyle: 'inset',
    },
    {
      id: '03',
      name: 'KODAMA ICE CO.',
      services: 'PHOTOGRAPHY + VIDEOGRAPHY',
      year: '2026',
      image: '/images/project-ice.jpg',
      imageStyle: 'full-bleed',
    },
    {
      id: '04',
      name: 'CAFÉ KITSUNÉ',
      services: 'BRAND FILM + EDITORIAL',
      year: '2026',
      image: '/images/hover-kitsune.jpg',
      imageStyle: 'full-bleed',
    },
  ] as Project[],
};

// ============================================================
// WHAT WE DO — SERVICES
// ============================================================
export const servicesData = {
  labelLeft: 'WHAT WE DO',
  labelRight: 'FULL SERVICE PRODUCTION',
  services: [
    {
      number: '01',
      name: 'VIDEOGRAPHY',
      description: 'END-TO-END VIDEO PRODUCTION SHAPED AROUND THE STORY.',
    },
    {
      number: '02',
      name: 'PHOTOGRAPHY',
      description: 'CAMPAIGN, PRODUCT, AND EDITORIAL IMAGERY WITH CINEMATIC INTENT.',
    },
    {
      number: '03',
      name: 'SOCIAL CONTENT',
      description: 'PLATFORM-NATIVE STORIES TOLD BESPOKE FOR YOUR BRAND.',
    },
    {
      number: '04',
      name: 'CREATIVE DIRECTION',
      description: 'CONCEPT AND VISUAL DIRECTION THAT CONNECTS EVERY FRAME.',
    },
  ] as Service[],
};

// ============================================================
// PARTNERS / CLIENT GRID
// ============================================================
export const partnersData = {
  labelLeft: "FRIENDS WE'VE WORKED WITH",
  labelRight: 'SELECTED PARTNERS',
  heading: ['GOOD COMPANY.', 'GREAT STORIES.'],
  clients: [
    {
      id: 'snackish',
      name: 'snackish',
      logo: '/logos/snackish.svg',
      hoverImage: '/images/hover-snackish.jpg',
    },
    {
      id: 'smart-sweets',
      name: 'Smart Sweets',
      logo: '/logos/smart-sweets.svg',
      hoverImage: '/images/hover-smart-sweets.jpg',
    },
    {
      id: 'kitsune',
      name: 'Café Kitsuné Paris',
      logo: '/logos/kitsune.svg',
      hoverImage: '/images/hover-kitsune.jpg',
    },
    {
      id: 'rugbybricks',
      name: 'Rugbybricks',
      logo: '/logos/rugbybricks.svg',
      hoverImage: '/images/hover-rugbybricks.jpg',
    },
    {
      id: 'staffbase',
      name: 'Staffbase',
      logo: '/logos/staffbase.svg',
      hoverImage: '/images/hover-staffbase.jpg',
    },
    {
      id: 'tevah',
      name: 'Tevah',
      logo: '/logos/tevah.svg',
      hoverImage: '/images/hover-tevah.jpg',
    },
    {
      id: 'mugco',
      name: 'Mug Co.',
      logo: '/logos/mug.svg',
      hoverImage: '/images/hover-mug.jpg',
    },
    {
      id: 'slo',
      name: 'slo.',
      logo: '/logos/slo.svg',
      hoverImage: '/images/hover-slo.jpg',
    },
  ] as Client[],
};

// ============================================================
// MARQUEE STRIP (orange #FF3300)
// ============================================================
export const marqueeData = {
  items: [
    { type: 'wordmark', content: 'kraqen' },
    {
      type: 'text',
      content:
        'WE BUILD BRANDS THAT PERFORM, SCALE AND DOMINATE. CREATIVITY, TECHNOLOGY AND DIGITAL INNOVATION UNDER ONE ROOF.',
    },
    { type: 'badge' },
    { type: 'separator', content: 'CREATIVE + TECH + MARKETING' },
    { type: 'wordmark', content: 'kraqen' },
    {
      type: 'text',
      content:
        'FROM BRANDING AND VIDEO TO MARKETING, WEBSITES AND SOFTWARE. CREATIVITY THAT PERFORMS.',
    },
    { type: 'badge' },
    { type: 'star' },
    { type: 'pill', content: 'KRAQEN INNOVATIONS' },
    { type: 'star' },
  ] as MarqueeItem[],
};

// ============================================================
// FOOTER / CTA
// ============================================================
export const footerData = {
  roundLogo: 'kraqen',
  cta: {
    line1: "LET'S WORK",
    line2: 'TOGETHER',
    href: '/contact',
  },
  navColumns: [
    [
      { label: 'WORK', href: '/work' },
      { label: 'ABOUT', href: '/about' },
      { label: 'CONTACT', href: '/contact' },
    ],
    [
      { label: 'INSTAGRAM', href: 'https://instagram.com/kraqeninc' },
      { label: 'LINKEDIN', href: 'https://linkedin.com/company/kraqeninc' },
      { label: 'TWITTER / X', href: 'https://x.com/kraqeninc' },
    ],
  ],
  wordmark: 'kraqen',
  copyright: '© 2026 KRAQEN INNOVATIONS LLP. ALL RIGHTS RESERVED.',
};
