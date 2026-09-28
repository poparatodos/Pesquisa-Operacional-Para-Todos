# 02: ADR 0003 — SSG para SEO

**What to build:** Registrar formalmente a decisão de trocar renderização no cliente (CSR) por Static Site Generation (`vite-ssg`) por causa de SEO, para que quem chegar depois entenda o porquê. É documentação de uma decisão já tomada; pode ser escrita de imediato.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Criado `docs/adr/0003-ssg-para-seo.md` no mesmo formato dos ADRs 0001 e 0002
- [ ] Contexto: SPA CSR entrega casca vazia; crawlers/scrapers não veem conteúdo; título único para todas as rotas
- [ ] Decisão: adotar `vite-ssg` (pré-render por rota em build time) + `@unhead/vue`
- [ ] Alternativas descartadas e o porquê: migrar para Nuxt (reescrita desproporcional) e manter CSR com meta injetada por JS (não resolve o crawler receber casca vazia)
- [ ] Deixa explícito que o encanamento do ADR 0001 é mantido (modelo `Disciplina → Aula → Parte/Material`, roteamento, testes)
