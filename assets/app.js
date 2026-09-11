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
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  if (menuBtn && menu) menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open)); menu.classList.toggle('open', !open);
  });
  document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => { menu?.classList.remove('open'); menuBtn?.setAttribute('aria-expanded','false'); }));

  // Remote originals from the existing Auetal website are the primary visuals.
  // When an offline/local preview cannot reach them, show a branded fallback instead of a broken grey box.
  document.querySelectorAll('.image-shell').forEach(shell => {
    const image = shell.querySelector('img');
    if (!image) return;
    const markMissing = () => shell.classList.add('is-missing');
    const markReady = () => shell.classList.remove('is-missing');
    image.addEventListener('error', markMissing, { once: true });
    image.addEventListener('load', markReady);
    if (image.complete) image.naturalWidth ? markReady() : markMissing();
    else setTimeout(() => { if (!image.complete || !image.naturalWidth) markMissing(); }, 1800);
  });

  const reveal = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) reveal.forEach(el => el.classList.add('visible'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    reveal.forEach(el => io.observe(el));
  }

  const modal = document.querySelector('[data-route-modal]');
  const content = document.querySelector('[data-route-content]');
  const routeTemplates = {
    care: `<span class="modal-kicker">PFLEGE-ORIENTIERUNG</span><h2 id="routeTitle">Was brauchen Sie gerade?</h2><p>Kein langes Formular. Wählen Sie den Punkt, der Ihrer Situation am nächsten kommt.</p><div class="modal-options"><a href="#haeuser" data-route-close><strong>Ein dauerhaftes Zuhause</strong><span>Herrenwiese & Clausberg vergleichen →</span></a><a href="#pflege" data-route-close><strong>Kurzzeit- oder intensivere Pflege</strong><span>Pflegeangebote einordnen →</span></a><a href="#kontakt" data-route-close><strong>Ich möchte erst persönlich sprechen</strong><span>Direkt Kontakt aufnehmen →</span></a></div>`,
    career: `<span class="modal-kicker">KARRIERE</span><h2 id="routeTitle">Du arbeitest in der Pflege?</h2><p>Dann ist die Karrierewelt der schnellste Weg: Arbeitgeber kennenlernen, offene Stellen sehen und in 60 Sekunden prüfen, ob ein Gespräch Sinn ergibt.</p><div class="modal-options"><a href="karriere.html"><strong>Karrierewelt öffnen</strong><span>Zum Job-Match →</span></a><a href="recruiting.html"><strong>Pflegeassistenz-Demo ansehen</strong><span>Social-Recruiting-Flow →</span></a></div>`
  };
  const closeModal = () => { if (!modal) return; modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); };
  document.querySelectorAll('[data-route-open]').forEach(btn => btn.addEventListener('click', () => { if (!modal || !content) return; content.innerHTML = routeTemplates[btn.dataset.routeOpen] || routeTemplates.care; modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); setTimeout(()=>modal.querySelector('.modal-close')?.focus(),20); }));
  document.addEventListener('click', e => { if (e.target.closest('[data-route-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();
