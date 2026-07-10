import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const order = ['formatos', 'midia', 'sobre', 'depoimentos', 'duvidas', 'agenda'];
const sections = {};

function extractSection(id) {
  const re = new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`, 'i');
  return html.match(re)?.[0] ?? null;
}

for (const id of ['formatos', 'midia', 'sobre', 'depoimentos', 'agenda']) {
  sections[id] = extractSection(id);
}

const faqRe = /<!-- FAQ[\s\S]*?<section(\s[^>]*)>([\s\S]*?)<\/section>\s*\n\s*<section id="agenda"/i;
const faqMatch = html.match(faqRe);
if (faqMatch) {
  sections.duvidas = `<section id="duvidas"${faqMatch[1]}>${faqMatch[2]}</section>`;
}

const start = html.indexOf('    <section id="sobre"');
const footerStart = html.indexOf('    <footer');
if (start === -1 || footerStart === -1) {
  console.error('Could not find section boundaries');
  process.exit(1);
}

const newBlock = order.map((id) => sections[id]).filter(Boolean).join('\n\n');
const updated = html.slice(0, start) + newBlock + '\n\n' + html.slice(footerStart);
fs.writeFileSync('index.html', updated);
console.log('Done:', order.filter((id) => sections[id]).join(' → '));
