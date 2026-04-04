/* =========================================
   CURSOR ZAMBIA  Interactions & Animations
   ========================================= */

(function () {
  'use strict';

  const nav = document.getElementById('nav');

  function handleNavScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }

  // Scroll-reveal
  function initScrollReveal() {
    const elements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  // Animated stat counters
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            animateCounter(el, target);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + '+';

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // Smooth anchor scrolling
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const offset = nav.offsetHeight + getTabsHeight();
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });
  }

  function getTabsHeight() {
    const tabs = document.getElementById('tabs');
    return tabs ? tabs.offsetHeight : 0;
  }

  // Tabs
  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const sections = ['events', 'community', 'about', 'join'];

    tabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        const targetId = this.getAttribute('data-tab');
        const target = document.getElementById(targetId);
        if (!target) return;

        const offset = nav.offsetHeight + getTabsHeight();
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });

    // Update active tab on scroll
    function updateActiveTab() {
      const scrollY = window.scrollY;
      const offset = nav.offsetHeight + getTabsHeight() + 100;

      let current = sections[0];
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top + window.scrollY - offset <= scrollY) {
          current = id;
        }
      }

      tabs.forEach((tab) => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === current);
      });
    }

    window.addEventListener('scroll', updateActiveTab, { passive: true });
    updateActiveTab();
  }

  // Parallax-lite on hero
  function initHeroParallax() {
    const hero = document.querySelector('.hero-inner');
    if (!hero) return;

    window.addEventListener(
      'scroll',
      function () {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          const opacity = 1 - scrollY / (window.innerHeight * 0.8);
          hero.style.opacity = Math.max(opacity, 0);
          hero.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
      },
      { passive: true }
    );
  }

  function init() {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    initScrollReveal();
    initCounters();
    initSmoothScroll();
    initTabs();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
