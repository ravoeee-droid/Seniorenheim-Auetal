(() => {
 const btn=document.getElementById('simulateLead'); const board=document.getElementById('pipelineBoard');
 btn?.addEventListener('click',()=>{
   const col=board?.querySelector('[data-stage="new"]'); if(!col) return;
   const card=document.createElement('div'); card.className='lead-card lead-new'; card.innerHTML='<strong>Demo Lead</strong><small>Pflegefachkraft · Social Ad</small><span>Gerade eben</span>';
   col.appendChild(card); const b=col.querySelector('header b'); if(b) b.textContent=String(Number(b.textContent||0)+1);
   btn.textContent='✓ Demo-Lead eingegangen'; setTimeout(()=>btn.textContent='+ Demo-Lead simulieren',1800);
 });
})();