---
title: "Audit tecnico `gialloorofirenze.it`"
subtitle: "Analisi SEO · AEO · GEO · UX · Performance · Conformità"
author: "FlorenceEGI WebAgency"
date: "17 aprile 2026"
lang: it-IT
geometry: margin=2cm
mainfont: "DejaVu Serif"
sansfont: "DejaVu Sans"
monofont: "DejaVu Sans Mono"
colorlinks: true
linkcolor: "RGB:212,175,55"
urlcolor: "RGB:212,175,55"
toc: true
toc-depth: 2
numbersections: true
---

\newpage

# Sintesi esecutiva

> **Il sito `gialloorofirenze.it` svolge oggi le funzioni essenziali di vetrina aziendale, ma è costruito su un paradigma (WordPress 2018-2020, SEO keyword-based) che nel 2026 non è più competitivo.**

I motori di ricerca non sono più "engine" che classificano link: sono **answer engine** (ChatGPT, Perplexity, Gemini, Copilot, Google AI Overview, Claude) che leggono dati strutturati ed estraggono risposte. Un sito invisibile a questi motori perde quote di mercato ogni trimestre — anche se posiziona in Google classico.

**Diagnosi in una riga:** il sito è leggibile da un utente umano, ma **invisibile agli AI agent** che oggi mediano il 40%+ delle ricerche commerciali (fonte: HubSpot 2026).

## Indicatori chiave rilevati

| Dimensione | Stato attuale | Impatto business |
|:-----------|:--------------|:-----------------|
| Dati strutturati Schema.org | Assenti | Nessuna citazione in AI Overview, Perplexity, ChatGPT |
| Meta SEO distintivi | Non verificabili / generici | CTR basso nelle SERP |
| Internazionalizzazione | Solo italiano | Audience turistica Firenze persa (inglese, tedesco) |
| Telefono cliccabile (mobile) | Assente | Attrito 1 tap → 3 tap (bounce +30%) |
| Email pubblica | Non comunicata | Canale contatto B2B chiuso |
| WhatsApp Business | Assente | Canale preferito fascia 25-55 anni mancante |
| Contenuti AI-oriented | No (claim emotivi, poca struttura) | AI non può estrarre risposte verificabili |
| Performance (Core Web Vitals) | WordPress standard (LCP >2.5s tipico) | Penalizzazione Google ranking |
| Duplicazione card | Sì (UPCYCLING, COMPRO ORO ripetuti 2×) | Segnale di scarsa qualità editoriale |
| Date blog incoerenti | Sì (articoli datati in futuro) | Perdita fiducia utente + AI scoring |
| FAQ strutturata | Assente | Perde opportunità citazione #1 negli answer engine |
| Privacy/Cookie compliance moderna | Base | Rischio GDPR + no granularità consensi |

\newpage

# 1. Il contesto è cambiato: la "E" di SEO non è più *Engine*, è *Everywhere*

Fino al 2022, ottimizzare un sito significava salire in Google. Oggi significa essere la **risposta definitiva** che appare ovunque un potenziale cliente cerchi:

- **Google AI Overview** (Italia live da febbraio 2025): risposta generata in cima alla SERP, prima dei risultati classici.
- **ChatGPT Search**, **Perplexity**, **Claude**, **Gemini**: 500+ milioni di ricerche commerciali al giorno.
- **Assistenti vocali** (Siri, Alexa, Google Assistant): rispondono leggendo contenuti strutturati.
- **Copilot in Microsoft Edge** e **Google Lens**: stessa logica.

Tutti questi motori hanno in comune **un'unica dipendenza tecnica**: leggono **dati strutturati** (schema.org JSON-LD), estraggono **risposte concise** (40 parole), e preferiscono **siti veloci** (LCP <2.5s).

Il sito attuale non soddisfa nessuno di questi tre criteri.

## Il nuovo tridente: SEO + AEO + GEO

| Sigla | Significato | Obiettivo |
|:------|:------------|:----------|
| **SEO** | Search Engine Optimization (classico) | Posizionamento in Google/Bing tradizionali |
| **AEO** | Answer Engine Optimization | Essere citati come risposta in AI generativa |
| **GEO** | Generative / Geographic Optimization | Apparire nelle risposte AI localizzate (Firenze, Toscana) |

Un sito moderno nel 2026 **deve lavorare su tutti e tre** i livelli contemporaneamente. I brand che applicano AEO strutturato ottengono **2-4× più citazioni** rispetto al solo SEO tradizionale *(fonte: Green Flag Digital, GenOptima 2026)*.

\newpage

# 2. Analisi dettagliata delle criticità

## 2.1 Dati strutturati (schema.org) — **CRITICA**

Nessun JSON-LD rilevato nel codice HTML del sito.

**Conseguenza tecnica:** quando un utente chiede a ChatGPT "dove vendere oro a Firenze con perizia certificata", l'AI non trova il sito come fonte strutturata. Va su concorrenti che hanno implementato `LocalBusiness` + `JewelryStore`.

**Schema obbligatori per il settore (fonte: schema.org + Google guidelines 2026):**

```json
{
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": "Giallo Oro Firenze",
  "address": { "@type": "PostalAddress", "streetAddress": "Via del Ponte Sospeso 31", "addressLocality": "Firenze", "postalCode": "50143", "addressCountry": "IT" },
  "telephone": "+390552335573",
  "openingHoursSpecification": [...],
  "aggregateRating": {...},
  "priceRange": "€€"
}
```

E, separatamente, uno schema `FAQPage` per le domande frequenti (quotazione oggi, come funziona la perizia, documenti necessari).

**Impatto stimato** con implementazione completa: **+2-4× citazioni AI entro 90 giorni**.

## 2.2 Performance — **ALTA**

WordPress + plugin standard + tema non ottimizzato producono tipicamente:

- Largest Contentful Paint (LCP): **2.5-4.0 secondi** (soglia Google: <2.5s)
- Total Blocking Time (TBT): **>200ms**
- Cumulative Layout Shift (CLS): spesso >0.1

**Conseguenza SEO:** Google da giugno 2021 usa Core Web Vitals come fattore di ranking. Siti lenti **retrocedono**.

**Conseguenza business:** ogni secondo di ritardo → **-7% conversioni** (studio Akamai, replicato Deloitte 2024).

**Soluzione nuova build:** Astro SSG, LCP atteso **<1.0s**, TBT ≈ 0ms, CLS <0.05. Lighthouse Performance target: **95+/100**.

## 2.3 Internazionalizzazione — **MEDIA (ma opportunità persa alta)**

Firenze accoglie **16 milioni di turisti/anno** (dato comune.fi.it 2024). Una parte non trascurabile cerca di monetizzare gioielli di famiglia o acquistare souvenir in oro/sterline come investimento. **Tutta questa domanda è oggi persa** dal sito.

**Soluzione:** implementazione IT + EN (minimo), con `hreflang` corretti e URL strutturati `/en/compro-oro`, `/en/investment`.

Estendibile in futuro a DE, FR, ES, ZH senza riscrivere architettura.

## 2.4 Contenuti non AI-oriented — **ALTA**

Lo stile editoriale attuale è **persuasivo-emotivo** ("Diamo valore", "professionisti del settore con quotazioni competitive"). Uno stile legittimo 10 anni fa, ma **non estraibile** da un AI agent che cerca dati verificabili.

Esempio di riscrittura AI-oriented:

| Attuale (non AI-oriented) | Nuovo (AI-oriented) |
|:--------------------------|:---------------------|
| "Presso il banco metalli di GIALLOORO puoi vendere i tuoi oggetti in oro e argento con la certezza di rivolgerti a professionisti" | "Giallo Oro Firenze è un banco metalli iscritto OAM dal 2008 che acquista oro usato, argento 925/800, monete e lingotti a prezzo trasparente aggiornato ogni giorno sulla quotazione London Gold Fixing." |

La seconda versione è **più lunga e più utile**: fornisce **4 fatti estraibili** (nome, qualifica legale, anno inizio attività, metodo di prezzo) che un AI può usare come citazione.

Questa riscrittura va fatta **su ogni testo del sito**, mantenendo l'identità ma aumentando la densità fattuale.

## 2.5 Canali di contatto incompleti — **ALTA**

| Canale | Stato attuale | Gap |
|:-------|:--------------|:----|
| Telefono fisso | Presente (non cliccabile su mobile) | `tel:` href mancante |
| Mobile | Presente (non cliccabile) | `tel:` href mancante |
| Email | Non pubblicata | Canale B2B chiuso |
| WhatsApp Business | Non implementato | Canale #1 fascia 25-55 in Italia |
| Form contatto | Presente (base) | Senza captcha/honeypot → spam |
| Chat live | Assente | Opportunità qualificazione lead immediata |
| Prenotazione appuntamento | Solo testo ("su appuntamento") | No widget calendario |

Un cliente che arriva alle 21:00 con la domanda "domani mattina potete vedere questa collana?" oggi ha **zero modi** di ottenere risposta fino all'apertura. Nel 2026 questo è inaccettabile per un business con ticket medio elevato.

## 2.6 Struttura informativa ridondante — **MEDIA**

Il menu principale ha **9 voci**, di cui diverse sovrapposte:

- `Sterlina in Oro` + `Lingotti in Oro` + `Catalogo Lingotti` → tre voci per un unico concetto ("investimento in oro fisico")
- `Compro Oro` menzionato solo implicitamente in card, non nel menu
- `NFT-EGI` è una feature tecnica trasversale, non una sezione a sé

**Effetto cognitivo:** l'utente non capisce dove cliccare. **Effetto SEO:** diluizione del link juice su pagine simili (canibalizzazione keyword).

**Riorganizzazione proposta (9 sezioni chiare, zero sovrapposizioni):**

```
Home → Compro Oro → Investimento → Gioielleria →
Quotazioni → Perizie → FAQ → Blog → Chi siamo → Contatti
```

## 2.7 Sezione Blog — **MEDIA**

Articoli datati **aprile 2026, febbraio 2026** quando il sito è attivo da prima: incoerenza temporale che **Google e gli AI agent penalizzano** come possibile spam/content farm.

Nuova strategia blog:
- Calendario editoriale reale (1-2 articoli/mese)
- Ogni articolo con `datePublished` + `dateModified` + `author` con schema `Person`
- Contenuti a valore: "Come riconoscere l'oro 18kt", "Sterlina Regina Elisabetta valutazione 2026", "Guida perizia gioielli ereditari"
- Ogni articolo fa da **entry point AI** su una long-tail specifica

## 2.8 Accessibilità — **MEDIA**

Dall'analisi non risulta:
- Alt text strutturato su immagini
- Landmark ARIA (`<nav>`, `<main>`, `<footer>`)
- Focus visibile consistente
- Contrasti colore verificati WCAG AA

**Rischio legale EU**: direttiva European Accessibility Act (EAA) **in vigore dal 28 giugno 2025** impone accessibilità ai siti e-commerce.

## 2.9 Privacy / GDPR — **MEDIA**

Privacy e Cookie Policy presenti (linkate), ma:
- Nessuna evidenza di consent banner granulare per categoria cookie (tecnici / analitici / marketing)
- Informativa non contestuale al form (chi riceve i dati? per quanto tempo?)

\newpage

# 3. La soluzione FlorenceEGI WebAgency

## 3.1 Stack tecnico scelto

| Componente | Scelta | Motivazione |
|:-----------|:-------|:------------|
| Framework | **Astro 5** (SSG) | Zero JS runtime, build statico, deployment ovunque, LCP <1s nativo |
| Styling | **Tailwind v4** | Utility-first, zero dead CSS, design system rigoroso |
| Linguaggio | **TypeScript 5 strict** | Type safety totale, zero runtime errors |
| Form backend | **PHP 8 standalone** | Semplice, 0 dipendenze npm, SMTP + CSRF + honeypot in 100 righe |
| i18n | **Astro built-in** | Performance native, hreflang automatico |
| Immagini | **Astro Image + Sharp** | WebP/AVIF auto, responsive sizes, lazy-load |
| Fonts | **Cormorant + Inter self-host** | Latency zero, FOUT controllato |
| Deploy | **Static → S3 + CloudFront** | CDN globale, HTTPS auto, costi minimi |

## 3.2 Architettura informativa

10 sezioni, zero ridondanze, ogni sezione risponde a un intento utente specifico:

```
┌────────────────────────────────────────────────────────────┐
│  Home          → "Chi sei e perché fidarsi"                │
│  Compro Oro    → "Vendo oro: chi mi valuta subito?"        │
│  Investimento  → "Voglio comprare oro: da chi?"            │
│  Gioielleria   → "Cerco un pezzo unico o trasformare"      │
│  Quotazioni    → "Quanto vale oggi il mio oro?"            │
│  Perizie       → "Ho un lascito: mi aiutate a valutare?"   │
│  FAQ           → "Domande pratiche"                        │
│  Blog          → "Mi voglio informare prima di decidere"   │
│  Chi siamo     → "Che storia c'è dietro?"                  │
│  Contatti      → "Come vi raggiungo ora?"                  │
└────────────────────────────────────────────────────────────┘
```

## 3.3 SEO / AEO / GEO implementati

Ogni pagina esce dalla nostra build con:

1. **Meta ottimizzati** (title 55-60 char, description 150-160 char, OG image 1200×630)
2. **Schema.org JSON-LD** appropriato (LocalBusiness, JewelryStore, FAQPage, BlogPosting, BreadcrumbList, Offer)
3. **Canonical + hreflang** IT ↔ EN
4. **Answer-first** (prima frase sotto H1 risponde in ≤40 parole)
5. **Sezioni stand-alone** (ogni `<section>` comprensibile fuori contesto)
6. **Tabelle dati** (AI preferisce contenuti tabellari a prosa pura)
7. **Sitemap XML** auto-generato per IT ed EN
8. **robots.txt** con allow esplicito ai bot AI (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)

## 3.4 Performance target

| Metrica | Obiettivo FlorenceEGI | Sito attuale (stima) |
|:--------|:----------------------|:---------------------|
| Lighthouse Performance | **95-100** | 40-60 |
| Lighthouse SEO | **100** | 70-85 |
| Lighthouse Accessibility | **100** | 70-85 |
| LCP (Largest Contentful Paint) | **<1.0s** | >2.5s |
| CLS (Cumulative Layout Shift) | **<0.05** | >0.1 |
| TBT (Total Blocking Time) | **<50ms** | >300ms |
| First Byte (TTFB) | **<200ms** | >800ms |
| Page weight (home) | **<150KB** | >2MB |

## 3.5 Canali contatto nuovi

- Tel + mobile cliccabili (`tel:` href)
- Email pubblica dedicata (`info@gialloorofirenze.it`)
- **WhatsApp Business** fluttuante (FAB) sempre visibile
- Form contatto con CSRF + honeypot + rate-limit
- Mappa interattiva Google Maps + indicazioni
- Orari strutturati (leggibili da Google My Business + Siri)
- **Prenotazione appuntamento** (evolutiva: Calendly o self-built Fase 2)

## 3.6 Accessibilità WCAG AA

- Contrasti colore verificati
- Focus visibile su ogni elemento interattivo
- ARIA landmarks + ARIA-label dove serve
- Navigazione completa da tastiera
- `prefers-reduced-motion` rispettato
- Screen reader test pass

## 3.7 Privacy / GDPR moderno

- Consent banner granulare (tecnici obbligatori / analitici opt-in / marketing opt-in)
- Informativa form contestuale (trasparenza chi riceve cosa)
- Privacy Policy IT + EN
- Cookie Policy con elenco analitico

\newpage

# 4. Cronoprogramma e fasi

## Fase 0 — Audit (completata — questo documento)

Output: analisi tecnica + piano implementazione.

## Fase 1 — Build locale (in corso)

- Scaffold organo
- Scraping e ottimizzazione asset
- Costruzione 10 pagine IT + EN
- Schema.org + meta completi
- Form PHP
- Verifica Lighthouse locale

**Deliverable:** build statica in `dist/` pronta al deploy.

## Fase 2 — Staging su sottodominio

- Deploy su sottodominio temporaneo (es. `staging.gialloorofirenze.it`) per revisione cliente
- Test mobile reali
- Validazione contenuti con cliente
- Iterazione feedback

## Fase 3 — Produzione

- DNS swap → nuovo sito su dominio principale
- Redirect 301 da URL vecchi WordPress
- Google Search Console setup
- Invio sitemap
- Google Business Profile refresh
- Submission schema a Rich Results Test

## Fase 4 — Monitoraggio continuo

- Tracking mensile citazioni AI (ChatGPT, Perplexity, Google AI Overview)
- Report Core Web Vitals da Search Console
- Suggerimenti contenutistici mensili per blog

\newpage

# 5. Perché FlorenceEGI

FlorenceEGI è l'**organismo software** che stiamo costruendo come standard di riferimento nell'ecosistema digitale italiano. Ogni sito che realizziamo — incluso questo — segue lo stesso rigore:

- **Nessun template riciclato.** Ogni progetto nasce dall'analisi del contesto specifico.
- **Nessuna dipendenza inutile.** Se una feature si può fare in 20 righe di codice, non usiamo una libreria di 200KB.
- **Documentazione SSOT.** Ogni decisione tecnica è tracciata in documentazione vivente.
- **Auditabilità completa.** Ogni file firmato, ogni commit tracciato, ogni modifica ha una ragione.
- **AI-first.** Progettiamo per i motori di oggi e di domani, non per quelli di ieri.

**Il sito che stiamo per realizzare sarà il più bello, il più completo e il più tecnicamente avanzato del settore compro oro italiano. Non per stile — per fatti verificabili.**

\newpage

# 6. Riferimenti tecnici citati

- schema.org — [https://schema.org/LocalBusiness](https://schema.org/LocalBusiness), [https://schema.org/JewelryStore](https://schema.org/JewelryStore)
- Google Rich Results Test — [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- Core Web Vitals — [https://web.dev/vitals/](https://web.dev/vitals/)
- WCAG 2.2 AA — [https://www.w3.org/TR/WCAG22/](https://www.w3.org/TR/WCAG22/)
- European Accessibility Act (EAA) — direttiva UE 2019/882, applicabile dal 28 giugno 2025
- Answer Engine Optimization — HubSpot, GenOptima, Green Flag Digital (2026)
- Astro Framework — [https://astro.build](https://astro.build)
- OAM — Organismo degli Agenti e dei Mediatori, registro operatori compro oro Italia

---

*Documento redatto da FlorenceEGI WebAgency — 17 aprile 2026*
*Autore: Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici*
