# 04: Canonical + Open Graph + OG image + domínio/base

**What to build:** Cada página pré-renderizada aponta para a origem canônica de produção e gera um card visual ao ser compartilhada em redes sociais. Define o domínio de produção como canônico e ajusta o base path do build.

**Blocked by:** 03 (todas as rotas — Disciplinas e Aulas — precisam existir para receberem canonical/OG).

**Status:** ready-for-agent

- [ ] `VITE_BASE` de produção passa a ser `/` (o GitHub Pages permanece como homologação com seu próprio base); arquivo `CNAME` com `pesquisaoperacional.uniriotec.br` adicionado
- [ ] `<link rel="canonical">` por rota apontando para `https://pesquisaoperacional.uniriotec.br/` + o path da rota, mesmo quando servido em homologação
- [ ] Tags Open Graph e Twitter Card por rota (`og:title`, `og:description`, `og:url`, `og:image`, `twitter:card`) derivadas do mesmo `HeadDescriptor`
- [ ] Uma OG image única de marca (1200×630, logo UNIRIO + título) como asset estático, referenciada em `og:image` por todas as rotas
- [ ] Verificável: cada HTML em `dist/` tem canonical + `og:*` + `og:image`
- [ ] Testes Vitest: `canonical` aponta para o domínio de produção com o path correto da rota
- [ ] `npm run test` e `npm run build` passam
