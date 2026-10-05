export interface SiteInfo {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  location: string;
  year: string;
}

export interface ThemeConfig {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  accent: string;
  footerBackground: string;
  footerText: string;
}

export interface TypographyConfig {
  displayFont: string;
  bodyFont: string;
  displayWeight: number;
  bodyWeight: number;
  heroSize: string;
  sectionHeadingSize: string;
  serviceSize: string;
  footerSize: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  links: NavLink[];
  cta: {
    label: string;
    href: string;
  };
  mobileLabel: string;
}

export interface HomeHero {
  eyebrow: string;
  title: string[];
  description: string;
  cta: {
    label: string;
    href: string;
  };
  images: string[];
}

export interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  href: string;
  featured?: boolean;
  align?: 'left' | 'right';
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  href?: string;
}

export interface StatementConfig {
  eyebrow?: string;
  title: string[];
  description?: string;
}

export interface HomeConfig {
  hero: HomeHero;
  selectedWork: {
    eyebrow: string;
    title: string[];
    description: string;
    projects: ProjectItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    items: ServiceItem[];
  };
  statement: StatementConfig;
}

export interface WorkFilter {
  key: string;
  label: string;
}

export interface WorkProjectItem {
  id: string;
  number: string;
  title: string;
  categoryKey: string;
  categoryLabel: string;
  description: string;
  year: string;
  image: string;
  aspect: string;
  column: 'left' | 'right';
  marginTop: string;
  href?: string;
}

export interface WorkConfig {
  eyebrow: string;
  title: string;
  description: string;
  filters: WorkFilter[];
  projects: WorkProjectItem[];
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
}

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
}

export interface ExpertiseItem {
  number: string;
  title: string;
  description: string;
}

export interface VisionConfig {
  eyebrow: string;
  intro: string;
  statement: string[];
}

export interface ImpactItem {
  value: string;
  label: string;
  description: string;
}

export interface AboutConfig {
  hero: {
    eyebrow: string;
    description: string;
  };
  whyChooseKraqen: {
    title: string;
    items: WhyChooseItem[];
  };
  expertise: {
    title: string;
    items: ExpertiseItem[];
  };
  vision: VisionConfig;
  impact: {
    title: string;
    items: ImpactItem[];
  };
  projects?: string[];
}

export interface ContactFormField {
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface ContactFormConfig {
  title: string[];
  fields: {
    name: ContactFormField;
    email: ContactFormField;
    phone: ContactFormField;
    message: ContactFormField;
  };
  submit: string;
}

export interface NewsletterConfig {
  title: string[];
  label: string;
  placeholder: string;
  button: string;
}

export interface ContactLocationConfig {
  city: string;
  address: string[];
  timezone: string;
}

export interface ContactConfig {
  hero: {
    title: string[];
    subtitle: string;
  };
  tel: string;
  phone: string;
  email: string;
  socials: SocialLink[];
  location: ContactLocationConfig;
  form: ContactFormConfig;
  newsletter: NewsletterConfig;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  eyebrow: string;
  title: string[];
  brand: string;
  brandSubtitle?: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
  navigation: NavLink[];
  socials: SocialLink[];
  location: string;
  copyright: string;
  backToTop: string;
}

export interface AnimationSettings {
  enabled: boolean;
  pageTransition: {
    duration: number;
    ease: string;
  };
  textReveal: {
    duration: number;
    stagger: number;
    y: number;
  };
  imageReveal: {
    duration: number;
    scale: number;
    blur: number;
  };
  hover: {
    duration: number;
    scale: number;
  };
  parallax: {
    enabled: boolean;
    amount: number;
  };
}

export interface ResponsiveConfig {
  mobileBreakpoint: number;
  tabletBreakpoint: number;
  mobileParallax: boolean;
  mobileCustomCursor: boolean;
}

export interface SiteData {
  site: SiteInfo;
  theme: ThemeConfig;
  typography: TypographyConfig;
  navigation: NavigationConfig;
  home: HomeConfig;
  work: WorkConfig;
  about: AboutConfig;
  contact: ContactConfig;
  footer: FooterConfig;
  animations: AnimationSettings;
  responsive: ResponsiveConfig;
}
