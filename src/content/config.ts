/**
 * @package GIALLORO-FIRENZE — Content Collections
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-17
 * @purpose Schema per FAQ e Blog. FAQ bilingue in un solo file (chiave q+a IT/EN);
 *          Blog separato per locale. Frontmatter validato Zod.
 */
import { defineCollection, z } from 'astro:content';

const faq = defineCollection({
  type: 'data',
  schema: z.object({
    order: z.number(),
    category: z.enum(['generale', 'vendita', 'acquisto', 'perizie', 'gioielleria', 'legale']),
    question_it: z.string().min(10),
    answer_it: z.string().min(30),
    question_en: z.string().min(10),
    answer_en: z.string().min(30),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['it', 'en']),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date().optional(),
    author: z.string().default('Edoardo Boccherini'),
    cover: z.string(),
    coverAlt: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { faq, blog };
