#!/usr/bin/env node
/**
 * @package GIALLORO-FIRENZE — Asset Scraper
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-17
 * @purpose Scraping immagini da gialloorofirenze.it → public/images/original/.
 *          Crawl pagine principali, estrae src/srcset, filtra wp-content/uploads,
 *          normalizza filename, skippa duplicati, log strutturato.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { constants as FS } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT = join(ROOT, 'public/images/original');
const MANIFEST = join(ROOT, 'public/images/manifest.json');

const BASE = 'https://www.gialloorofirenze.it';
const PAGES = [
  '/',
  '/quotazione-oro/',
  '/investire-in-oro/',
  '/sterlina-in-oro/',
  '/lingotti-in-oro/',
  '/gioielleria/',
  '/contattaci/',
];

const UA = 'Mozilla/5.0 (FlorenceEGI-WebAgency-AuditBot; +https://florenceegi.com)';

async function exists(p) {
  try { await access(p, FS.F_OK); return true; } catch { return false; }
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function downloadBinary(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

function extractImageUrls(html) {
  const urls = new Set();
  // src="..." / data-src / data-lazy-src
  const srcRe = /(?:src|data-src|data-lazy-src)\s*=\s*["']([^"']+)["']/gi;
  // srcset="url1 1x, url2 2x"
  const srcsetRe = /(?:srcset|data-srcset)\s*=\s*["']([^"']+)["']/gi;
  // background-image: url(...)
  const bgRe = /background(?:-image)?\s*:\s*url\(["']?([^)"']+)["']?\)/gi;

  for (const m of html.matchAll(srcRe)) urls.add(m[1]);
  for (const m of html.matchAll(srcsetRe)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u) urls.add(u);
    }
  }
  for (const m of html.matchAll(bgRe)) urls.add(m[1]);
  return Array.from(urls);
}

function normalize(url) {
  try {
    return new URL(url, BASE).toString();
  } catch {
    return null;
  }
}

function isAsset(url) {
  if (!url) return false;
  if (!url.includes('gialloorofirenze.it')) return false;
  if (!/\/wp-content\/uploads\//i.test(url)) return false;
  return /\.(jpe?g|png|webp|gif|svg|avif)(\?.*)?$/i.test(url);
}

function filename(url) {
  const clean = url.split('?')[0];
  return basename(clean).replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`[scrape] output: ${OUT}`);

  const seen = new Set();
  const manifest = { scraped_at: new Date().toISOString(), pages: [], assets: [] };

  for (const path of PAGES) {
    const url = BASE + path;
    console.log(`\n[page] ${url}`);
    try {
      const html = await fetchText(url);
      const urls = extractImageUrls(html).map(normalize).filter(isAsset);
      const unique = urls.filter((u) => !seen.has(u));
      unique.forEach((u) => seen.add(u));
      manifest.pages.push({ path, assets_found: urls.length, new_unique: unique.length });
      console.log(`  → ${urls.length} img refs, ${unique.length} new`);

      for (const u of unique) {
        const name = filename(u);
        const dest = join(OUT, name);
        if (await exists(dest)) {
          console.log(`    · skip (exists): ${name}`);
          manifest.assets.push({ url: u, file: name, status: 'skipped' });
          continue;
        }
        try {
          const bytes = await downloadBinary(u, dest);
          console.log(`    ✓ ${name} (${(bytes / 1024).toFixed(1)} KB)`);
          manifest.assets.push({ url: u, file: name, bytes, status: 'downloaded' });
        } catch (e) {
          console.log(`    ✗ ${name} — ${e.message}`);
          manifest.assets.push({ url: u, file: name, status: 'error', error: e.message });
        }
      }
    } catch (e) {
      console.log(`  ✗ page error: ${e.message}`);
      manifest.pages.push({ path, error: e.message });
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  const ok = manifest.assets.filter((a) => a.status === 'downloaded').length;
  const skip = manifest.assets.filter((a) => a.status === 'skipped').length;
  const err = manifest.assets.filter((a) => a.status === 'error').length;
  console.log(`\n[done] downloaded=${ok} skipped=${skip} error=${err}`);
  console.log(`[done] manifest: ${MANIFEST}`);
}

main().catch((e) => {
  console.error('[fatal]', e);
  process.exit(1);
});
