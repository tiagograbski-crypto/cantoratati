# Tati Vanzan — Site Oficial

Site da cantora **Tati Vanzan** (pagode e sertanejo), com foco em conversão e reserva de datas.

## Stack

- Vite 6 + HTML/CSS/JS
- Tailwind CSS (build-time, sem CDN)
- Agenda em `public/data/agenda.json`
- Deploy automático via GitHub Actions → GitHub Pages

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre em: http://localhost:5173/

Variáveis em `.env.local`:

| Variável | Descrição |
|---|---|
| `VITE_BASE_PATH` | `/` no dev local |
| `VITE_ADMIN_ENABLED` | `true` para painel admin |
| `VITE_ADMIN_PIN` | Senha do admin (somente dev) |

## Produção

**URL:** https://tiagograbski-crypto.github.io/cantoratati/

Cada push em `main` executa:

1. `npm run build` (bundle em `dist/`)
2. `npm run build:check` (smoke test)
3. Deploy oficial do GitHub Pages (artefato `dist/`)

**Configuração única no GitHub:** Settings → Pages → Source: **GitHub Actions**.

Preview local idêntico ao ar:

```bash
npm run build
npm run preview
```

Abre em: http://localhost:4173/cantoratati/

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run build:check` | Valida `dist/` antes do deploy |
| `npm run ci` | Build + validação (usado na CI) |
| `npm run preview` | Preview do build |
| `npm run images` | Otimização de imagens |

## Estrutura

```
├── index.html
├── css/main.css
├── js/
├── public/data/agenda.json
├── assets/images/
├── scripts/
├── vite.config.js
└── .github/workflows/deploy-pages.yml
```

## Agenda (admin — apenas local)

1. `npm run dev` com `VITE_ADMIN_ENABLED=true`
2. Cadeado no rodapé
3. Marcar datas como **reservado** ou **indisponível**
4. **Salvar agenda** → grava em `public/data/agenda.json`

Em produção o admin fica **desativado** por segurança.

## Repositório

https://github.com/tiagograbski-crypto/cantoratati
