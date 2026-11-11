'use strict';
const {ACCEPTING,sql,short,requestBody,send,goodOrigin,rateLimit}=require('../lib/auetal');
const emailValid=e=>!e||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
const roleAllowed=new Set(['Examinierte Pflegefachkraft','Examinierte Pflegefachkraft – Wiedereinstieg','Pflegefachkraft mit Zusatzqualifikation','Noch unsicher – erst kennenlernen']);
const workAllowed=new Set(['Vollzeit','Teilzeit','Nachtdienst interessant','Noch offen – erst sprechen']);
const timingAllowed=new Set(['Möglichst bald','In den nächsten Wochen','Später – ich informiere mich','Erst einmal unverbindlich sprechen']);
const priorityAllowed=new Set(['Familie & Arbeitszeit besser verbinden','Ein gutes Team und verlässliche Führung','Entwicklung & Weiterbildung','Weniger Bürokratie / mehr Zeit für Menschen']);
module.exports=async(req,res)=>{
 if(req.method==='GET'){
   let ready=ACCEPTING();
   if(ready){try{const rows=await sql().query("SELECT to_regclass('public.auetal_applicants') AS table_name");ready=Boolean(rows[0]?.table_name);}catch{ready=false;}}
   return send(res,200,{ready});
 }
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return send(res,405,{error:'method_not_allowed'});}
 if(!ACCEPTING())return send(res,503,{error:'application_delivery_not_ready'});
 if(!goodOrigin(req))return send(res,403,{error:'origin_denied'});
 if(!String(req.headers['content-type']||'').startsWith('application/json'))return send(res,415,{error:'content_type'});
 if(Number(req.headers['content-length']||0)>9000)return send(res,413,{error:'too_large'});
 let d;try{d=requestBody(req);}catch{return send(res,400,{error:'invalid_json'});}
 if(!d||typeof d!=='object'||Array.isArray(d)||JSON.stringify(d).length>8000)return send(res,413,{error:'invalid_body'});
 if(short(d.website,100))return send(res,200,{success:true}); // Honeypot; no applicant created.
 const name=short(d.name,120),email=short(d.email,180),telephone=short(d.telephone,50);
 const role=short(d.role,140),preferredJob=short(d.preferred_job,140);
 const priority=short(d.priority,160),worktime=short(d.worktime,80),timing=short(d.timing,120);
 const message=short(d.message,1500),source='Karrierewelt';
 const utmSource=short(d.utm_source,100),utmMedium=short(d.utm_medium,100),utmCampaign=short(d.utm_campaign,120),utmContent=short(d.utm_content,120);
 if(name.length<2||!roleAllowed.has(role)||!priorityAllowed.has(priority)||!workAllowed.has(worktime)||!timingAllowed.has(timing)||!emailValid(email)||(!email&&telephone.replace(/\D/g,'').length<6)||d.privacy_acknowledged!==true)
   return send(res,422,{error:'invalid_fields'});
 // No IP, name, email, phone or message is ever emitted into logs or analytics.
 try{
   if(await rateLimit(req,'candidate',6,1800))return send(res,429,{error:'too_many_requests'});
   const rows=await sql().query(
     'INSERT INTO auetal_applicants(name,email,telephone,role,preferred_job,priority,worktime,timing,message,source,utm_source,utm_medium,utm_campaign,utm_content) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id',
     [name,email,telephone,role,preferredJob,priority,worktime,timing,message,source,utmSource,utmMedium,utmCampaign,utmContent]
   );
   return send(res,201,{success:true,reference:rows[0]?.id});
 }catch(err){console.error('auetal_application_submission_failed');return send(res,503,{error:'service_unavailable'});}
};
