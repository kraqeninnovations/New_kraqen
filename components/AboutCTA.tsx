'use client';

import React from 'react';
import InquiryForm from '@/components/InquiryForm';
import SocialIcon from '@/components/ui/SocialIcon';
import type { AboutContent } from '@/lib/schemas/about';
import type { SiteContent } from '@/lib/schemas/site';

interface AboutCTAProps {
  data: AboutContent['cta'];
  site: SiteContent;
}

export default function AboutCTA({ data, site }: AboutCTAProps) {
  const whatsappNumber = site.office?.whatsapp?.number || '918939651621';
  const whatsappMsg = encodeURIComponent(site.office?.whatsapp?.message || "Hi Kraqen Innovations, I'd like to discuss a project.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;
  const emailUrl = `mailto:${site.office?.email?.address || 'support@kraqeninc.com'}`;

  const addressLines = site.office?.addressLines || [
    'No 44, Vasantham Nagar,',
    'Kishkinta Main Road, West Tambaram,',
    'Chennai, Tamil Nadu, India - 600045',
  ];

  return (
    <section
      className="bg-[#0f0f0f] pt-[var(--space-section)] pb-[var(--space-section)] text-white px-[var(--page-x)]"
      aria-label="Let's Build Something Cult"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="font-tanker text-white uppercase text-[clamp(40px,7vw,110px)] leading-[0.88] tracking-tight mb-3">
            {data.title}
          </h2>
          <p className="font-mono text-xs md:text-sm text-white/60 tracking-wider">
            {data.subtitle}
          </p>
        </div>

        {/* Two Equal Columns: Form on Left, Office & Direct Links on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-block)] items-stretch">
          {/* Left Column: Inquiry Form Card */}
          <div className="bg-[#151515] border border-white/12 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="font-tanker text-2xl md:text-3xl uppercase tracking-wide text-white mb-6">
                PROJECT INQUIRY
              </h3>
              <InquiryForm site={site} fieldSet="inquiry" placement="about" />
            </div>
          </div>

          {/* Right Column: Office Card with Link Rows */}
          <div className="bg-[#151515] border border-white/12 rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col justify-between font-mono">
            <div>
              <span className="text-[11px] text-white/40 uppercase tracking-wider block mb-3">
                {site.office?.label || 'OUR CHENNAI OFFICE'}
              </span>

              <div className="space-y-1 text-sm text-white/90 leading-relaxed mb-4">
                {addressLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>

              {site.office?.mapUrl && (
                <a
                  href={site.office.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white underline underline-offset-4 hover:text-white/80 transition-colors inline-block mb-8"
                >
                  VIEW ON GOOGLE MAPS →
                </a>
              )}

              {/* Link Rows */}
              <div className="border-t border-white/15 divide-y divide-white/10 text-xs">
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 flex items-center justify-between group hover:text-emerald-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="tracking-wider uppercase font-bold">WHATSAPP</span>
                  </div>
                  <span className="transform group-hover:translate-x-1.5 transition-transform text-sm">→</span>
                </a>

                {/* Email */}
                <a
                  href={emailUrl}
                  className="py-4 flex items-center justify-between group hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="tracking-wider uppercase font-bold">EMAIL: {site.office?.email?.address || 'support@kraqeninc.com'}</span>
                  </div>
                  <span className="transform group-hover:translate-x-1.5 transition-transform text-sm">→</span>
                </a>

                {/* Socials (Instagram, LinkedIn, YouTube) */}
                {site.socials.map((social) => {
                  const href = social.href || social.url;
                  if (!href) return null;
                  return (
                    <a
                      key={social.label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-4 flex items-center justify-between group hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <SocialIcon type={social.label} size={18} className="text-[#B7A8FF]" />
                        <span className="tracking-wider uppercase font-bold">{social.label}</span>
                      </div>
                      <span className="transform group-hover:translate-x-1.5 transition-transform text-sm">→</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 text-[11px] text-white/50">
              Kraqen Innovations LLP • Chennai, Tamil Nadu
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
