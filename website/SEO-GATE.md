# Gate de SEO no CI (ticket 08)

O pipeline barra regressões de SEO antes de publicar. Rodam **sobre o `dist/`**
(o mesmo artefato de build usado em homologação/produção), depois do `npm run
build`, no `.github/workflows/deploy-pages.yml`. Nenhum deles altera a lógica de
SEO em `src/seo` — apenas leem e validam o artefato.

## 1. dist-scan — `npm run seo:gate`

`scripts/seo-gate.ts` (via vite-node). Reaproveita `ssgRoutes()` (`src/seo`) — a
mesma enumeração de rotas do SSG e do sitemap — e, para cada página HTML de rota,
afirma:

- `<title>` presente, não vazio e **único** entre as rotas;
- `<meta name="description">` presente e não vazio;
- `<link rel="canonical">` presente.

Sai com código ≠ 0 e lista as páginas que falharem. A `dist/404.html` fica fora
de propósito (reaproveita o title/description da home e não é rota de conteúdo).

Regressão verificada manualmente: remover ou duplicar um `<title>` no `dist/` faz
o gate sair com código 1 e apontar a rota; restaurado, volta a 0.

## 2. Lighthouse CI — `npm run seo:lighthouse`

`@lhci/cli` (devDependency) com `lighthouserc.json`: `lhci autorun` serve o
`dist/` (`collect.staticDistDir`), audita **apenas a categoria SEO**
(`onlyCategories`) e **falha o build se a nota de SEO for < 1.0 (100)**
(`assert` → `categories:seo` = `error`, `minScore: 1`). Resultados ficam em
`.lighthouseci/` (gitignored); `upload.target: filesystem` evita qualquer envio
para serviço externo.

### Rodar localmente

Requer Chrome/Chromium instalado. No **Windows** o run pode terminar com
`EPERM ... Permission denied ... Temp\lighthouse.*` no encerramento do Chrome
(bug conhecido do `chrome-launcher` ao apagar o diretório temporário; o Node
resolve `os.tmpdir()` no load, então redefinir `TMP/TEMP` não contorna). **As
auditorias de SEO em si rodam e pontuam 1.0** — a falha é só na limpeza do temp.
No runner `ubuntu-latest` (que já traz Chrome) o passo roda sem esse problema;
`chromeFlags: --no-sandbox --headless=new` cobrem o ambiente de CI.
