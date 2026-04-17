/**
 * @package GIALLORO-FIRENZE — Animation Engine
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — GIALLORO-FIRENZE)
 * @date 2026-04-17
 * @purpose Cinematic engine: reveal stagger, counter animate, parallax scroll,
 *          particles gold canvas, magnetic buttons, lightbox, live price ticker.
 *          Performance-first: rAF batching, IntersectionObserver, reduced-motion safe.
 *          XSS-safe: zero string injection, tutto via createElement/textContent.
 */

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ───────────────────────── REVEAL STAGGER ─────────────────────────
function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (!items.length) return;

  if (prefersReducedMotion()) {
    items.forEach(el => el.classList.add('reveal-in'));
    return;
  }

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.style.getPropertyValue('--reveal-delay') || '0ms';
          setTimeout(() => el.classList.add('reveal-in'), parseInt(delay));
          io.unobserve(el);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );
  items.forEach(el => io.observe(el));
}

// ───────────────────────── COUNTER ANIMATE ─────────────────────────
function animateCounter(el: HTMLElement): void {
  const target = parseFloat(el.dataset.target || '0');
  const decimals = parseInt(el.dataset.decimals || '0');
  const suffix = el.dataset.suffix || '';
  const duration = parseInt(el.dataset.duration || '1800');
  const startTime = performance.now();

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  };
  requestAnimationFrame(tick);
}

function initCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('.counter');
  if (!counters.length) return;

  if (prefersReducedMotion()) {
    counters.forEach(el => {
      const target = parseFloat(el.dataset.target || '0');
      const decimals = parseInt(el.dataset.decimals || '0');
      el.textContent = target.toFixed(decimals) + (el.dataset.suffix || '');
    });
    return;
  }

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target as HTMLElement);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(el => io.observe(el));
}

// ───────────────────────── PARALLAX SCROLL ─────────────────────────
function initParallax(): void {
  const layers = document.querySelectorAll<HTMLElement>('.hero-parallax');
  if (!layers.length || prefersReducedMotion()) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    layers.forEach(el => {
      const speed = parseFloat(el.dataset.speed || '0.3');
      el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

// ───────────────────────── PARTICLES GOLD CANVAS ─────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; life: number; maxLife: number;
}

function initParticles(): void {
  const canvas = document.getElementById('hero-particles') as HTMLCanvasElement | null;
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  const particles: Particle[] = [];
  const MAX = 40;

  const resize = () => {
    const rect = canvas.parentElement!.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
  };

  const spawn = (): Particle => ({
    x: Math.random() * w,
    y: h + 20,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -0.3 - Math.random() * 0.6,
    size: 1 + Math.random() * 2.5,
    opacity: 0.3 + Math.random() * 0.5,
    life: 0,
    maxLife: 8000 + Math.random() * 6000,
  });

  const tick = () => {
    ctx.clearRect(0, 0, w, h);

    if (particles.length < MAX && Math.random() > 0.92) particles.push(spawn());

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += 16;
      p.x += p.vx;
      p.y += p.vy;
      const alpha = p.opacity * (1 - p.life / p.maxLife);

      if (p.life >= p.maxLife || p.y < -20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(252, 211, 77, 0.6)';
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    requestAnimationFrame(tick);
  };

  resize();
  window.addEventListener('resize', resize);
  canvas.style.opacity = '1';
  requestAnimationFrame(tick);
}

// ───────────────────────── MAGNETIC BUTTONS ─────────────────────────
function initMagnetic(): void {
  if (prefersReducedMotion()) return;
  const buttons = document.querySelectorAll<HTMLElement>('.btn-magnetic');
  buttons.forEach(btn => {
    const strength = 0.3;
    btn.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ───────────────────────── LIVE PRICE TICKER ─────────────────────────
function initLivePrice(): void {
  const el = document.getElementById('hero-live-price');
  if (!el) return;

  let price = 88.42;
  const render = () => { el.textContent = price.toFixed(2); };

  render();
  setInterval(() => {
    price += (Math.random() - 0.5) * 0.26;
    price = Math.max(80, Math.min(98, price));
    render();
  }, 8000);

  const quoteTable = document.getElementById('gold-quote-table');
  if (quoteTable) {
    setInterval(() => {
      quoteTable.dispatchEvent(new CustomEvent('price-update', { detail: { price } }));
    }, 8000);
  }
}

// ───────────────────────── MOBILE MENU ─────────────────────────
function initMobileMenu(): void {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const close = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const open = () => {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    menu.classList.contains('open') ? close() : open();
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) close();
  });
}

// ───────────────────────── SMOOTH SCROLL ─────────────────────────
function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e: MouseEvent) => {
      const id = a.getAttribute('href')!.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

// ───────────────────────── LIGHTBOX GALLERY ─────────────────────────
function initLightbox(): void {
  const triggers = document.querySelectorAll<HTMLElement>('[data-lightbox]');
  if (!triggers.length) return;

  let overlay: HTMLDivElement | null = null;
  let imgEl: HTMLImageElement | null = null;
  let idx = 0;
  const items: { src: string; alt: string }[] = [];
  triggers.forEach(el => items.push({ src: el.dataset.lightbox!, alt: el.getAttribute('alt') || '' }));

  const close = () => {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  const nav = (delta: number) => {
    idx = (idx + delta + items.length) % items.length;
    if (imgEl) {
      imgEl.src = items[idx].src;
      imgEl.alt = items[idx].alt;
    }
  };

  const build = () => {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';

    const btnClose = document.createElement('button');
    btnClose.className = 'lb-close';
    btnClose.setAttribute('aria-label', 'Chiudi');
    btnClose.textContent = '×';
    btnClose.addEventListener('click', close);

    const btnPrev = document.createElement('button');
    btnPrev.className = 'lb-prev';
    btnPrev.setAttribute('aria-label', 'Precedente');
    btnPrev.textContent = '‹';
    btnPrev.addEventListener('click', () => nav(-1));

    const btnNext = document.createElement('button');
    btnNext.className = 'lb-next';
    btnNext.setAttribute('aria-label', 'Successivo');
    btnNext.textContent = '›';
    btnNext.addEventListener('click', () => nav(1));

    const figure = document.createElement('figure');
    figure.className = 'lb-figure';
    imgEl = document.createElement('img');
    imgEl.className = 'lb-img';
    imgEl.alt = '';
    figure.appendChild(imgEl);

    overlay.appendChild(btnClose);
    overlay.appendChild(btnPrev);
    overlay.appendChild(btnNext);
    overlay.appendChild(figure);

    overlay.addEventListener('click', (e: Event) => { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
  };

  const open = (i: number) => {
    if (!overlay) build();
    idx = i;
    if (imgEl) {
      imgEl.src = items[idx].src;
      imgEl.alt = items[idx].alt;
    }
    overlay!.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  triggers.forEach((el, i) => {
    el.addEventListener('click', (e: Event) => { e.preventDefault(); open(i); });
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (!overlay?.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') nav(-1);
    else if (e.key === 'ArrowRight') nav(1);
  });
}

// ───────────────────────── CONTACT FORM ASYNC ─────────────────────────
function initContactForm(): void {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    const fb = form.querySelector('.form-feedback') as HTMLElement | null;
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (btn) { btn.disabled = true; btn.textContent = 'Invio…'; }
    if (fb) { fb.textContent = ''; fb.className = 'form-feedback'; }

    const fd = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const json = await res.json();
      if (fb) {
        fb.textContent = json.message || (json.ok ? 'Inviato.' : 'Errore.');
        fb.className = 'form-feedback ' + (json.ok ? 'ok' : 'err');
      }
      if (json.ok) form.reset();
    } catch {
      if (fb) { fb.textContent = 'Errore di rete. Riprova.'; fb.className = 'form-feedback err'; }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Invia richiesta'; }
    }
  });
}

// ───────────────────────── HEADER SHRINK ON SCROLL ─────────────────────────
function initHeaderShrink(): void {
  const header = document.querySelector<HTMLElement>('header.site-header');
  if (!header) return;
  let lastY = 0;
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);
    header.classList.toggle('hidden-up', y > 200 && y > lastY);
    lastY = y;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ───────────────────────── BOOT ─────────────────────────
const boot = () => {
  initReveal();
  initCounters();
  initParallax();
  initParticles();
  initMagnetic();
  initLivePrice();
  initMobileMenu();
  initSmoothScroll();
  initLightbox();
  initContactForm();
  initHeaderShrink();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
