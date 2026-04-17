/**
 * @package GIALLORO-FIRENZE — Schema.org JSON-LD helpers
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-17
 * @purpose Tipi e factory schema.org: LocalBusiness/JewelryStore, FAQPage,
 *          BlogPosting, BreadcrumbList, Offer, WebSite. AEO/GEO 2026 compliant.
 *          Ogni factory ritorna un oggetto JSON-serializable per <script type="application/ld+json">.
 */

export const BUSINESS = {
  id: 'https://gialloorofirenze.it/#business',
  legalName: 'Gialloorofirenze Gioielleria - Compro Oro',
  name: 'Giallo Oro Firenze',
  vatId: 'IT06010050489',
  url: 'https://gialloorofirenze.it',
  logo: 'https://gialloorofirenze.it/images/logo.svg',
  image: 'https://gialloorofirenze.it/images/og-home.jpg',
  telephone: '+390552335573',
  mobile: '+393917792818',
  email: 'info@gialloorofirenze.it',
  address: {
    streetAddress: 'Via del Ponte Sospeso 31',
    addressLocality: 'Firenze',
    addressRegion: 'FI',
    postalCode: '50143',
    addressCountry: 'IT',
  },
  geo: { latitude: 43.7762, longitude: 11.2361 },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'], opens: '09:30', closes: '13:00' },
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Friday'], opens: '15:00', closes: '19:00' },
    { days: ['Thursday'], opens: '09:30', closes: '13:00' },
    { days: ['Thursday'], opens: '16:00', closes: '19:00' },
  ],
  sameAs: [
    'https://www.facebook.com/gialloorofirenze',
    'https://www.instagram.com/gialloorofirenze',
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Bank transfer, Credit card',
} as const;

export type SchemaObject = Record<string, unknown>;

/**
 * LocalBusiness + JewelryStore (sottotipo specifico settore).
 * Da usare SOLO nella home o pagine "identita".
 */
export function localBusinessSchema(): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': ['JewelryStore', 'LocalBusiness'],
    '@id': BUSINESS.id,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    vatID: BUSINESS.vatId,
    url: BUSINESS.url,
    logo: BUSINESS.logo,
    image: BUSINESS.image,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    address: { '@type': 'PostalAddress', ...BUSINESS.address },
    geo: { '@type': 'GeoCoordinates', ...BUSINESS.geo },
    openingHoursSpecification: BUSINESS.openingHours.map((o) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: o.days.map((d) => `https://schema.org/${d}`),
      opens: o.opens,
      closes: o.closes,
    })),
    sameAs: BUSINESS.sameAs,
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted: BUSINESS.paymentAccepted,
    areaServed: {
      '@type': 'City',
      name: 'Firenze',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Toscana' },
    },
    knowsAbout: [
      'Compro oro',
      'Valutazione oro usato',
      'Sterline oro',
      'Lingotti oro 24kt',
      'Perizie gioielli',
      'Upcycling gioielleria',
      'Lasciti ereditari',
    ],
  };
}

/** WebSite globale con SearchAction (per SERP sitelinks search box) */
export function webSiteSchema(locale: 'it' | 'en'): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS.url}/#website`,
    name: locale === 'it' ? 'Giallo Oro Firenze' : 'Giallo Oro Firenze',
    url: BUSINESS.url,
    inLanguage: locale === 'it' ? 'it-IT' : 'en-US',
    publisher: { '@id': BUSINESS.id },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BUSINESS.url}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Breadcrumb strutturato (sitelinks + contesto AI) */
export interface Crumb { name: string; url: string; }
export function breadcrumbSchema(crumbs: Crumb[]): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

/** FAQPage — AEO core. 3.1× citation rate secondo benchmark 2026. */
export interface FaqItem { question: string; answer: string; }
export function faqPageSchema(items: FaqItem[]): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

/** BlogPosting — per articoli blog */
export interface BlogMeta {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  locale: 'it' | 'en';
}
export function blogPostingSchema(m: BlogMeta): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: m.title,
    description: m.description,
    image: m.image,
    datePublished: m.datePublished,
    dateModified: m.dateModified ?? m.datePublished,
    inLanguage: m.locale === 'it' ? 'it-IT' : 'en-US',
    mainEntityOfPage: { '@type': 'WebPage', '@id': m.url },
    author: { '@type': 'Person', name: m.authorName },
    publisher: { '@id': BUSINESS.id },
  };
}

/** Offer/Service per sezioni servizio (Compro Oro, Perizie, ...) */
export interface ServiceSchema {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  priceSpec?: { min?: number; max?: number; currency: string };
}
export function serviceSchema(s: ServiceSchema): SchemaObject {
  const base: SchemaObject = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.description,
    serviceType: s.serviceType,
    url: s.url,
    provider: { '@id': BUSINESS.id },
    areaServed: { '@type': 'City', name: 'Firenze' },
  };
  if (s.priceSpec) {
    base.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: s.priceSpec.currency,
      ...(s.priceSpec.min !== undefined && { lowPrice: s.priceSpec.min }),
      ...(s.priceSpec.max !== undefined && { highPrice: s.priceSpec.max }),
    };
  }
  return base;
}

/** Dataset per pagina quotazioni (oro live) — AI extrae prezzi come tabella */
export interface QuoteRow { metal: string; purity: string; pricePerGram: number; currency: string; updatedAt: string; }
export function goldQuotesDatasetSchema(rows: QuoteRow[], pageUrl: string): SchemaObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Quotazioni oro e argento Giallo Oro Firenze',
    description: 'Prezzo al grammo per oro 18kt/24kt e argento 925 aggiornato quotidianamente.',
    url: pageUrl,
    creator: { '@id': BUSINESS.id },
    license: 'https://creativecommons.org/licenses/by/4.0/',
    temporalCoverage: new Date().toISOString().slice(0, 10),
    variableMeasured: rows.map((r) => ({
      '@type': 'PropertyValue',
      name: `${r.metal} ${r.purity}`,
      value: r.pricePerGram,
      unitText: `${r.currency}/g`,
    })),
  };
}

/** Helper: serializza in JSON sicuro per <script type="application/ld+json"> */
export function serialize(schema: SchemaObject | SchemaObject[]): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c');
}
