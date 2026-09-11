(() => {
  const btn = document.getElementById('simulateLead');
  const board = document.getElementById('pipelineBoard');

  const addLead = ({ title='Demo-Lead', detail='Pflegefachkraft · Websystem Demo', time='Gerade eben', hot=false } = {}) => {
    const col = board?.querySelector('[data-stage="new"]');
    if (!col) return;
    const card = document.createElement('div');
    card.className = `lead-card lead-new${hot ? ' lead-hot' : ''}`;
    const strong = document.createElement('strong'); strong.textContent = title;
    const small = document.createElement('small'); small.textContent = detail;
    const span = document.createElement('span'); span.textContent = time;
    card.append(strong, small, span);
    const firstExisting = col.querySelector('.lead-card');
    firstExisting ? col.insertBefore(card, firstExisting) : col.append(card);
    const b = col.querySelector('header b'); if (b) b.textContent = String(Number(b.textContent || 0) + 1);
    card.animate?.([{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'none'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});
  };

  btn?.addEventListener('click', () => {
    addLead();
    btn.textContent = '✓ Demo-Lead eingegangen';
    setTimeout(() => btn.textContent = '+ Demo-Lead simulieren', 1800);
  });

  // Prospect-only bridge: complete Job-Match -> open Cockpit -> see that exact demo contact arrive.
  try {
    const raw = localStorage.getItem('auetalDemoLead');
    if (raw) {
      const lead = JSON.parse(raw);
      addLead({
        title: 'Job-Match Kontakt · Demo',
        detail: [lead.role, lead.hours, 'Quelle: Karrierewelt'].filter(Boolean).join(' · '),
        time: 'Gerade über den Job-Match eingegangen',
        hot: true
      });
      localStorage.removeItem('auetalDemoLead');
      const banner = document.querySelector('.admin-demo-banner span');
      if (banner) banner.textContent = 'Der eben abgeschlossene Job-Match wurde als Demo-Kontakt in die Pipeline übernommen.';
    }
  } catch (_) {}
})();
