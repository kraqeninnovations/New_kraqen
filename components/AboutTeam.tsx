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
        // Card 1 clip-path reveal wipe (bottom to top, 0.9s)
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

          // Subtle parallax scrub (+/- 20px) on desktop
          const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
          const img1 = img1BoxRef.current.querySelector('img');
          if (img1 && hasFinePointer) {
            gsap.fromTo(
              img1,
              { y: -20 },
              {
                y: 20,
                ease: 'none',
                scrollTrigger: {
                  trigger: card1Ref.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }
        }

        // Card 2 clip-path reveal wipe (bottom to top, 0.9s)
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

          // Subtle parallax scrub (+/- 20px) on desktop
          const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
          const img2 = img2BoxRef.current.querySelector('img');
          if (img2 && hasFinePointer) {
            gsap.fromTo(
              img2,
              { y: -20 },
              {
                y: 20,
                ease: 'none',
                scrollTrigger: {
                  trigger: card2Ref.current,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: true,
                },
              }
            );
          }
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
      className="bg-[#1a1a1a] section-px pt-[clamp(40px,6vw,80px)] pb-[clamp(80px,12vw,160px)]"
      style={{ color: 'var(--text)' }}
      aria-label="Our Team"
    >
      <div className="relative flex flex-col md:flex-row gap-[56px] md:gap-0 justify-between items-start">
        {/* CARD 1: Member 1 (LEFT, width ~38vw on desktop, 100% on mobile) */}
        <div
          ref={card1Ref}
          className="w-full md:w-[38vw] flex flex-col"
        >
          {/* Black-and-white portrait photo, near-square (aspect ~ 1 : 1.1) */}
          <div
            ref={img1BoxRef}
            className={`team-image-box w-full aspect-[1/1.1] rounded-[2px] bg-[#222] ${
              member1.isGreyscaleDefault ? 'greyscale-hover' : ''
            }`}
          >
            <Image
              src={member1.image}
              alt={member1.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 38vw"
              className="object-cover"
            />
          </div>

          {/* 28px gap */}
          <div className="mt-[28px]">
            <h2 className="team-name" style={{ color: 'var(--text)' }}>
              {member1.name}
            </h2>
            <p className="team-role mt-1 text-[#FF3300]">{member1.role}</p>
          </div>

          {/* 16px gap, bio max-width 320px */}
          <p className="team-bio mt-[16px] max-w-[320px]" style={{ color: 'var(--text-muted)' }}>
            {member1.bio}
          </p>
        </div>

        {/* CARD 2: Member 2 (RIGHT, width ~39vw, margin-top ~14vw on desktop, stacked with 56px gap on mobile) */}
        <div
          ref={card2Ref}
          className="w-full md:w-[39vw] md:ml-auto md:mt-[14vw] flex flex-col"
        >
          {/* Natural color portrait, aspect ~ 1 : 1.0 */}
          <div
            ref={img2BoxRef}
            className={`team-image-box w-full aspect-square rounded-[2px] bg-[#222] ${
              member2.isGreyscaleDefault ? 'greyscale-hover' : ''
            }`}
          >
            <Image
              src={member2.image}
              alt={member2.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 39vw"
              className="object-cover"
            />
          </div>

          {/* Gap, name, role */}
          <div className="mt-[28px]">
            <h2 className="team-name" style={{ color: 'var(--text)' }}>
              {member2.name}
            </h2>
            <p className="team-role mt-1 text-[#FF3300]">{member2.role}</p>
          </div>

          {/* 16px gap, bio */}
          <p className="team-bio mt-[16px] max-w-[340px]" style={{ color: 'var(--text-muted)' }}>
            {member2.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
