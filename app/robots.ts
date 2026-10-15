import type { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteContent();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/admin'],
    },
    sitemap: `${site.brand.url}/sitemap.xml`,
  };
}
