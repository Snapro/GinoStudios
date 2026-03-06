/* ============================================================
   GINO STUDIOS ZAMBIA — MAIN JAVASCRIPT
   Minimal, vanilla JS
   ============================================================ */

(function () {
  'use strict';

  /* ── NAV SCROLL BEHAVIOUR ── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── MOBILE NAV TOGGLE ── */
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── ACTIVE NAV LINK ── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (currentPath === '/' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ── INTERSECTION OBSERVER: FADE-UP ANIMATIONS ── */
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(el => observer.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ── LAZY LOAD IMAGES ── */
  const lazyImages = document.querySelectorAll('img[data-src]');
  if (lazyImages.length && 'IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.removeAttribute('data-src');
            imgObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    lazyImages.forEach(img => imgObserver.observe(img));
  }

  /* ── NETLIFY FORM HANDLING ── */
  function encode(data) {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }

  function setupForm(formId, successId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {};
      formData.forEach((val, key) => { data[key] = val; });

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': form.getAttribute('name'), ...data }),
      })
        .then(() => {
          form.reset();
          if (success) { success.style.display = 'block'; }
        })
        .catch(err => {
          console.error('Form error:', err);
          alert('Something went wrong. Please try again or email us directly.');
        });
    });
  }

  setupForm('contact-form', 'contact-success');
  setupForm('quote-form', 'quote-success');
  setupForm('newsletter-form', 'newsletter-success');

  /* ── ANIMATE COUNTERS (stats) ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1800;
            const start = performance.now();

            const tick = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => countObserver.observe(el));
  }

  /* ── SMOOTH ANCHOR SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── CURRENT YEAR IN FOOTER ── */
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });

})();
