import fs from 'fs';
import path from 'path';
import { unstable_cache } from 'next/cache';
import { contentSchemas, ContentName } from './schemas';
import { defaultContentMap } from './defaults';
import type { SiteContent } from './schemas/site';
import type { HomeContent } from './schemas/home';
import type { AboutContent } from './schemas/about';
import type { WorkContent } from './schemas/work';
import type { ContactContent } from './schemas/contact';

export interface ContentHealthItem {
  name: ContentName;
  status: 'valid' | 'fallback' | 'error';
  lastChecked: string;
  error?: string;
}

// In-memory last-known-good cache and health status tracker
const lastKnownGoodCache: Partial<Record<ContentName, unknown>> = {};
const contentHealthStatus: Record<ContentName, ContentHealthItem> = {
  site: { name: 'site', status: 'valid', lastChecked: new Date().toISOString() },
  home: { name: 'home', status: 'valid', lastChecked: new Date().toISOString() },
  about: { name: 'about', status: 'valid', lastChecked: new Date().toISOString() },
  work: { name: 'work', status: 'valid', lastChecked: new Date().toISOString() },
  contact: { name: 'contact', status: 'valid', lastChecked: new Date().toISOString() },
};

export function getContentHealth(): ContentHealthItem[] {
  return Object.values(contentHealthStatus);
}

/**
 * Format human-readable error messages as specified in C6
 */
export function formatErrorMessage(fileName: string, err: unknown, rawText?: string): string {
  if (err instanceof SyntaxError && rawText) {
    // Try to extract line and column from SyntaxError or position
    const match = err.message.match(/position (\d+)/i);
    if (match) {
      const pos = parseInt(match[1], 10);
      const lines = rawText.slice(0, pos).split('\n');
      const line = lines.length;
      const col = lines[lines.length - 1].length + 1;
      return `JSON SYNTAX ERROR in content/${fileName}.json at line ${line}, column ${col}: ${err.message}. Check for a missing comma or quote.`;
    }
    return `JSON SYNTAX ERROR in content/${fileName}.json: ${err.message}. Check for a missing comma or quote.`;
  }

  // Zod error
  if (typeof err === 'object' && err !== null && 'issues' in err) {
    const issues = (err as { issues: Array<{ path: (string | number)[]; message: string }> }).issues;
    return issues
      .map((issue) => {
        const pathStr = issue.path.length > 0 ? issue.path.join('.') : 'root';
        return `CONTENT ERROR in content/${fileName}.json at ${pathStr}: "${issue.message}".`;
      })
      .join('\n');
  }

  return `CONTENT ERROR in content/${fileName}.json: ${err instanceof Error ? err.message : String(err)}`;
}

/**
 * Strips keys starting with "_" as per rule:
 * "keys starting with '_' are notes and are ignored"
 */
function cleanUnderscoreKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(cleanUnderscoreKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (!k.startsWith('_')) {
        out[k] = cleanUnderscoreKeys(v);
      }
    }
    return out;
  }
  return obj;
}

/**
 * Raw load and validation of a content file from disk
 */
export async function loadAndValidateContent<T>(name: ContentName): Promise<T> {
  const filePath = path.join(process.cwd(), 'content', `${name}.json`);
  let rawText = '';

  try {
    rawText = await fs.promises.readFile(filePath, 'utf-8');
  } catch (readErr) {
    const msg = `CONTENT ERROR in content/${name}.json: File could not be read at ${filePath}.`;
    contentHealthStatus[name] = {
      name,
      status: 'error',
      lastChecked: new Date().toISOString(),
      error: msg,
    };
    if (process.env.NODE_ENV === 'development') {
      console.error('\x1b[31m%s\x1b[0m', msg);
    }
    if (lastKnownGoodCache[name]) {
      return lastKnownGoodCache[name] as T;
    }
    return defaultContentMap[name] as T;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (syntaxErr) {
    const msg = formatErrorMessage(name, syntaxErr, rawText);
    contentHealthStatus[name] = {
      name,
      status: 'error',
      lastChecked: new Date().toISOString(),
      error: msg,
    };
    console.error('\x1b[31m%s\x1b[0m', msg);
    if (lastKnownGoodCache[name]) {
      return lastKnownGoodCache[name] as T;
    }
    return defaultContentMap[name] as T;
  }

  const cleaned = cleanUnderscoreKeys(parsed);
  const schema = contentSchemas[name];
  const parseResult = schema.safeParse(cleaned);

  if (!parseResult.success) {
    const msg = formatErrorMessage(name, parseResult.error);
    contentHealthStatus[name] = {
      name,
      status: 'fallback',
      lastChecked: new Date().toISOString(),
      error: msg,
    };
    console.error('\x1b[31m%s\x1b[0m', msg);

    if (process.env.NODE_ENV === 'development') {
      // In development, log the error clearly to the server console
      console.warn(`[Content Warning] Using last valid or default content for content/${name}.json`);
    }

    if (lastKnownGoodCache[name]) {
      return lastKnownGoodCache[name] as T;
    }
    return defaultContentMap[name] as T;
  }

  // Check logo files exist in /public for site
  if (name === 'site') {
    const siteData = parseResult.data as SiteContent;
    const publicDir = path.join(process.cwd(), 'public');
    for (const [logoKey, logoVal] of Object.entries(siteData.logos)) {
      if (typeof logoVal === 'string' && logoVal.startsWith('/')) {
        const fullPath = path.join(publicDir, logoVal.slice(1));
        if (!fs.existsSync(fullPath)) {
          const msg = `CONTENT ERROR in content/site.json at logos.${logoKey}: file "${logoVal}" not found in /public.`;
          console.error('\x1b[31m%s\x1b[0m', msg);
          contentHealthStatus[name] = {
            name,
            status: 'fallback',
            lastChecked: new Date().toISOString(),
            error: msg,
          };
          if (lastKnownGoodCache[name]) {
            return lastKnownGoodCache[name] as T;
          }
          return defaultContentMap[name] as T;
        }
      }
    }
  }

  // Success
  contentHealthStatus[name] = {
    name,
    status: 'valid',
    lastChecked: new Date().toISOString(),
  };
  lastKnownGoodCache[name] = parseResult.data;
  return parseResult.data as T;
}

/**
 * Cache-wrapped content getter using Next.js unstable_cache with tag-based revalidation
 */
const getCachedContentInternal = (name: ContentName) =>
  unstable_cache(
    async () => loadAndValidateContent(name),
    [`content-${name}`],
    {
      tags: [`content-${name}`],
      revalidate: false, // Revalidated on-demand via revalidateTag
    }
  )();

/**
 * Primary loader for pages and server components
 */
export async function getContent<T = unknown>(name: ContentName): Promise<T> {
  if (process.env.NODE_ENV === 'development') {
    // In dev mode, always read fresh so editing JSON updates live without server restart
    return loadAndValidateContent<T>(name);
  }
  return getCachedContentInternal(name) as Promise<T>;
}

// Strongly typed convenience helpers
export const getSiteContent = () => getContent<SiteContent>('site');
export const getHomeContent = () => getContent<HomeContent>('home');
export const getAboutContent = () => getContent<AboutContent>('about');
export const getWorkContent = () => getContent<WorkContent>('work');
export const getContactContent = () => getContent<ContactContent>('contact');

export { interpolate } from './content-utils';

