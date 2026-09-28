# 01: Tracer — SSG + módulo de SEO + home pré-renderizada

**What to build:** A home (`/`) passa a ser gerada como um HTML estático real em build time, com `<title>` e `<meta description>` próprios, provando o pipeline de ponta a ponta (SSG → head → módulo de SEO → teste). Prefactor foundational: adota `vite-ssg` como estratégia de renderização e `@unhead/vue` para aplicar os metadados, e cria o módulo puro de SEO onde toda a lógica de metadados vai viver.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] `vite-ssg` instalado e o bootstrap do app convertido para o entry de SSG, mantendo o roteamento e o tema atuais funcionando (respeita ADR 0001)
- [ ] `@unhead/vue` integrado; as views aplicam metadados via `useHead`, sem lógica de SEO dentro dos componentes
- [ ] Módulo puro em `src/seo/` expõe `headForRoute(routeName, params)` → `HeadDescriptor { title, description, canonical, og, jsonLd }` (nesta fatia, ao menos `title` e `description`)
- [ ] A home usa o descriptor; `npm run build` gera `dist/index.html` com `<title>` e `<meta description>` reais (verificável por `curl`/grep no HTML)
- [ ] Teste Vitest do módulo de SEO para a home, no estilo de `src/content/__tests__/validate.spec.ts`
- [ ] `npm run test` e `npm run build` passam
