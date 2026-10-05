import { useEffect, useState } from 'react';
import siteJson from '../data/site.json';
import type { SiteData } from './types';

const defaultSiteData: SiteData = {
  site: {
    name: "KRAQEN INNOVATIONS",
    shortName: "KRAQEN",
    tagline: "CREATIVE TECHNOLOGY & DIGITAL AGENCY",
    description: "We build digital products, websites, AI platforms and technology experiences for modern brands.",
    location: "CHENNAI · INDIA",
    year: "2026",
  },
  theme: {
    background: "#111111",
    surface: "#151515",
    text: "#F3F0E6",
    mutedText: "#A5A29B",
    border: "rgba(243,240,230,0.2)",
    accent: "#FF3B00",
    footerBackground: "#FF3B00",
    footerText: "#111111",
  },
  typography: {
    displayFont: "Anton, sans-serif",
    bodyFont: "Plus Jakarta Sans, sans-serif",
    displayWeight: 900,
    bodyWeight: 400,
    heroSize: "14vw",
    sectionHeadingSize: "6vw",
    serviceSize: "4vw",
    footerSize: "10vw",
  },
  navigation: {
    logo: "KRAQEN",
    links: [
      { label: "WORK", href: "/work" },
      { label: "ABOUT", href: "/about" },
      { label: "CONTACT", href: "/contact" },
    ],
    cta: { label: "START A PROJECT", href: "/contact" },
    mobileLabel: "MENU",
  },
  home: {
    hero: {
      eyebrow: "KRAQEN INNOVATIONS",
      title: ["WE BUILD", "YOUR DIGITAL", "EXPERIENCES."],
      description: "A creative technology agency building websites, web applications, and AI platform experiences.",
      cta: { label: "EXPLORE WORK ↗", href: "/work" },
      images: ["/assets/kraqen_hero_1.jpg", "/assets/kraqen_hero_2.jpg", "/assets/p1.jpg", "/assets/kraqen_hero_3.jpg"],
    },
    selectedWork: {
      eyebrow: "PORTFOLIO",
      title: ["SELECTED", "WORK"],
      description: "Explore our recent digital products and creative engineering.",
      projects: [],
    },
    services: {
      eyebrow: "SERVICES",
      title: "WHAT WE DO",
      items: [],
    },
    statement: {
      eyebrow: "CREATIVE MANIFESTO",
      title: ["A POINT OF VIEW.", "CARRIED THROUGH", "EVERY EXPERIENCE."],
    },
  },
  work: {
    eyebrow: "SELECTED WORK",
    title: "WORK",
    description: "Explore digital products and creative experiences built by Kraqen Innovations.",
    filters: [],
    projects: [],
  },
  about: {
    hero: {
      eyebrow: "ABOUT US",
      description: "Built for brands that hate boring, we mix creative energy with digital strategy to make businesses impossible to ignore.",
    },
    whyChooseKraqen: { title: "WHY CHOOSE KRAQEN", items: [] },
    expertise: { title: "OUR EXPERTISE", items: [] },
    vision: { eyebrow: "OUR VISION", intro: "WE BUILD BRANDS THAT DON'T JUST EXIST-", statement: ["THEY PERFORM,", "SCALE,", "AND DOMINATE."] },
    impact: { title: "OUR IMPACT", items: [] },
    projects: [],
  },
  contact: {
    hero: { title: ["WE CREATE.", "WE MARKET.", "WE BUILD."], subtitle: "MEET KRAQEN" },
    tel: "+91 44 4642 8157",
    phone: "+91 8939651621",
    email: "support@kraqeninc.com",
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "YouTube", href: "https://youtube.com" },
    ],
    location: { city: "CHENNAI", address: ["No 44, Vasantham Nagar,", "Kishkinta Main Road,", "Chennai - 600045"], timezone: "Asia/Kolkata" },
    form: {
      title: ["LET'S BUILD", "SOMETHING GREAT"],
      fields: {
        name: { label: "NAME", placeholder: "Your name", required: true },
        email: { label: "EMAIL", placeholder: "your@email.com", required: true },
        phone: { label: "PHONE NUMBER", placeholder: "Your phone number", required: true },
        message: { label: "DESCRIBE YOUR GOALS AND CHALLENGES", placeholder: "Type here..", required: true },
      },
      submit: "LET'S TALK GROWTH!",
    },
    newsletter: { title: ["SUBSCRIBE TO OUR", "NEWSLETTER"], label: "YOUR EMAIL", placeholder: "Enter your email", button: "SUBSCRIBE" },
  },
  footer: {
    eyebrow: "HAVE A PROJECT IN MIND?",
    title: ["LET'S WORK", "TOGETHER ↗"],
    brand: "KRAQEN",
    brandSubtitle: "INNOVATIONS",
    description: "Have an idea, product or brand that needs a digital experience? LET'S BUILD SOMETHING GREAT.",
    cta: { label: "START A PROJECT ↗", href: "/contact" },
    navigation: [
      { label: "SERVICES", href: "/services" },
      { label: "PORTFOLIO", href: "/work" },
      { label: "ABOUT", href: "/about" },
      { label: "CONTACT", href: "/contact" },
    ],
    socials: [
      { label: "INSTAGRAM ↗", href: "https://instagram.com" },
      { label: "LINKEDIN ↗", href: "https://linkedin.com" },
      { label: "YOUTUBE ↗", href: "https://youtube.com" },
    ],
    location: "KRAQEN INNOVATIONS · CHENNAI · INDIA",
    copyright: "© 2026 KRAQEN. ALL RIGHTS RESERVED.",
    backToTop: "BACK TO TOP ↗",
  },
  animations: {
    enabled: true,
    pageTransition: { duration: 600, ease: "power3.out" },
    textReveal: { duration: 900, stagger: 100, y: 60 },
    imageReveal: { duration: 1000, scale: 1.05, blur: 8 },
    hover: { duration: 400, scale: 1.03 },
    parallax: { enabled: true, amount: 20 },
  },
  responsive: {
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    mobileParallax: false,
    mobileCustomCursor: false,
  },
};

/**
 * Validates critical properties in SiteData JSON and merges with defaults
 */
function validateSiteData(data: any): SiteData {
  if (!data || typeof data !== 'object') {
    return defaultSiteData;
  }
  return {
    ...defaultSiteData,
    ...data,
    site: { ...defaultSiteData.site, ...data.site },
    theme: { ...defaultSiteData.theme, ...data.theme },
    typography: { ...defaultSiteData.typography, ...data.typography },
    navigation: { ...defaultSiteData.navigation, ...data.navigation },
    home: { ...defaultSiteData.home, ...data.home },
    work: { ...defaultSiteData.work, ...data.work },
    about: { ...defaultSiteData.about, ...data.about },
    contact: { ...defaultSiteData.contact, ...data.contact },
    footer: { ...defaultSiteData.footer, ...data.footer },
  };
}

const siteData: SiteData = validateSiteData(siteJson);

export function getSiteData(): SiteData {
  return siteData;
}

export function applyThemeVariables(theme?: SiteData['theme'], typography?: SiteData['typography'], animations?: SiteData['animations']) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const t = theme || defaultSiteData.theme;
  const typo = typography || defaultSiteData.typography;
  const anim = animations || defaultSiteData.animations;

  // Theme colors
  root.style.setProperty('--color-background', t.background || '#111111');
  root.style.setProperty('--color-surface', t.surface || '#151515');
  root.style.setProperty('--color-text', t.text || '#F3F0E6');
  root.style.setProperty('--color-muted-text', t.mutedText || '#A5A29B');
  root.style.setProperty('--color-border', t.border || 'rgba(243,240,230,0.2)');
  root.style.setProperty('--color-accent', t.accent || '#FF3B00');
  root.style.setProperty('--color-footer-background', t.footerBackground || '#FF3B00');
  root.style.setProperty('--color-footer-text', t.footerText || '#111111');

  // Typography
  if (typo) {
    if (typo.heroSize) root.style.setProperty('--hero-size', typo.heroSize);
    if (typo.sectionHeadingSize) root.style.setProperty('--section-heading-size', typo.sectionHeadingSize);
    if (typo.serviceSize) root.style.setProperty('--service-size', typo.serviceSize);
    if (typo.footerSize) root.style.setProperty('--footer-size', typo.footerSize);
    if (typo.displayFont) root.style.setProperty('--font-display', typo.displayFont);
    if (typo.bodyFont) root.style.setProperty('--font-body', typo.bodyFont);
  }

  // Animation settings
  if (anim) {
    root.style.setProperty('--anim-enabled', anim.enabled ? '1' : '0');
    root.style.setProperty('--anim-duration', `${anim.textReveal?.duration || 900}ms`);
    root.style.setProperty('--anim-stagger', `${anim.textReveal?.stagger || 100}ms`);
  }
}

export function useSiteData(): SiteData {
  const [data] = useState<SiteData>(siteData);

  useEffect(() => {
    applyThemeVariables(data.theme, data.typography, data.animations);
  }, [data]);

  return data;
}

export default siteData;
