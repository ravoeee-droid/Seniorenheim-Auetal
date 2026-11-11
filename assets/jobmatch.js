/* Auetal Job-Match: same UI and question order, improved screen reader and keyboard support. */
(() => {
  'use strict';
  const stage = document.getElementById('jobStage');
  if (!stage) return;
  const count = document.getElementById('jobCount');
  const bar = document.getElementById('jobProgress');
  const progress = bar?.parentElement;
  const back = document.getElementById('jobBack');
  const restart = document.getElementById('jobRestart');
  let step = 0;
  const data = {};
  const steps = [
    {k:'role', kicker:'Deine Qualifikation', q:'Was beschreibt dich am besten?', o:['Examinierte Pflegefachkraft','Examinierte Pflegefachkraft – Wiedereinstieg','Pflegefachkraft mit Zusatzqualifikation','Noch unsicher – erst kennenlernen']},
    {k:'priority', kicker:'Was soll besser werden?', q:'Was ist dir bei einem neuen Arbeitgeber am wichtigsten?', o:['Familie & Arbeitszeit besser verbinden','Ein gutes Team und verlässliche Führung','Entwicklung & Weiterbildung','Weniger Bürokratie / mehr Zeit für Menschen']},
    {k:'hours', kicker:'Dein Arbeitsmodell', q:'Was passt aktuell zu deinem Leben?', o:['Vollzeit','Teilzeit','Nachtdienst interessant','Noch offen – erst sprechen']},
    {k:'timing', kicker:'Nur zur Einordnung', q:'Wann wäre ein Kennenlernen interessant?', o:['Möglichst bald','In den nächsten Wochen','Später – ich informiere mich','Erst einmal unverbindlich sprechen']},
    {result:true}
  ];
  const make = (tag,className,text) => {
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(text!==undefined)el.textContent=text;
    return el;
  };
  const updateTop=()=>{
    const n=step+1;
    if(count)count.textContent=String(n).padStart(2,'0')+' / 05';
    if(bar)bar.style.width=(n/5*100)+'%';
    if(progress)progress.setAttribute('aria-valuenow',String(n));
    if(back)back.disabled=step===0;
  };
  const focusHeading = () => {
    const h=stage.querySelector('h3');
    if(h){h.tabIndex=-1;h.focus({preventScroll:true});}
  };
  const render=(focus=false)=>{
    updateTop();
    stage.replaceChildren();
    if(steps[step].result){
      const summary=[data.role,data.priority,data.hours,data.timing].filter(Boolean);
      const root=make('div','flow-result');
      root.append(make('span','flow-kicker','Deine Gesprächsgrundlage'));
      root.append(make('h3','','Das könnte einen ersten Austausch wert sein.'));
      const chips=make('div','flow-summary');
      summary.forEach(value=>chips.append(make('span','',value)));
      root.append(chips);
      root.append(make('p','','Du musst dich jetzt nicht festlegen. Ein unverbindliches Gespräch oder eine Hospitation kann der nächste Schritt sein.'));
      const actions=make('div','flow-result-actions');
      const email=make('a','btn btn-primary');
      const body='Hallo liebes Auetal-Team,\n\nich interessiere mich für ein Kennenlernen im Seniorenheim Auetal.\n\nMeine kurze Einordnung:\n- '+summary.join('\n- ')+'\n\nIch freue mich über eine Rückmeldung.';
      email.href='mailto:info@seniorenheim-auetal.de?subject='+encodeURIComponent('Unverbindliches Kennenlernen Auetal')+'&body='+encodeURIComponent(body);
      email.append('E-Mail-Entwurf vorbereiten ');
      email.append(make('span','','↗'));
      const application=make('a','text-link','Offizielles Online-Bewerbungsformular');
      application.href='https://seniorenheim-auetal.de/bewerbungsformular/';
      application.target='_blank';
      application.rel='noopener noreferrer';
      const call=make('a','text-link','Lieber anrufen · 05553 99430');
      call.href='tel:+49555399430';
      actions.append(email,call,application);
      root.append(actions);
      root.append(make('p','flow-clarification','Hinweis: Dein E-Mail-Programm öffnet einen Entwurf. Bitte sende die Nachricht dort selbst ab.'));
      stage.append(root);
      if(focus)focusHeading();
      return;
    }
    const s=steps[step];
    const root=make('div','flow-screen');
    root.append(make('span','flow-kicker',s.kicker));
    const heading=make('h3','',s.q);
    const questionId='jobQuestion'+step;
    heading.id=questionId;
    root.append(heading);
    const options=make('div','flow-options');
    options.setAttribute('role','group');
    options.setAttribute('aria-labelledby',questionId);
    s.o.forEach(value=>{
      const button=make('button','',value);
      button.type='button';
      button.dataset.answer=value;
      const arrow=make('span','','→');
      arrow.setAttribute('aria-hidden','true');
      button.append(arrow);
      button.addEventListener('click',()=>{
        data[s.k]=value;
        step++;
        render(true);
      });
      options.append(button);
    });
    root.append(options);
    stage.append(root);
    if(focus)focusHeading();
  };
  back?.addEventListener('click',()=>{
    if(step>0){step--;render(true);}
  });
  restart?.addEventListener('click',()=>{
    step=0;
    Object.keys(data).forEach(k=>delete data[k]);
    render(true);
  });
  document.querySelectorAll('[data-job]').forEach(link=>{
    link.addEventListener('click',()=>{
      data.role=link.dataset.job||'Pflegefachkraft';
      step=1;
      render(true);
    });
  });
  render();
})();