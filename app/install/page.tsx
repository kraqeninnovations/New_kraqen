import type { Metadata } from 'next';
import { getSiteContent } from '@/lib/content';
import InstallPageClient from './InstallPageClient';

export const metadata: Metadata = {
  title: 'Install Kraqen App — Kraqen Innovations LLP',
  description: 'Install Kraqen on your phone or tablet for faster access with offline capabilities.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InstallPage() {
  const site = await getSiteContent();

  return <InstallPageClient site={site} />;
}

