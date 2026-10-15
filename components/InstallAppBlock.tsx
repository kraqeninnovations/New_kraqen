'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { SiteContent } from '@/lib/schemas/site';

interface InstallAppBlockProps {
  site: SiteContent;
  className?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppBlock({ site, className = '' }: InstallAppBlockProps) {
  const install = site.install;
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [activeModal, setActiveModal] = useState<'android' | 'ios' | null>(null);
  const [copied, setCopied] = useState(false);
  const [isInApp, setIsInApp] = useState(false);
  const [imgError, setImgError] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check standalone mode & in-app browser
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const ua = navigator.userAgent || navigator.vendor || '';
    const inApp = /FBAN|FBAV|Instagram|Line|WhatsApp|LinkedIn|GSA|Snapchat/i.test(ua);
    setIsInApp(inApp);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Generate QR code client-side
  useEffect(() => {
    if (!install?.qr?.enabled || !install?.qr?.url) return;

    import('qrcode')
      .then((QRCode) => {
        QRCode.toString(install.qr.url, {
          type: 'svg',
          margin: 1,
          color: { dark: '#1a1a1a', light: '#00000000' },
        })
          .then((svg) => setQrSvg(svg))
          .catch((err) => console.error('QR code generation failed:', err));
      })
      .catch((err) => console.error('Failed to load qrcode module:', err));
  }, [install?.qr?.enabled, install?.qr?.url]);

  // Esc key & Focus Trap for Dialog
  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  // If install is disabled or running in standalone mode, hide
  if (!install || install.enabled === false || isStandalone) {
    return null;
  }

  const handleAndroidClick = () => {
    if (install.android.playStoreUrl) {
      window.open(install.android.playStoreUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      });
      return;
    }

    // Open instruction dialog
    setActiveModal('android');

    // Trigger download if apkUrl is set
    if (install.android.apkUrl) {
      const a = document.createElement('a');
      a.href = install.android.apkUrl;
      a.download = 'kraqen.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.warn('install.android.apkUrl is empty');
    }
  };

  const handleIosClick = () => {
    if (install.ios.appStoreUrl) {
      window.open(install.ios.appStoreUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setActiveModal('ios');
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  return (
    <>
      <div
        className={`install-app-block ${className}`}
        style={{ color: '#1a1a1a' }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-12">
          {/* Left Column: App icon + Text + Action Buttons */}
          <div className="flex-1 max-w-2xl">
            {/* Top row with logo & headings: side-by-side vertically centered, gap 14px */}
            <div className="flex items-center gap-[14px] mb-4 sm:mb-5">
              <div
                className="install-logo-wrap flex-shrink-0 rounded-[16px] overflow-hidden border border-[#1a1a1a]/15 flex items-center justify-center bg-transparent"
                style={{ height: 'var(--install-logo-h)', width: 'auto' }}
              >
                {!imgError ? (
                  <Image
                    src={install.appIcon || '/brand/kraqen-mark.png'}
                    alt={site.logos.alt || site.brand.name}
                    width={0}
                    height={0}
                    sizes="96px"
                    priority
                    style={{ height: 'var(--install-logo-h)', width: 'auto' }}
                    className="object-contain block"
                    onError={() => {
                      console.warn('[Install Block] App logo failed to load, falling back to brand name');
                      setImgError(true);
                    }}
                  />
                ) : (
                  <div
                    className="install-logo-fallback flex items-center justify-center font-tanker text-xl text-[#1a1a1a] uppercase px-3"
                    style={{ height: 'var(--install-logo-h)' }}
                  >
                    {site.brand.shortName}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-mono text-[11px] tracking-wider uppercase text-[#1a1a1a]/70 font-semibold mb-0.5">
                  {install.label}
                </span>
                <h3 className="font-tanker text-[clamp(28px,8vw,40px)] md:text-[clamp(32px,4vw,56px)] uppercase leading-none tracking-tight text-[#1a1a1a]">
                  {install.title}
                </h3>
              </div>
            </div>

            <p className="font-mono text-[13px] text-[#1a1a1a]/85 leading-relaxed max-w-[420px] mb-6 sm:mb-8">
              {install.text}
            </p>

            {/* Buttons: Stacked on mobile (56px high, gap 12px), side-by-side on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Android Button */}
              <button
                type="button"
                onClick={handleAndroidClick}
                className="install-pill-btn group h-14 px-5 rounded-full border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#FF3300] focus:bg-[#1a1a1a] focus:text-[#FF3300] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 transition-all duration-200 flex items-center justify-start gap-3.5 w-full sm:w-auto min-w-[210px]"
                aria-label={`${install.android.label} - ${install.android.subLabel}`}
              >
                {/* Android Icon (22x22, flex-shrink: 0, fill: currentColor) */}
                <svg
                  className="w-[22px] h-[22px] min-w-[22px] min-h-[22px] flex-shrink-0 transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.0833 12 8.0833s-3.5902.3283-5.1368.8664L4.8409 5.4467a.4161.4161 0 10-.7197.4155l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                </svg>

                <div className="flex flex-col text-left leading-tight">
                  <span className="font-mono text-[10px] tracking-wider uppercase opacity-75">
                    {install.android.label}
                  </span>
                  <span className="font-mono text-[12px] font-bold tracking-wider uppercase">
                    {install.android.subLabel}
                  </span>
                </div>
              </button>

              {/* iOS Button */}
              <button
                type="button"
                onClick={handleIosClick}
                className="install-pill-btn group h-14 px-5 rounded-full border-[1.5px] border-[#1a1a1a] bg-transparent text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#FF3300] focus:bg-[#1a1a1a] focus:text-[#FF3300] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 transition-all duration-200 flex items-center justify-start gap-3.5 w-full sm:w-auto min-w-[210px]"
                aria-label={`${install.ios.label} - ${install.ios.subLabel}`}
              >
                {/* Apple Icon (22x22, flex-shrink: 0, fill: currentColor) */}
                <svg
                  className="w-[22px] h-[22px] min-w-[22px] min-h-[22px] flex-shrink-0 transition-colors"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.9.04-2 .6-2.65 1.35-.58.65-1.09 1.73-1.03 2.76.99.08 2.05-.49 2.67-1.24z" />
                </svg>

                <div className="flex flex-col text-left leading-tight">
                  <span className="font-mono text-[10px] tracking-wider uppercase opacity-75">
                    {install.ios.label}
                  </span>
                  <span className="font-mono text-[12px] font-bold tracking-wider uppercase">
                    {install.ios.subLabel}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: QR Code (Desktop 1024px+ only) */}
          {install.qr.enabled && qrSvg && (
            <div className="hidden lg:flex flex-col items-center justify-center p-4 border border-[#1a1a1a]/20 rounded-2xl bg-white/10 backdrop-blur-sm flex-shrink-0">
              <div
                className="w-[120px] h-[120px]"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
                aria-label="QR Code for App Install"
              />
              <span className="font-mono text-[10px] tracking-wider uppercase text-[#1a1a1a]/80 text-center max-w-[140px] mt-2 font-medium">
                {install.qr.caption}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Accessible Modals: Android & iOS Instructions */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-modal-title"
          className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center bg-black/75 p-0 sm:p-6 backdrop-blur-sm"
          onClick={() => setActiveModal(null)}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] bg-[#1a1a1a] text-white p-6 sm:p-8 rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl relative font-mono text-[13px] animate-fadeIn"
            style={{
              paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/15 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-black border border-white/20 flex-shrink-0">
                  <Image
                    src={install.appIcon || '/brand/kraqen-mark.png'}
                    alt={site.brand.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4
                    id="install-modal-title"
                    className="font-tanker text-[24px] uppercase tracking-wide leading-none text-white"
                  >
                    {activeModal === 'android'
                      ? install.android.helpTitle
                      : install.ios.helpTitle}
                  </h4>
                  <span className="font-mono text-[11px] text-white/50 tracking-wider uppercase">
                    {site.brand.shortName} App
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-white/60 hover:text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-white"
                aria-label={install.closeLabel || 'Close'}
              >
                ✕
              </button>
            </div>

            {/* In-app Browser Warning for iOS */}
            {activeModal === 'ios' && isInApp && (
              <div className="mb-5 p-3.5 rounded-lg bg-[#FF3300]/15 border border-[#FF3300]/40 text-[#FF6633] text-[12px] leading-relaxed">
                <p className="mb-2 font-medium">{install.ios.inAppBrowserNote}</p>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 bg-[#FF3300] text-black font-bold uppercase rounded text-[11px] hover:bg-white transition-colors"
                >
                  {copied ? 'COPIED TO CLIPBOARD!' : install.ios.copyLinkLabel}
                </button>
              </div>
            )}

            {/* Instructions Steps */}
            <ol className="space-y-3.5 mb-6 text-white/85">
              {(activeModal === 'android'
                ? install.android.helpSteps
                : install.ios.helpSteps
              ).map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[11px]">
                    {idx + 1}
                  </span>
                  <div className="flex-1 pt-0.5 leading-snug flex items-center gap-2">
                    <span>{step}</span>
                    {activeModal === 'ios' && idx === 1 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/15 text-[10px]" title="Share Icon">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <polyline points="16 6 12 2 8 6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                      </span>
                    )}
                    {activeModal === 'ios' && idx === 2 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/15 text-[10px]" title="Add to Home Screen Icon">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {/* Modal Action Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              {activeModal === 'android' && install.android.apkUrl && (
                <a
                  href={install.android.apkUrl}
                  download="kraqen.apk"
                  className="px-5 py-2.5 rounded-full bg-[#FF3300] text-black font-bold uppercase text-[12px] hover:bg-white transition-colors"
                >
                  RE-DOWNLOAD APK
                </a>
              )}
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-full border border-white/20 text-white/80 hover:text-white uppercase text-[12px] transition-colors"
              >
                {install.closeLabel || 'CLOSE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

