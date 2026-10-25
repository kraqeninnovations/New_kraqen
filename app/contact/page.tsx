import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import InquiryForm from '@/components/InquiryForm';
import Footer from '@/components/Footer';
import { getSiteContent, getContactContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSiteContent(), getContactContent()]);
  return {
    title: contact.seo.title || 'Contact Kraqen Innovations | Book a Call, Creative Agency in Chennai',
    description: contact.seo.description || site.seo.description,
    openGraph: {
      title: contact.seo.title || 'Contact Kraqen Innovations | Book a Call, Creative Agency in Chennai',
      description: contact.seo.description || site.seo.description,
      type: 'website',
    },
  };
}

export default async function ContactPage() {
  const [site, contact] = await Promise.all([getSiteContent(), getContactContent()]);

  const whatsappNumber = site.office?.whatsapp?.number || '918939651621';
  const whatsappMsg = encodeURIComponent(
    site.office?.whatsapp?.message || "Hi Kraqen Innovations, I'd like to discuss a project."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;
  const emailUrl = `mailto:${site.office?.email?.address || 'support@kraqeninc.com'}`;
  const phoneNumber = site.office?.phone || site.brand?.phone || '+91 8939651621';
  const phoneUrl = `tel:${phoneNumber.replace(/\s+/g, '')}`;

  const addressLines = site.office?.addressLines || [
    'No 44, Vasantham Nagar,',
    'Kishkinta Main Road, West Tambaram,',
    'Chennai, Tamil Nadu, India - 600045',
  ];

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen">
      <LenisInit />
      <PageTransition />
      <Nav site={site} />

      <main id="top" className="px-[var(--page-x)] pt-[80px] md:pt-[96px] pb-0">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-block)] items-stretch">
          {/* LEFT "contact" card: solid var(--brand-purple) */}
          <div
            className="rounded-[24px] p-6 sm:p-8 md:p-12 text-white flex flex-col justify-between"
            style={{
              backgroundColor: 'var(--brand-purple)',
              minHeight: 'clamp(560px, 46vw, 680px)',
            }}
          >
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 block mb-4">
                {contact.header.label}
              </span>
              <h1 className="font-tanker text-white uppercase text-[clamp(44px,5.5vw,84px)] leading-[0.88] tracking-tight mb-4">
                {contact.header.titleLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </h1>
              <p className="font-mono text-xs md:text-sm text-white/90 leading-relaxed mb-8 max-w-md normal-case">
                {contact.header.paragraph}
              </p>
            </div>

            {/* Office, Phone, Email & Links */}
            <div className="space-y-6 pt-6 border-t border-white/20 font-mono text-xs">
              <div>
                <span className="text-[10px] text-white/60 uppercase tracking-wider block mb-2">
                  OUR CHENNAI OFFICE
                </span>
                <div className="space-y-1 text-white/90 leading-relaxed">
                  {addressLines.map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </div>
                {site.office?.mapUrl && (
                  <a
                    href={site.office.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white underline underline-offset-4 hover:text-white/80 transition-colors inline-block mt-2 font-bold"
                  >
                    VIEW ON MAPS →
                  </a>
                )}
              </div>

              {/* Direct Links */}
              <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between text-white hover:underline transition-colors uppercase font-bold"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    WHATSAPP CHAT
                  </span>
                  <span>→</span>
                </a>
                <a
                  href={emailUrl}
                  className="inline-flex items-center justify-between text-white hover:underline transition-colors uppercase font-bold"
                >
                  <span>EMAIL: {site.office?.email?.address || 'support@kraqeninc.com'}</span>
                  <span>→</span>
                </a>
                <a
                  href={phoneUrl}
                  className="inline-flex items-center justify-between text-white hover:underline transition-colors uppercase font-bold"
                >
                  <span>PHONE: {phoneNumber}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT "send a message" card: background #151515 */}
          <div
            className="rounded-[24px] bg-[#151515] border border-white/12 p-6 sm:p-8 md:p-12 text-white flex flex-col justify-between"
            style={{
              minHeight: 'clamp(560px, 46vw, 680px)',
            }}
          >
            <div>
              <h2 className="font-tanker text-3xl md:text-4xl uppercase tracking-wide text-white mb-2">
                {contact.formCard.title}
              </h2>
              <p className="font-mono text-xs text-white/60 mb-6 leading-relaxed">
                Send us a message and our team will get back to you within 24 hours.
              </p>
              <InquiryForm
                site={site}
                fieldSet="contact"
                placement="contact"
              />
            </div>

            {/* Social Links Footer Block */}
            {contact.formCard.showSocials !== false && (
              <div className="mt-8 pt-6 border-t border-white/15">
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/50 block">
                  {contact.formCard.followLabel || 'FOLLOW US'}
                </span>
                <div className="flex items-center gap-3 my-3">
                  {site.socials.map((social) => {
                    const href = social.url || social.href;
                    if (!href) return null;
                    const norm = social.label.toLowerCase();
                    return (
                      <a
                        key={social.label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Kraqen Innovations on ${social.label}`}
                        className="w-12 h-12 rounded-full border border-white/20 bg-transparent flex items-center justify-center text-white hover:bg-[#22C55E] hover:text-[#0B0B0B] hover:border-[#22C55E] transition-all duration-200"
                      >
                        {norm.includes('instagram') && (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r=".5" />
                          </svg>
                        )}
                        {norm.includes('linkedin') && (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect width="4" height="12" x="2" y="9" />
                            <circle cx="4" cy="4" r="2" />
                          </svg>
                        )}
                        {norm.includes('youtube') && (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                            <path d="m10 15 5-3-5-3z" />
                          </svg>
                        )}
                      </a>
                    );
                  })}
                </div>
                <p className="font-mono text-xs text-white/60 leading-relaxed">
                  {contact.formCard.followText ||
                    'Prefer to talk on social? Say hi and we will reply fast.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer (shows the booking card on /contact) */}
      <Footer site={site} />
    </div>
  );
}
