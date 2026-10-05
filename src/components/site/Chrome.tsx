import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Lenis from "lenis";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EASE, EASE_OUT } from "./motion-primitives";
import { Logo, LogoMark } from "./Logo";
import { useSiteData } from "@/lib/site-data";

export function SmoothScroll() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    (window as unknown as { __lenis?: Lenis }).__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);
  return null;
}

export function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { site, navigation, contact } = useSiteData();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      if (pathname !== "/") {
        window.location.href = "/" + href;
        return;
      }
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
        if (lenis) {
          lenis.scrollTo(el as HTMLElement, { offset: -80 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const navLinks = navigation.links.length > 0 ? navigation.links : [
    { label: "WORK", href: "/work" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#0d0d0d]/90 py-4 backdrop-blur-md border-b border-cream/10" : "bg-transparent py-6 sm:py-8 md:py-10"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10">
          {/* Top Left: Kraqen Brand */}
          <Link to="/" className="group" data-cursor="link">
            <Logo size={36} />
          </Link>

          {/* Top Right: Links & CTA */}
          <div className="hidden items-center gap-10 md:flex">
            <nav className="flex items-center gap-8 sm:gap-9">
              {navLinks.map((n) => {
                const isRoute = n.href.startsWith("/");
                const isActive = pathname === n.href;
                if (isRoute) {
                  return (
                    <Link
                      key={n.href}
                      to={n.href}
                      className={`eyebrow link-line text-[11px] tracking-widest transition-colors ${
                        isActive ? "text-[var(--color-accent,#ff3b00)] font-bold" : "text-cream/80 hover:text-cream"
                      }`}
                      data-cursor="link"
                    >
                      {n.label} {isActive && "•"}
                    </Link>
                  );
                }
                return (
                  <a
                    key={n.href}
                    href={n.href}
                    onClick={(e) => handleNavClick(e, n.href)}
                    className="eyebrow link-line text-cream/80 hover:text-cream transition-colors text-[11px] tracking-widest"
                    data-cursor="link"
                  >
                    {n.label}
                  </a>
                );
              })}
            </nav>

            <Link
              to={navigation.cta?.href || "/contact"}
              data-cursor="cta"
              className="group inline-flex items-center gap-2 rounded-full border border-cream/30 bg-transparent px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-cream transition-all duration-500 hover:border-[var(--color-accent,#ff3b00)] hover:bg-[var(--color-accent,#ff3b00)] hover:text-white"
            >
              <span>{navigation.cta?.label || "START A PROJECT"}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-cream md:hidden z-50 p-2"
          >
            <span>{open ? "CLOSE" : navigation.mobileLabel || "MENU"}</span>
            {open ? <X className="h-5 w-5 text-[var(--color-accent,#ff3b00)]" /> : <Menu className="h-5 w-5 text-cream" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-[#0d0d0d] px-6 pt-32 pb-12 md:hidden"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="space-y-6">
              <p className="eyebrow text-[var(--color-accent,#ff3b00)] tracking-widest mb-4">{navigation.mobileLabel || "NAVIGATION"}</p>
              {navLinks.map((n, i) => {
                const isRoute = n.href.startsWith("/");
                const isActive = pathname === n.href;
                return (
                  <div key={n.label} className="overflow-hidden border-b border-cream/10 pb-5">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
                    >
                      {isRoute ? (
                        <Link
                          to={n.href}
                          onClick={() => setOpen(false)}
                          className={`font-display text-4xl sm:text-5xl uppercase tracking-[-0.025em] leading-[0.9] transition-colors ${
                            isActive ? "text-[var(--color-accent,#ff3b00)]" : "text-cream hover:text-[var(--color-accent,#ff3b00)]"
                          }`}
                        >
                          {n.label}
                        </Link>
                      ) : (
                        <a
                          href={n.href}
                          onClick={(e) => handleNavClick(e, n.href)}
                          className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-[-0.025em] leading-[0.9] hover:text-[var(--color-accent,#ff3b00)] transition-colors"
                        >
                          {n.label}
                        </a>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-6 pt-6">
              <Link
                to={navigation.cta?.href || "/contact"}
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent,#ff3b00)] py-4 text-center font-display text-lg tracking-wider text-white uppercase"
              >
                <span>{navigation.cta?.label || "START A PROJECT ↗"}</span>
              </Link>
              <div className="flex justify-between text-xs text-muted-text uppercase tracking-widest pt-5 border-t border-cream/10">
                <span>{site.location}</span>
                <span>{contact.info?.email}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  const { site, footer, contact } = useSiteData();

  const scrollToTop = () => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navLinks = footer.navigation.length > 0 ? footer.navigation : [
    { label: "WORK", href: "/work" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
  ];

  const socialLinks = footer.socials.length > 0 ? footer.socials : [
    { label: "INSTAGRAM ↗", href: "https://instagram.com" },
    { label: "LINKEDIN ↗", href: "https://linkedin.com" },
    { label: "GITHUB ↗", href: "https://github.com" },
    { label: "YOUTUBE ↗", href: "https://youtube.com" }
  ];

  return (
    <footer className="bg-[#080808] px-5 pt-20 sm:pt-28 pb-10 sm:pb-12 text-cream md:px-10 border-t border-cream/10 overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        {/* Massive Screen-Spanning Brand Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
          className="overflow-hidden border-b border-cream/10 pb-10 sm:pb-14"
        >
          <h2 className="text-display-brand text-cream font-display uppercase tracking-[-0.04em] leading-[0.74] block">
            {footer.brand || site.shortName || "KRAQEN"}
          </h2>
          {footer.brandSubtitle && (
            <h2 className="text-display-brand text-muted-text/30 font-display uppercase tracking-[-0.04em] leading-[0.74] block">
              {footer.brandSubtitle}
            </h2>
          )}
        </motion.div>

        {/* Links Grid */}
        <div className="mt-14 sm:mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 text-sm pb-16 sm:pb-20 border-b border-cream/10">
          <div>
            <p className="eyebrow mb-5 text-[var(--color-accent,#ff3b00)] font-semibold tracking-widest">NAVIGATION</p>
            <ul className="space-y-3 font-medium">
              {navLinks.map((n) => (
                <li key={n.href}>
                  <Link to={n.href} className="link-line text-cream/80 hover:text-cream text-xs uppercase tracking-wider">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5 text-[var(--color-accent,#ff3b00)] font-semibold tracking-widest">SOCIAL</p>
            <ul className="space-y-3 font-medium">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link-line text-cream/80 hover:text-cream text-xs uppercase tracking-wider">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5 text-[var(--color-accent,#ff3b00)] font-semibold tracking-widest">INQUIRIES</p>
            <a href={`mailto:${contact.info?.email || 'hello@kraqen.com'}`} className="text-lg font-medium text-cream hover:text-[var(--color-accent,#ff3b00)] transition-colors block mb-3">
              {contact.info?.email || "hello@kraqen.com"}
            </a>
            <p className="text-xs text-muted-text leading-relaxed">
              {footer.description || site.description}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5 text-[var(--color-accent,#ff3b00)] font-semibold tracking-widest">STUDIO LOCATION</p>
            <p className="font-medium text-cream uppercase tracking-wider text-xs mb-2">{footer.location || site.location}</p>
            <p className="text-xs text-muted-text leading-relaxed">
              {contact.info?.address || "Building digital products for global brands."}
            </p>
          </div>
        </div>

        {/* Bottom Copyright and Back To Top */}
        <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 pb-2 sm:pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-text tracking-wider uppercase">
          <div className="flex items-center gap-3">
            <LogoMark className="w-5 h-5" />
            <span>{footer.location || `${site.name} · ${site.location}`}</span>
          </div>
          <span>{footer.copyright || `© ${site.year} ${site.name}. All rights reserved.`}</span>
          <button
            onClick={scrollToTop}
            data-cursor="link"
            className="link-line text-cream hover:text-[var(--color-accent,#ff3b00)] uppercase text-xs font-semibold cursor-pointer w-fit"
          >
            {footer.backToTop || "BACK TO TOP ↗"}
          </button>
        </div>
      </div>
    </footer>
  );
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as HTMLElement;
      const cursorTag = target.closest<HTMLElement>("[data-cursor]");

      if (cursorTag) {
        setIsHovered(true);
        const mode = cursorTag.dataset.cursor;
        if (mode === "project") {
          setCursorText("VIEW PROJECT ↗");
        } else if (mode === "cta") {
          setCursorText("LET'S WORK ↗");
        } else if (mode === "link") {
          setCursorText("");
        } else {
          setCursorText("");
        }
      } else if (target.closest("a, button")) {
        setIsHovered(true);
        setCursorText("");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[100] flex items-center justify-center rounded-full bg-cream text-ink font-semibold text-[10px] tracking-wider uppercase mix-blend-difference px-3 py-1"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: cursorText ? "auto" : isHovered ? 36 : 12,
        height: cursorText ? 36 : isHovered ? 36 : 12,
        opacity: 1,
      }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      {cursorText && (
        <span className="whitespace-nowrap text-[#0d0d0d] font-bold px-2">
          {cursorText}
        </span>
      )}
    </motion.div>
  );
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
