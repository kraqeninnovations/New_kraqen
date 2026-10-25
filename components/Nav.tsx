'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import Brand from '@/components/Brand';
import type { SiteContent } from '@/lib/schemas/site';

interface NavProps {
  site: SiteContent;
}

export default function Nav({ site }: NavProps) {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll listener for backdrop blur & background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation for desktop nav
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    );
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      if (menuRef.current) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape key & Focus Trap
  useEffect(() => {
    if (!mobileOpen) return;

    const timer = setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[1000] h-[64px] md:h-[72px] transition-all duration-300 px-[var(--page-x)] flex items-center justify-between ${
          scrolled
            ? 'bg-[#0f0f0f]/85 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Brand Logo Link on LEFT */}
        <Brand
          variant="nav"
          src={site.logos.navbarLogo}
          name={site.brand.displayName || 'KRAQEN INNOVATIONS'}
          className="-ml-1"
        />

        {/* Desktop Navigation Links (at the far right end) */}
        <nav aria-label="Desktop Navigation" className="hidden md:flex items-center">
          <ul className="flex items-center gap-6 lg:gap-8 list-none m-0 p-0">
            {site.navigation.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label} className="whitespace-nowrap">
                  <Link
                    href={link.href}
                    className={`transition-colors font-mono text-[11px] uppercase tracking-wider ${
                      isActive
                        ? 'text-white font-bold underline underline-offset-8 decoration-2 decoration-[#3D5AFE]'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile Hamburger Button (44x44 tap target) */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="md:hidden flex flex-col justify-center items-center w-11 h-11 p-2 gap-1.5 focus:outline-none text-white cursor-pointer"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={site.navigation.mobileMenuLabel}
        >
          <span className="w-6 h-[2px] bg-current block transition-transform" />
          <span className="w-6 h-[2px] bg-current block transition-transform" />
        </button>
      </header>

      {/* Full-Screen Dark Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-[2000] bg-[#0f0f0f] text-white flex flex-col justify-between p-6 sm:p-10"
          style={{
            paddingTop: 'max(24px, env(safe-area-inset-top))',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          }}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-6 border-b border-white/15">
            <Brand
              variant="menu"
              src={site.logos.navbarLogo}
              name={site.brand.displayName || 'KRAQEN INNOVATIONS'}
              onClick={() => setMobileOpen(false)}
            />

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center font-mono text-[13px] tracking-wider uppercase text-white/80 hover:text-white cursor-pointer"
              aria-label="Close navigation menu"
            >
              {site.navigation.mobileCloseLabel} [✕]
            </button>
          </div>

          {/* Large Tanker Nav Links */}
          <div className="flex flex-col gap-4 py-8">
            {site.navigation.links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-tanker text-[clamp(44px,13vw,72px)] leading-none uppercase tracking-tight transition-colors min-h-[56px] flex items-center ${
                    isActive ? 'text-[#3D5AFE]' : 'text-white hover:text-[#3D5AFE]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer: Contacts + Socials */}
          <div className="pt-6 border-t border-white/15 flex flex-col gap-4 font-mono text-[11px] tracking-wider uppercase">
            <div className="flex flex-col sm:flex-row justify-between gap-2 text-white/70">
              <a
                href={`mailto:${site.brand.email}`}
                className="hover:text-white py-1 min-h-[44px] flex items-center"
              >
                {site.brand.email}
              </a>
              <a
                href={`tel:${site.brand.phone.replace(/\s+/g, '')}`}
                className="hover:text-white py-1 min-h-[44px] flex items-center"
              >
                {site.brand.phone}
              </a>
            </div>

            <div className="flex flex-wrap gap-4 text-white/50 text-[10px]">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors py-1"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
