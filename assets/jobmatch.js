(() => {
  const stage = document.getElementById('jobStage'); if (!stage) return;
  const count = document.getElementById('jobCount'); const progress = document.getElementById('jobProgress');
  const back = document.getElementById('jobBack'); const restart = document.getElementById('jobRestart');
  let step = 0; const data = {};
  const steps = [
    {k:'role', kicker:'Dein Hintergrund', q:'Was beschreibt dich am besten?', o:['Pflegefachkraft','Pflegeassistenz / Pflegehilfe','Quereinstieg / Ausbildung','Andere Rolle im Haus']},
    {k:'priority', kicker:'Was soll besser werden?', q:'Was ist dir bei einem neuen Arbeitgeber am wichtigsten?', o:['Familie & Arbeitszeit besser verbinden','Ein gutes Team und verlässliche Führung','Entwicklung & Weiterbildung','Weniger Bürokratie / mehr Zeit für Menschen']},
    {k:'hours', kicker:'Dein Arbeitsmodell', q:'Was passt aktuell zu deinem Leben?', o:['Vollzeit','Teilzeit','Nachtdienst interessant','Noch offen – erst sprechen']},
    {k:'timing', kicker:'Nur zur Einordnung', q:'Wann wäre ein Kennenlernen interessant?', o:['Möglichst bald','In den nächsten Wochen','Später – ich informiere mich','Erst einmal unverbindlich sprechen']},
    {result:true}
  ];
  const updateTop = () => { if(count) count.textContent = String(step+1).padStart(2,'0')+' / 05'; if(progress) progress.style.width = `${((step+1)/5)*100}%`; };
  const render = () => {
    updateTop();
    if (steps[step].result) {
      const summary = [data.role,data.priority,data.hours,data.timing].filter(Boolean);
      const body = encodeURIComponent(`Hallo liebes Auetal-Team,\n\nich interessiere mich grundsätzlich für ein Kennenlernen im Seniorenheim Auetal.\n\nMeine kurze Einordnung:\n- ${summary.join('\n- ')}\n\nIch freue mich über eine kurze Rückmeldung.`);
      stage.innerHTML = `<div class="flow-result"><span class="flow-kicker">Deine Gesprächsgrundlage</span><h3>Das könnte einen ersten Austausch wert sein.</h3><div class="flow-summary">${summary.map(x=>`<span>${x}</span>`).join('')}</div><p>Du musst dich jetzt nicht vollständig bewerben. Ein erster Kontakt oder Probearbeiten kann der nächste Schritt sein.</p><div class="flow-result-actions"><a class="btn btn-primary" href="mailto:info@seniorenheim-auetal.de?subject=Unverbindliches%20Kennenlernen%20Auetal&body=${body}">Interesse senden <span>↗</span></a><a class="text-link" href="tel:+49555399430">Lieber anrufen · 05553 99430</a><button class="demo-cockpit-link" type="button" data-demo-cockpit>Konzeptdemo: diesen Kontakt im Cockpit zeigen <span>→</span></button></div></div>`;
      stage.querySelector('[data-demo-cockpit]')?.addEventListener('click', () => {
        try { localStorage.setItem('auetalDemoLead', JSON.stringify({ role:data.role||'Pflege', priority:data.priority||'', hours:data.hours||'', timing:data.timing||'', createdAt:Date.now() })); } catch (_) {}
        location.href = 'admin.html?from=jobmatch';
      });
      return;
    }
    const s = steps[step]; stage.innerHTML = `<div class="flow-screen"><span class="flow-kicker">${s.kicker}</span><h3>${s.q}</h3><div class="flow-options">${s.o.map(o=>`<button type="button" data-answer="${escapeHtml(o)}">${o}<span>→</span></button>`).join('')}</div></div>`;
    stage.querySelectorAll('[data-answer]').forEach(btn => btn.addEventListener('click', () => { data[s.k] = btn.dataset.answer; step++; render(); }));
  };
  const escapeHtml = str => str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  back?.addEventListener('click', () => { if(step>0){ step--; render(); }});
  restart?.addEventListener('click', () => { step=0; Object.keys(data).forEach(k=>delete data[k]); render(); });
  document.querySelectorAll('[data-job]').forEach(a => a.addEventListener('click', () => { data.role = a.dataset.job; }));
  render();
})();
