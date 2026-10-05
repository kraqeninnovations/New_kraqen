import { useEffect, useState } from 'react';
import siteJson from '../data/site.json';
import type { SiteData } from './types';

/**
 * Validates critical properties in SiteData JSON
 */
function validateSiteData(data: any): SiteData {
  if (!data || typeof data !== 'object') {
    throw new Error('[SiteData Error] Invalid site.json format: Data must be an object.');
  }

  const requiredKeys = ['site', 'theme', 'typography', 'navigation', 'home', 'work', 'about', 'contact', 'footer', 'animations'];
  for (const key of requiredKeys) {
    if (!data[key]) {
      console.warn(`[SiteData Warning] Missing section "${key}" in site.json. Falling back to default structural data.`);
    }
  }

  return data as SiteData;
}

const siteData: SiteData = validateSiteData(siteJson);

/**
 * Data Access Layer (DAL)
 * Returns the central website configuration from site.json.
 * This can easily be updated to fetch from an external CMS or API in the future.
 */
export function getSiteData(): SiteData {
  return siteData;
}

/**
 * Applies CSS variables from theme and typography to the root element.
 */
export function applyThemeVariables(theme: SiteData['theme'], typography: SiteData['typography'], animations: SiteData['animations']) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Theme colors
  root.style.setProperty('--color-background', theme.background || '#111111');
  root.style.setProperty('--color-surface', theme.surface || '#151515');
  root.style.setProperty('--color-text', theme.text || '#F3F0E6');
  root.style.setProperty('--color-muted-text', theme.mutedText || '#A5A29B');
  root.style.setProperty('--color-border', theme.border || 'rgba(243,240,230,0.2)');
  root.style.setProperty('--color-accent', theme.accent || '#FF3B00');
  root.style.setProperty('--color-footer-background', theme.footerBackground || '#FF3B00');
  root.style.setProperty('--color-footer-text', theme.footerText || '#111111');

  // Typography
  if (typography) {
    if (typography.heroSize) root.style.setProperty('--hero-size', typography.heroSize);
    if (typography.sectionHeadingSize) root.style.setProperty('--section-heading-size', typography.sectionHeadingSize);
    if (typography.serviceSize) root.style.setProperty('--service-size', typography.serviceSize);
    if (typography.footerSize) root.style.setProperty('--footer-size', typography.footerSize);
    if (typography.displayFont) root.style.setProperty('--font-display', typography.displayFont);
    if (typography.bodyFont) root.style.setProperty('--font-body', typography.bodyFont);
  }

  // Animation settings
  if (animations) {
    root.style.setProperty('--anim-enabled', animations.enabled ? '1' : '0');
    root.style.setProperty('--anim-duration', `${animations.textReveal?.duration || 900}ms`);
    root.style.setProperty('--anim-stagger', `${animations.textReveal?.stagger || 100}ms`);
  }
}

/**
 * React Hook for consuming reactive site data & applying CSS variables.
 */
export function useSiteData(): SiteData {
  const [data, setData] = useState<SiteData>(siteData);

  useEffect(() => {
    // Apply theme and typography CSS vars immediately
    applyThemeVariables(data.theme, data.typography, data.animations);
  }, [data]);

  return data;
}

export default siteData;
