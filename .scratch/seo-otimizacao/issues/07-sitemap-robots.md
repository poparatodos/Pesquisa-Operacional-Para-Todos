# 07: `sitemap.xml` + `robots.txt`

**What to build:** O site fica descobrível por buscadores: publica um `sitemap.xml` listando todas as rotas (com URLs absolutas no domínio de produção) e um `robots.txt` liberando o rastreamento e apontando para o sitemap.

**Blocked by:** 04 (as URLs do sitemap usam o domínio de produção e o base definidos no ticket 04).

**Status:** ready-for-agent

- [ ] `sitemap.xml` gerado no build cobrindo todas as rotas pré-renderizadas (home, Disciplinas e todas as Aulas), com URLs absolutas em `https://pesquisaoperacional.uniriotec.br/`
- [ ] `robots.txt` liberando o rastreamento e com a linha `Sitemap:` apontando para o sitemap publicado
- [ ] Ambos presentes na raiz do `dist/` após o build (verificável por `curl`)
- [ ] `npm run build` passa
