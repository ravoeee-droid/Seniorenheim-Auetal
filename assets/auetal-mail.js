'use strict';
(()=>{
const $=id=>document.getElementById(id);
let selected=null;
let messages=[];
const status=(message)=>{$('status').textContent=message;};
const note=(message)=>{$('notice').hidden=false;$('notice').textContent=message;};
const clearNote=()=>{$('notice').hidden=true;$('notice').textContent='';};
const showLogin=()=>{$('app').hidden=true;$('loginPanel').hidden=false;status('Anmeldung erforderlich');};
const hideLogin=()=>{$('loginPanel').hidden=true;$('loginError').textContent='';};
const displayDate=value=>value?new Date(value).toLocaleString('de-DE',{dateStyle:'medium',timeStyle:'short'}):'';
const fetchJSON=async(url,opts={})=>{
 const response=await fetch(url,{credentials:'same-origin',cache:'no-store',...opts});
 const data=await response.json().catch(()=>({}));
 if(!response.ok){const err=new Error(data.error||'request_failed');err.status=response.status;throw err;}
 return data;
};
const mailUrl=mode=>'/api/admin/mail?mode='+mode;
function openComposer(to='',subject='',replyId=''){
 selected={replyId};
 $('messageView').hidden=true;$('composer').hidden=false;$('reply').hidden=true;
 $('detailTitle').textContent='E-Mail verfassen';$('to').value=to;$('subject').value=subject;
 $('body').value='';$('sendStatus').textContent='';$('body').focus();
}
function showMessage(){ $('messageView').hidden=false;$('composer').hidden=true;}
function renderList(){
 const root=$('messageList');root.replaceChildren();
 if(!messages.length){const p=document.createElement('p');p.className='content muted';p.textContent='Keine Nachrichten im Posteingang.';root.append(p);return;}
 for(const m of messages){
  const b=document.createElement('button');b.type='button';b.className='message'+(selected?.uid===m.uid?' selected':'');
  const title=document.createElement('strong');title.textContent=(m.unread?'● ':'')+(m.subject||'(Ohne Betreff)');
  const who=document.createElement('small');who.textContent=(m.fromName||m.from||'Unbekannt')+' · '+displayDate(m.date);
  b.append(title,who);b.addEventListener('click',()=>read(m.uid));root.append(b);
 }
}
async function refresh(){
 status('Posteingang wird aktualisiert …');
 try{messages=(await fetchJSON(mailUrl('list'))).messages||[];renderList();status(messages.length+' Nachrichten geladen.');}
 catch(e){status('Der Posteingang konnte nicht geladen werden.');note('Bitte Verbindung und Zugangsdaten prüfen.');}
}
async function read(uid){
 status('Nachricht wird geladen …');
 try{
  const {message:m}=await fetchJSON(mailUrl('read')+'&uid='+encodeURIComponent(uid));
  selected=m;renderList();showMessage();$('detailTitle').textContent=m.subject||'(Ohne Betreff)';
  const box=$('messageView');box.replaceChildren();
  const hdr=document.createElement('p');hdr.className='muted';hdr.textContent='Von: '+(m.from||m.fromAddress)+'\nAn: '+(m.to||'')+'\n'+displayDate(m.date);
  hdr.style.whiteSpace='pre-wrap';box.append(hdr);
  const divider=document.createElement('hr');divider.style.border='0';divider.style.borderTop='1px solid #eee4e1';box.append(divider);
  const body=document.createElement('div');body.className='mail-body';body.textContent=m.tooLarge?'Diese Nachricht ist für die Dashboard-Ansicht zu groß.':(m.text||'(Kein Textinhalt verfügbar)');
  box.append(body);
  if(m.attachments?.length){const p=document.createElement('p');p.className='muted';p.textContent='Anhänge: '+m.attachments.map(a=>a.filename).join(', ')+' (Download noch nicht verfügbar)';box.append(p);}
  $('reply').hidden=!(m.fromAddress&&!m.tooLarge);
  status('Nachricht geöffnet.');
 }catch(e){status('Nachricht konnte nicht geladen werden.');}
}
$('refresh').addEventListener('click',refresh);
$('new').addEventListener('click',()=>openComposer());
$('reply').addEventListener('click',()=>{
 if(!selected?.fromAddress)return;
 openComposer(selected.fromAddress,/^re:/i.test(selected.subject)?selected.subject:'Re: '+(selected.subject||''),selected.messageId||'');
});
$('cancel').addEventListener('click',()=>{showMessage();$('detailTitle').textContent='Nachricht auswählen';});
$('composer').addEventListener('submit',async event=>{
 event.preventDefault();const btn=$('send');btn.disabled=true;
 $('sendStatus').textContent='E-Mail wird gesendet …';
 try{
  const data={to:$('to').value.trim(),subject:$('subject').value.trim(),text:$('body').value,inReplyTo:selected?.replyId||''};
  await fetchJSON('/api/admin/mail',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  $('sendStatus').textContent='E-Mail erfolgreich versendet.';$('body').value='';
  status('E-Mail wurde versendet.');setTimeout(()=>{showMessage();$('detailTitle').textContent='Nachricht auswählen';},1200);
 }catch(e){$('sendStatus').textContent='Versand fehlgeschlagen. Prüfe die Verbindung.';}
 finally{btn.disabled=false;}
});
async function initializeMailbox(){
 clearNote();
 try{
   const state=await fetchJSON(mailUrl('status'));
   hideLogin();
   if(!state.configured){
     $('app').hidden=true;
     note('Dashboard-Anmeldung erfolgreich. Zum Abrufen der E-Mails fehlt noch das Postfach-Passwort von Polaris in der geschützten Vercel-Konfiguration.');
     status('E-Mail-Zugangsdaten fehlen');
     return;
   }
   $('app').hidden=false;
   status('Verbunden mit '+state.address);
   await refresh();
 }catch(e){
   if(e.status===401){showLogin();return;}
   if(e.status===503){note('Der Dashboard-Zugang ist noch nicht konfiguriert. Bitte die geschützte Vorschau-Konfiguration prüfen.');}
   else{note('Das Postfach ist zurzeit nicht verfügbar.');}
   status('Zugriff derzeit nicht möglich');
 }
}
$('loginForm').addEventListener('submit',async event=>{
 event.preventDefault();
 const btn=$('loginSubmit');btn.disabled=true;$('loginError').textContent='';
 try{
  await fetchJSON('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:$('loginPassword').value})});
  $('loginPassword').value='';
  await initializeMailbox();
 }catch(e){
  $('loginError').textContent=e.status===401?'Passwort nicht korrekt.':e.status===429?'Zu viele Versuche. Versuche es später erneut.':e.status===503?'Die Anmeldung ist serverseitig noch nicht bereit.':'Anmeldung fehlgeschlagen. Bitte versuche es erneut.';
 }finally{btn.disabled=false;}
});
initializeMailbox();
})();