/**
 * @package GIALLORO-FIRENZE — Screenshots
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — Gialloro Firenze)
 * @date 2026-04-17
 * @purpose Capture README portfolio screenshots via Playwright.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'http://localhost:4331';
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const shots = [
  { name: '01-hero-desktop.png',        url: '/',                 viewport: { width: 1440, height: 900 }, fullPage: false, waitMs: 1500 },
  { name: '02-sterline-timeline.png',   url: '/sterline',         viewport: { width: 1440, height: 900 }, fullPage: true,  waitMs: 1000 },
  { name: '03-faq.png',                 url: '/faq',              viewport: { width: 1440, height: 900 }, fullPage: true,  waitMs: 800  },
  { name: '04-quotazioni.png',          url: '/quotazioni',       viewport: { width: 1440, height: 900 }, fullPage: true,  waitMs: 800  },
  { name: '05-en-home.png',             url: '/en',               viewport: { width: 1440, height: 900 }, fullPage: false, waitMs: 1500 },
  { name: '06-mobile-hero.png',         url: '/',                 viewport: { width: 390,  height: 844 }, fullPage: false, waitMs: 1500 },
  { name: '07-compliance-footer.png',   url: '/',                 viewport: { width: 1440, height: 900 }, fullPage: true,  waitMs: 1200, clip: 'footer' },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ deviceScaleFactor: 2 });

for (const s of shots) {
  const page = await ctx.newPage();
  await page.setViewportSize(s.viewport);
  console.log(`→ ${s.name}  ${BASE}${s.url}  (${s.viewport.width}x${s.viewport.height})`);
  await page.goto(BASE + s.url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(s.waitMs);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);

  if (s.clip === 'footer') {
    // screenshot footer only
    const footer = await page.$('footer');
    if (footer) {
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await footer.screenshot({ path: join(OUT, s.name) });
    } else {
      await page.screenshot({ path: join(OUT, s.name), fullPage: true });
    }
  } else {
    await page.screenshot({ path: join(OUT, s.name), fullPage: s.fullPage });
  }
  await page.close();
}

await browser.close();
console.log(`\n✓ ${shots.length} screenshots saved to ${OUT}/`);
