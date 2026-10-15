'use client';

import { useState, useEffect } from 'react';
import type { ContentName } from '@/lib/schemas';

interface HealthItem {
  name: ContentName;
  status: 'valid' | 'fallback' | 'error';
  lastChecked: string;
  error?: string;
}

interface VersionItem {
  id: string;
  name: ContentName;
  timestamp: string;
  size: number;
}

const FILES: { id: ContentName; label: string; desc: string }[] = [
  { id: 'site', label: 'site.json', desc: 'Brand, SEO, Navigation, Marquee, Footer, Errors' },
  { id: 'home', label: 'home.json', desc: 'Hero headline, Selected Work, Services, 11 Client Partners' },
  { id: 'about', label: 'about.json', desc: 'Intro copy, Team bios, Studio Photos, Approach' },
  { id: 'work', label: 'work.json', desc: 'Portfolio header, Categories, Project gallery' },
  { id: 'contact', label: 'contact.json', desc: 'Hero title, Form fields, Budget & Timing options, Validation' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [selectedFile, setSelectedFile] = useState<ContentName>('site');
  const [jsonText, setJsonText] = useState('');
  const [healthList, setHealthList] = useState<HealthItem[]>([]);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // Check initial authentication by attempting to fetch health
  useEffect(() => {
    fetch('/api/admin/content?health=true')
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
          return res.json();
        }
        setIsAuthenticated(false);
        return null;
      })
      .then((data) => {
        if (data?.health) setHealthList(data.health);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Load file content when selected
  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoadingFile(true);
    setErrorMessage(null);
    setStatusMessage(null);

    fetch(`/api/admin/content?file=${selectedFile}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to load file');
        }
        return res.json();
      })
      .then((data) => {
        setJsonText(data.content);
        setVersions(data.versions || []);
      })
      .catch((err) => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setIsLoadingFile(false);
      });
  }, [selectedFile, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid password');
        return;
      }
      setIsAuthenticated(true);
    } catch {
      setAuthError('Connection error. Please try again.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile, content: jsonText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Validation failed');
        return;
      }

      setStatusMessage(data.message || 'Saved and revalidated successfully.');

      // Refresh versions & health
      fetch(`/api/admin/content?file=${selectedFile}&versions=true`)
        .then((r) => r.json())
        .then((d) => setVersions(d.versions || []));

      fetch('/api/admin/content?health=true')
        .then((r) => r.json())
        .then((d) => setHealthList(d.health || []));
    } catch (err: unknown) {
      setErrorMessage(`Network or server error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(`Cannot format invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleRevert = async (versionId: string) => {
    if (!confirm(`Revert content/${selectedFile}.json to version ${versionId}?`)) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: selectedFile, action: 'revert', versionId }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Revert failed');
        return;
      }

      setStatusMessage(data.message || 'Reverted successfully');

      // Reload content
      fetch(`/api/admin/content?file=${selectedFile}`)
        .then((r) => r.json())
        .then((d) => {
          setJsonText(d.content);
          setVersions(d.versions || []);
        });
    } catch (err) {
      setErrorMessage(`Revert failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center font-mono">
        <span className="text-[12px] uppercase tracking-wider text-white/60">Checking session...</span>
      </div>
    );
  }

  // Password Gate Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6 font-mono">
        <div className="w-full max-w-md bg-[#1a1a1a] border border-white/15 p-8 rounded-[2px] shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-[#FF3300] rounded-full" />
            <h1 className="font-tanker text-[24px] uppercase tracking-wider text-white">
              Kraqen Content CMS
            </h1>
          </div>
          <p className="text-[11px] text-white/60 mb-6 leading-relaxed">
            Please enter your administrator password to edit website content live.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-2">
                ADMIN PASSWORD
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#0f0f0f] border border-white/20 p-3 text-[13px] text-white outline-none focus:border-[#FF3300]"
                autoFocus
              />
            </div>

            {authError && (
              <span className="text-[#FF3300] text-[11px] bg-[#FF3300]/10 p-2.5 border border-[#FF3300]/30">
                {authError}
              </span>
            )}

            <button
              type="submit"
              className="mt-2 w-full py-3 bg-[#FF3300] text-[#1a1a1a] font-bold text-[11px] uppercase tracking-wider hover:bg-[#e02e00] transition-colors"
            >
              ACCESS CMS ↗
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-mono flex flex-col">
      {/* CMS Top Bar */}
      <header className="border-b border-white/15 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#141414]">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF3300]" />
          <div>
            <h1 className="font-tanker text-[22px] tracking-wide text-white leading-none">
              KRAQEN CONTENT STUDIO
            </h1>
            <span className="text-[10px] text-white/50 uppercase tracking-wider">
              LIVE CMS & ON-DEMAND REVALIDATION
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white border border-white/20 px-3 py-1.5 transition-colors"
          >
            VIEW LIVE SITE ↗
          </a>
          <button
            type="button"
            onClick={() => {
              document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              setIsAuthenticated(false);
            }}
            className="text-[#FF3300] hover:underline"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] divide-y lg:divide-y-0 lg:divide-x divide-white/15">
        {/* Left Column: File Selector & Health Status */}
        <aside className="p-6 flex flex-col gap-6 bg-[#121212]">
          <div>
            <h2 className="text-[10px] uppercase tracking-wider text-white/50 mb-3">
              CONTENT FILES (/content)
            </h2>
            <div className="flex flex-col gap-1.5">
              {FILES.map((file) => {
                const isSelected = selectedFile === file.id;
                return (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => setSelectedFile(file.id)}
                    className={`text-left p-3 border transition-all ${
                      isSelected
                        ? 'border-[#FF3300] bg-[#FF3300]/10 text-white'
                        : 'border-white/10 hover:border-white/30 text-white/70 bg-[#161616]'
                    }`}
                  >
                    <div className="font-bold text-[12px]">{file.label}</div>
                    <div className="text-[10px] text-white/45 mt-0.5 truncate">{file.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Health Panel */}
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-[10px] uppercase tracking-wider text-white/50 mb-3">
              CONTENT HEALTH STATUS
            </h2>
            <div className="flex flex-col gap-2 text-[11px]">
              {FILES.map((file) => {
                const item = healthList.find((h) => h.name === file.id);
                const isOk = item?.status === 'valid' || !item;
                return (
                  <div key={file.id} className="flex justify-between items-center py-1">
                    <span className="text-white/70">{file.label}</span>
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 rounded-[2px] font-bold ${
                        isOk ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {item?.status || 'VALID'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Center Column: Raw JSON Editor & Validation Errors */}
        <main className="p-6 flex flex-col bg-[#0e0e0e]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-[13px] font-bold text-white">
                Editing: /content/{selectedFile}.json
              </span>
              {isLoadingFile && <span className="ml-3 text-[11px] text-white/50">Loading...</span>}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleFormat}
                className="px-3 py-1.5 border border-white/20 text-white/80 hover:text-white text-[11px] transition-colors"
              >
                PRETTY PRINT
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-1.5 bg-[#FF3300] hover:bg-[#e02e00] text-[#1a1a1a] font-bold text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSaving ? 'VALIDATING & SAVING...' : 'SAVE CHANGES ↗'}
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {statusMessage && (
            <div className="mb-4 p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-[11px] leading-relaxed">
              ✅ {statusMessage}
            </div>
          )}

          {/* Error Banner (C6 formatted readable errors) */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-950/80 border border-red-600 text-red-200 text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Code Editor Area */}
          <div className="flex-1 relative border border-white/15 bg-[#121212] overflow-hidden rounded-[2px]">
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[500px] p-4 bg-transparent text-[#e6e6e6] font-mono text-[12px] leading-[1.6] outline-none resize-none selection:bg-[#FF3300]/30"
            />
          </div>
        </main>

        {/* Right Column: Version History & Rollback */}
        <aside className="p-6 bg-[#121212] flex flex-col gap-4">
          <div>
            <h2 className="text-[10px] uppercase tracking-wider text-white/50 mb-1">
              VERSION HISTORY (LAST 10)
            </h2>
            <p className="text-[10px] text-white/40 mb-4 leading-normal">
              Every save stores a timestamped backup copy for instant rollback.
            </p>

            {versions.length === 0 ? (
              <span className="text-[11px] text-white/40">No backup versions recorded yet.</span>
            ) : (
              <div className="flex flex-col gap-2">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 bg-[#181818] border border-white/10 flex flex-col gap-2 rounded-[2px]"
                  >
                    <div className="flex justify-between items-center text-[10px] text-white/60">
                      <span>{ver.timestamp}</span>
                      <span>{(ver.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRevert(ver.id)}
                      className="text-left text-[11px] text-[#FF3300] hover:underline font-bold"
                    >
                      ↩ REVERT TO THIS VERSION
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

