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
| `VITE_ADMIN_PIN` | Senha do painel admin |
| `VITE_ADMIN_HASH` | Hashtag secreta (padrão: `cantoratati-admin`) |
| `VITE_GITHUB_REPO` | `owner/repo` para publicar a agenda |

## Agenda (admin)

### Desenvolvimento local

1. `npm run dev`
2. Painel abre direto (dev) ou via `#cantoratati-admin`
3. Senha padrão: valor de `VITE_ADMIN_PIN` (`.env.local`, padrão `1234`)
4. **Salvar agenda** → grava em `public/data/agenda.json`

### Site publicado (GitHub Pages)

**URL do painel:** https://tiagograbski-crypto.github.io/cantoratati/#cantoratati-admin

1. Acesse o link acima (não há cadeado visível no site)
2. Digite a senha (`VITE_ADMIN_PIN` configurada nos Secrets do GitHub)
3. Cole um **Personal Access Token** do GitHub com permissão de escrita no repositório
4. Marque datas e clique em **Salvar agenda** → commit em `public/data/agenda.json` → deploy automático

**GitHub → Settings → Secrets → Actions:** crie `VITE_ADMIN_PIN` com a senha desejada.

**Token GitHub:** [Fine-grained PAT](https://github.com/settings/tokens) com *Contents: Read and write* no repo `cantoratati`. O token fica só na sessão do navegador, não no código.

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

## Repositório

https://github.com/tiagograbski-crypto/cantoratati
