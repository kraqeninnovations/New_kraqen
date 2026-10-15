import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import CustomCursor from '@/components/CustomCursor';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import Hero from '@/components/Hero';
import SelectedWork from '@/components/SelectedWork';
import WhatWeDo from '@/components/WhatWeDo';
import Partners from '@/components/Partners';
import MarqueeStrip from '@/components/MarqueeStrip';
import Footer from '@/components/Footer';
import FloatingReelWidget from '@/components/FloatingReelWidget';
import { getSiteContent, getHomeContent } from '@/lib/content';
import { fetchInstagramProjects } from '@/lib/instagram';

export async function generateMetadata(): Promise<Metadata> {
  const [site, home] = await Promise.all([getSiteContent(), getHomeContent()]);
  return {
    title: 'Kraqen Innovations LLP',
    description: home.seo.description || site.seo.description,
  };
}

export default async function HomePage() {
  const [site, home] = await Promise.all([getSiteContent(), getHomeContent()]);

  let selectedWorkData = home.selectedWork;
  if (home.selectedWork.source === 'instagram-api') {
    const projects = await fetchInstagramProjects(
      home.selectedWork.projects,
      home.selectedWork.limit || 12
    );
    selectedWorkData = { ...home.selectedWork, projects };
  }

  return (
    <>
      <LenisInit />
      <CustomCursor />
      <PageTransition />
      <Nav site={site} />
      <main>
        <Hero data={home.hero} />
        <SelectedWork data={selectedWorkData} />
        <WhatWeDo data={home.services} />
        <Partners data={home.partners} />
        <MarqueeStrip data={site.marquee} wordmark={site.brand.giantWordmark} />
        <Footer site={site} />
      </main>
      <FloatingReelWidget data={site.reelWidget} />
    </>
  );
}
