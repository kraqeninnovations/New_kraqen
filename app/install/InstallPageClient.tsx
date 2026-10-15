'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Brand from '@/components/Brand';
import type { SiteContent } from '@/lib/schemas/site';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPageClient({ site }: { site: SiteContent }) {
  const install = site.install;
  const [device, setDevice] = useState<'android' | 'ios' | 'desktop'>('desktop');
  const [isInApp, setIsInApp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [qrSvg, setQrSvg] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || navigator.vendor || '';

    if (/android/i.test(ua)) {
      setDevice('android');
    } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      setDevice('ios');
    } else {
      setDevice('desktop');
    }

    const inApp = /FBAN|FBAV|Instagram|Line|WhatsApp|LinkedIn|GSA|Snapchat/i.test(ua);
    setIsInApp(inApp);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Generate QR code for desktop view
  useEffect(() => {
    if (!install?.qr?.url) return;

    import('qrcode')
      .then((QRCode) => {
        QRCode.toString(install.qr.url, {
          type: 'svg',
          margin: 1,
          color: { dark: '#FFFFFF', light: '#00000000' },
        })
          .then((svg) => setQrSvg(svg))
          .catch((err) => console.error('QR code generation failed:', err));
      })
      .catch((err) => console.error('Failed to load qrcode module:', err));
  }, [install?.qr?.url]);

  const handleAndroidInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
      return;
    }

    if (install?.android.apkUrl) {
      const a = document.createElement('a');
      a.href = install.android.apkUrl;
      a.download = 'kraqen.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  if (!install) return null;

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex flex-col justify-between p-6 sm:p-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <Brand variant="nav" src={site.logos.navbarLogo} name={site.brand.shortName} />
        <Link
          href="/"
          className="font-mono text-[12px] tracking-wider uppercase text-white/70 hover:text-white transition-colors"
        >
          ← BACK TO SITE
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl my-auto py-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black border border-white/20 flex-shrink-0">
            <Image
              src={install.appIcon || '/brand/kraqen-mark.png'}
              alt={site.brand.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-mono text-[11px] tracking-wider uppercase text-white/50 block">
              {install.label}
            </span>
            <h1 className="font-tanker text-[clamp(36px,6vw,64px)] uppercase leading-none tracking-tight">
              {install.title}
            </h1>
          </div>
        </div>

        <p className="font-mono text-[13px] text-white/75 leading-relaxed mb-8">
          {install.text}
        </p>

        {/* Android Device Flow */}
        {device === 'android' && (
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAndroidInstall}
                className="h-14 px-6 rounded-full bg-[#FF3300] text-black font-bold font-mono text-[13px] tracking-wider uppercase hover:bg-white transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.0833 12 8.0833s-3.5902.3283-5.1368.8664L4.8409 5.4467a.4161.4161 0 10-.7197.4155l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                </svg>
                {deferredPrompt ? 'INSTALL APP DIRECTLY' : `${install.android.label} / ${install.android.subLabel}`}
              </button>

              {install.android.apkUrl && (
                <a
                  href={install.android.apkUrl}
                  download="kraqen.apk"
                  className="h-14 px-6 rounded-full border border-white/20 text-white font-mono text-[12px] tracking-wider uppercase hover:border-white transition-colors flex items-center justify-center"
                >
                  DOWNLOAD APK DIRECTLY ({install.android.version})
                </a>
              )}
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-mono text-[12px] uppercase text-white/90 font-bold mb-3">
                {install.android.helpTitle}
              </h4>
              <ol className="space-y-2 text-white/70 font-mono text-[12px]">
                {install.android.helpSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5">
                    <span className="text-white/40">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* iOS Device Flow */}
        {device === 'ios' && (
          <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/10 space-y-6">
            {isInApp && (
              <div className="p-4 rounded-xl bg-[#FF3300]/15 border border-[#FF3300]/40 text-[#FF6633] font-mono text-[12px]">
                <p className="mb-3">{install.ios.inAppBrowserNote}</p>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-[#FF3300] text-black font-bold uppercase rounded text-[11px]"
                >
                  {copied ? 'COPIED TO CLIPBOARD!' : install.ios.copyLinkLabel}
                </button>
              </div>
            )}

            <div>
              <h4 className="font-mono text-[13px] uppercase text-white/90 font-bold mb-4">
                {install.ios.helpTitle}
              </h4>
              <ol className="space-y-3.5 text-white/80 font-mono text-[13px]">
                {install.ios.helpSteps.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                    {idx === 1 && (
                      <span className="px-2 py-1 rounded bg-white/15 text-[11px]">
                        <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <polyline points="16 6 12 2 8 6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                      </span>
                    )}
                    {idx === 2 && (
                      <span className="px-2 py-1 rounded bg-white/15 text-[11px]">
                        <svg className="w-4 h-4 inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="12" y1="8" x2="12" y2="16" />
                          <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Desktop View */}
        {device === 'desktop' && (
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-8">
            {qrSvg && (
              <div className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-xl">
                <div
                  className="w-[140px] h-[140px]"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                  aria-label="QR Code for Mobile Install"
                />
                <span className="font-mono text-[10px] tracking-wider uppercase text-white/60 text-center max-w-[150px] mt-2">
                  {install.qr.caption}
                </span>
              </div>
            )}

            <div className="flex-1 space-y-4">
              <h4 className="font-tanker text-[26px] uppercase tracking-wide leading-tight">
                Scan with your phone or download directly
              </h4>
              <p className="font-mono text-[12px] text-white/70 leading-relaxed">
                Open your phone camera to scan the code and install on iOS or Android. Alternatively, you can download the APK package below.
              </p>
              {install.android.apkUrl && (
                <a
                  href={install.android.apkUrl}
                  download="kraqen.apk"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF3300] text-black font-bold font-mono text-[12px] uppercase hover:bg-white transition-colors"
                >
                  DOWNLOAD ANDROID APK ({install.android.version})
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[11px] text-white/40 uppercase">
        <span>{site.brand.copyright}</span>
        <span>{site.brand.tagline}</span>
      </div>
    </main>
  );
}

