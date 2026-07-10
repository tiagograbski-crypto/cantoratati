# Tati Vanzan — Site Oficial

Site da cantora **Tati Vanzan** (pagode e sertanejo), com foco em conversão e reserva de datas.

## Stack

- HTML + CSS + JavaScript (Vite)
- Tailwind (CDN)
- Agenda local em `public/data/agenda.json`

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abre em: http://localhost:5173/

## Scripts úteis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Preview do build |
| `npm run images` | Otimização de imagens |

## Estrutura do projeto

```
├── index.html          # Página principal
├── css/main.css        # Estilos (tema dark premium)
├── js/                 # Lógica (agenda, UI, config)
├── public/data/        # Agenda JSON + favicon
├── assets/images/      # Imagens do site
├── scripts/            # Utilitários (assets, imagens)
├── vite.config.js      # Vite + API local da agenda
└── package.json
```

## Agenda (admin)

1. Rodar `npm run dev`
2. Clicar no cadeado no rodapé
3. Senha padrão: `1234` (alterar em `js/site-config.js`)
4. Marcar datas como **reservado** ou **indisponível**
5. Clicar em **Salvar agenda** → grava em `public/data/agenda.json`

## Repositório

https://github.com/tiagograbski-crypto/cantoratati
