'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import Brand from '@/components/Brand';
import Logo from '@/components/Logo';
import type { SiteContent } from '@/lib/schemas/site';

interface NavProps {
  site: SiteContent;
}

export default function Nav({ site }: NavProps) {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Entrance animation for desktop nav
  useEffect(() => {
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' }
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
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className={`site-nav ${pathname === '/contact' ? 'text-[#1a1a1a] is-contact' : 'text-[var(--text)]'}`}
        data-page={pathname === '/contact' ? 'contact' : 'default'}
        aria-label="Main navigation"
      >
        {/* Brand Logo Link with min 44x44 tap target */}
        <Brand
          variant="nav"
          src={site.logos.navbarLogo}
          name={site.brand.shortName}
          className="-ml-2"
        />

        {/* Desktop Navigation Links */}
        <ul className="site-nav-links hidden md:flex list-none">
          {site.navigation.links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`transition-colors ${
                    isActive
                      ? 'text-[#FF3300] !opacity-100 font-bold'
                      : pathname === '/contact'
                      ? 'text-[#1a1a1a] hover:opacity-60'
                      : 'text-[var(--text)] hover:text-[var(--text-hover)]'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Hamburger Button (44x44 tap target) */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className={`md:hidden flex flex-col justify-center items-center w-11 h-11 p-2 gap-1.5 pointer-events-auto focus:outline-none ${
            pathname === '/contact' ? 'text-[#1a1a1a]' : 'text-[var(--text)]'
          }`}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={site.navigation.mobileMenuLabel}
        >
          <span className="w-6 h-[1.5px] bg-current block transition-transform" />
          <span className="w-6 h-[1.5px] bg-current block transition-transform" />
        </button>
      </nav>

      {/* Full-Screen Dark Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-[2000] bg-[#0f0f0f] text-white flex flex-col justify-between p-6 sm:p-10"
          style={{ paddingTop: 'max(24px, env(safe-area-inset-top))', paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
        >
          {/* Drawer Header */}
          <div className="flex justify-between items-center pb-6 border-b border-white/15">
            <Brand
              variant="menu"
              src={site.logos.navbarLogo}
              name={site.brand.shortName}
              onClick={() => setMobileOpen(false)}
            />

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center font-mono text-[13px] tracking-wider uppercase text-white/80 hover:text-white"
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
                    isActive ? 'text-[#FF3300]' : 'text-white hover:text-[#FF3300]'
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
                  className="hover:text-[#FF3300] transition-colors py-1"
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
