(() => {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('#scrollProgress');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 24);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenuState = (open) => {
    if (!menuBtn || !menu) return;
    if (!menu.id) menu.id = 'mobileMenu';
    menuBtn.setAttribute('aria-controls', menu.id);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('open', open);
  };

  if (menuBtn && menu) {
    setMenuState(false);
    menuBtn.addEventListener('click', () => {
      setMenuState(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }

  document.querySelectorAll('.mobile-menu a').forEach((a) => {
    a.addEventListener('click', () => setMenuState(false));
  });

  document.querySelectorAll('.image-shell').forEach((shell) => {
    const image = shell.querySelector('img');
    if (!image) return;
    const markMissing = () => shell.classList.add('is-missing');
    const markReady = () => shell.classList.remove('is-missing');
    image.addEventListener('error', markMissing, { once: true });
    image.addEventListener('load', markReady);
    if (image.complete) image.naturalWidth ? markReady() : markMissing();
    else setTimeout(() => {
      if (!image.complete || !image.naturalWidth) markMissing();
    }, 1800);
  });

  const reveal = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveal.forEach((el) => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    reveal.forEach((el) => io.observe(el));
  }

  const modal = document.querySelector('[data-route-modal]');
  const content = document.querySelector('[data-route-content]');
  let lastModalTrigger = null;

  if (modal) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'routeTitle');
  }

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const focusablesInModal = () => {
    if (!modal) return [];
    return [...modal.querySelectorAll(focusableSelector)]
      .filter((el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true');
  };

  const routeTemplates = {
    care: `<span class="modal-kicker">PFLEGE-ORIENTIERUNG</span><h2 id="routeTitle">Was brauchen Sie gerade?</h2><p>Kein langes Formular. Wählen Sie den Punkt, der Ihrer Situation am nächsten kommt.</p><div class="modal-options"><a href="#haeuser" data-route-close><strong>Ein dauerhaftes Zuhause</strong><span>Herrenwiese & Clausberg vergleichen →</span></a><a href="#pflege" data-route-close><strong>Kurzzeit- oder intensivere Pflege</strong><span>Pflegeangebote einordnen →</span></a><a href="#kontakt" data-route-close><strong>Ich möchte erst persönlich sprechen</strong><span>Direkt Kontakt aufnehmen →</span></a></div>`,
    career: `<span class="modal-kicker">KARRIERE</span><h2 id="routeTitle">Du arbeitest in der Pflege?</h2><p>Dann ist die Karrierewelt der schnellste Weg: Arbeitgeber kennenlernen, offene Stellen sehen und in 60 Sekunden prüfen, ob ein Gespräch Sinn ergibt.</p><div class="modal-options"><a href="karriere.html"><strong>Karrierewelt öffnen</strong><span>Zum Job-Match →</span></a><a href="recruiting.html"><strong>Pflegeassistenz-Demo ansehen</strong><span>Social-Recruiting-Flow →</span></a></div>`
  };

  const backgroundNodes = () => [header, document.querySelector('main'), document.querySelector('.site-footer')]
    .filter((node) => node && modal && !node.contains(modal));

  const setBackgroundInert = (value) => {
    backgroundNodes().forEach((node) => { node.inert = value; });
  };

  const closeModal = ({ restoreFocus = true } = {}) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    setBackgroundInert(false);

    const focusTarget = lastModalTrigger;
    lastModalTrigger = null;
    if (restoreFocus && focusTarget instanceof HTMLElement) {
      requestAnimationFrame(() => focusTarget.focus());
    }
  };

  document.querySelectorAll('[data-route-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!modal || !content) return;
      lastModalTrigger = btn;
      content.innerHTML = routeTemplates[btn.dataset.routeOpen] || routeTemplates.care;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      setBackgroundInert(true);
      requestAnimationFrame(() => modal.querySelector('.modal-close')?.focus());
    });
  });

  document.addEventListener('click', (e) => {
    const closer = e.target.closest?.('[data-route-close]');
    if (!closer) return;
    closeModal({ restoreFocus: closer.tagName !== 'A' });
  });

  document.addEventListener('keydown', (e) => {
    const modalOpen = modal?.classList.contains('open');

    if (e.key === 'Escape') {
      if (modalOpen) {
        e.preventDefault();
        closeModal();
        return;
      }
      if (menu?.classList.contains('open')) {
        e.preventDefault();
        setMenuState(false);
        menuBtn?.focus();
      }
      return;
    }

    if (e.key !== 'Tab' || !modalOpen) return;

    const items = focusablesInModal();
    if (!items.length) {
      e.preventDefault();
      modal.querySelector('.modal-close')?.focus();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
