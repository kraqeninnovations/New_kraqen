import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import CustomCursor from '@/components/CustomCursor';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import WorkGallery from '@/components/WorkGallery';
import MarqueeStrip from '@/components/MarqueeStrip';
import Footer from '@/components/Footer';
import FloatingReelWidget from '@/components/FloatingReelWidget';
import { getSiteContent, getWorkContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, work] = await Promise.all([getSiteContent(), getWorkContent()]);
  return {
    title: 'Kraqen Innovations LLP',
    description: work.seo.description || site.seo.description,
    openGraph: {
      title: 'Kraqen Innovations LLP',
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
      <CustomCursor />
      <PageTransition />
      <Nav site={site} />
      <main>
        {/* 1. Work Portfolio Staggered Gallery */}
        <WorkGallery data={work} />

        {/* 2. Orange Marquee Strip */}
        <MarqueeStrip data={site.marquee} wordmark={site.brand.giantWordmark} />

        {/* 3. Orange Footer with Giant Wordmark */}
        <Footer site={site} />
      </main>

      {/* Floating View Reel widget */}
      <FloatingReelWidget data={site.reelWidget} />
    </>
  );
}
