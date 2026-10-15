import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import CustomCursor from '@/components/CustomCursor';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import ContactHeroForm from '@/components/ContactHeroForm';
import MarqueeStrip from '@/components/MarqueeStrip';
import Footer from '@/components/Footer';
import { getSiteContent, getContactContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSiteContent(), getContactContent()]);
  return {
    title: 'Kraqen Innovations LLP',
    description: contact.seo.description || site.seo.description,
    openGraph: {
      title: 'Kraqen Innovations LLP',
      description: contact.seo.description || site.seo.description,
      type: 'website',
    },
  };
}

export default async function ContactPage() {
  const [site, contact] = await Promise.all([getSiteContent(), getContactContent()]);

  return (
    <div className="contact-page-wrapper">
      <LenisInit />
      <CustomCursor />
      <PageTransition />
      <Nav site={site} />
      <main>
        {/* 1. Contact Hero + Enquiry Form */}
        <ContactHeroForm data={contact} site={site} />

        {/* 2. Orange Marquee Strip */}
        <MarqueeStrip data={site.marquee} wordmark={site.brand.giantWordmark} />

        {/* 3. Orange Footer with Giant Wordmark */}
        <Footer site={site} />
      </main>
    </div>
  );
}
