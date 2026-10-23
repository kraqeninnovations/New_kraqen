'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { AboutContent } from '@/lib/schemas/about';

interface AboutTeamProps {
  data: AboutContent['team'];
}

export default function AboutTeam({ data }: AboutTeamProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const img1BoxRef = useRef<HTMLDivElement>(null);
  const img2BoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: { revert: () => void } | null = null;

    const init = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!sectionRef.current) return;

      ctx = gsap.context(() => {
        // Card 1 clip-path reveal wipe
        if (img1BoxRef.current && card1Ref.current) {
          gsap.fromTo(
            img1BoxRef.current,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card1Ref.current,
                start: 'top 85%',
              },
            }
          );
        }

        // Card 2 clip-path reveal wipe
        if (img2BoxRef.current && card2Ref.current) {
          gsap.fromTo(
            img2BoxRef.current,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card2Ref.current,
                start: 'top 85%',
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

  const member1 = data.members[0];
  const member2 = data.members[1];

  if (!member1 || !member2) return null;

  return (
    <section
      ref={sectionRef}
      className="bg-[#1a1a1a] section-px py-[clamp(64px,10vw,140px)] border-b border-white/15"
      style={{ color: 'var(--text)' }}
      aria-label="Our Team"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-tanker text-white uppercase text-[clamp(40px,6.5vw,96px)] leading-[0.88] tracking-tight mb-3">
            {data.title}
          </h2>
          <p className="font-mono text-sm text-white/60 tracking-wider">
            {data.subtitle}
          </p>
        </div>

        {/* Staggered Founder Photos */}
        <div className="relative flex flex-col md:flex-row gap-12 md:gap-0 justify-between items-start">
          {/* CARD 1: Member 1 (LEFT) */}
          <div
            ref={card1Ref}
            className="w-full md:w-[44%] flex flex-col"
          >
            <div
              ref={img1BoxRef}
              className={`team-image-box w-full aspect-[1/1.1] rounded-xl overflow-hidden bg-[#222] ${
                member1.isGreyscaleDefault ? 'grayscale hover:grayscale-0 transition-all duration-500' : ''
              }`}
            >
              <Image
                src={member1.image}
                alt={member1.alt}
                width={700}
                height={770}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 44vw"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <h3 className="font-tanker text-2xl md:text-3xl text-white uppercase tracking-wide">
                {member1.name}
              </h3>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold">
                {member1.role}
              </span>
              <p className="font-mono text-xs md:text-sm text-white/70 leading-relaxed mt-2">
                {member1.bio}
              </p>
            </div>
          </div>

          {/* CARD 2: Member 2 (RIGHT, staggered down on desktop) */}
          <div
            ref={card2Ref}
            className="w-full md:w-[44%] flex flex-col md:mt-24"
          >
            <div
              ref={img2BoxRef}
              className={`team-image-box w-full aspect-[1/1.1] rounded-xl overflow-hidden bg-[#222] ${
                member2.isGreyscaleDefault ? 'grayscale hover:grayscale-0 transition-all duration-500' : ''
              }`}
            >
              <Image
                src={member2.image}
                alt={member2.alt}
                width={700}
                height={770}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 44vw"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <h3 className="font-tanker text-2xl md:text-3xl text-white uppercase tracking-wide">
                {member2.name}
              </h3>
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold">
                {member2.role}
              </span>
              <p className="font-mono text-xs md:text-sm text-white/70 leading-relaxed mt-2">
                {member2.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
