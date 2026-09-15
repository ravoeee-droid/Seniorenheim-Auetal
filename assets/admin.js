(() => {
  const btn = document.getElementById('simulateLead');
  const board = document.getElementById('pipelineBoard');

  const addLead = ({ title='Beispielkontakt', detail='Pflegefachkraft · Beispielansicht', time='Gerade eben', hot=false } = {}) => {
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
    btn.textContent = '✓ Beispielkontakt eingegangen';
    setTimeout(() => btn.textContent = '+ Beispielkontakt simulieren', 1800);
  });

  const copyFinalizer = document.createElement('script');
  copyFinalizer.src = 'assets/copy-finalizer.js';
  copyFinalizer.defer = true;
  document.head.append(copyFinalizer);
})();
