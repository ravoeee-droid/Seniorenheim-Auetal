'use strict';
const {send,goodOrigin,setCookie}=require('../../lib/auetal');
module.exports=(req,res)=>{
 if(req.method!=='POST'){res.setHeader('Allow','POST');return send(res,405,{error:'method_not_allowed'});}
 if(!goodOrigin(req))return send(res,403,{error:'origin_denied'});
 setCookie(res,'',0);
 return send(res,200,{authenticated:false});
};
