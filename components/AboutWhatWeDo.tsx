'use client';

import React from 'react';

interface AboutWhatWeDoProps {
  data?: any;
  homeServices?: any;
}

export default function AboutWhatWeDo({ data, homeServices }: AboutWhatWeDoProps) {
  if (!data) return null;
  const items = data.useHomeServices || !data.items || data.items.length === 0 ? homeServices?.items || [] : data.items;

  return (
    <section className="bg-[#1a1a1a] section-px py-16" aria-label="Services">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between pb-4 border-b border-white/15 mb-8 font-mono text-xs text-white/50">
          <span>{data.labelLeft || 'WHAT WE DO'}</span>
          <span>{data.labelRight || 'FULL SERVICE PRODUCTION'}</span>
        </div>
        <div className="space-y-6">
          {items.map((service: any, i: number) => (
            <div key={i} className="flex flex-col md:flex-row justify-between py-4 border-b border-white/10 gap-2">
              <span className="font-tanker text-3xl uppercase text-white">
                {service.title || service.name}
              </span>
              <span className="font-mono text-xs text-white/60 max-w-sm">
                {service.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
