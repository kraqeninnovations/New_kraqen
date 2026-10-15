export interface SiteConfig {
  name: string;
  legalName: string;
  shortName: string;
  url: string;
  email: string;
  phone: string;
  tagline: string;
  description: string;
  copyright: string;
  socials: { label: string; href: string }[];
  marqueeTexts: {
    pill: string;
    category: string;
    p1: string;
    p2: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Kraqen Innovations LLP',
  legalName: 'Kraqen Innovations LLP',
  shortName: 'Kraqen',
  url: 'https://www.kraqeninc.com',
  email: 'support@kraqeninc.com',
  phone: '+91 8939651621',
  tagline: 'We Build Brands That Perform, Scale & Dominate',
  description:
    'Kraqen Innovations LLP is a creative, technology and digital innovation partner. We build brands that perform, scale and dominate.',
  copyright: '© 2026 KRAQEN INNOVATIONS LLP. ALL RIGHTS RESERVED.',
  socials: [
    { label: 'INSTAGRAM', href: 'https://instagram.com/kraqeninc' },
    { label: 'LINKEDIN', href: 'https://linkedin.com/company/kraqeninc' },
    { label: 'TWITTER / X', href: 'https://x.com/kraqeninc' },
    { label: 'YOUTUBE', href: 'https://youtube.com/@kraqeninc' },
  ],
  marqueeTexts: {
    pill: 'KRAQEN INNOVATIONS',
    category: 'CREATIVE + TECH + MARKETING',
    p1: 'WE BUILD BRANDS THAT PERFORM, SCALE AND DOMINATE. CREATIVITY, TECHNOLOGY AND DIGITAL INNOVATION UNDER ONE ROOF.',
    p2: 'FROM BRANDING AND VIDEO TO MARKETING, WEBSITES AND SOFTWARE. CREATIVITY THAT PERFORMS.',
  },
};

export const SOCIALS = siteConfig.socials;

