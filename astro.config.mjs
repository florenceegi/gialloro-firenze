// @ts-check
/**
 * @package GIALLORO-FIRENZE — Astro Config
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-17
 * @purpose Config Astro 5 SSG con i18n IT/EN, sitemap, MDX, Tailwind v4. Target LCP <1s.
 */
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gialloorofirenze.it',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'it',
        locales: { it: 'it-IT', en: 'en-US' },
      },
    }),
    mdx(),
  ],
  vite: { plugins: [tailwindcss()] },
  build: { assets: 'assets', inlineStylesheets: 'auto' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
