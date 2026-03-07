// ═══════════════════════════════════════════════════
//  Joshua G. Bolton Portfolio — main.js
// ═══════════════════════════════════════════════════

// ─── Touch / pointer detection ──────────────────────
const isPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ─── Custom cursor (desktop only) ───────────────────
if (isPointer) {
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cur && ring) {
    cur.classList.add('visible');
    ring.classList.add('visible');

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    // Smooth lagging ring
    (function tick() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tick);
    })();

    // Hover state — scale star and ring on interactive elements
    document.querySelectorAll('a, button, .work-item, .pillar, .lead-card, .client-item, .quote-card, .metric').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.classList.add('big');
        ring.classList.add('big');
      });
      el.addEventListener('mouseleave', () => {
        cur.classList.remove('big');
        ring.classList.remove('big');
      });
    });
  }
}

// ─── Scroll progress bar ────────────────────────────
const progressBar = document.getElementById('progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / maxScroll * 100) + '%';
  }, { passive: true });
}

// ─── Hero background text parallax ──────────────────
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    heroBg.style.transform = `translate(-50%, calc(-50% + ${sy * 0.22}px))`;
    heroBg.style.opacity   = Math.max(0, 1 - sy / 480);
  }, { passive: true });
}

// ─── Mobile hamburger menu ───────────────────────────
const ham     = document.getElementById('ham');
const mobMenu = document.getElementById('mobMenu');
if (ham && mobMenu) {
  let menuOpen = false;

  const toggleMenu = (state) => {
    menuOpen = state;
    ham.classList.toggle('open', menuOpen);
    mobMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  };

  ham.addEventListener('click', () => toggleMenu(!menuOpen));

  document.querySelectorAll('.mob-link').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) toggleMenu(false);
  });
}

// ─── Scroll reveal ───────────────────────────────────
const revealEls = document.querySelectorAll('[data-r]');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ─── Philosophy quote underline animation ───────────
const philosophyQuote = document.querySelector('.philosophy-quote');
if (philosophyQuote) {
  const quoteObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) philosophyQuote.classList.add('in');
  }, { threshold: 0.3 });
  quoteObserver.observe(philosophyQuote);
}

// ─── Capability bars animate on scroll ──────────────
document.querySelectorAll('.cap-fill').forEach(bar => {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) bar.classList.add('in');
  }, { threshold: 0.5 }).observe(bar);
});

// ─── Active nav link highlight ───────────────────────
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

if (navLinks.length && sections.length) {
  const setActive = (id) => {
    navLinks.forEach(a => a.classList.remove('active'));
    const active = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (active) active.classList.add('active');
  };

  sections.forEach(section => {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setActive(section.id);
    }, { threshold: 0.35 }).observe(section);
  });
}
