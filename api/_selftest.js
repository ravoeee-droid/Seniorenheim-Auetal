'use strict';
/* Temporary, token-protected synthetic QA. Remove before client handoff. */
const crypto=require('node:crypto');
const candidate=require('./bewerbung');
const applicants=require('./admin/applicants');
const {createSession,sql}=require('../lib/auetal');
const eq=(a,b)=>{
 const x=Buffer.from(String(a||'')),y=Buffer.from(String(b||''));
 return x.length===y.length&&x.length>20&&crypto.timingSafeEqual(x,y);
};
const makeResponse=()=>{
 const headers={};
 return {
  headers,statusCode:200,data:null,
  setHeader(k,v){headers[k.toLowerCase()]=v;return this},
  status(n){this.statusCode=n;return this},
  json(v){this.data=v;return this},
  end(){return this}
 };
};
const call=async(handler,method,body,headers,query={})=>{
 const req={method,body,headers,query};const res=makeResponse();
 await handler(req,res);return res;
};
module.exports=async function(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='GET')return res.status(405).json({error:'method'});
 if(!eq(req.query?.token,process.env.AUETAL_E2E_TOKEN))return res.status(404).json({error:'not_found'});
 const host=req.headers.host;
 const common={host,origin:'https://'+host,'content-type':'application/json','x-real-ip':'127.0.0.1'};
 const admin={...common,cookie:'auetal_admin_session='+encodeURIComponent(createSession())};
 const report={database:false,create:false,read:false,update:false,delete:false,auth:false};
 let id;
 try {
  const db=await sql().query('SELECT to_regclass($1) AS t',['public.auetal_applicants']);
  report.database=Boolean(db[0]?.t);
  const payload={
   name:'Auetal SYNTHETISCHER Funktionstest',email:'test-auetal-qa@example.invalid',telephone:'',
   role:'Examinierte Pflegefachkraft',preferred_job:'Pflegefachkraft – Test',priority:'Ein gutes Team und verlässliche Führung',
   worktime:'Vollzeit',timing:'Möglichst bald',message:'Automatischer synthetischer Test, keine reale Bewerbung',
   privacy_acknowledged:true,website:'',utm_source:'integration-test'
  };
  const added=await call(candidate,'POST',payload,common);
  report.create=added.statusCode===201&&added.data?.success===true;
  if(!report.create){report.failure='create_'+added.statusCode+'_'+(added.data?.error||'');return res.status(200).json(report);}
  id=added.data.reference;
  const read=await call(applicants,'GET',null,admin,{});
  report.auth=read.statusCode===200;
  report.read=report.auth&&read.data?.rows?.some(r=>r.id===id);
  const changed=await call(applicants,'PATCH',{id,status:'kontakt',notes:'Synthetischer QA-Statuswechsel',follow_up_at:null},admin);
  report.update=changed.statusCode===200&&changed.data?.row?.status==='kontakt';
  const removed=await call(applicants,'DELETE',{id,confirm:'DELETE'},admin);
  report.delete=removed.statusCode===200&&removed.data?.deleted===true;
  if(report.delete)id=null;
  return res.status(200).json(report);
 } catch(e){
  report.failure='runtime_error';
  return res.status(200).json(report);
 } finally{
  if(id){try{await sql().query('DELETE FROM auetal_applicants WHERE id=$1',[id]);}catch(_){}}
 }
};