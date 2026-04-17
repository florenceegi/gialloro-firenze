/**
 * @package GIALLORO-FIRENZE — i18n helpers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-17
 * @purpose Resolver atomic keys (P0-102). t(key) solo lookup diretto, no interpolazione.
 *          Chi serve inserire valori dinamici: concatena fuori (es. t('x') + ' ' + name).
 */
import it from './it.json';
import en from './en.json';

export type Locale = 'it' | 'en';
const dicts = { it, en } as const;
export type Dict = typeof it;
export type Key = keyof Dict;

export function getDict(locale: Locale): Dict {
  return dicts[locale] as Dict;
}

export function t(locale: Locale, key: Key): string {
  const d = dicts[locale] as Dict;
  const v = d[key];
  if (typeof v !== 'string') {
    // In dev: segnalare chiave mancante (build-time warn)
    if (import.meta.env.DEV) console.warn(`[i18n] missing: ${locale}.${key}`);
    return String(key);
  }
  return v;
}

export function altLocale(current: Locale): Locale {
  return current === 'it' ? 'en' : 'it';
}

export function hrefFor(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (locale === 'it') return clean ? `/${clean}` : '/';
  return clean ? `/en/${clean}` : '/en';
}

/**
 * Mappa route IT ↔ EN. Usa URL inglesi più naturali per SEO EN.
 * Per hreflang cross-locale serve questa mappa esplicita.
 */
export const ROUTES_IT_TO_EN: Record<string, string> = {
  '/': '/en',
  '/compro-oro': '/en/sell-gold',
  '/investimento': '/en/buy-gold',
  '/gioielleria': '/en/jewelry',
  '/quotazioni': '/en/live-price',
  '/perizie': '/en/appraisals',
  '/faq': '/en/faq',
  '/blog': '/en/news',
  '/chi-siamo': '/en/about',
  '/contatti': '/en/contact',
};

export const ROUTES_EN_TO_IT: Record<string, string> = Object.fromEntries(
  Object.entries(ROUTES_IT_TO_EN).map(([it, en]) => [en, it]),
);

export function alternateUrl(currentLocale: Locale, currentPath: string): string {
  if (currentLocale === 'it') return ROUTES_IT_TO_EN[currentPath] ?? currentPath;
  return ROUTES_EN_TO_IT[currentPath] ?? currentPath;
}
