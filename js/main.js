/* ============================================================
   合同会社BISIN — main.js
   ============================================================ */

'use strict';

/* ---- Nav: scroll effect ------------------------------------ */
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ---- Nav: hamburger (mobile) ------------------------------ */
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');
const navCta    = document.querySelector('.nav__cta');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('nav__links--open', open);
    if (navCta) navCta.classList.toggle('nav__cta--open', open);
    hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('nav__links--open');
      if (navCta) navCta.classList.remove('nav__cta--open');
    });
  });
}

/* ---- Scroll: fade-in-up animation ------------------------- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

// Elements that fade in individually
const FADE_SELECTORS = [
  '.page-hero__title',
  '.page-hero__desc',
  '.section-eyebrow',
  '.section-title',
  '.section-subtitle',
  '.about-mission__text',
  '.about-mission__visual',
  '.product-showcase__intro',
  '.product-image-placeholder',
  '.contact-info',
  '.contact-form-wrap',
  '.cta-banner__title',
  '.cta-banner__desc',
].join(', ');

document.querySelectorAll(FADE_SELECTORS).forEach(el => {
  el.classList.add('fade-in-up');
  observer.observe(el);
});

// Grid children: fade in with stagger delay
const GRID_SELECTORS = [
  '.overview__grid',
  '.values-grid',
  '.service-grid',
  '.plan-grid',
  '.stats-grid',
  '.flow-list',
  '.feature-list',
];

GRID_SELECTORS.forEach(gridSel => {
  document.querySelectorAll(gridSel).forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('fade-in-up');
      if (i > 0) child.classList.add(`delay-${Math.min(i, 4)}`);
      observer.observe(child);
    });
  });
});

/* ---- Number counter animation ----------------------------- */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__number[data-count]').forEach(el => {
  counterObserver.observe(el);
});

/* ---- Smooth scroll for anchor links ----------------------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY
                - parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-height'), 10);
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- Language Picker -------------------------------------- */
const langPicker = document.getElementById('langPicker');
if (langPicker) {
  const trigger = langPicker.querySelector('.lang-picker__trigger');
  const label   = langPicker.querySelector('.lang-picker__label');
  const items   = langPicker.querySelectorAll('.lang-picker__item');

  // Initialize UI from saved language
  const savedLang = window.BISIN_I18N ? window.BISIN_I18N.initLang() : 'ja';
  items.forEach(item => {
    const active = item.dataset.lang === savedLang;
    item.classList.toggle('lang-picker__item--active', active);
    item.setAttribute('aria-selected', active ? 'true' : 'false');
    if (active) label.textContent = item.dataset.label;
  });
  if (window.BISIN_I18N) window.BISIN_I18N.applyLang(savedLang);

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    const open = langPicker.classList.toggle('open');
    trigger.setAttribute('aria-expanded', open);
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => {
        i.classList.remove('lang-picker__item--active');
        i.setAttribute('aria-selected', 'false');
      });
      item.classList.add('lang-picker__item--active');
      item.setAttribute('aria-selected', 'true');
      label.textContent = item.dataset.label;
      langPicker.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      if (window.BISIN_I18N) window.BISIN_I18N.applyLang(item.dataset.lang);
    });
  });

  document.addEventListener('click', e => {
    if (!langPicker.contains(e.target)) {
      langPicker.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && langPicker.classList.contains('open')) {
      langPicker.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  });
}

/* ---- Contact form: basic client-side validation ----------- */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    contactForm.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('field--error');
      if (!field.value.trim()) {
        field.classList.add('field--error');
        valid = false;
      }
    });

    if (!valid) {
      const first = contactForm.querySelector('.field--error');
      if (first) first.focus();
      return;
    }

    // Success state (replace with real submission logic)
    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = '送信完了しました';
    btn.disabled = true;
    btn.style.opacity = '0.6';
  });

  // Remove error state on input
  contactForm.addEventListener('input', e => {
    if (e.target.classList.contains('field--error') && e.target.value.trim()) {
      e.target.classList.remove('field--error');
    }
  });
}
