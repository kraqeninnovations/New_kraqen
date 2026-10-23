import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import WorkGallery from '@/components/WorkGallery';
import Footer from '@/components/Footer';
import { getSiteContent, getWorkContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, work] = await Promise.all([getSiteContent(), getWorkContent()]);
  return {
    title: work.seo.title || `${work.header.title} | Kraqen`,
    description: work.seo.description || site.seo.description,
    openGraph: {
      title: work.seo.title || `${work.header.title} | Kraqen`,
      description: work.seo.description || site.seo.description,
      type: 'website',
    },
  };
}

export default async function WorkPage() {
  const [site, work] = await Promise.all([getSiteContent(), getWorkContent()]);

  return (
    <>
      <LenisInit />
      <PageTransition />
      <Nav site={site} />
      <main>
        <WorkGallery data={work} />
        <Footer site={site} />
      </main>
    </>
  );
}
