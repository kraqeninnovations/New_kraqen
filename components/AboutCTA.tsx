'use client';

import React from 'react';
import InquiryForm from '@/components/InquiryForm';
import type { AboutContent } from '@/lib/schemas/about';
import type { SiteContent } from '@/lib/schemas/site';

interface AboutCTAProps {
  data: AboutContent['cta'];
  site: SiteContent;
}

export default function AboutCTA({ data, site }: AboutCTAProps) {
  const whatsappUrl = `https://wa.me/${site.office.whatsapp.number}?text=${encodeURIComponent(
    site.office.whatsapp.message || "Hi Kraqen, I'd like to discuss a project."
  )}`;
  const emailUrl = `mailto:${site.office.email.address}`;

  const validAddressLines = site.office.addressLines.filter((l) => l.trim().length > 0);

  return (
    <section
      className="bg-[#0f0f0f] section-px py-[clamp(64px,10vw,140px)] text-white"
      aria-label="Let's Build Something Cult"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="font-tanker text-white uppercase text-[clamp(40px,7vw,110px)] leading-[0.88] tracking-tight mb-3">
            {data.title}
          </h2>
          <p className="font-mono text-sm text-white/60 tracking-wider">
            {data.subtitle}
          </p>
        </div>

        {/* Two Columns: Form on Left, Office & Direct Links on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Inquiry Form Card */}
          <div className="lg:col-span-7 bg-[#151515] border border-white/12 rounded-2xl p-6 sm:p-8 md:p-10">
            <h3 className="font-tanker text-2xl md:text-3xl uppercase tracking-wide text-white mb-6">
              PROJECT INQUIRY
            </h3>
            <InquiryForm site={site} fieldSet="inquiry" placement="about" />
          </div>

          {/* Right Column: Office Address, WhatsApp & Email */}
          <div className="lg:col-span-5 space-y-8 font-mono">
            {/* Office Block */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#151515] border border-white/12">
              <span className="text-[11px] text-white/40 uppercase tracking-wider block mb-4">
                {site.office.label}
              </span>
              {validAddressLines.length > 0 ? (
                <div className="space-y-1 text-sm text-white/80 leading-relaxed">
                  {validAddressLines.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-white/80">Chennai, Tamil Nadu, India</div>
              )}
            </div>

            {/* Direct Connect Buttons */}
            <div className="space-y-4">
              {/* WhatsApp Link */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 rounded-2xl bg-[#151515] border border-white/12 hover:border-accent transition-all duration-300"
              >
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                    DIRECT CHAT
                  </span>
                  <span className="font-tanker text-2xl uppercase tracking-wide text-white group-hover:text-accent transition-colors">
                    {site.office.whatsapp.label}
                  </span>
                </div>
                <span className="font-mono text-2xl text-white transform group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </a>

              {/* Email Link */}
              <a
                href={emailUrl}
                className="group flex items-center justify-between p-6 rounded-2xl bg-[#151515] border border-white/12 hover:border-accent transition-all duration-300"
              >
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
                    DROP AN EMAIL
                  </span>
                  <span className="font-tanker text-2xl uppercase tracking-wide text-white group-hover:text-accent transition-colors">
                    {site.office.email.label}
                  </span>
                  <span className="block font-mono text-xs text-white/60 lowercase">
                    {site.office.email.address}
                  </span>
                </div>
                <span className="font-mono text-2xl text-white transform group-hover:translate-x-2 transition-transform">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

