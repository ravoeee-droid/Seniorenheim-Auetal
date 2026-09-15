(() => {
  const REMOTE_MEDIA = 'https://seniorenheim-auetal.de/wp-content/uploads/';

  const toLocalMedia = (src) => {
    if (!src) return src;
    try {
      const absolute = new URL(src, window.location.href).href;
      if (absolute.startsWith(REMOTE_MEDIA)) {
        return `/media/${absolute.slice(REMOTE_MEDIA.length)}`;
      }
    } catch (_) {}
    return src;
  };

  const proxyImage = (img) => {
    if (!(img instanceof HTMLImageElement)) return;
    const src = img.getAttribute('src');
    const local = toLocalMedia(src);
    if (local && local !== src) img.setAttribute('src', local);
  };

  document.querySelectorAll('img').forEach(proxyImage);

  const mediaObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLImageElement) {
        proxyImage(mutation.target);
      }
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node instanceof HTMLImageElement) proxyImage(node);
        node.querySelectorAll?.('img').forEach(proxyImage);
      });
    }
  });
  mediaObserver.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['src']
  });

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
    image.addEventListener('error', markMissing);
    image.addEventListener('load', markReady);
    if (image.complete) {
      image.naturalWidth ? markReady() : markMissing();
    }
  });

  const reveal = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveal.forEach((el) => el.classList.add('visible'));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
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
    career: `<span class="modal-kicker">KARRIERE</span><h2 id="routeTitle">Du arbeitest in der Pflege?</h2><p>Lerne Auetal als Arbeitgeber kennen, sieh dir offene Stellen an und prüfe in wenigen Fragen, ob ein Gespräch für dich interessant sein könnte.</p><div class="modal-options"><a href="karriere.html"><strong>Karrierewelt öffnen</strong><span>Zum Job-Match →</span></a><a href="recruiting.html"><strong>Pflegeassistenz ansehen</strong><span>Stelle & Konditionen →</span></a></div>`
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

  document.addEventListener('click', (event) => {
    const closer = event.target.closest?.('[data-route-close]');
    if (!closer) return;
    closeModal({ restoreFocus: closer.tagName !== 'A' });
  });

  document.addEventListener('keydown', (event) => {
    const modalOpen = modal?.classList.contains('open');

    if (event.key === 'Escape') {
      if (modalOpen) {
        event.preventDefault();
        closeModal();
        return;
      }
      if (menu?.classList.contains('open')) {
        event.preventDefault();
        setMenuState(false);
        menuBtn?.focus();
      }
      return;
    }

    if (event.key !== 'Tab' || !modalOpen) return;

    const items = focusablesInModal();
    if (!items.length) {
      event.preventDefault();
      modal.querySelector('.modal-close')?.focus();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  if (!document.querySelector('script[data-copy-finalizer]')) {
    const copyFinalizer = document.createElement('script');
    copyFinalizer.src = 'assets/copy-finalizer.js';
    copyFinalizer.defer = true;
    copyFinalizer.dataset.copyFinalizer = 'true';
    document.head.append(copyFinalizer);
  }
})();
