# Spec: Otimização de SEO + CI/CD de produção

Status: ready-for-agent

## Problem Statement

O site "Pesquisa Operacional Para Todos" (projeto de extensão da UNIRIO) foi refatorado
para uma SPA Vue 3 + vue-router renderizada **100% no cliente**. O `index.html` publicado é
uma casca vazia (`<div id="app">`), sem conteúdo, sem `<meta description>`, sem Open Graph e
com um `<title>` único e estático para todas as rotas. Consequências:

- Crawlers (e especialmente Bing e os scrapers de card das redes sociais) recebem uma página
  vazia; o Google renderiza JS de forma lenta e não confiável.
- Toda rota se apresenta como "Pesquisa Operacional Para Todos" — a home, cada Disciplina e cada
  Aula têm o mesmo título e nenhuma descrição própria.
- Compartilhar um link no WhatsApp/LinkedIn não gera card decente (sem OG/imagem).
- Não há `sitemap.xml`, `robots.txt` nem dados estruturados.
- O `404.html` é uma cópia do `index.html`, então qualquer URL desconhecida responde conteúdo
  "200" (soft-404), que polui a indexação.

A versão antiga (site estático em produção) já tinha SEO ruim; a meta é subir a nova versão
**com SEO otimizado desde o primeiro deploy**, e automatizar a publicação para o servidor de
produção da UNIRIO.

## Solution

Do ponto de vista de quem usa o site e de quem o mantém:

1. **Cada rota vira uma página HTML real**, gerada em build time por SSG (`vite-ssg`), com seu
   próprio título, descrição, canonical, Open Graph e dados estruturados — de modo que um buscador
   ou um scraper de rede social veja o conteúdo sem precisar executar JavaScript.
2. **Cada Aula funciona como uma landing page** por palavra-chave (simplex, dualidade, Dijkstra,
   PERT/CPM, teoria dos jogos, ...), com título e descrição derivados do próprio conteúdo tipado.
3. **Compartilhar qualquer link** gera um card visual com imagem de marca.
4. **O site é descobrível**: `sitemap.xml` e `robots.txt` publicados, canonical apontando para o
   domínio de produção `https://pesquisaoperacional.uniriotec.br/`.
5. **URLs inválidas devolvem HTTP 404 de verdade**, não conteúdo mascarado de 200.
6. **Toda alteração aprovada em `main` sobe sozinha para produção** via CI/CD, e uma regressão de
   SEO quebra o build antes de chegar ao ar.

## User Stories

1. Como aluno de graduação buscando "algoritmo simplex aula" no Google, quero encontrar a página da
   Aula de Simplex do site, para estudar por um material aberto e gratuito.
2. Como aluno buscando "pesquisa operacional unirio" ou "po unirio", quero que o site apareça com um
   título e descrição que deixem claro que é o material de PO da UNIRIO, para reconhecer a fonte.
3. Como aluno, quero que cada Aula tenha um título de página específico (ex.: "Algoritmo Simplex — PO I
   | Pesquisa Operacional Para Todos"), para saber qual resultado abrir na lista de busca.
4. Como aluno, quero uma descrição por Aula nos resultados de busca, para decidir se aquela aula cobre
   o que preciso antes de clicar.
5. Como professor(a) procurando material aberto de PO para reusar, quero achar as Disciplinas e Aulas
   via busca, para indicar aos meus alunos.
6. Como pessoa compartilhando o link do site no WhatsApp, quero um card com imagem, título e descrição,
   para que o link não apareça "cru".
7. Como pessoa compartilhando um link de Aula específica no LinkedIn, quero que o card reflita aquela
   aula, para dar contexto de quem vê.
8. Como buscador (Googlebot), quero um `sitemap.xml` listando todas as rotas do site, para indexar todas
   as Aulas sem depender de crawling de links em JS.
9. Como buscador, quero um `robots.txt` que libere o rastreamento e aponte para o sitemap, para saber o
   que indexar.
10. Como buscador, quero uma tag `<link rel="canonical">` por página apontando para o domínio de
    produção, para não indexar duplicatas (ex.: ambiente de homologação no GitHub Pages).
11. Como buscador, quero dados estruturados JSON-LD identificando o site como `EducationalOrganization`
    e cada Disciplina como `Course`, para exibir rich results.
12. Como buscador, quero um `BreadcrumbList` estruturado (Site › Disciplina › Aula), para mostrar a
    trilha de navegação nos resultados.
13. Como buscador, quero (numa segunda fase) `VideoObject` por Parte de vídeo, para tornar as aulas
    elegíveis a rich results de vídeo.
14. Como visitante que digitou uma URL inexistente, quero receber uma página 404 de verdade (HTTP 404),
    para saber que a página não existe — e para que o buscador não indexe lixo.
15. Como mantenedor, quero que o título/descrição/OG de cada rota sejam **derivados automaticamente do
    conteúdo tipado**, para que adicionar uma nova Aula não exija escrever SEO à mão.
16. Como mantenedor, quero poder sobrescrever a descrição de SEO de uma Aula específica quando a
    descrição de conteúdo for fraca, via um campo opcional, sem reescrever o conteúdo.
17. Como mantenedor, quero que toda a lógica de SEO viva num único módulo puro, para testá-la em Vitest
    sem montar componentes.
18. Como mantenedor, quero que uma alteração aprovada em `main` publique automaticamente no servidor de
    produção da UNIRIO, para não depender de deploy manual.
19. Como mantenedor, quero que o ambiente de homologação (GitHub Pages) continue existindo em paralelo,
    para validar antes de subir para produção.
20. Como mantenedor, quero que o build do CI **falhe** se alguma rota ficar sem título/descrição únicos
    ou se a nota de SEO do Lighthouse cair abaixo de 100, para barrar regressões antes de produção.
21. Como mantenedor, quero as credenciais de SSH do servidor guardadas como GitHub Secrets, para não
    expor segredo no repositório.

## Implementation Decisions

### Renderização (SSG)

- Adotar **`vite-ssg`** para pré-renderizar todas as rotas em HTML estático em build time. Descartado
  migrar para Nuxt (reescrita desproporcional para conteúdo estático) e descartado manter CSR com meta
  injetada por JS (não resolve o crawler receber casca vazia). **Justifica um ADR novo — ver Further Notes.**
- As rotas dinâmicas de Aula (`/po1/:lessonId`, `/po2/:lessonId`, `/problemas/:lessonId`) são
  enumeradas a partir do conteúdo tipado (`content/`) e **cada `lessonId` é pré-renderizado** como um
  HTML próprio. A configuração de SSG deve gerar a lista de rotas incluídas a partir das Disciplinas.

### Origem canônica e base

- Domínio de produção canônico: **`https://pesquisaoperacional.uniriotec.br/`**.
- `VITE_BASE` de produção passa a ser **`/`** (hoje o CI usa `/Pesquisa-Operacional-Para-Todos/` para o
  Pages). Adicionar arquivo **`CNAME`** com o domínio. O GitHub Pages continua como **homologação**, com
  seu próprio base path, sem ser a origem canônica (canonical sempre aponta para o domínio de produção).

### Metadados por rota (módulo de SEO)

- Criar um módulo de SEO (seam único) que expõe uma função **pura** mapeando rota + conteúdo para um
  **`HeadDescriptor`** tipado: `{ title, description, canonical, og, jsonLd }`.
- As views consomem o descritor via **`@unhead/vue`** (`useHead`) — companion natural do `vite-ssg`.
  Nenhuma lógica de SEO nos componentes; eles apenas aplicam o descritor.
- **Derivação automática** a partir do conteúdo:
  - `title` de Aula: `"{título da Aula} — {título da Disciplina} | Pesquisa Operacional Para Todos"`.
  - `title` de Disciplina/home: variações análogas incluindo o nome do site.
  - `description`: usa a `description` da Aula; quando ausente/fraca, usa o novo campo opcional
    `seoDescription`.
- **Sem `<meta keywords>`** (ignorada pelo Google). Os termos-alvo ("pesquisa operacional", "po unirio",
  nomes de algoritmos/problemas) entram naturalmente em títulos, descrições e headings.

### Mudança no modelo de conteúdo

- Adicionar campo **opcional** `seoDescription?: string` a `Lesson` (Aula) e, se necessário, a
  `Discipline` (Disciplina), em `src/types/content.ts`. Preencher apenas onde a descrição atual for
  fraca; não é obrigatório para todas as Aulas.

### Dados estruturados (JSON-LD) — faseado

- **Fase 1** (dados que já existem): `EducationalOrganization` (site), `Course` (por Disciplina),
  `BreadcrumbList` (Site › Disciplina › Aula).
- **Fase 2** (requer enriquecer o conteúdo com duração/thumbnail das Partes): `VideoObject` por Parte de
  vídeo do YouTube. Fora do escopo da entrega inicial.

### Open Graph / imagem de compartilhamento

- Uma **OG image única de marca** (1200×630, logo UNIRIO + título) como asset estático, aplicada a todas
  as rotas via `og:image`. Variação por Disciplina fica para depois.
- Tags Open Graph e Twitter Card por rota (`og:title`, `og:description`, `og:url`, `og:image`,
  `twitter:card`), derivadas do mesmo `HeadDescriptor`.

### Sitemap, robots e 404

- Gerar **`sitemap.xml`** com todas as rotas pré-renderizadas, URLs absolutas no domínio de produção.
- **`robots.txt`** liberando rastreamento e apontando para o sitemap.
- **404 real**: o `.htaccess` de produção usa `ErrorDocument 404 /404.html` e **remove** a regra
  catch-all que hoje reescreve tudo para `index.html`. Todas as rotas legítimas existem como HTML
  pré-renderizado, então o catch-all de SPA deixa de ser necessário.

### CI/CD

- **Deploy de produção**: workflow disparado em `push` para `main` → `vite-ssg build` **no GitHub
  Actions** → envia o `dist/` para o `DocumentRoot` do servidor Apache da UNIRIO via **`rsync`/`scp`
  sobre SSH**. O servidor não precisa de Node (build acontece no CI). Credenciais SSH (host, usuário,
  chave privada) e o caminho do `DocumentRoot` ficam em **GitHub Secrets**.
- **Homologação**: workflow existente do GitHub Pages permanece (disparo manual / branches), como
  ambiente de teste.
- **Gate de qualidade** no pipeline, antes de publicar em produção:
  1. Script node pós-build varre o `dist/` e afirma que **cada rota tem `<title>` e `<meta
     description>` únicos** e um `<link rel="canonical">`.
  2. **Lighthouse CI** (`@lhci/cli`) roda sobre o `preview` do `dist/` e **falha o build se a nota de
     SEO for < 100**.

## Testing Decisions

- **O que é um bom teste aqui**: testar **comportamento externo**, não detalhes de implementação. Para o
  SEO, o comportamento observável é "dado uma rota/Aula, qual `HeadDescriptor` sai" — não como o objeto é
  montado internamente. Não assertar contra classes CSS internas nem estrutura de DOM de componentes.
- **Seam único de código**: o módulo de SEO (`src/seo/`), testado em **Vitest**. Casos:
  - cada Aula produz um `title` único e não vazio;
  - `description` cai para `seoDescription` quando a descrição de conteúdo está ausente;
  - `canonical` aponta para o domínio de produção com o path correto da rota;
  - o JSON-LD de `Course` e de `BreadcrumbList` contém os campos obrigatórios;
  - a lista de rotas para pré-renderização cobre todas as Aulas de todas as Disciplinas.
- **Prior art**: `src/content/__tests__/validate.spec.ts` e `src/content/__tests__/content.spec.ts`
  (funções puras sobre o conteúdo tipado) — o novo teste segue o mesmo estilo. Para o gate de artefato,
  o prior art é `scripts/validate-content.ts` (script node executado no CI).
- **Gate de integração (artefato, não seam de código)**: o script que varre o `dist/` e o Lighthouse CI
  rodam no pipeline; não são testes unitários de componente.
- **E2E**: opcionalmente, um teste Cypress (prior art em `cypress/e2e/navegacao.cy.ts`) pode verificar
  que `document.title` muda ao navegar entre rotas — mas a garantia primária de SEO é o HTML
  pré-renderizado verificado pelo gate de CI, não o comportamento em runtime.

## Out of Scope

- **`VideoObject` (JSON-LD de vídeo)** e o enriquecimento do conteúdo com duração/thumbnail das Partes —
  fica para uma fase 2.
- **OG image por Disciplina** — a entrega inicial usa uma imagem de marca única.
- **Ranqueamento real no Google** — é consequência, não critério de pronto; o critério objetivo é
  Lighthouse SEO = 100 + Rich Results válido + HTML pré-renderizado verificável.
- **Configuração de DNS/HTTPS** de `pesquisaoperacional.uniriotec.br` no servidor da UNIRIO — é
  pré-requisito de operação, fora do código (ver dependências em Further Notes).
- **Redirects/normalização de URLs legadas** do site antigo — não abordado aqui.

## Further Notes

### ADR recomendado

A troca **CSR → SSG (`vite-ssg`) por causa de SEO** é difícil de reverter, surpreende quem chega depois
e resulta de um trade-off real (Nuxt e CSR-com-meta-via-JS foram descartados). Deve ser registrada como
**`docs/adr/0003-ssg-para-seo.md`** (os ADRs atuais vão até 0002), respeitando o ADR 0001 (manter o
encanamento Vue: modelo `Disciplina → Aula → Parte/Material`, roteamento e testes).

### Dependências operacionais a confirmar antes do deploy de produção

- Caminho do `DocumentRoot` do Apache no servidor (destino do `rsync`).
- Host / usuário SSH + chave privada → cadastrar como GitHub Secrets.
- DNS de `pesquisaoperacional.uniriotec.br` apontando para o servidor com HTTPS válido (senão o
  canonical fica inválido).

### Glossário

Usar a linguagem do `CONTEXT.md`: **Disciplina** (PO I, PO II, Problemas Clássicos), **Aula**, **Parte**
(vídeo individual), **Material** (arquivo de apoio), **Problema Clássico** (modelado como Disciplina). No
código, os tipos correspondentes são `Discipline`, `Lesson`, `VideoPart`, `Material`.
