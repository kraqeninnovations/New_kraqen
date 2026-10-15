/**
 * Client-safe content utilities (no Node.js fs dependencies)
 */

/**
 * String interpolation helper for templates like "{count} / {total}" or "Showing {count} projects"
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  if (!template) return '';
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return vars[key] !== undefined ? String(vars[key]) : `{${key}}`;
  });
}

