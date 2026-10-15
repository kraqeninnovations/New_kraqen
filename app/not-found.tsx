import Link from 'next/link';
import { getSiteContent } from '@/lib/content';

export default async function NotFound() {
  const site = await getSiteContent();

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[var(--text)] flex flex-col items-center justify-center p-8 text-center font-mono">
      <h1 className="font-tanker text-[clamp(96px,18vw,260px)] leading-none text-[#FF3300]">
        404
      </h1>
      <h2 className="font-tanker text-[24px] uppercase tracking-wide text-[var(--text)] mt-4">
        {site.notFound.title}
      </h2>
      <p className="text-[12px] uppercase tracking-[0.05em] text-[var(--text-muted)] mt-2 mb-8 max-w-[420px]">
        {site.notFound.message}
      </p>
      <Link
        href={site.notFound.buttonHref}
        className="px-6 py-3 bg-[#FF3300] text-[#1a1a1a] text-[11px] uppercase tracking-wider font-bold hover:bg-[var(--text-hover)] transition-colors"
      >
        {site.notFound.buttonLabel} ↗
      </Link>
    </div>
  );
}
