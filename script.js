/* ============================================================
   script.js — LongHorn Steakhouse Menu Site
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const header = document.getElementById('site-header');
  const navbar = header ? header.querySelector('.navbar') : null;

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    // Back-to-top visibility
    const btn = document.getElementById('back-to-top');
    if (btn) {
      btn.classList.toggle('visible', window.scrollY > 400);
    }
  }, { passive: true });

  /* ---- Mobile hamburger ---- */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks     = document.getElementById('nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburgerBtn.classList.toggle('open', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when any link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ---- Back-to-top button ---- */
  // Inject button if not in HTML
  if (!document.getElementById('back-to-top')) {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);
  }

  document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Intersection Observer — fade-up animations ---- */

  // Cards on homepage get the fade-up class added dynamically
  const cardEls = document.querySelectorAll('.menu-card, .location-card, .why-card');
  cardEls.forEach(el => el.classList.add('fade-up'));

  // All elements with .fade-up (includes .content-block on inner pages)
  // We observe them ALL with a single observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  // Observe homepage cards
  cardEls.forEach(el => observer.observe(el));

  // Observe inner page content blocks, contact cards, page hero
  const contentEls = document.querySelectorAll(
    '.content-block, .contact-info-card, .contact-form-card'
  );
  contentEls.forEach(el => {
    // Add fade-up if not already present
    el.classList.add('fade-up');
    observer.observe(el);
  });

  // Page hero — make instantly visible (no fade delay)
  document.querySelectorAll('.page-hero').forEach(el => {
    el.style.opacity = '1';
  });

  /* ---- Smooth anchor scrolling with offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height') || '70', 10) + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id], main[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ---- Contact form handling (contact.html) ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('.form-submit');
      const successMsg = document.getElementById('form-success');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate async submit
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        if (successMsg) successMsg.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          if (successMsg) successMsg.style.display = 'none';
        }, 4000);
      }, 1200);
    });
  }

  /* ---- Lazy image fallback ---- */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.addEventListener('error', function () {
      this.style.background = 'var(--bg-darkest)';
      this.alt = this.alt + ' (image unavailable)';
    });
  });

})();
