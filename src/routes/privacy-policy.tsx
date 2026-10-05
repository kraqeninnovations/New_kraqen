import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "PRIVACY POLICY — KRAQEN INNOVATIONS" },
      { name: "description", content: "Privacy policy and data protection standards for Kraqen Innovations." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="bg-[#111111] text-[#F3F0E6] min-h-screen pt-32 sm:pt-36 lg:pt-44 px-5 md:px-10 pb-24">
      <div className="mx-auto max-w-[900px] space-y-10">
        <p className="eyebrow text-[var(--color-accent,#ff3b00)]">LEGAL & PRIVACY</p>
        <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-tight text-[#F3F0E6]">
          PRIVACY POLICY
        </h1>
        <div className="space-y-6 text-sm text-[#B7B4AC] leading-relaxed border-t border-cream/15 pt-8">
          <p>
            At Kraqen Innovations ("Kraqen", "we", "us", or "our"), we respect your privacy and are committed to protecting personal data. This privacy policy informs you how we look after your personal data when you visit our website or interact with our digital services.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">1. INFORMATION WE COLLECT</h2>
          <p>
            We collect information provided directly by you through our project enquiry form, contact form, or newsletter subscription, including your name, email address, phone number, company name, and project description.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">2. HOW WE USE YOUR INFORMATION</h2>
          <p>
            We use collected information solely to evaluate project inquiries, respond to communications, deliver contracted digital engineering services, and provide periodic newsletter updates where requested. We do not sell or rent personal information to third parties.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">3. DATA SECURITY</h2>
          <p>
            We maintain strict administrative, technical, and physical security measures designed to protect personal data against unauthorized access, loss, or alteration.
          </p>
          <h2 className="font-display text-xl text-[#F3F0E6] uppercase pt-4">4. CONTACT US</h2>
          <p>
            If you have questions regarding this Privacy Policy, please reach out to us at <a href="mailto:support@kraqeninc.com" className="text-[var(--color-accent,#ff3b00)] underline">support@kraqeninc.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
