#!/usr/bin/env node
/* Run locally. Never commit its output or paste secrets into a chat. */
const crypto=require('node:crypto');
const password=crypto.randomBytes(24).toString('base64url');
const salt=crypto.randomBytes(16);
const hash=crypto.scryptSync(password,salt,64).toString('hex');
const sessionSecret=crypto.randomBytes(32).toString('hex');
console.log('SAVE THIS ONE-TIME ADMIN PASSWORD IN YOUR PASSWORD MANAGER:');
console.log(password);
console.log('\nSET THESE AS ENCRYPTED/SECRET VARIABLES IN VERCEL:');
console.log('AUETAL_ADMIN_PASSWORD_HASH='+salt.toString('hex')+':'+hash);
console.log('AUETAL_SESSION_SECRET='+sessionSecret);
console.log('\nDo not post these outputs online or commit them to git.');
