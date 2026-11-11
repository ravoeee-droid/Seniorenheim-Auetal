/* Auetal protected applicant cockpit. No sample contacts, localStorage or browser-side credentials. */
(() => {
 'use strict';
 const gate=document.getElementById('adminGate'),content=document.getElementById('adminContent'),sidebar=document.getElementById('adminSidebar');
 if(!gate||!content)return;
 const gateStatus=document.getElementById('gateStatus'),form=document.getElementById('adminLoginForm');
 const password=document.getElementById('adminPassword'),board=document.getElementById('pipelineBoard');
 const detail=document.getElementById('candidateDetail'),status=document.getElementById('adminStatus');
 const source=document.getElementById('sourceSummary');
 const labels={neu:'Neu',kontakt:'Kontakt',gespraech:'Gespräch',hospitation:'Hospitation',eingestellt:'Eingestellt',abgesagt:'Abgesagt',archiviert:'Archiviert'};
 let all=[],authenticated=false,busy=false,lastTotal=null;
 const api=async(path,options={})=>{
   const result=await fetch(path,{credentials:'same-origin',cache:'no-store',...options});
   let data={};
   try{data=await result.json();}catch(_){}
   if(!result.ok){const err=new Error(data.error||'request_failed');err.status=result.status;throw err;}
   return data;
 };
 const lock=(msg='Bitte melde dich an.')=>{
   authenticated=false;content.hidden=true;if(sidebar)sidebar.hidden=true;gate.hidden=false;
   all=[];lastTotal=null;
   if(msg)gateStatus.textContent=msg;
 };
 const text=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=String(value);};
 const node=(tag,className,value)=>{
   const el=document.createElement(tag);
   if(className)el.className=className;
   if(value!==undefined)el.textContent=value;
   return el;
 };
 const date=v=>{
   if(!v)return '—';
   const d=new Date(v);
   if(Number.isNaN(d.getTime()))return '—';
   return new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(d);
 };
 const infoRow=(key,value)=>{
   const box=node('div');
   box.append(node('small','',key),node('strong','',value||'—'));
   return box;
 };
 const renderDetail=(candidate)=>{
   detail.replaceChildren();
   if(!candidate){detail.append(node('p','','Bitte wähle einen Kontakt aus der Bewerberpipeline.'));return;}
   detail.append(node('small','', 'Eingegangen am '+date(candidate.created_at)));
   detail.append(node('h3','',candidate.name));
   const grid=node('div','detail-info');
   grid.append(infoRow('Stelle',candidate.preferred_job||candidate.role),infoRow('Arbeitsmodell',candidate.worktime),
     infoRow('Telefon',candidate.telephone),infoRow('E-Mail',candidate.email),
     infoRow('Wichtigster Wunsch',candidate.priority),infoRow('Kennenlernen',candidate.timing),
     infoRow('Anfrage',candidate.message),infoRow('Quelle',candidate.utm_source||candidate.source),
     infoRow('Kampagne',candidate.utm_campaign||'ohne Kampagnenkennung'),infoRow('Zuletzt aktualisiert',date(candidate.updated_at)));
   detail.append(grid);
   const controls=node('form','');
   const stageLabel=node('label','','Bearbeitungsstatus');stageLabel.htmlFor='candidateStatus';
   const select=node('select');select.id='candidateStatus';
   Object.entries(labels).forEach(([k,v])=>{const o=node('option','',v);o.value=k;o.selected=candidate.status===k;select.append(o);});
   const notesLabel=node('label','','Notizen für Auetal (nur intern)');notesLabel.htmlFor='candidateNotes';
   const notes=node('textarea');notes.id='candidateNotes';notes.maxLength=2000;notes.value=candidate.notes||'';
   const dateLabel=node('label','','Nächster Rückruf / Wiedervorlage');dateLabel.htmlFor='candidateFollowup';
   const next=node('input');next.type='datetime-local';next.id='candidateFollowup';
   if(candidate.follow_up_at){
     const d=new Date(candidate.follow_up_at);const local=new Date(d.getTime()-d.getTimezoneOffset()*60000);
     next.value=local.toISOString().slice(0,16);
   }
   const action=node('div','auetal-panel-actions');
   const save=node('button','save','Änderungen speichern');save.type='submit';
   const close=node('button','','Schließen');close.type='button';close.addEventListener('click',()=>renderDetail(null));
   const remove=node('button','danger','Daten endgültig löschen');remove.type='button';
   const feedback=node('p','auetal-status');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
   action.append(save,close,remove);
   controls.append(stageLabel,select,notesLabel,notes,dateLabel,next,action,feedback);
   detail.append(controls);
   controls.addEventListener('submit',async ev=>{
     ev.preventDefault();save.disabled=true;feedback.textContent='Änderungen werden gespeichert …';
     try{
       await api('/api/admin/applicants',{method:'PATCH',headers:{'Content-Type':'application/json'},
         body:JSON.stringify({id:candidate.id,status:select.value,notes:notes.value,follow_up_at:next.value?new Date(next.value).toISOString():null})});
       feedback.textContent='Gespeichert.';
       await load();const current=all.find(v=>v.id===candidate.id);if(current)renderDetail(current);
     }catch(e){feedback.textContent='Speichern fehlgeschlagen. Bitte erneut versuchen.';save.disabled=false;}
   });
   remove.addEventListener('click',async()=>{
     if(!window.confirm('Bewerberdaten von '+candidate.name+' endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.'))return;
     remove.disabled=true;
     try{
       await api('/api/admin/applicants',{method:'DELETE',headers:{'Content-Type':'application/json'},
         body:JSON.stringify({id:candidate.id,confirm:'DELETE'})});
       renderDetail(null);await load();
     }catch(_){feedback.textContent='Löschen fehlgeschlagen.';remove.disabled=false;}
   });
   detail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 };
 const renderBoard=()=>{
   for(const col of board.querySelectorAll('.pipeline-col')){
     const stage=col.dataset.stage;
     const items=all.filter(a=>stage==='other'?['abgesagt','archiviert'].includes(a.status):a.status===stage);
     const counter=col.querySelector('header b'),list=col.querySelector('.lead-list');
     if(counter)counter.textContent=String(items.length);
     list.replaceChildren();
     if(!items.length){list.append(node('p','empty-col','Noch keine Bewerbungen in dieser Phase.'));continue;}
     items.forEach(applicant=>{
       const btn=node('button','lead-card');
       btn.type='button';
       btn.style.display='block';btn.style.width='100%';btn.style.textAlign='left';
       btn.append(node('strong','',applicant.name));
       btn.append(node('small','',applicant.preferred_job||applicant.role));
       btn.append(node('span','',date(applicant.created_at)));
       btn.addEventListener('click',()=>renderDetail(applicant));
       list.append(btn);
     });
   }
 };
 const sources=()=>{
   if(!all.length){source.textContent='Noch keine gespeicherten Bewerbungen. Besucher- und Werbeausgaben sind nicht mit diesem Dashboard verbunden.';return;}
   const groups=new Map();
   for(const a of all){const label=a.utm_source||a.source||'Karrierewelt';groups.set(label,(groups.get(label)||0)+1);}
   source.textContent=[...groups.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+': '+v+' Kontakt'+(v===1?'':'e')).join(' · ')+'. Dies sind echte gespeicherte Bewerberkontakte, keine Impressionen.';
 };
 const load=async()=>{
   if(!authenticated||busy)return;
   busy=true;
   try{
     let page=0,items=[],last={};
     do{
       last=await api('/api/admin/applicants?page='+page);
       items.push(...(last.rows||[]));page++;
     }while((last.rows||[]).length===50&&page<20);
     all=items;
     const totals=Object.fromEntries((last.counts||[]).map(a=>[a.status,Number(a.count)]));
     text('metricTotal',last.total||0);
     text('metricNew',totals.neu||0);
     text('metricTalk',(totals.kontakt||0)+(totals.gespraech||0));
     text('metricTrial',totals.hospitation||0);
     renderBoard();sources();
     status.textContent='Aktualisiert: '+date(new Date().toISOString())+' · '+(last.total||0)+' gespeicherte Kontakte';
     if(lastTotal!==null&&Number(last.total)>lastTotal)status.textContent='Neue Bewerbungen eingegangen! '+status.textContent;
     lastTotal=Number(last.total)||0;
   }catch(e){
     if(e.status===401){lock('Deine Anmeldung ist abgelaufen. Bitte melde dich erneut an.');return;}
     status.textContent='Bewerberdaten gerade nicht abrufbar. Bitte Verbindung und Datenbank prüfen.';
   }finally{busy=false;}
 };
 const unlock=()=>{
   authenticated=true;gate.hidden=true;content.hidden=false;if(sidebar)sidebar.hidden=false;
   load();
 };
 const check=async()=>{
   try{
     const s=await api('/api/admin/login');
     if(!s.configured){
       lock('Die Datenbank und der sichere Admin-Zugang sind noch nicht eingerichtet. Bis dahin werden keine echten Bewerberdaten angenommen oder angezeigt.');
       form.hidden=true;return;
     }
     form.hidden=false;
     if(s.authenticated)unlock();else lock('Bitte melde dich mit dem geschützten Auetal-Dashboard-Passwort an.');
   }catch(_){lock('Sicherheitsstatus derzeit nicht erreichbar. Versuche es später erneut.');}
 };
 form.addEventListener('submit',async ev=>{
   ev.preventDefault();
   const btn=form.querySelector('button[type="submit"]');btn.disabled=true;gateStatus.textContent='Anmeldung wird geprüft …';
   try{
     await api('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},
       body:JSON.stringify({password:password.value})});
     password.value='';unlock();
   }catch(e){gateStatus.textContent=e.status===429?'Zu viele Versuche. Bitte später erneut versuchen.':'Anmeldung nicht möglich. Zugangsdaten prüfen.';}
   finally{btn.disabled=false;}
 });
 document.getElementById('adminLogout')?.addEventListener('click',async()=>{
   try{await api('/api/admin/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});}catch(_){}
   lock('Du bist abgemeldet.');form.hidden=false;password.value='';
 });
 document.getElementById('adminRefresh')?.addEventListener('click',load);
 setInterval(()=>{if(authenticated&&document.visibilityState==='visible')load();},30000);
 check();
})();
