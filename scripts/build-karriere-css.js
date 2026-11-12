'use strict';
// Bündelt alle Stylesheets der Karrierewelt in eine Datei (ein Request statt 21).
// Aufruf: node scripts/build-karriere-css.js
const fs = require('node:fs'), path = require('node:path');
const root = path.join(__dirname, '..', 'assets');
const order = [
  'styles-1.css','styles-2.css','styles-3.css','styles-4.css','styles-5.css',
  'premium/part-1.css','premium/part-2.css','premium/part-3.css','premium/part-4.css',
  'premium/part-5.css','premium/part-6.css','premium/part-7.css','premium/part-8.css',
  'karriere-lesbarkeit.css','karriere-barrierefreiheit.css','auetal-teamstimmen.css',
  'auetal-funnel.css','auetal-karrierevideo.css','karriere-final.css'
];
const css = order.map(f => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) return '';
  return `/* ---- ${f} ---- */\n` + fs.readFileSync(p, 'utf8').replace(/@import[^;]+;/g, '').trim();
}).join('\n');
fs.writeFileSync(path.join(root, 'karriere.bundle.css'), css + '\n');
console.log('karriere.bundle.css', (css.length/1024).toFixed(0), 'KB');
