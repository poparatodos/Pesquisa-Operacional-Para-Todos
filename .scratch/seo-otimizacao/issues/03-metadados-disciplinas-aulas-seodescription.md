# 03: Metadados de Disciplinas e Aulas + campo `seoDescription`

**What to build:** Cada Disciplina (PO I, PO II, Problemas Clássicos) e cada Aula passam a ter seu próprio HTML pré-renderizado com título e descrição específicos, derivados automaticamente do conteúdo tipado. Uma Aula vira uma landing page por palavra-chave (simplex, dualidade, Dijkstra, PERT/CPM...). Onde a descrição de conteúdo for fraca, um campo opcional permite sobrescrever a descrição de SEO sem reescrever o conteúdo.

**Blocked by:** 01 (o módulo de SEO e o pipeline de SSG precisam existir).

**Status:** ready-for-agent

- [ ] `headForRoute` estendido para as rotas de Disciplina e de Aula; `title` de Aula no formato `"{Aula} — {Disciplina} | Pesquisa Operacional Para Todos"`
- [ ] Campo opcional `seoDescription?: string` adicionado a `Lesson` (e a `Discipline` se necessário) em `src/types/content.ts`; a `description` usa `seoDescription` como fallback quando a descrição de conteúdo é ausente/fraca
- [ ] A configuração de SSG enumera **todos os `lessonId`** de todas as Disciplinas a partir do `content/` e pré-renderiza cada Aula como HTML próprio
- [ ] `npm run build` gera, por ex., um HTML da Aula de Simplex (`/po1/aula-5`) com título/descrição específicos (verificável por `curl`/grep)
- [ ] **Sem** `<meta keywords>`; termos-alvo entram em títulos/descrições/headings
- [ ] Testes Vitest: cada Aula produz `title` único e não vazio; fallback para `seoDescription`; a lista de rotas de pré-render cobre todas as Aulas
- [ ] `npm run test` e `npm run build` passam
