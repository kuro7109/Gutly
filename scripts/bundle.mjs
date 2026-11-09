// Rebuilds index.html and mobile/index.html from src/*.src.html, embedding the mascot images.
// Usage: npm run bundle
import { readFileSync, writeFileSync } from 'node:fs';
const names = ['happy','calm','excited','stressed','sad','angry','anxious','tired'];
const M = Object.fromEntries(names.map(n => [n, 'data:image/webp;base64,' + readFileSync(`assets/mascot/${n}.webp`).toString('base64')]));
const head = base => `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="theme-color" content="#F28C38">\n<link rel="icon" href="${base}favicon.ico" sizes="any">\n<link rel="apple-touch-icon" href="${base}assets/icon-180.png">\n<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n</head>\n<body>\n`;
for (const [src, out, base] of [['src/web.src.html', 'index.html', ''], ['src/mobile.src.html', 'mobile/index.html', '../']]) {
  const s = readFileSync(src, 'utf8');
  if (!s.includes('/*MASCOTS*/{}')) throw new Error('Mascot placeholder missing in ' + src);
  writeFileSync(out, head(base) + s.replace('/*MASCOTS*/{}', () => JSON.stringify(M)) + '\n</body>\n</html>\n');
  console.log('wrote', out);
}
