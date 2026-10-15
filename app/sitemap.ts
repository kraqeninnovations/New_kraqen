import type { MetadataRoute } from 'next';
import { getSiteContent } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteContent();
  const routes = ['', '/work', '/about', '/contact'];

  return routes.map((route) => ({
    url: `${site.brand.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
