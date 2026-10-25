'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import ScrollRow from '@/components/ScrollRow';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutTeamProps {
  data: AboutContent['team'];
}

export default function AboutTeam({ data }: AboutTeamProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!gridRef.current) return;

      ctx = gsap.context(() => {
        const cards = gridRef.current?.querySelectorAll('.team-card');
        if (cards && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 80%',
              },
            }
          );
        }
      }, sectionRef);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  const members = data.members || [];

  const renderCard = (member: typeof members[0]) => (
    <div className="relative aspect-[3/4] w-full rounded-[16px] overflow-hidden bg-[#151515] border border-white/10 group">
      {/* Background portrait filling the whole card */}
      <Image
        src={member.image}
        alt={member.alt || member.name}
        fill
        sizes="(max-width: 768px) 78vw, (max-width: 1024px) 45vw, 30vw"
        style={{ objectPosition: '50% 20%' }}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Details inside image at bottom on dark gradient */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 z-10"
        style={{
          background: 'linear-gradient(to top, rgba(15,15,15,0.94) 0%, rgba(15,15,15,0.7) 45%, transparent 100%)',
        }}
      >
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#B7A8FF] font-bold block mb-1">
          {member.role}
        </span>
        <h3 className="font-tanker text-[clamp(24px,2.4vw,36px)] uppercase leading-[0.9] text-white tracking-tight mb-2">
          {member.name}
        </h3>
        <p className="font-mono text-[11px] leading-relaxed text-white/80 line-clamp-3 normal-case">
          {member.bio}
        </p>
      </div>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#0f0f0f] pt-[var(--space-section)] pb-0 text-white"
      aria-label="Our Team"
    >
      <div className="px-[var(--page-x)]">
        {/* Section Header */}
        <div className="mb-8 md:mb-10">
          <h2 className="font-tanker text-white uppercase text-[clamp(36px,5.5vw,84px)] leading-[0.88] tracking-tight mb-2">
            {data.title}
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/60 tracking-wider">
            {data.subtitle}
          </p>
        </div>

        {/* Desktop / Tablet: 3 columns x 2 rows (6 ID cards) */}
        <div
          ref={gridRef}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-block)] w-full"
        >
          {members.map((member, idx) => (
            <div key={idx} className="team-card">
              {renderCard(member)}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: ScrollRow with 78vw cards */}
      <ScrollRow itemCount={members.length} itemWidthClass="w-[78vw] max-w-[340px]">
        {members.map((member, idx) => (
          <div key={idx}>
            {renderCard(member)}
          </div>
        ))}
      </ScrollRow>
    </section>
  );
}
