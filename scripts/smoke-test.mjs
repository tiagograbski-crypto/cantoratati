import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const basePath = process.env.VITE_BASE_PATH || '/cantoratati/';
const errors = [];

function fail(message) {
  errors.push(message);
}

if (!existsSync(distDir)) {
  fail('dist/ não encontrado. Rode npm run build primeiro.');
} else {
  const indexPath = join(distDir, 'index.html');
  if (!existsSync(indexPath)) {
    fail('dist/index.html ausente.');
  } else {
    const html = readFileSync(indexPath, 'utf8');
    if (html.includes('cdn.tailwindcss.com')) fail('Build ainda referencia Tailwind CDN.');
    if (!html.includes(`${basePath}assets/`)) fail(`Build sem assets com base path ${basePath}`);
    if (html.includes('src="/js/main.js"') || html.includes('href="/css/main.css"')) {
      fail('Build ainda referencia arquivos fonte (/js ou /css) em vez do bundle.');
    }
    if (!html.includes('section-fit-value__divider')) {
      fail('HTML sem section-fit-value__divider (seções empilhadas).');
    }
    if (!html.includes('Pedir orçamento')) {
      fail('HTML sem CTA unificado "Pedir orçamento".');
    }
    if (!html.includes('id="admin-modal"')) {
      fail('HTML sem modal administrativo.');
    }
  }

  const agendaPath = join(distDir, 'data', 'agenda.json');
  if (!existsSync(agendaPath)) fail('dist/data/agenda.json ausente.');

  const assetsDir = join(distDir, 'assets');
  if (!existsSync(assetsDir)) {
    fail('dist/assets ausente.');
  } else {
    const assets = readdirSync(assetsDir);
    if (!assets.some((file) => file.endsWith('.css'))) fail('Bundle CSS ausente em dist/assets.');
    if (!assets.some((file) => file.endsWith('.js'))) fail('Bundle JS ausente em dist/assets.');
    const cssFile = assets.find((file) => file.endsWith('.css'));
    if (cssFile) {
      const css = readFileSync(join(assetsDir, cssFile), 'utf8');
      if (!css.includes('section-fit-value__divider')) {
        fail('CSS sem section-fit-value__divider.');
      }
      if (!css.includes('hero-layout') || !css.includes('grid-template-columns')) {
        fail('CSS sem hero split (grid) no desktop.');
      }
    }
    if (!assets.some((file) => file.endsWith('.jpg') || file.endsWith('.webp'))) {
      fail('Nenhuma imagem otimizada encontrada em dist/assets.');
    }
  }
}

if (errors.length) {
  console.error('Smoke test do build falhou:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Smoke test do build aprovado.');
