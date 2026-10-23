import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import LenisInit from '@/components/LenisInit';
import PageTransition from '@/components/PageTransition';
import InquiryForm from '@/components/InquiryForm';
import CalendlyBookingCard from '@/components/CalendlyBookingCard';
import Footer from '@/components/Footer';
import { getSiteContent, getContactContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const [site, contact] = await Promise.all([getSiteContent(), getContactContent()]);
  return {
    title: contact.seo.title || 'Contact | Kraqen',
    description: contact.seo.description || site.seo.description,
    openGraph: {
      title: contact.seo.title || 'Contact | Kraqen',
      description: contact.seo.description || site.seo.description,
      type: 'website',
    },
  };
}

export default async function ContactPage() {
  const [site, contact] = await Promise.all([getSiteContent(), getContactContent()]);

  const whatsappUrl = `https://wa.me/${site.office.whatsapp.number}?text=${encodeURIComponent(
    site.office.whatsapp.message || "Hi Kraqen, I'd like to discuss a project."
  )}`;
  const emailUrl = `mailto:${site.office.email.address}`;
  const phoneUrl = `tel:${site.brand.phone.replace(/\s+/g, '')}`;

  const validAddressLines = site.office.addressLines.filter((l) => l.trim().length > 0);

  return (
    <div className="bg-[#0f0f0f] text-white min-h-screen">
      <LenisInit />
      <PageTransition />
      <Nav site={site} />
      <main className="section-px pt-28 md:pt-36 pb-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Solid Brand Purple Rounded Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 rounded-[24px] bg-brand-purple p-6 sm:p-8 md:p-12 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/70 block mb-6">
                {contact.header.label}
              </span>
              <h1 className="font-tanker text-white uppercase text-[clamp(48px,6vw,96px)] leading-[0.88] tracking-tight mb-6">
                {contact.header.titleLines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </h1>
              <p className="font-mono text-xs md:text-sm text-white/85 leading-relaxed mb-10 max-w-md">
                {contact.header.paragraph}
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-6 pt-6 border-t border-white/30 font-mono text-xs">
              {/* Address */}
              <div>
                <span className="text-[10px] text-white/60 uppercase tracking-wider block mb-1">
                  OFFICE
                </span>
                {validAddressLines.length > 0 ? (
                  validAddressLines.map((l, i) => <div key={i}>{l}</div>)
                ) : (
                  <div>Chennai, Tamil Nadu, India</div>
                )}
              </div>

              {/* Direct links */}
              <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between text-white hover:text-white/80 transition-colors uppercase font-bold"
                >
                  <span>WHATSAPP CHAT</span>
                  <span>→</span>
                </a>
                <a
                  href={emailUrl}
                  className="inline-flex items-center justify-between text-white hover:text-white/80 transition-colors uppercase font-bold"
                >
                  <span>{site.office.email.address}</span>
                  <span>→</span>
                </a>
                <a
                  href={phoneUrl}
                  className="inline-flex items-center justify-between text-white hover:text-white/80 transition-colors uppercase font-bold"
                >
                  <span>{site.brand.phone}</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Stacked Cards (Form Card + Booking Card) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Card 1: Form Card */}
            <div className="rounded-[20px] bg-[#151515] border border-white/12 p-6 sm:p-8 md:p-10 text-white shadow-2xl">
              <h2 className="font-tanker text-2xl md:text-3xl uppercase tracking-wide text-white mb-6">
                {contact.formCard.title}
              </h2>
              <InquiryForm
                site={site}
                fieldSet="contact"
                placement="contact"
                submitButtonClassName="bg-brand-purple text-white hover:bg-brand-purple-dark"
              />
            </div>

            {/* Card 2: Calendly Booking Card */}
            <CalendlyBookingCard data={contact.booking} />
          </div>
        </div>
      </main>

      {/* Footer (form card automatically hidden on /contact) */}
      <Footer site={site} />
    </div>
  );
}
