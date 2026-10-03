// Re-embeds the CWO and PPM pages into index.html (CWO Dashboard / PPM Dashboard tabs).
// Run after editing either page:   node build-cwo.js
// The pages are inlined so the tabs work anywhere index.html is opened
// (GitHub Pages, file://, a downloaded copy) without needing the cwo/ or ppm/ folders.
const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, 'index.html');
const PAGES = [
  { file: path.join('cwo', 'cwo-dashboard.html'), start: '/*CWO_HTML_START*/', end: '/*CWO_HTML_END*/' },
  { file: path.join('ppm', 'ppm-dashboard.html'), start: '/*PPM_HTML_START*/', end: '/*PPM_HTML_END*/' }
];
let index = fs.readFileSync(indexPath, 'utf8');
for (const p of PAGES) {
  const src = path.join(__dirname, p.file);
  if (!fs.existsSync(src)) { console.warn(`Skipped ${p.file} (not found)`); continue; }
  const html = fs.readFileSync(src, 'utf8');
  const literal = JSON.stringify(html).replace(/</g, '\\u003c');
  const a = index.indexOf(p.start), b = index.indexOf(p.end);
  if (a < 0 || b < a) { console.error(`Markers for ${p.file} not found in index.html`); process.exit(1); }
  index = index.slice(0, a + p.start.length) + literal + index.slice(b);
  console.log(`Embedded ${html.length.toLocaleString()} chars of ${p.file}`);
}
fs.writeFileSync(indexPath, index);
