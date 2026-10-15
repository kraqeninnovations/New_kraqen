import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import Brand from '@/components/Brand';

export const metadata = {
  title: 'Offline — Kraqen Innovations LLP',
  robots: { index: false, follow: false },
};

export default async function OfflinePage() {
  const site = await getSiteContent();

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between p-6 sm:p-12">
      <div className="flex items-center justify-between">
        <Brand variant="nav" src={site.logos.navbarLogo} name={site.brand.shortName} />
      </div>

      <div className="max-w-xl my-auto py-12">
        <span className="font-mono text-[11px] tracking-wider uppercase text-white/50 block mb-3">
          NO CONNECTION DETECTED
        </span>
        <h1 className="font-tanker text-[clamp(44px,8vw,80px)] uppercase leading-none tracking-tight mb-4">
          YOU ARE OFFLINE
        </h1>
        <p className="font-mono text-[13px] text-white/70 leading-relaxed mb-8">
          Please check your network connection and try again. Cached pages and resources remain accessible.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-white/20 font-mono text-[12px] uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
        >
          RETRY HOME
        </Link>
      </div>

      <div className="font-mono text-[10px] uppercase text-white/40">
        {site.brand.copyright}
      </div>
    </main>
  );
}

