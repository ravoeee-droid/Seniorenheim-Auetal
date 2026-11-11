'use strict';
const crypto=require('node:crypto');
const {neon}=require('@neondatabase/serverless');
const STATES=['neu','kontakt','gespraech','hospitation','eingestellt','abgesagt','archiviert'];
const DB_READY=()=>Boolean(process.env.AUETAL_DATABASE_URL);
const ADMIN_READY=()=>Boolean(DB_READY()&&/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(process.env.AUETAL_ADMIN_PASSWORD_HASH||'')&&process.env.AUETAL_SESSION_SECRET&&process.env.AUETAL_SESSION_SECRET.length>=32);
const ACCEPTING=()=>Boolean(ADMIN_READY()&&process.env.AUETAL_ACCEPT_APPLICATIONS==='true');
const sql=()=>{if(!DB_READY())throw Error('auetal_db_not_configured');return neon(process.env.AUETAL_DATABASE_URL);};
const short=(v,max=160)=>typeof v==='string'?v.trim().slice(0,max):'';
const requestBody=req=>typeof req.body==='string'?JSON.parse(req.body):req.body||{};
const noStore=res=>{res.setHeader('Cache-Control','no-store, private');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');};
const send=(res,status,payload)=>{noStore(res);return res.status(status).json(payload);};
const goodOrigin=req=>{
 const host=(req.headers['x-forwarded-host']||req.headers.host||'').toLowerCase().split(',')[0].trim();
 const origin=req.headers.origin||req.headers.referer||'';
 if(!origin||!host)return false;
 try{const u=new URL(origin);return u.host.toLowerCase()===host&&u.protocol==='https:';}catch{return false;}
};
const cookieValue=req=>{const m=(req.headers.cookie||'').match(/(?:^|;\s*)auetal_admin_session=([^;]+)/);return m?decodeURIComponent(m[1]):'';};
const signature=(encoded,secret)=>crypto.createHmac('sha256',secret).update(encoded).digest('base64url');
const createSession=()=>{
 const issued=Date.now();
 const encoded=Buffer.from(JSON.stringify({v:1,sub:'auetal-admin',iat:issued,exp:issued+8*3600000})).toString('base64url');
 return encoded+'.'+signature(encoded,process.env.AUETAL_SESSION_SECRET);
};
const authorized=req=>{
 if(!ADMIN_READY())return false;
 const parts=cookieValue(req).split('.');if(parts.length!==2)return false;
 const expected=Buffer.from(signature(parts[0],process.env.AUETAL_SESSION_SECRET)),actual=Buffer.from(parts[1]);
 if(expected.length!==actual.length||!crypto.timingSafeEqual(expected,actual))return false;
 try{const d=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));return d.v===1&&d.sub==='auetal-admin'&&Date.now()<d.exp&&Date.now()>=d.iat-60000;}catch{return false;}
};
const passwordValid=password=>{
 if(!ADMIN_READY()||typeof password!=='string'||password.length>200)return false;
 const parts=process.env.AUETAL_ADMIN_PASSWORD_HASH.split(':');
 if(parts.length!==2||!/^[a-f0-9]{32}$/.test(parts[0])||!/^[a-f0-9]{128}$/.test(parts[1]))return false;
 const expected=Buffer.from(parts[1],'hex'),actual=crypto.scryptSync(password,Buffer.from(parts[0],'hex'),64);
 return actual.length===expected.length&&crypto.timingSafeEqual(actual,expected);
};
const setCookie=(res,value,maxAge=8*3600)=>res.setHeader('Set-Cookie','auetal_admin_session='+encodeURIComponent(value)+'; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age='+maxAge);
const throttleKey=(req,prefix)=>{
 const ip=String(req.headers['x-real-ip']||req.headers['x-forwarded-for']||'unknown').split(',')[0].slice(0,90);
 return crypto.createHmac('sha256',process.env.AUETAL_SESSION_SECRET||'disabled').update(prefix+'|'+ip).digest('hex');
};
const rateLimit=async(req,prefix,max,bucketSeconds)=>{
 const key=throttleKey(req,prefix),bucket=Math.floor(Date.now()/(bucketSeconds*1000));
 const rows=await sql().query('INSERT INTO auetal_rate_limits(key_hash,bucket,attempts) VALUES ($1,$2,1) ON CONFLICT(key_hash,bucket) DO UPDATE SET attempts=auetal_rate_limits.attempts+1 RETURNING attempts',[key,bucket]);
 return rows[0]?.attempts>max;
};
module.exports={STATES,DB_READY,ADMIN_READY,ACCEPTING,sql,short,requestBody,send,noStore,goodOrigin,authorized,createSession,passwordValid,setCookie,rateLimit};
