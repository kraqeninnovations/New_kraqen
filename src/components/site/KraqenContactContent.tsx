import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteData } from "@/lib/site-data";
import { LogoMark } from "./Logo";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function ContactPageContent() {
  const { site, contact } = useSiteData();
  const { hero, tel, phone, email, socials, location, form, newsletter } = contact;

  // Live Chennai Clock State
  const [chennaiTime, setChennaiTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const formatted = new Intl.DateTimeFormat("en-GB", {
        timeZone: location?.timezone || "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
      setChennaiTime(formatted);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [location?.timezone]);

  // Main Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (form.fields.name.required && !formData.name.trim()) {
      errs.name = "Name is required";
    }
    if (form.fields.email.required && (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))) {
      errs.email = "Valid email is required";
    }
    if (form.fields.phone.required && !formData.phone.trim()) {
      errs.phone = "Phone number is required";
    }
    if (form.fields.message.required && !formData.message.trim()) {
      errs.message = "Goals & challenges description is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && /\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterSubmitted(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#111111] text-[#F3F0E6] min-h-screen">
      {/* ==========================================
          1. CONTACT HERO SECTION
         ========================================== */}
      <section className="pt-32 sm:pt-36 lg:pt-44 px-5 md:px-10 pb-20 sm:pb-24 lg:pb-32 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="space-y-6">
            {/* Subtitle / Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
              className="flex items-center gap-3"
            >
              <span className="h-[2px] w-6 bg-[#FF3B00]" />
              <span className="eyebrow text-[#FF3B00] font-semibold tracking-[0.25em]">
                {hero?.subtitle || "MEET KRAQEN"}
              </span>
            </motion.div>

            {/* Massive Display Title */}
            <h1 className="font-display text-[20vw] sm:text-[16vw] lg:text-[11vw] leading-[0.84] sm:leading-[0.86] lg:leading-[0.88] uppercase tracking-[-0.035em] text-[#F3F0E6]">
              {(hero?.title || ["WE CREATE.", "WE MARKET.", "WE BUILD."]).map((line, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 + idx * 0.1, ease: EASE_OUT }}
                  className="block mb-1 sm:mb-2"
                >
                  {line}
                </motion.span>
              ))}
            </h1>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. CONTACT INFORMATION SECTION
         ========================================== */}
      <section className="py-20 sm:py-24 lg:py-32 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* TEL Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
              className="space-y-3"
            >
              <p className="eyebrow text-[#FF3B00] font-semibold tracking-widest text-xs">TEL</p>
              <a
                href={`tel:${(tel || "+91 44 4642 8157").replace(/\s+/g, "")}`}
                className="font-display text-2xl sm:text-3xl text-[#F3F0E6] hover:text-[#FF3B00] transition-colors block leading-tight"
              >
                {tel || "+91 44 4642 8157"}
              </a>
            </motion.div>

            {/* PHONE Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT }}
              className="space-y-3"
            >
              <p className="eyebrow text-[#FF3B00] font-semibold tracking-widest text-xs">PHONE</p>
              <a
                href={`tel:${(phone || "+91 8939651621").replace(/\s+/g, "")}`}
                className="font-display text-2xl sm:text-3xl text-[#F3F0E6] hover:text-[#FF3B00] transition-colors block leading-tight"
              >
                {phone || "+91 8939651621"}
              </a>
            </motion.div>

            {/* EMAIL Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
              className="space-y-3"
            >
              <p className="eyebrow text-[#FF3B00] font-semibold tracking-widest text-xs">EMAIL</p>
              <a
                href={`mailto:${email || "support@kraqeninc.com"}`}
                className="font-display text-xl sm:text-2xl lg:text-3xl text-[#F3F0E6] hover:text-[#FF3B00] transition-colors block leading-tight break-all"
              >
                {email || "support@kraqeninc.com"}
              </a>
            </motion.div>

            {/* SOCIAL MEDIA Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT }}
              className="space-y-3"
            >
              <p className="eyebrow text-[#FF3B00] font-semibold tracking-widest text-xs">SOCIAL MEDIA</p>
              <ul className="space-y-2 text-sm font-semibold uppercase tracking-wider">
                {(socials || [
                  { label: "Instagram", href: "https://instagram.com" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                  { label: "YouTube", href: "https://youtube.com" }
                ]).map((soc) => (
                  <li key={soc.label}>
                    <a
                      href={soc.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-line text-[#F3F0E6] hover:text-[#FF3B00] transition-colors"
                    >
                      {soc.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==========================================
          3. LOCATION & LIVE CHENNAI TIME BLOCK
         ========================================== */}
      <section className="py-20 sm:py-24 lg:py-32 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* City & Live Clock */}
            <div className="lg:col-span-5 space-y-4">
              <p className="eyebrow text-[#FF3B00] font-semibold tracking-widest text-xs">STUDIO LOCATION</p>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#F3F0E6] uppercase leading-[0.88] tracking-[-0.03em]">
                {location?.city || "CHENNAI"}
              </h2>
              <div className="flex items-center gap-3 pt-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF3B00] animate-pulse" />
                <span className="font-mono text-xl sm:text-2xl tracking-wider text-[#F3F0E6]">
                  {chennaiTime || "17:08:54"}
                </span>
                <span className="text-xs text-[#A5A29B] font-semibold tracking-widest">IST (UTC+5:30)</span>
              </div>
            </div>

            {/* Address */}
            <div className="lg:col-span-7 lg:pl-12 border-t border-[rgba(243,240,230,0.15)] pt-8 lg:border-t-0 lg:pt-0">
              <div className="space-y-2 text-base sm:text-lg lg:text-xl text-[#B7B4AC] leading-relaxed">
                {(location?.address || [
                  "No 44, Vasantham Nagar,",
                  "Kishkinta Main Road,",
                  "Chennai - 600045"
                ]).map((line, idx) => (
                  <p key={idx} className="font-normal text-[#F3F0E6]">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          4. MAIN CONTACT FORM SECTION
         ========================================== */}
      <section className="py-24 sm:py-32 lg:py-40 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
            {/* Left: Heading */}
            <div className="lg:col-span-6 space-y-6">
              <p className="eyebrow text-[#FF3B00] font-semibold tracking-widest text-xs">START A CONVERSATION</p>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#F3F0E6] uppercase leading-[0.84] sm:leading-[0.86] tracking-[-0.035em]">
                {(form?.title || ["LET'S BUILD", "SOMETHING GREAT"]).map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-6 lg:pl-6">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-[rgba(243,240,230,0.25)] bg-[#151515] p-10 sm:p-12 lg:p-16 text-center space-y-6"
                  >
                    <CheckCircle2 className="h-16 w-16 text-[#FF3B00] mx-auto" />
                    <h3 className="font-display text-4xl sm:text-5xl text-[#F3F0E6] uppercase leading-[0.88] tracking-tight">
                      THANK YOU.<br />WE'LL BE IN TOUCH.
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A5A29B] max-w-sm mx-auto leading-relaxed pt-2">
                      We have received your details and will get back to you shortly.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", message: "" });
                      }}
                      className="eyebrow link-line text-[#FF3B00] font-bold text-xs uppercase pt-4 cursor-pointer"
                    >
                      SEND ANOTHER ENQUIRY ↗
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE_OUT }}
                    onSubmit={handleFormSubmit}
                    className="space-y-8"
                  >
                    {/* NAME */}
                    <div className="space-y-2">
                      <label className="eyebrow text-[#F3F0E6] text-xs block font-bold tracking-widest">
                        {form?.fields?.name?.label || "NAME"}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={form?.fields?.name?.placeholder || "Your name"}
                        className={`w-full bg-transparent border ${
                          errors.name ? "border-[#FF3B00]" : "border-[rgba(243,240,230,0.25)]"
                        } px-4 py-4 text-sm text-[#F3F0E6] placeholder:text-[#A5A29B]/60 focus:border-[#F3F0E6] focus:outline-none transition-colors rounded-none`}
                      />
                      {errors.name && <p className="text-xs text-[#FF3B00] font-semibold mt-1">{errors.name}</p>}
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">
                      <label className="eyebrow text-[#F3F0E6] text-xs block font-bold tracking-widest">
                        {form?.fields?.email?.label || "EMAIL"}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={form?.fields?.email?.placeholder || "your@email.com"}
                        className={`w-full bg-transparent border ${
                          errors.email ? "border-[#FF3B00]" : "border-[rgba(243,240,230,0.25)]"
                        } px-4 py-4 text-sm text-[#F3F0E6] placeholder:text-[#A5A29B]/60 focus:border-[#F3F0E6] focus:outline-none transition-colors rounded-none`}
                      />
                      {errors.email && <p className="text-xs text-[#FF3B00] font-semibold mt-1">{errors.email}</p>}
                    </div>

                    {/* PHONE NUMBER */}
                    <div className="space-y-2">
                      <label className="eyebrow text-[#F3F0E6] text-xs block font-bold tracking-widest">
                        {form?.fields?.phone?.label || "PHONE NUMBER"}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={form?.fields?.phone?.placeholder || "Your phone number"}
                        className={`w-full bg-transparent border ${
                          errors.phone ? "border-[#FF3B00]" : "border-[rgba(243,240,230,0.25)]"
                        } px-4 py-4 text-sm text-[#F3F0E6] placeholder:text-[#A5A29B]/60 focus:border-[#F3F0E6] focus:outline-none transition-colors rounded-none`}
                      />
                      {errors.phone && <p className="text-xs text-[#FF3B00] font-semibold mt-1">{errors.phone}</p>}
                    </div>

                    {/* DESCRIBE YOUR GOALS AND CHALLENGES */}
                    <div className="space-y-2">
                      <label className="eyebrow text-[#F3F0E6] text-xs block font-bold tracking-widest">
                        {form?.fields?.message?.label || "DESCRIBE YOUR GOALS AND CHALLENGES"}
                      </label>
                      <textarea
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={form?.fields?.message?.placeholder || "Type here.."}
                        className={`w-full bg-transparent border ${
                          errors.message ? "border-[#FF3B00]" : "border-[rgba(243,240,230,0.25)]"
                        } px-4 py-4 text-sm text-[#F3F0E6] placeholder:text-[#A5A29B]/60 focus:border-[#F3F0E6] focus:outline-none transition-colors rounded-none`}
                      />
                      {errors.message && <p className="text-xs text-[#FF3B00] font-semibold mt-1">{errors.message}</p>}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                      type="submit"
                      data-cursor="cta"
                      className="group w-full flex items-center justify-center gap-3 bg-[#FF3B00] hover:bg-[#F3F0E6] text-[#111111] py-5 sm:py-6 text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-none cursor-pointer mt-4"
                    >
                      <span>{form?.submit || "LET'S TALK GROWTH!"}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          5. NEWSLETTER SECTION
         ========================================== */}
      <section className="py-24 sm:py-32 px-5 md:px-10 border-b border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Title */}
            <div className="lg:col-span-6 space-y-4">
              <p className="eyebrow text-[#FF3B00] font-semibold tracking-widest text-xs">STAY INFORMED</p>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#F3F0E6] uppercase leading-[0.88] tracking-[-0.03em]">
                {(newsletter?.title || ["SUBSCRIBE TO OUR", "NEWSLETTER"]).map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>

            {/* Form */}
            <div className="lg:col-span-6 lg:pl-6">
              {newsletterSubmitted ? (
                <div className="border border-[rgba(243,240,230,0.25)] bg-[#151515] p-6 text-center text-sm font-semibold text-[#F3F0E6]">
                  THANK YOU FOR SUBSCRIBING TO KRAQEN INNOVATIONS.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <label className="eyebrow text-[#F3F0E6] text-xs block font-bold tracking-widest">
                    {newsletter?.label || "YOUR EMAIL"}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={newsletter?.placeholder || "Enter your email"}
                      className="w-full bg-transparent border border-[rgba(243,240,230,0.25)] px-4 py-4 text-sm text-[#F3F0E6] placeholder:text-[#A5A29B]/60 focus:border-[#F3F0E6] focus:outline-none transition-colors rounded-none"
                    />
                    <button
                      type="submit"
                      className="bg-[#FF3B00] hover:bg-[#F3F0E6] text-[#111111] px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors duration-300 shrink-0 rounded-none cursor-pointer"
                    >
                      {newsletter?.button || "SUBSCRIBE"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          6. FOOTER SECTION
         ========================================== */}
      <footer className="bg-[#080808] text-[#F3F0E6] px-5 pt-20 sm:pt-28 pb-10 sm:pb-12 md:px-10 border-t border-[rgba(243,240,230,0.15)]">
        <div className="mx-auto max-w-[1440px] space-y-16">
          {/* Top Links Grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-sm pb-12 border-b border-[rgba(243,240,230,0.15)]">
            {/* NAVIGATION LINKS */}
            <div>
              <p className="eyebrow mb-5 text-[#FF3B00] font-semibold tracking-widest text-xs">NAVIGATION</p>
              <ul className="space-y-3 font-semibold uppercase text-xs tracking-wider">
                <li>
                  <Link to="/services" className="link-line text-[#F3F0E6] hover:text-[#FF3B00]">
                    SERVICES
                  </Link>
                </li>
                <li>
                  <Link to="/work" className="link-line text-[#F3F0E6] hover:text-[#FF3B00]">
                    PORTFOLIO
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="link-line text-[#F3F0E6] hover:text-[#FF3B00]">
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="link-line text-[#FF3B00] font-bold">
                    CONTACT •
                  </Link>
                </li>
              </ul>
            </div>

            {/* CONTACT DETAILS */}
            <div>
              <p className="eyebrow mb-5 text-[#FF3B00] font-semibold tracking-widest text-xs">CONTACT DETAILS</p>
              <div className="space-y-2 text-xs font-semibold uppercase tracking-wider text-[#B7B4AC]">
                <p>
                  <a href={`mailto:${email || "support@kraqeninc.com"}`} className="text-[#F3F0E6] hover:text-[#FF3B00] transition-colors">
                    {email || "support@kraqeninc.com"}
                  </a>
                </p>
                <p>
                  <a href={`tel:${(phone || "+91 8939651621").replace(/\s+/g, "")}`} className="text-[#F3F0E6] hover:text-[#FF3B00] transition-colors">
                    {phone || "+91 8939651621"}
                  </a>
                </p>
              </div>
            </div>

            {/* LEGAL LINKS */}
            <div>
              <p className="eyebrow mb-5 text-[#FF3B00] font-semibold tracking-widest text-xs">LEGAL</p>
              <ul className="space-y-3 font-semibold uppercase text-xs tracking-wider">
                <li>
                  <Link to="/privacy-policy" className="link-line text-[#F3F0E6] hover:text-[#FF3B00]">
                    PRIVACY POLICY
                  </Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions" className="link-line text-[#F3F0E6] hover:text-[#FF3B00]">
                    TERMS AND CONDITIONS
                  </Link>
                </li>
              </ul>
            </div>

            {/* SOCIAL MEDIA LINKS */}
            <div>
              <p className="eyebrow mb-5 text-[#FF3B00] font-semibold tracking-widest text-xs">SOCIAL</p>
              <ul className="space-y-3 font-semibold uppercase text-xs tracking-wider">
                {(socials || [
                  { label: "Instagram", href: "https://instagram.com" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                  { label: "YouTube", href: "https://youtube.com" }
                ]).map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="link-line text-[#F3F0E6] hover:text-[#FF3B00]">
                      {s.label.toUpperCase()} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Strip: Copyright & Back To Top */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-bold uppercase tracking-wider text-[#A5A29B]">
            <div className="flex items-center gap-3">
              <LogoMark className="w-5 h-5 text-[#FF3B00]" />
              <span>{site.name}</span>
            </div>
            <span>© 2026 KRAQEN. ALL RIGHTS RESERVED.</span>
            <button
              onClick={scrollToTop}
              data-cursor="link"
              className="link-line text-[#F3F0E6] hover:text-[#FF3B00] uppercase text-xs font-extrabold cursor-pointer w-fit"
            >
              BACK TO TOP ↗
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
