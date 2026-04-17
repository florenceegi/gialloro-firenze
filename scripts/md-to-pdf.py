#!/usr/bin/env python3
"""
@package GIALLORO-FIRENZE - Audit PDF builder
@author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 1.0.0 (FlorenceEGI - GIALLORO-FIRENZE)
@date 2026-04-17
@purpose Converte docs/audit-gialloorofirenze-it.md in PDF via headless Chrome.
         Zero dipendenze extra: python-markdown (gia installato) + google-chrome.
"""
import subprocess
import sys
import re
from pathlib import Path

try:
    import markdown
except ImportError:
    print("Installa python3-markdown: sudo apt install python3-markdown", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "audit-gialloorofirenze-it.md"
HTML = ROOT / "docs" / "audit-gialloorofirenze-it.html"
PDF = ROOT / "docs" / "audit-gialloorofirenze-it.pdf"

# Strip YAML frontmatter
raw = SRC.read_text(encoding="utf-8")
body = re.sub(r"^---\n.*?\n---\n", "", raw, count=1, flags=re.DOTALL)
body = body.replace("\\newpage", '<div class="page-break"></div>')

html_body = markdown.markdown(
    body,
    extensions=["extra", "tables", "toc", "sane_lists", "fenced_code", "codehilite"],
)

css = """
@page { size: A4; margin: 2cm 2cm 2.2cm 2cm;
  @bottom-right { content: counter(page) " / " counter(pages); font-family: Inter, sans-serif; font-size: 9pt; color: #92760f; }
}
:root { --gold: #d4af37; --gold-dk: #92760f; --ink: #0c0a09; --ink-soft: #57534e; --ivory: #fdfbf5; --ink-border: #e7e5e4; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: Georgia, "Times New Roman", serif; font-size: 10.5pt; line-height: 1.55; color: var(--ink); background: white; }
h1, h2, h3, h4, h5, h6 { font-family: "Playfair Display", Georgia, serif; color: var(--ink); letter-spacing: -0.01em; margin-top: 1.4em; margin-bottom: 0.6em; line-height: 1.2; }
h1 { font-size: 26pt; border-bottom: 2px solid var(--gold); padding-bottom: 0.3em; margin-top: 0; }
h2 { font-size: 18pt; color: var(--gold-dk); }
h3 { font-size: 13pt; }
h4 { font-size: 11.5pt; font-style: italic; color: var(--ink-soft); }
p { margin: 0 0 0.8em; text-align: justify; hyphens: auto; }
a { color: var(--gold-dk); text-decoration: none; border-bottom: 1px solid rgba(212,175,55,0.4); }
strong { color: var(--ink); }
blockquote { margin: 1.2em 0; padding: 0.8em 1.2em; border-left: 3px solid var(--gold); background: var(--ivory); font-style: italic; color: var(--ink-soft); }
code { font-family: "SF Mono", Consolas, "Courier New", monospace; font-size: 0.88em; background: #f5f5f4; padding: 0.1em 0.35em; border-radius: 2px; color: var(--ink); }
pre { background: #0c0a09; color: #fde68a; padding: 1em 1.2em; border-radius: 3px; overflow-x: auto; font-size: 8.5pt; line-height: 1.5; page-break-inside: avoid; }
pre code { background: transparent; color: inherit; padding: 0; }
table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 9.5pt; page-break-inside: avoid; }
th { background: var(--ink); color: var(--gold); font-family: Inter, sans-serif; font-weight: 600; text-align: left; padding: 0.55em 0.7em; letter-spacing: 0.03em; text-transform: uppercase; font-size: 8pt; }
td { padding: 0.5em 0.7em; border-bottom: 1px solid var(--ink-border); vertical-align: top; }
tr:nth-child(even) td { background: var(--ivory); }
hr { border: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); margin: 2em 0; }
ul, ol { padding-left: 1.4em; margin: 0.6em 0 1em; }
li { margin: 0.25em 0; }
.page-break { page-break-before: always; }
/* Cover */
.cover { height: 25cm; display: flex; flex-direction: column; justify-content: space-between; padding: 3cm 0 2cm; page-break-after: always; }
.cover .brand { font-family: "Playfair Display", serif; font-size: 11pt; letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold-dk); }
.cover .title { font-family: "Playfair Display", serif; font-size: 42pt; line-height: 1.1; color: var(--ink); margin: 0; }
.cover .sub { font-family: Georgia, serif; font-size: 15pt; color: var(--ink-soft); font-style: italic; margin-top: 0.4em; }
.cover .rule { height: 2px; background: var(--gold); width: 80px; margin: 1.2em 0; }
.cover .meta { font-family: Inter, sans-serif; font-size: 10pt; color: var(--ink-soft); letter-spacing: 0.05em; }
.cover .meta strong { color: var(--ink); }
"""

cover = """
<div class="cover">
  <div>
    <div class="brand">FlorenceEGI &middot; WebAgency</div>
  </div>
  <div>
    <div class="rule"></div>
    <h1 class="title">Audit tecnico<br/><span style="color:#92760f">gialloorofirenze.it</span></h1>
    <div class="sub">Analisi SEO &middot; AEO &middot; GEO &middot; UX &middot; Performance &middot; Conformita</div>
    <div class="rule"></div>
  </div>
  <div class="meta">
    <strong>Destinatario</strong>: Edoardo Boccherini &mdash; Giallo Oro Firenze<br/>
    <strong>Redatto da</strong>: FlorenceEGI WebAgency &mdash; Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici<br/>
    <strong>Data</strong>: 17 aprile 2026<br/>
    <strong>Versione</strong>: 1.0.0
  </div>
</div>
"""

doc = f"""<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8"/>
<title>Audit gialloorofirenze.it - FlorenceEGI WebAgency</title>
<style>{css}</style>
</head>
<body>
{cover}
{html_body}
</body>
</html>
"""

HTML.write_text(doc, encoding="utf-8")
print(f"[ok] HTML generato: {HTML}")

cmd = [
    "google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox",
    "--no-pdf-header-footer",
    f"--print-to-pdf={PDF}", f"file://{HTML}",
]
print(f"[run] {' '.join(cmd)}")
result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
if result.returncode != 0:
    print("[err] chrome stderr:", result.stderr, file=sys.stderr)
    sys.exit(result.returncode)

size = PDF.stat().st_size / 1024
print(f"[ok] PDF generato: {PDF} ({size:.1f} KB)")
