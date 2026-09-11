(() => {
  const root = document.querySelector('#careFlow');
  const stage = document.querySelector('#careStage');
  const count = document.querySelector('#careCount');
  const progress = document.querySelector('#careProgress');
  const back = document.querySelector('#careBack');
  const restart = document.querySelector('#careRestart');
  if (!root || !stage) return;

  const state = { step: 0, answers: {} };
  const steps = [
    { key:'person', kicker:'Nur eine Sache zum Anfang', title:'Für wen suchen Sie gerade Unterstützung?', options:['Für einen Angehörigen','Für mich selbst','Für meine Partnerin / meinen Partner','Ich informiere mich erst einmal'] },
    { key:'need', kicker:'Was ist gerade am wichtigsten?', title:'Welche Situation trifft am ehesten zu?', options:['Ein dauerhaftes Zuhause','Unterstützung bei Demenz','Kurzzeitpflege / Entlastung','Ich weiß es noch nicht genau'] },
    { key:'urgency', kicker:'Damit der nächste Schritt passt', title:'Wie dringend fühlt sich die Situation an?', options:['Möglichst bald','In den nächsten Wochen','Ich orientiere mich ohne Zeitdruck'] },
    { key:'next', kicker:'So wie es für Sie angenehm ist', title:'Wie möchten Sie Auetal kennenlernen?', options:['Kurz telefonieren','Besichtigung anfragen','Erst den virtuellen Rundgang ansehen'] }
  ];

  const esc = str => String(str).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const mailLink = () => {
    const a = state.answers;
    const body = `Guten Tag,\n\nich interessiere mich für das Seniorenheim Auetal.\n\nFür wen: ${a.person||'-'}\nSituation: ${a.need||'-'}\nDringlichkeit: ${a.urgency||'-'}\nGewünschter nächster Schritt: ${a.next||'-'}\n\nViele Grüße`;
    return `mailto:info@seniorenheim-auetal.de?subject=${encodeURIComponent('Interesse / Pflege-Orientierung')}&body=${encodeURIComponent(body)}`;
  };
  const render = () => {
    const total = steps.length + 1;
    count.textContent = `${String(state.step+1).padStart(2,'0')} / 0${total}`;
    progress.style.width = `${((state.step+1)/total)*100}%`;
    back.disabled = state.step === 0;
    if (state.step < steps.length) {
      const s = steps[state.step];
      stage.innerHTML = `<small>${esc(s.kicker)}</small><h3>${esc(s.title)}</h3><div class="care-options">${s.options.map(o=>`<button type="button" data-care-value="${esc(o)}"><span>${esc(o)}</span><b>→</b></button>`).join('')}</div>`;
      stage.querySelectorAll('[data-care-value]').forEach(btn => btn.addEventListener('click', () => { state.answers[s.key]=btn.dataset.careValue; state.step++; render(); }));
    } else {
      const a = state.answers;
      stage.innerHTML = `<small>Ihre Situation – kompakt</small><h3>Sie müssen heute noch nicht alles entscheiden.</h3><div class="care-result-summary"><strong>${esc(a.need||'Orientierung gesucht')}</strong><span>${esc(a.person||'')} · ${esc(a.urgency||'')}</span><span>Gewünschter Weg: ${esc(a.next||'persönlich klären')}</span></div><p>Diese Einordnung ist keine Pflegeberatung oder Verfügbarkeitszusage. Sie hilft nur dabei, das erste Gespräch leichter zu machen.</p><div class="care-result-actions"><a class="btn btn-primary" href="tel:+49555399430">Direkt anrufen <span>↗</span></a><a class="btn btn-soft" href="${mailLink()}">Zusammenfassung senden</a></div>`;
    }
  };
  back.addEventListener('click', () => { if (state.step>0) { state.step--; render(); } });
  restart.addEventListener('click', () => { state.step=0; state.answers={}; render(); });
  render();
})();
