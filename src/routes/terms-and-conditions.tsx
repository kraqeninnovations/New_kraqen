import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "TERMS AND CONDITIONS — KRAQEN INNOVATIONS" },
      { name: "description", content: "Terms and conditions of service for Kraqen Innovations." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="bg-[#111111] text-[#F3F0E6] min-h-screen pt-32 sm:pt-36 lg:pt-44 px-5 md:px-10 pb-24">
      <div className="mx-auto max-w-[900px] space-y-10">
        <p className="eyebrow text-[var(--color-accent,#ff3b00)]">LEGAL & COMPLIANCE</p>
        <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-tight text-[#F3F0E6]">
          TERMS AND CONDITIONS
        </h1>
        <div className="space-y-6 text-sm text-[#B7B4AC] leading-relaxed border-t border-cream/15 pt-8">
          <p>
            Welcome to Kraqen Innovations. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">1. INTELLECTUAL PROPERTY</h2>
          <p>
            All content, visual assets, code, designs, and branding displayed on this website are the exclusive intellectual property of Kraqen Innovations unless otherwise indicated.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">2. USE OF SERVICES</h2>
          <p>
            Our website and contact interfaces must be used solely for lawful inquiries and legitimate project collaborations. Any unauthorized attempt to breach website security or compromise infrastructure is strictly prohibited.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">3. GOVERNING LAW</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India, with primary jurisdiction in Chennai, Tamil Nadu.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">4. INQUIRIES</h2>
          <p>
            For any legal or contractual inquiries, please contact us at <a href="mailto:support@kraqeninc.com" className="text-[var(--color-accent,#ff3b00)] underline">support@kraqeninc.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
