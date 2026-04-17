/**
 * @package GIALLORO-FIRENZE — CMS API client
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-18
 * @purpose Fetch live data from Laravel CMS (GIALLORO-FIRENZE-CMS) at request time.
 *          Only published content. Locale-aware.
 */

const API_URL = import.meta.env.CMS_API_URL ?? 'http://127.0.0.1:8765/api/v1';

export interface CmsBlogPost {
  id: number;
  locale: 'it' | 'en' | 'de' | 'es' | 'fr' | 'pt';
  title: string;
  slug: string;
  excerpt: string | null;
  content_md: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  author_id: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CmsPagination { current_page: number; last_page: number; per_page: number; total: number; }
interface CmsListResponse<T> { data: T[]; pagination: CmsPagination; }
interface CmsItemResponse<T> { data: T; }

async function cmsGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchBlogList(locale: 'it' | 'en'): Promise<CmsBlogPost[]> {
  const res = await cmsGet<CmsListResponse<CmsBlogPost>>(`/blog?locale=${locale}&per_page=100`);
  return res?.data ?? [];
}

export async function fetchBlogBySlug(slug: string, locale: 'it' | 'en'): Promise<CmsBlogPost | null> {
  const res = await cmsGet<CmsItemResponse<CmsBlogPost>>(`/blog/${encodeURIComponent(slug)}?locale=${locale}`);
  return res?.data ?? null;
}

export function formatDate(iso: string, locale: 'it' | 'en'): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}
