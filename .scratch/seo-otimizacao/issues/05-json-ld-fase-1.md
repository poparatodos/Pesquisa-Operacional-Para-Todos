# 05: Dados estruturados JSON-LD (Fase 1)

**What to build:** As páginas emitem dados estruturados JSON-LD identificando o site como uma organização educacional, cada Disciplina como um curso e a trilha de navegação como breadcrumb, tornando-as elegíveis a rich results.

**Blocked by:** 03 (precisa das rotas de Disciplina/Aula e do descriptor). Observação: toca o mesmo módulo `src/seo/` do ticket 04 — na prática, sequenciar com o 04.

**Status:** ready-for-agent

- [ ] JSON-LD `EducationalOrganization` emitido para o site (nome, URL, logo)
- [ ] JSON-LD `Course` por Disciplina, com os campos exigidos pelo schema
- [ ] JSON-LD `BreadcrumbList` refletindo Site › Disciplina › Aula
- [ ] O JSON-LD sai no HTML pré-renderizado (verificável por `curl`/grep)
- [ ] `VideoObject` fica **fora de escopo** (Fase 2 — depende de enriquecer as Partes com duração/thumbnail)
- [ ] Testes Vitest: o JSON-LD de `Course` e de `BreadcrumbList` contém os campos obrigatórios
- [ ] `npm run test` e `npm run build` passam
