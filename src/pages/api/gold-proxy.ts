/**
 * @package GIALLORO-FIRENZE — Gold price proxy
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-18
 * @purpose Server-side proxy verso CMS Laravel /api/v1/gold/price. Evita CORS,
 *          nasconde URL interno del CMS, caching HTTP 60s via headers.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

const API_URL = import.meta.env.CMS_API_URL ?? 'http://127.0.0.1:8765/api/v1';

export const GET: APIRoute = async () => {
  try {
    const res = await fetch(`${API_URL}/gold/price`, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'upstream', status: res.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = await res.text();
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'fetch_failed' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
