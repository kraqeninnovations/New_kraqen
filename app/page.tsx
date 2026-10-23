import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import Hero from '@/components/Hero';
import SelectedWork from '@/components/SelectedWork';
import WhatWeDo from '@/components/WhatWeDo';
import Partners from '@/components/Partners';
import Footer from '@/components/Footer';
import { getSiteContent, getHomeContent, getWorkContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, home] = await Promise.all([getSiteContent(), getHomeContent()]);
  return {
    title: home.seo.title || site.seo.title || 'Next-Gen Creative & Social Agency Chennai | Kraqen',
    description: home.seo.description || site.seo.description,
  };
}

export default async function HomePage() {
  const [site, home, work] = await Promise.all([
    getSiteContent(),
    getHomeContent(),
    getWorkContent(),
  ]);

  return (
    <>
      <LenisInit />
      <PageTransition />
      <Nav site={site} />
      <main>
        <Hero data={home.hero} />
        <SelectedWork data={home.selectedWork} workItems={work.items} />
        <WhatWeDo data={home.services} />
        <Partners data={home.partners} />
        <Footer site={site} />
      </main>
    </>
  );
}
