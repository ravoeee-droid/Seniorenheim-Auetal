'use strict';
const { ImapFlow } = require('imapflow');
const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');
const {ADMIN_READY,authorized,requestBody,send,goodOrigin,rateLimit} = require('../../lib/auetal');

const HOST = 'mail.polarismedia.de';
const MAIL_USER = () => (process.env.AUETAL_MAIL_USER || '').trim();
const MAIL_PASSWORD = () => process.env.AUETAL_MAIL_PASSWORD || '';
const configured = () => Boolean(MAIL_USER() && MAIL_PASSWORD() && ADMIN_READY());
const toAddress = value => typeof value === 'string' ? value.trim() : '';
const validAddress = value => /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value) && value.length <= 254;
const imapClient = () => new ImapFlow({
 host: HOST, port: 993, secure: true, auth: {user: MAIL_USER(), pass: MAIL_PASSWORD()},
 logger: false, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000,
 tls: {minVersion: 'TLSv1.2', rejectUnauthorized: true}
});
function address(entry) {
 if (!entry) return '';
 const o = Array.isArray(entry) ? entry[0] : entry;
 return o && o.address ? String(o.address).slice(0, 254) : '';
}
async function withInbox(fn) {
 const c = imapClient();
 try {
   await c.connect();
   const lock = await c.getMailboxLock('INBOX');
   try {return await fn(c);} finally {lock.release();}
 } finally {try {await c.logout();} catch {}}
}
function sanitizeSubject(s) {return typeof s === 'string' ? s.replace(/[\r\n\x00-\x1f]/g,' ').trim().slice(0, 180) : '';}
module.exports = async(req,res) => {
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Content-Security-Policy',"frame-ancestors 'none'");
 if(!ADMIN_READY()) return send(res,503,{error:'admin_not_configured'});
 if(!authorized(req)) return send(res,401,{error:'unauthorized'});
 if(req.method==='GET' && req.query?.mode==='status')return send(res,200,{configured:configured(),address:MAIL_USER(),host:HOST});
 if(!configured()) return send(res,503,{error:'mail_not_configured'});
 if(req.method==='GET') {
   try {
     if(req.query?.mode==='read'){
       const uid=Number(req.query?.uid);
       if(!Number.isSafeInteger(uid)||uid<1||uid>2147483647)return send(res,422,{error:'invalid_uid'});
       const message=await withInbox(async c=>{
         const m=await c.fetchOne(uid,{source:true,envelope:true},{uid:true});
         if(!m?.source)return null;
         if(m.source.length>2*1024*1024) return {uid,tooLarge:true};
         const parsed=await simpleParser(m.source,{skipHtmlToText:false,skipTextToHtml:true,maxHtmlLengthToParse:250000});
         return {uid,subject:sanitizeSubject(parsed.subject||''),from:parsed.from?.text?.slice(0,300)||'',
           fromAddress:parsed.from?.value?.[0]?.address||'',to:parsed.to?.text?.slice(0,400)||'',
           date:parsed.date||null,text:(parsed.text||'').slice(0,80000),
           messageId:typeof parsed.messageId==='string'?parsed.messageId.slice(0,240):'',
           attachments:(parsed.attachments||[]).map(a=>({filename:a.filename||'Anhang',size:a.size||0})).slice(0,20)};
       });
       return message?send(res,200,{message}):send(res,404,{error:'not_found'});
     }
     if(req.query?.mode!=='list')return send(res,400,{error:'invalid_mode'});
     const messages=await withInbox(async c=>{
       const total=c.mailbox.exists||0;
       if(!total)return [];
       const start=Math.max(1,total-39);
       const list=[];
       for await(const m of c.fetch(start+':'+total,{uid:true,envelope:true,flags:true,internalDate:true})){
         list.push({uid:m.uid,subject:sanitizeSubject(m.envelope?.subject||''),
           from:address(m.envelope?.from),fromName:String(m.envelope?.from?.[0]?.name||'').slice(0,100),
           date:m.internalDate||m.envelope?.date||null,unread:!m.flags?.has('\\Seen')});
       }
       return list.sort((a,b)=>b.uid-a.uid).slice(0,40);
     });
     return send(res,200,{messages});
   }catch(e){console.error('auetal_mail_read_failed',e?.code||e?.name||'unknown');return send(res,503,{error:'mail_unavailable'});}
 }
 if(req.method==='POST'){
   if(!goodOrigin(req))return send(res,403,{error:'origin_denied'});
   let d;try{d=requestBody(req);}catch{return send(res,400,{error:'invalid_json'});}
   const to=toAddress(d.to),subject=sanitizeSubject(d.subject),body=typeof d.text==='string'?d.text.trim():'';
   if(!validAddress(to)||!subject||!body||body.length>10000)return send(res,422,{error:'invalid_message'});
   if(/[\r\n]/.test(to))return send(res,422,{error:'invalid_recipient'});
   try{if(await rateLimit(req,'mail-send',20,3600))return send(res,429,{error:'send_limit'});}
   catch{return send(res,503,{error:'rate_limit_unavailable'});}
   const transport=nodemailer.createTransport({
     host:HOST,port:465,secure:true,auth:{user:MAIL_USER(),pass:MAIL_PASSWORD()},
     connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,
     tls:{minVersion:'TLSv1.2',rejectUnauthorized:true}
   });
   try{
     await transport.sendMail({from:MAIL_USER(),to,subject,text:body,
       ...(typeof d.inReplyTo==='string' && /^<[^<>\r\n]{1,230}>$/.test(d.inReplyTo)?{inReplyTo:d.inReplyTo}:{} )});
     return send(res,200,{sent:true});
   }catch(e){console.error('auetal_mail_send_failed',e?.code||e?.name||'unknown');return send(res,503,{error:'send_failed'});}
   finally{transport.close();}
 }
 res.setHeader('Allow','GET, POST');
 return send(res,405,{error:'method_not_allowed'});
};
