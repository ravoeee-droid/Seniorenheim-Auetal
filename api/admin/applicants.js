'use strict';
const {STATES,ADMIN_READY,authorized,sql,short,requestBody,send,goodOrigin}=require('../../lib/auetal');
const validUUID=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
module.exports=async(req,res)=>{
 if(!ADMIN_READY())return send(res,503,{error:'admin_not_configured'});
 if(!authorized(req))return send(res,401,{error:'unauthorized'});
 try{
   if(req.method==='GET'){
     const stage=short(req.query?.status,30);
     if(stage&&!STATES.includes(stage))return send(res,422,{error:'invalid_status'});
     const page=Math.max(0,Math.min(1000,parseInt(req.query?.page,10)||0));
     const offset=page*50;
     const rows=await sql().query(
       'SELECT id,created_at,updated_at,status,name,email,telephone,role,preferred_job,priority,worktime,timing,message,notes,source,utm_source,utm_medium,utm_campaign,utm_content,follow_up_at FROM auetal_applicants WHERE ($1::text = \'\' OR status=$1) ORDER BY created_at DESC LIMIT 50 OFFSET $2',
       [stage,offset]
     );
     const counts=await sql().query('SELECT status,COUNT(*)::int AS count FROM auetal_applicants GROUP BY status');
     const total=counts.reduce((acc,c)=>acc+Number(c.count),0);
     return send(res,200,{rows,counts,total,page});
   }
   if(req.method==='PATCH'){
     if(!goodOrigin(req))return send(res,403,{error:'origin_denied'});
     let d;try{d=requestBody(req);}catch{return send(res,400,{error:'invalid_json'});}
     if(!validUUID(d?.id)||!STATES.includes(d?.status))return send(res,422,{error:'invalid_fields'});
     const notes=short(d.notes,2000);
     let next=null;
     if(d.follow_up_at){
       const date=new Date(d.follow_up_at);
       if(Number.isNaN(date.getTime())||Math.abs(Date.now()-date.getTime())>2*365*86400000)return send(res,422,{error:'invalid_followup'});
       next=date.toISOString();
     }
     const prev=await sql().query('SELECT status FROM auetal_applicants WHERE id=$1',[d.id]);
     if(!prev.length)return send(res,404,{error:'not_found'});
     const rows=await sql().query(
       'UPDATE auetal_applicants SET status=$2,notes=$3,follow_up_at=$4,updated_at=now() WHERE id=$1 RETURNING id,status,notes,follow_up_at,updated_at',
       [d.id,d.status,notes,next]
     );
     if(prev[0].status!==d.status)await sql().query('INSERT INTO auetal_applicant_events(applicant_id,event_type,previous_status,new_status) VALUES($1,$2,$3,$4)',[d.id,'status_changed',prev[0].status,d.status]);
     return send(res,200,{success:true,row:rows[0]});
   }
   if(req.method==='DELETE'){
     if(!goodOrigin(req))return send(res,403,{error:'origin_denied'});
     let d;try{d=requestBody(req);}catch{return send(res,400,{error:'invalid_json'});}
     if(!validUUID(d?.id)||d.confirm!=='DELETE')return send(res,422,{error:'confirmation_required'});
     const rows=await sql().query('DELETE FROM auetal_applicants WHERE id=$1 RETURNING id',[d.id]);
     return send(res,200,{deleted:rows.length===1});
   }
   res.setHeader('Allow','GET, PATCH, DELETE');
   return send(res,405,{error:'method_not_allowed'});
 }catch(_){console.error('auetal_admin_query_failed');return send(res,503,{error:'service_unavailable'});}
};
