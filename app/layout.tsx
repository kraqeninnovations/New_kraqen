import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSiteContent } from '@/lib/content';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import FxLayer from '@/components/FxLayer';

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();

  const keywordsArray = Array.isArray(site.seo.keywords)
    ? site.seo.keywords
    : site.seo.keywords
    ? [...(site.seo.keywords.primary || []), ...(site.seo.keywords.secondary || [])]
    : undefined;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.brand.url),
    title: {
      default: site.seo.title,
      template: '%s',
    },
    description: site.seo.description || site.brand.description,
    keywords: keywordsArray,
    authors: [{ name: site.brand.name, url: site.brand.url }],
    creator: site.brand.name,
    publisher: site.brand.name,
    robots: {
      index: true,
      follow: true,
    },
    manifest: '/site.webmanifest',
    icons: {
      icon: '/icon.png',
      apple: '/apple-touch-icon.png',
    },
    appleWebApp: {
      capable: true,
      title: 'Kraqen Innovations',
      statusBarStyle: 'black-translucent',
    },
    openGraph: {
      type: 'website',
      siteName: site.brand.name,
      title: site.seo.title,
      description: site.seo.description || site.brand.description,
      url: site.brand.url,
      images: [
        {
          url: site.seo.ogImage || '/og-image.png',
          width: 1200,
          height: 630,
          alt: site.brand.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: site.seo.title,
      description: site.seo.description || site.brand.description,
      images: [site.seo.ogImage || '/og-image.png'],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteContent();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.brand.legalName || 'Kraqen Innovations LLP',
    url: site.brand.url,
    logo: `${site.brand.url}${site.logos.navbarLogo}`,
    image: `${site.brand.url}${site.seo.ogImage || '/og-image.png'}`,
    telephone: site.office?.phone || site.brand.phone || '+91 8939651621',
    email: site.office?.email?.address || site.brand.email || 'support@kraqeninc.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'No 44, Vasantham Nagar, Kishkinta Main Road, West Tambaram',
      addressLocality: 'Chennai',
      addressRegion: 'Tamil Nadu',
      postalCode: '600045',
      addressCountry: 'IN',
    },
    areaServed: 'Chennai',
    sameAs: site.socials.map((s) => s.href || s.url),
    serviceType: site.serviceOptions || [
      'Video Production',
      'Editorial & Motion Designs',
      'Social Creatives',
      'Creative Direction & Strategy',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=5" sizes="any" />
        <link rel="icon" href="/icon.png?v=5" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=5" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://api.fontshare.com/v2/css?f[]=tanker@400&display=swap"
          as="style"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=tanker@400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <FxLayer effects={site.effects} />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
