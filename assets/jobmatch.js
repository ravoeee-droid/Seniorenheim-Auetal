/* Auetal career funnel: 4 familiar questions, real candidate capture when securely configured. */
(() => {
 'use strict';
 const stage=document.getElementById('jobStage');if(!stage)return;
 const counter=document.getElementById('jobCount'),progress=document.getElementById('jobProgress');
 const progressShell=progress?.parentElement,back=document.getElementById('jobBack'),restart=document.getElementById('jobRestart');
 const data={};let step=0;
 const steps=[
   {k:'role',kicker:'Deine Qualifikation',q:'Was beschreibt dich am besten?',o:['Examinierte Pflegefachkraft','Examinierte Pflegefachkraft – Wiedereinstieg','Pflegefachkraft mit Zusatzqualifikation','Noch unsicher – erst kennenlernen']},
   {k:'priority',kicker:'Deine Wünsche',q:'Was soll bei deinem nächsten Arbeitgeber besser werden?',o:['Familie & Arbeitszeit besser verbinden','Ein gutes Team und verlässliche Führung','Entwicklung & Weiterbildung','Weniger Bürokratie / mehr Zeit für Menschen']},
   {k:'worktime',kicker:'Arbeitsmodell',q:'Was passt aktuell zu deinem Leben?',o:['Vollzeit','Teilzeit','Nachtdienst interessant','Noch offen – erst sprechen']},
   {k:'timing',kicker:'Dein Zeitplan',q:'Wann wäre ein Kennenlernen interessant?',o:['Möglichst bald','In den nächsten Wochen','Später – ich informiere mich','Erst einmal unverbindlich sprechen']},
   {result:true}
 ];
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
 const href=(text,url,cls='text-link')=>{const a=el('a',cls,text);a.href=url;return a;};
 const focusH=()=>{const h=stage.querySelector('h3');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}};
 const render=(focus=false)=>{
   const n=step+1;
   if(counter)counter.textContent=String(n).padStart(2,'0')+' / 05';
   if(progress)progress.style.width=n*20+'%';
   if(progressShell)progressShell.setAttribute('aria-valuenow',String(n));
   if(back)back.disabled=step===0;
   stage.replaceChildren();
   if(steps[step].result){renderContact();if(focus)focusH();return;}
   const info=steps[step],screen=el('div','flow-screen');
   screen.append(el('span','flow-kicker',info.kicker));
   const h=el('h3','',info.q);h.id='jobQuestion'+step;screen.append(h);
   const options=el('div','flow-options');options.setAttribute('role','group');options.setAttribute('aria-labelledby',h.id);
   for(const value of info.o){
     const btn=el('button','',value);btn.type='button';btn.dataset.answer=value;
     const arrow=el('span','','→');arrow.setAttribute('aria-hidden','true');btn.append(arrow);
     btn.addEventListener('click',()=>{data[info.k]=value;step++;render(true);});options.append(btn);
   }
   screen.append(options);stage.append(screen);if(focus)focusH();
 };
 const simpleContact=()=>{
   const emailBody=['Guten Tag,','', 'ich möchte das Auetal-Team kennenlernen.','',
     'Rolle: '+(data.role||'Pflegefachkraft'),
     'Stelle: '+(data.preferred_job||'noch offen'),
     'Wichtig: '+(data.priority||'—'),
     'Arbeitszeit: '+(data.worktime||'—'),
     'Zeitplan: '+(data.timing||'—')].join('\n');
   const url='mailto:info@seniorenheim-auetal.de?subject='+encodeURIComponent('Unverbindliches Kennenlernen Auetal')+'&body='+encodeURIComponent(emailBody);
   const links=el('div','flow-result-actions');
   links.append(href('Alternativ: E-Mail-Entwurf vorbereiten ↗',url),href('Direkt anrufen · 05553 99430','tel:+49555399430'));
   const official=href('Offizielles Online-Bewerbungsformular ↗','https://seniorenheim-auetal.de/bewerbungsformular/');
   official.target='_blank';official.rel='noopener noreferrer';links.append(official);
   return links;
 };
 const input=(type,id,label,required=false)=>{
   const field=el('div','auetal-input');
   const lbl=el('label','',label);lbl.htmlFor=id;
   const box=el('input','');box.type=type;box.id=id;box.name=id;
   if(type==='text')box.autocomplete='name';
   if(type==='tel')box.autocomplete='tel';
   if(type==='email')box.autocomplete='email';
   if(required)box.required=true;
   box.maxLength=type==='text'?120:180;
   field.append(lbl,box);return {field,box};
 };
 const renderContact=()=>{
   const root=el('div','flow-result auetal-candidate');
   root.append(el('span','flow-kicker','Fast geschafft · persönlicher Kontakt'));
   root.append(el('h3','','Wie können wir dich erreichen?'));
   root.append(el('p','flow-intro','Sag uns kurz, wie wir dich erreichen können. Wir melden uns persönlich bei dir – ohne Lebenslauf, ohne Anschreiben.'));
   const selected=el('div','flow-summary');for(const v of [data.role,data.preferred_job,data.worktime,data.priority,data.timing].filter(Boolean))selected.append(el('span','',v));root.append(selected);
   const form=el('form','auetal-candidate-form');form.noValidate=true;
   const name=input('text','auetalCandidateName','Dein Name *',true);
   const tel=input('tel','auetalCandidatePhone','Telefonnummer');
   const mail=input('email','auetalCandidateEmail','E-Mail-Adresse');
   form.append(name.field,tel.field,mail.field);
   form.append(el('p','contact-hint','Telefonnummer oder E-Mail-Adresse – eines von beiden genügt.'));
   const msg=el('div','auetal-input');
   const ml=el('label','','Deine Nachricht (freiwillig)');ml.htmlFor='auetalCandidateMessage';
   const box=el('textarea','');box.id='auetalCandidateMessage';box.rows=3;box.maxLength=1500;box.placeholder='Zum Beispiel: Wann passt ein Rückruf?';msg.append(ml,box);form.append(msg);
   const consent=el('label','auetal-consent');
   const checked=el('input','');checked.type='checkbox';checked.required=true;
   const agreement=el('span','');agreement.append('Ich habe die ');
   const link=href('Informationen zum Datenschutz','https://seniorenheim-auetal.de/datenschutz/');
   link.target='_blank';link.rel='noopener noreferrer';agreement.append(link,' gelesen. Auetal darf mich wegen dieser Anfrage kontaktieren. *');
   consent.append(checked,agreement);form.append(consent);
   const trap=el('input','auetal-honeypot');trap.type='text';trap.name='website';trap.tabIndex=-1;trap.autocomplete='off';trap.setAttribute('aria-hidden','true');form.append(trap);
   const submit=el('button','btn btn-primary','Unverbindlich Kontakt aufnehmen ↗');submit.type='submit';submit.disabled=true;
   form.append(submit);
   const feedback=el('p','auetal-contact-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');form.append(feedback);
   form.append(el('p','flow-clarification','Deine Angaben gehen ausschließlich an Auetal und werden nur für diese Kontaktaufnahme genutzt.'));
   root.append(form,simpleContact());stage.append(root);
   fetch('/api/bewerbung',{cache:'no-store'}).then(r=>r.ok?r.json():{ready:false}).then(v=>{
     submit.disabled=v.ready!==true;
     if(!v.ready)feedback.textContent='Die Kontaktaufnahme über diese Seite ist gerade nicht verfügbar. Ruf uns gern an oder nutze die Links unten.';
     else feedback.textContent='';
   }).catch(()=>{feedback.textContent='Die Kontaktaufnahme über diese Seite ist gerade nicht erreichbar. Ruf uns gern an oder schreib uns eine E-Mail.';});
   form.addEventListener('submit',async event=>{
     event.preventDefault();
     if(submit.disabled)return;
     feedback.textContent='';
     const candidateName=name.box.value.trim(),telephone=tel.box.value.trim(),email=mail.box.value.trim();
     if(candidateName.length<2){feedback.textContent='Bitte gib deinen Namen an.';name.box.focus();return;}
     if(!email&&telephone.replace(/\D/g,'').length<6){feedback.textContent='Bitte gib eine gültige Telefonnummer oder E-Mail-Adresse an.';tel.box.focus();return;}
     if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){feedback.textContent='Bitte prüfe die E-Mail-Adresse.';mail.box.focus();return;}
     if(!checked.checked){feedback.textContent='Bitte bestätige, dass du die Datenschutzhinweise gelesen hast.';checked.focus();return;}
     submit.disabled=true;submit.textContent='Wird sicher übertragen …';
     const utm=new URLSearchParams(location.search);
     const payload={role:data.role||'Examinierte Pflegefachkraft',preferred_job:data.preferred_job||'',
       priority:data.priority||'',worktime:data.worktime||'',timing:data.timing||'',name:candidateName,telephone,email,message:box.value,
       privacy_acknowledged:true,website:trap.value,utm_source:utm.get('utm_source')||'',utm_medium:utm.get('utm_medium')||'',
       utm_campaign:utm.get('utm_campaign')||'',utm_content:utm.get('utm_content')||''};
     try{
       const res=await fetch('/api/bewerbung',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
       const v=await res.json().catch(()=>({}));
       if(!res.ok||v.success!==true)throw Error('delivery_failed');
       root.replaceChildren(el('span','flow-kicker','Anfrage eingegangen'),el('h3','','Danke – wir freuen uns auf dich!'),
         el('p','flow-intro','Deine Kontaktanfrage ist sicher bei Auetal eingegangen. Wir melden uns persönlich bei dir.'));
       root.append(href('Noch Fragen? Jetzt anrufen ↗','tel:+49555399430'));
       stage.dispatchEvent(new CustomEvent('auetal:application-received',{bubbles:true}));
     }catch(_){feedback.textContent='Die Übertragung hat nicht funktioniert. Es wurde keine Bestätigung gespeichert. Bitte versuche es später erneut oder nutze Telefon/E-Mail.';submit.disabled=false;submit.textContent='Erneut versuchen ↗';}
   });
 };
 back?.addEventListener('click',()=>{if(step>0){step--;render(true);}});
 restart?.addEventListener('click',()=>{step=0;for(const k in data)delete data[k];render(true);});
 document.querySelectorAll('[data-job]').forEach(link=>link.addEventListener('click',()=>{
   data.preferred_job=link.dataset.job||'';
   data.role=data.preferred_job.toLowerCase().includes('wiedereinstieg')?'Examinierte Pflegefachkraft – Wiedereinstieg':'Examinierte Pflegefachkraft';
   step=1;render(true);
 }));
 render();
 const flow=document.getElementById('jobFlow');
 if(flow&&'IntersectionObserver'in window){
   new IntersectionObserver(entries=>{for(const e of entries)document.body.classList.toggle('flow-in-view',e.isIntersecting);},{threshold:.15}).observe(flow);
 }
})();
