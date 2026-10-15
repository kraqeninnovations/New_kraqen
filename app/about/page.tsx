import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import CustomCursor from '@/components/CustomCursor';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import AboutIntro from '@/components/AboutIntro';
import AboutTeam from '@/components/AboutTeam';
import AboutWhatWeDo from '@/components/AboutWhatWeDo';
import AboutStudioSplit from '@/components/AboutStudioSplit';
import AboutApproach from '@/components/AboutApproach';
import MarqueeStrip from '@/components/MarqueeStrip';
import Footer from '@/components/Footer';
import FloatingReelWidget from '@/components/FloatingReelWidget';
import { getSiteContent, getAboutContent, getHomeContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, about] = await Promise.all([getSiteContent(), getAboutContent()]);
  return {
    title: 'Kraqen Innovations LLP',
    description: about.seo.description || site.seo.description,
    openGraph: {
      title: 'Kraqen Innovations LLP',
      description: about.seo.description || site.seo.description,
      type: 'website',
    },
  };
}

export default async function AboutPage() {
  const [site, about, home] = await Promise.all([
    getSiteContent(),
    getAboutContent(),
    getHomeContent(),
  ]);

  return (
    <div className="about-page-wrapper">
      <LenisInit />
      <CustomCursor />
      <PageTransition />
      <Nav site={site} />
      <main>
        {/* 1. About Intro */}
        <AboutIntro data={about.intro} />

        {/* 2. Team: Staggered 2-column layout */}
        <AboutTeam data={about.team} />

        {/* 3. What We Do (Services) */}
        <AboutWhatWeDo data={about.services} homeServices={home.services} />

        {/* 4. Studio Photo Split */}
        <AboutStudioSplit data={about.studioSplit} />

        {/* 5. Approach + Client Grid */}
        <AboutApproach data={about.approach} homeClients={home.partners.clients} />

        {/* 6. Marquee Strip */}
        <MarqueeStrip data={site.marquee} wordmark={site.brand.giantWordmark} />

        {/* 7. Footer / CTA with giant wordmark */}
        <Footer site={site} />
      </main>

      {/* 8. Floating Reel Widget */}
      <FloatingReelWidget data={site.reelWidget} />
    </div>
  );
}
