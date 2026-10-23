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
import AboutWhatWeDo from '@/components/AboutWhatWeDo';
import AboutStudioSplit from '@/components/AboutStudioSplit';
import AboutApproach from '@/components/AboutApproach';
import Footer from '@/components/Footer';
import { getSiteContent, getAboutContent, getHomeContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, about] = await Promise.all([getSiteContent(), getAboutContent()]);
  return {
    title: about.seo.title || 'About Kraqen Innovations | Kraqen',
    description: about.seo.description || site.seo.description,
    openGraph: {
      title: about.seo.title || 'About Kraqen Innovations | Kraqen',
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
    <div className="about-page-wrapper bg-[#0f0f0f]">
      <LenisInit />
      <PageTransition />
      <Nav site={site} />
      <main>
        {/* 1. Hero */}
        <AboutHero data={about.hero} />

        {/* 2. Intro: We Engineer Visual Culture */}
        <AboutIntro data={about.intro} />

        {/* 3. Team: The Minds Behind the Lens */}
        <AboutTeam data={about.team} />

        {/* 4. The Blueprint to Execution */}
        <AboutBlueprint data={about.blueprint} />

        {/* 5. On Set & In the Suite */}
        <AboutOnSet data={about.onSet} />

        {/* 6. Inquiry CTA: Let's Build Something Cult */}
        <AboutCTA data={about.cta} site={site} />

        {/* Legacy Sections (toggled via about.legacy in about.json) */}
        {about.legacy?.whatWeDo && about.services && (
          <AboutWhatWeDo data={about.services} homeServices={home.services} />
        )}
        {about.legacy?.studioSplit && about.studioSplit && (
          <AboutStudioSplit data={about.studioSplit} />
        )}
        {about.legacy?.approachClients && about.approach && (
          <AboutApproach data={about.approach} homeClients={home.partners.items} />
        )}

        {/* Footer (form card automatically hidden on /about) */}
        <Footer site={site} />
      </main>
    </div>
  );
}
