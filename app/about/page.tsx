import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import AboutHero from '@/components/AboutHero';
import AboutIntro from '@/components/AboutIntro';
import AboutTeam from '@/components/AboutTeam';
import AboutBlueprint from '@/components/AboutBlueprint';
import AboutOnSet from '@/components/AboutOnSet';
import AboutCTA from '@/components/AboutCTA';
import Footer from '@/components/Footer';
import { getSiteContent, getAboutContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, about] = await Promise.all([getSiteContent(), getAboutContent()]);
  return {
    title: about.seo.title || 'About Kraqen Innovations | Creative Production Agency in Chennai',
    description: about.seo.description || site.seo.description,
    openGraph: {
      title: about.seo.title || 'About Kraqen Innovations | Creative Production Agency in Chennai',
      description: about.seo.description || site.seo.description,
      type: 'website',
    },
  };
}

export default async function AboutPage() {
  const [site, about] = await Promise.all([
    getSiteContent(),
    getAboutContent(),
  ]);

  return (
    <div className="about-page-wrapper bg-[#0f0f0f] min-h-screen text-white">
      <LenisInit />
      <PageTransition />
      <Nav site={site} />
      <main>
        {/* 1. Hero */}
        <AboutHero data={about.hero} />

        {/* 2. Intro: We Engineer Visual Culture */}
        <AboutIntro data={about.intro} />

        {/* 3. Team: The Minds Behind the Lens (6 ID cards) */}
        <AboutTeam data={about.team} />

        {/* 4. The Blueprint to Execution (3-step timeline) */}
        <AboutBlueprint data={about.blueprint} />

        {/* 5. On Set & In the Suite (Uniform 4:3 grid) */}
        <AboutOnSet data={about.onSet} />

        {/* 6. Inquiry CTA: Let's Build Something Cult (Form + Office) */}
        <AboutCTA data={about.cta} site={site} />
      </main>

      {/* Footer (shows the booking card on /about) */}
      <Footer site={site} />
    </div>
  );
}
