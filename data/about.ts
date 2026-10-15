// ============================================================
// KRAQEN INNOVATIONS LLP — ABOUT PAGE DATA
// Single source of truth for /about page copy and assets
// ============================================================

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  alt: string;
  isGreyscaleDefault?: boolean;
}

export interface AboutService {
  number: string;
  name: string;
  description: string;
}

export interface ClientPartner {
  id: string;
  name: string;
  logo: string;
  hoverImage: string;
}

export interface StudioSplitPhoto {
  src: string;
  alt: string;
  widthRatio: string; // e.g. '66%' | '34%'
}

export interface ShowreelData {
  title: string;
  label: string;
  videoSrc: string;
  previewSrc: string;
  posterSrc: string;
}

// 1. Navigation
export const aboutNavData = {
  logo: 'kraqen',
  links: [
    { label: 'WORK', href: '/work' },
    { label: 'ABOUT', href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ],
};

// 2. Intro Section
export const aboutIntroData = {
  title: 'ABOUT',
  paragraph:
    'Kraqen Innovations translates brand moments into visceral perspectives, flexing between the quietude of the ethereal and the grit of the expressive. We are a close-knit production team drawn to ideas with texture, movement and feeling, shaping each frame with cinematic intent from first conversation through final delivery.',
};

// 3. Team Section
export const aboutTeamData = {
  members: [
    {
      id: 'victor-yuen',
      name: 'VICTOR YUEN',
      role: 'FOUNDER / CREATIVE DIRECTOR',
      bio: 'Victor has worked in the creative industry for more than a decade, collaborating with clients at every scale. With a background in design, he puts storytelling and strong visual direction at the forefront of every project. From large in-house creative teams to small businesses, he finds the most compelling way through each production.',
      image: '/about/victor-yuen.jpg',
      alt: 'Victor Yuen, Founder and Creative Director at Kraqen Innovations, smiling with hands in pockets',
      isGreyscaleDefault: true,
    },
    {
      id: 'max-tagesen',
      name: 'MAX TAGESEN',
      role: 'EDITOR / CAMERA OPERATOR / ASSISTANT',
      bio: 'Max is a multidisciplinary creator with an undying passion for sport. He tells real, meaningful stories through photography and video, looking for the emotion and movement that make each frame unique. No project is too small or too large. If there is a story worth telling, he is all in.',
      image: '/about/max-tagesen.jpg',
      alt: 'Max Tagesen, Editor and Camera Operator at Kraqen Innovations, smiling with arms crossed',
      isGreyscaleDefault: false,
    },
  ] as TeamMember[],
};

// 4. What We Do (Services)
export const aboutServicesData = {
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
  ] as AboutService[],
};

// 5. Studio Photo Split
export const aboutStudioSplitData = {
  left: {
    src: '/about/studio-left.jpg',
    alt: 'Kraqen Innovations team working at long white desk with large monitors and hanging paper globe lamp in airy studio',
    widthRatio: '66%',
  } as StudioSplitPhoto,
  right: {
    src: '/about/studio-right.jpg',
    alt: 'Studio interior shelf with potted plants, rugby ball, designer yellow lamp, books and gear',
    widthRatio: '34%',
  } as StudioSplitPhoto,
};

// 6. Approach + Client Grid
export const aboutApproachData = {
  labelLeft: 'APPROACH',
  labelRight: 'SELECTED PARTNERS',
  headline: ['A POINT OF VIEW, CARRIED', 'THROUGH EVERY FRAME.'],
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
  ] as ClientPartner[],
};

// 7. Marquee Strip (reused)
export { marqueeData } from '@/data/home';

// 8. Footer (reused)
export { footerData } from '@/data/home';

// 9. Floating Reel Widget
export const showreelData: ShowreelData = {
  title: 'KRAQEN INNOVATIONS — 2026 REEL',
  label: 'VIEW REEL',
  videoSrc: '/about/showreel.mp4',
  previewSrc: '/about/showreel-preview.mp4',
  posterSrc: '/about/showreel-poster.jpg',
};

