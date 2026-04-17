/**
 * @package GIALLORO-FIRENZE — Screenshot Optimizer
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — Gialloro Firenze)
 * @date 2026-04-17
 * @purpose Resize + compress README screenshots to 1600px wide WebP.
 */
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = 'docs/screenshots';
const files = (await readdir(DIR)).filter(f => f.endsWith('.png'));

for (const f of files) {
  const input = join(DIR, f);
  const output = join(DIR, f.replace('.png', '.webp'));
  const meta = await sharp(input).metadata();
  const width = Math.min(meta.width, f.startsWith('06-mobile') ? 800 : 1600);
  await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(output);
  console.log(`✓ ${f} → ${output.split('/').pop()}  (${width}px)`);
}
