'use strict';
const {ADMIN_READY,requestBody,send,goodOrigin,authorized,passwordValid,createSession,setCookie,rateLimit}=require('../../lib/auetal');
module.exports=async(req,res)=>{
 if(req.method==='GET')return send(res,200,{configured:ADMIN_READY(),authenticated:authorized(req)});
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return send(res,405,{error:'method_not_allowed'});}
 if(!ADMIN_READY())return send(res,503,{error:'admin_not_configured'});
 if(!goodOrigin(req))return send(res,403,{error:'origin_denied'});
 let d;try{d=requestBody(req);}catch{return send(res,400,{error:'invalid_json'});}
 try{
   if(await rateLimit(req,'admin-login',8,900))return send(res,429,{error:'temporarily_locked'});
 }catch{console.error('auetal_auth_db_unavailable');return send(res,503,{error:'service_unavailable'});}
 if(!passwordValid(d?.password))return send(res,401,{error:'invalid_credentials'});
 setCookie(res,createSession());
 return send(res,200,{authenticated:true});
};
