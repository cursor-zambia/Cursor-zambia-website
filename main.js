/* =========================================
   CURSOR ZAMBIA  Premium Interactions
   ========================================= */

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  function handleNavScroll() {
    const scrollY = window.scrollY;
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    const threshold = heroHeight * 0.7;

    if (scrollY > threshold) {
      nav.classList.add('scrolled');
      nav.classList.remove('nav--dark');
    } else if (scrollY > 50) {
      nav.classList.add('scrolled');
      nav.classList.remove('nav--dark');
    } else {
      nav.classList.remove('scrolled');
      if (hero) {
        nav.classList.add('nav--dark');
      }
    }
  }

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
      { 
        threshold: 0.1, 
        rootMargin: '0px 0px -80px 0px' 
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

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
    const duration = 2000;
    const start = performance.now();
    const suffix = el.getAttribute('data-suffix') !== null ? el.getAttribute('data-suffix') : '+';

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target) + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

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

  function initMobileNav() {
    if (!nav || document.querySelector('.nav-toggle')) return;

    const links = [];
    nav.querySelectorAll('.nav-left a, .nav-right a').forEach((a) => {
      links.push({ 
        href: a.getAttribute('href'), 
        text: a.textContent.trim(), 
        target: a.getAttribute('target'), 
        rel: a.getAttribute('rel') 
      });
    });
    if (!links.length) return;

    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(toggle);

    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.innerHTML = links
      .map((l) => `<a href="${l.href}"${l.target ? ` target="${l.target}"` : ''}${l.rel ? ` rel="${l.rel}"` : ''}>${l.text}</a>`)
      .join('');
    document.body.appendChild(drawer);

    function closeDrawer() {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      drawer.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
  }

  function initHeroParallax() {
    const heroInner = document.querySelector('.hero-inner');
    const heroBg = document.querySelector('.hero-background img');
    if (!heroInner || !hero) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          const heroHeight = hero.offsetHeight;

          if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            const opacity = 1 - (progress * 1.2);
            const translateY = scrollY * 0.4;
            const scale = 1 - (progress * 0.1);

            heroInner.style.opacity = Math.max(opacity, 0);
            heroInner.style.transform = `translateY(${translateY}px) scale(${Math.max(scale, 0.9)})`;

            if (heroBg) {
              heroBg.style.transform = `scale(${1 + progress * 0.1})`;
            }
          }

          ticking = false;
        });

        ticking = true;
      }
    }, { passive: true });
  }

  function initImageHoverEffects() {
    const images = document.querySelectorAll('.gallery-card-img, .showcase-item');
    
    images.forEach(img => {
      img.addEventListener('mouseenter', function(e) {
        this.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  function initCursorGlow() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    let glowElement = document.createElement('div');
    glowElement.style.cssText = `
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
      pointer-events: none;
      z-index: 2;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.5s ease;
    `;
    heroSection.appendChild(glowElement);

    heroSection.addEventListener('mouseenter', () => {
      glowElement.style.opacity = '1';
    });

    heroSection.addEventListener('mouseleave', () => {
      glowElement.style.opacity = '0';
    });

    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowElement.style.left = x + 'px';
      glowElement.style.top = y + 'px';
    });
  }

  function initStaggeredAnimations() {
    const showcaseItems = document.querySelectorAll('.showcase-item');
    const galleryCards = document.querySelectorAll('.gallery-card');

    showcaseItems.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });

    galleryCards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.15}s`;
    });
  }

  function initButtonRipple() {
    const buttons = document.querySelectorAll('.hero-btn, .btn, .event-cta');

    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: ripple 0.6s ease-out forwards;
        `;
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 2px;
      background: linear-gradient(90deg, #1a1a1a 0%, #555 100%);
      z-index: 1000;
      transform-origin: left;
      transform: scaleX(0);
      transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      progressBar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
  }

  function init() {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    initScrollReveal();
    initCounters();
    initSmoothScroll();
    initTabs();
    initMobileNav();
    initHeroParallax();
    initImageHoverEffects();
    initCursorGlow();
    initStaggeredAnimations();
    initButtonRipple();
    initScrollProgress();

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
