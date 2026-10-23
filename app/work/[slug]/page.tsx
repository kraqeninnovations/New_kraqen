import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import InstagramReelEmbed from '@/components/InstagramReelEmbed';
import { getSiteContent, getWorkContent } from '@/lib/content';

export async function generateStaticParams() {
  const work = await getWorkContent();
  return work.items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkContent();
  const project = work.items.find((item) => item.slug === slug);

  if (!project) {
    return {
      title: 'Project Not Found | Kraqen',
    };
  }

  return {
    title: `${project.title} | Kraqen`,
    description: project.detail.intro || project.alt || project.title,
    openGraph: {
      title: `${project.title} | Kraqen`,
      description: project.detail.intro || project.alt || project.title,
      images: [project.poster || project.src],
    },
  };
}

const RATIO_ASPECT_CSS: Record<string, string> = {
  '4:5': '4 / 5',
  '16:9': '16 / 9',
  '9:16': '9 / 16',
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, work] = await Promise.all([getSiteContent(), getWorkContent()]);
  const project = work.items.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const category = work.categories.find((c) => c.id === project.category);
  const sameCategoryProjects = work.items.filter((it) => it.category === project.category);
  const currentIndex = sameCategoryProjects.findIndex((it) => it.slug === project.slug);
  const prevProject = currentIndex > 0 ? sameCategoryProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < sameCategoryProjects.length - 1 ? sameCategoryProjects[currentIndex + 1] : null;

  return (
    <>
      <Nav site={site} />
      <main className="bg-[#0f0f0f] text-white pt-28 md:pt-36 pb-24 section-px">
        <div className="max-w-[1400px] mx-auto">
          {/* 1. Header & Back Link */}
          <div className="pb-8 border-b border-white/15">
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link
                href="/work"
                className="font-mono text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>←</span> OUR PORTFOLIO
              </Link>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold">
                {category?.title || project.category}
              </span>
            </div>

            <h1 className="font-tanker text-white uppercase text-[clamp(48px,9vw,150px)] leading-[0.88] tracking-tight">
              {project.title}
            </h1>
          </div>

          {/* 2. Meta Row with Hairlines (4 columns on desktop, 2 on mobile) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-white/15 font-mono">
            <div>
              <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">
                CLIENT / INDUSTRY
              </span>
              <span className="text-sm text-white font-medium">
                {project.clientIndustry || 'Commercial Production'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">
                DELIVERABLE
              </span>
              <span className="text-sm text-white font-medium">
                {project.deliverable || 'Video & Creative'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">
                RESULT / IMPACT
              </span>
              <span className="text-sm text-accent font-medium">
                {project.result || 'High Engagement'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-white/40 uppercase tracking-wider mb-1">
                YEAR
              </span>
              <span className="text-sm text-white font-medium">
                {project.year || 2026}
              </span>
            </div>
          </div>

          {/* 3. Main Media */}
          <div className="py-12 md:py-16 flex justify-center">
            {project.mediaType === 'reel' && project.instagramUrl ? (
              <InstagramReelEmbed
                url={project.instagramUrl}
                poster={project.poster || project.src}
                title={project.title}
              />
            ) : project.mediaType === 'video' && project.video ? (
              <div className="w-full max-h-[80svh] rounded-2xl overflow-hidden bg-black shadow-2xl flex items-center justify-center">
                <video
                  src={project.video}
                  poster={project.poster || project.src}
                  controls
                  playsInline
                  className="w-full max-h-[80svh] object-contain"
                />
              </div>
            ) : (
              <div
                className="relative w-full max-h-[80svh] rounded-2xl overflow-hidden bg-[#151515] shadow-2xl flex items-center justify-center"
                style={{
                  aspectRatio: RATIO_ASPECT_CSS[project.ratio] || '16 / 9',
                }}
              >
                <Image
                  src={project.src}
                  alt={project.alt || project.title}
                  fill
                  priority
                  sizes="(max-width: 1400px) 100vw, 1400px"
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* 4. THE BRIEF & HOW WE DID IT */}
          <div className="py-12 md:py-16 border-t border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* The Brief & Intro */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-wider text-white/40 block">
                THE BRIEF
              </span>
              {project.detail.intro && (
                <p className="font-mono text-base md:text-lg text-white leading-relaxed font-medium">
                  {project.detail.intro}
                </p>
              )}
              {project.detail.brief && (
                <p className="font-mono text-sm text-white/70 leading-relaxed">
                  {project.detail.brief}
                </p>
              )}

              {/* Gear and Location */}
              <div className="pt-6 border-t border-white/10 space-y-4 font-mono text-xs">
                {project.detail.gear && project.detail.gear.length > 0 && (
                  <div>
                    <span className="text-white/40 uppercase tracking-wider block mb-1">
                      GEAR RIG
                    </span>
                    <span className="text-white">
                      {project.detail.gear.join(', ')}
                    </span>
                  </div>
                )}
                {project.detail.location && (
                  <div>
                    <span className="text-white/40 uppercase tracking-wider block mb-1">
                      LOCATION
                    </span>
                    <span className="text-white">
                      {project.detail.location}
                    </span>
                  </div>
                )}
                {project.detail.credits && project.detail.credits.length > 0 && (
                  <div>
                    <span className="text-white/40 uppercase tracking-wider block mb-1">
                      CREDITS
                    </span>
                    {project.detail.credits.map((cr, idx) => (
                      <div key={idx} className="text-white/80">
                        {cr.role}: {cr.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* How We Did It: Process Steps with Faded Numerals */}
            <div className="lg:col-span-7">
              <span className="font-mono text-xs uppercase tracking-wider text-white/40 block mb-8">
                HOW WE DID IT
              </span>
              <div className="space-y-8">
                {project.detail.process.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 overflow-hidden"
                  >
                    {/* Large faded numeral behind */}
                    <div
                      className="absolute right-4 bottom-[-10px] font-tanker text-white/[0.08] text-[100px] sm:text-[140px] leading-none select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    <div className="relative z-10">
                      <span className="font-mono text-xs text-accent uppercase tracking-wider block mb-2 font-bold">
                        STEP {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-tanker text-2xl md:text-3xl uppercase tracking-wide text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="font-mono text-sm text-white/70 leading-relaxed max-w-xl">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Gallery Grid */}
          {project.detail.gallery && project.detail.gallery.length > 0 && (
            <div className="py-12 md:py-16 border-t border-white/15">
              <h2 className="font-tanker text-3xl md:text-4xl uppercase text-white tracking-wide mb-8">
                CAMPAIGN FRAMES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.detail.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl overflow-hidden bg-[#151515]"
                    style={{
                      aspectRatio: RATIO_ASPECT_CSS[img.ratio] || '16 / 9',
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt || `${project.title} frame ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Previous / Next Project Navigation */}
          <div className="py-12 border-t border-white/15 flex items-center justify-between font-mono text-xs uppercase tracking-wider">
            {prevProject ? (
              <Link
                href={`/work/${prevProject.slug}`}
                className="group flex flex-col text-left hover:text-accent transition-colors"
              >
                <span className="text-white/40 mb-1">← PREVIOUS PROJECT</span>
                <span className="font-tanker text-xl md:text-2xl text-white group-hover:text-accent">
                  {prevProject.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/work/${nextProject.slug}`}
                className="group flex flex-col text-right hover:text-accent transition-colors"
              >
                <span className="text-white/40 mb-1">NEXT PROJECT →</span>
                <span className="font-tanker text-xl md:text-2xl text-white group-hover:text-accent">
                  {nextProject.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* 7. CTA Block */}
          <div className="mt-12 p-8 md:p-14 rounded-3xl bg-brand-purple text-white text-center flex flex-col items-center">
            <h2 className="font-tanker text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight mb-4">
              START A PROJECT LIKE THIS
            </h2>
            <p className="font-mono text-sm md:text-base text-white/80 max-w-xl mb-8 leading-relaxed">
              Ready to engineer visual culture and scale your brand with cinema-grade execution?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-white text-brand-purple font-mono text-sm uppercase tracking-wider font-bold px-9 py-4 hover:bg-black hover:text-white transition-colors"
            >
              LET'S TALK GROWTH →
            </Link>
          </div>
        </div>
      </main>
      <Footer site={site} />
    </>
  );
}

