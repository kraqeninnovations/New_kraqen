'use client';

import React from 'react';
import Image from 'next/image';

interface AboutStudioSplitProps {
  data?: any;
}

export default function AboutStudioSplit({ data }: AboutStudioSplitProps) {
  if (!data?.left?.src || !data?.right?.src) return null;

  return (
    <section className="bg-[#0f0f0f] py-16 section-px" aria-label="Studio Split">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 relative aspect-[16/10] rounded-xl overflow-hidden bg-[#151515]">
          <Image src={data.left.src} alt={data.left.alt} fill className="object-cover" />
        </div>
        <div className="md:col-span-4 relative aspect-[4/5] rounded-xl overflow-hidden bg-[#151515]">
          <Image src={data.right.src} alt={data.right.alt} fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
