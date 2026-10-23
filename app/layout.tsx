import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSiteContent } from '@/lib/content';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.brand.url),
    title: {
      default: site.seo.title,
      template: '%s',
    },
    description: site.seo.description || site.brand.description,
    keywords: site.seo.keywords,
    authors: [{ name: site.brand.name, url: site.brand.url }],
    creator: site.brand.name,
    publisher: site.brand.name,
    robots: {
      index: true,
      follow: true,
    },
    manifest: '/site.webmanifest',
    appleWebApp: {
      capable: true,
      title: 'Kraqen',
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
    '@type': 'Organization',
    name: site.brand.name,
    legalName: site.brand.legalName,
    url: site.brand.url,
    logo: `${site.brand.url}${site.logos.navbarLogo}`,
    email: site.brand.email,
    telephone: site.brand.phone,
    sameAs: site.socials.map((s) => s.href),
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico?v=5" sizes="any" />
        <link rel="icon" href="/icon.png?v=5" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=5" />
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
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
