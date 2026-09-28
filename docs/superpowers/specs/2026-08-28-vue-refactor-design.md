# Design — Reformulação do site "Pesquisa Operacional Para Todos" em Vue

**Data:** 2026-08-28
**Autor:** Lucas Motta (com apoio do Claude Code)
**Status:** Aprovação pendente

## 1. Contexto e objetivo

O site do projeto de extensão **Pesquisa Operacional Para Todos** (UNIRIO) está em
produção em <https://pesquisaoperacional.uniriotec.br/>, servido a partir do servidor
da universidade. Hoje é um site estático em HTML/CSS/JavaScript vanilla:

- `index.html` (Home) com menu lateral, hero banner, carrossel (Sobre / Instagram /
  Equipe) e rodapé.
- Páginas `pages/po1.html`, `pages/po2.html`, `pages/problemas.html` que carregam
  dados de `assets/data/*.json` via `assets/js/video-loader.js` e montam um accordion
  de aulas, cada uma com vídeos (iframes do YouTube), abas para múltiplas partes e
  links de download de slides `.pptx`.
- Cores UNIRIO (`--unirio-blue #003366`, `--secondary-blue #005A9C`, destaque
  `#FFC107`), fonte Poppins, ícones Lucide.

**Dores atuais:**

1. Responsividade mobile ruim — componentes quebram em telas pequenas.
2. Navegação dentro das disciplinas vira uma "lista infinita" quando várias aulas do
   accordion são abertas ao mesmo tempo.
3. Arquitetura difícil de manter/evoluir (JS vanilla, HTML duplicado por página,
   dois formatos de dados inconsistentes).

**Objetivo:** reescrever o site em Vue 3 com boas práticas, mantendo a identidade
visual (cores/tipografia), corrigindo o mobile de ponta a ponta, modernizando a
navegação e organizando o projeto para deploy no servidor da UNIRIO (com Docker mais
à frente) e um ambiente de validação no GitHub Pages via CI/CD.

A base de referência é o projeto **esf-rio.github.io** e seu stack.

## 2. Decisões tomadas (brainstorming)

| Tema | Decisão |
|------|---------|
| Framework/build | Vue 3 + Vite + **TypeScript** (igual ao esf-rio) |
| UI/CSS | **Bootstrap 5.3** + bootstrap-icons; paleta UNIRIO preservada via CSS variables; fonte Poppins |
| Vídeos | **Mantidos em streaming no YouTube**, mas com player redesenhado de aparência nativa (fachada lazy-load, `youtube-nocookie`, sem recomendados). Servidor da UNIRIO guarda só slides/materiais. |
| Conteúdo | **Arquivos de dados tipados** (módulos TS por disciplina) — sem CMS/backend |
| Navegação global | **Navbar no topo** (Bootstrap), responsiva; substitui o drawer lateral atual |
| Navegação na disciplina | **Sidebar de aulas + painel de conteúdo** (estilo docs); no mobile a lista colapsa num dropdown; aula selecionada refletida na URL |
| Deploy | **GitHub Pages = validação (CI/CD)**, **servidor UNIRIO = produção**; `base` do Vite por variável de ambiente; Docker depois |
| Testes | Cypress (e2e, como o esf-rio) + Vitest para unitários pontuais |

**Fora de escopo (YAGNI):** CMS, backend, Pinia/estado global, i18n, autenticação,
seção de "algoritmos Python para download" (mencionada no texto do "Sobre" mas ainda
inexistente; poderá ser adicionada depois com o mesmo modelo de conteúdo).

## 3. Stack e dependências

- **Runtime:** Vue 3 (`^3.5`), Vue Router (history mode).
- **Build:** Vite 6, TypeScript ~5.8, `vue-tsc` para type-check.
- **UI:** Bootstrap 5.3, bootstrap-icons, `@popperjs/core` (para navbar/offcanvas).
- **Testes:** Cypress (e2e), Vitest + `@vue/test-utils` (unitários pontuais).
- **Qualidade:** ESLint + Prettier (config padrão Vue).
- **Sem** Pinia, sem backend, sem biblioteca de UI adicional além do Bootstrap.

## 4. Estrutura de diretórios

Espelha o esf-rio: o app Vue vive em `website/`, deixando a raiz para documentação,
scripts e (depois) Docker.

```text
/
├── website/
│   ├── src/
│   │   ├── main.ts
│   │   ├── App.vue                 # shell: <AppNavbar/> + <RouterView/> + <AppFooter/>
│   │   ├── router/
│   │   │   └── index.ts            # rotas /, /po1/:lessonId?, /po2/:lessonId?, /problemas/:itemId?
│   │   ├── layout/
│   │   │   ├── AppNavbar.vue       # navbar topo, responsiva, link ativo
│   │   │   ├── AppFooter.vue
│   │   │   └── HeroBanner.vue      # banner reutilizável (título/subtítulo/logos)
│   │   ├── views/
│   │   │   ├── HomeView.vue
│   │   │   ├── DisciplinaView.vue  # genérica: recebe a disciplina e monta sidebar+painel
│   │   │   └── ProblemasView.vue   # reusa o mesmo padrão sidebar+painel
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── AboutSection.vue
│   │   │   │   ├── SocialSection.vue   # feed/link do Instagram
│   │   │   │   ├── TeamSection.vue
│   │   │   │   └── TeamCard.vue
│   │   │   ├── lessons/
│   │   │   │   ├── LessonSidebar.vue   # lista de aulas (desktop) / dropdown (mobile)
│   │   │   │   ├── LessonPanel.vue     # conteúdo da aula selecionada
│   │   │   │   └── MaterialList.vue    # links de slides/PDF
│   │   │   └── ui/
│   │   │       ├── LiteYouTube.vue     # fachada lazy do player do YouTube
│   │   │       └── VideoTabs.vue       # abas quando a aula tem múltiplas partes
│   │   ├── content/
│   │   │   ├── po1.ts               # dados tipados da PO I
│   │   │   ├── po2.ts               # dados tipados da PO II
│   │   │   └── problemas.ts         # dados dos problemas clássicos
│   │   ├── types/
│   │   │   └── content.ts           # interfaces Discipline, Lesson, VideoPart, Material
│   │   ├── assets/                  # logos, fotos da equipe, background (bundled)
│   │   └── styles/
│   │       ├── theme.css            # variáveis UNIRIO + overrides de Bootstrap
│   │       └── main.css             # imports globais
│   ├── public/
│   │   ├── .htaccess                # fallback SPA no Apache (produção UNIRIO)
│   │   ├── 404.html                 # fallback SPA no GitHub Pages (gerado no build)
│   │   └── materiais/
│   │       ├── po1/                 # slides .pptx/.pdf com nomes limpos (sem %20)
│   │       └── po2/
│   ├── cypress/                     # testes e2e
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   └── package.json
├── docs/                            # documentação (migra e amplia o README atual)
│   └── superpowers/specs/           # este documento e futuros specs
├── scripts/
│   └── validate-content.ts          # checa IDs de vídeo/arquivos faltando no conteúdo
└── (futuro) Dockerfile, docker/nginx.conf
```

## 5. Modelo de conteúdo

Unifica os dois formatos inconsistentes de hoje (`youtubeId` solto vs `subVideos`,
`slidesUrl` string vs array) num modelo único e tipado.

```ts
// types/content.ts
export interface Material {
  title: string;
  url: string;        // caminho em /materiais/... ou URL externa
}

export interface VideoPart {
  title: string;      // ex.: "Parte 1 - Teoria"
  youtubeId: string;
}

export interface Lesson {
  id: string;         // slug estável usado na URL, ex.: "aula-5"
  number: number;     // ordem de exibição
  title: string;
  description?: string;
  topics?: string;
  videos: VideoPart[];    // 0+ partes; vazio = "em breve"
  materials: Material[];  // 0+ materiais
}

export interface Discipline {
  slug: string;       // "po1" | "po2" | "problemas"
  title: string;      // "Pesquisa Operacional I"
  subtitle: string;
  lessons: Lesson[];
}
```

- Os arquivos `content/*.ts` exportam objetos `Discipline` já tipados — editar conteúdo
  = mexer num arquivo, com autocomplete e validação de tipo.
- `scripts/validate-content.ts` (rodável em CI) verifica: IDs de vídeo ausentes/placeholder
  (ex.: `CODIGO_DO_VIDEO_2`), materiais apontando para arquivos inexistentes em
  `public/materiais/`, slugs duplicados.
- Migração: os `assets/data/*.json` atuais são convertidos para esse formato; os
  placeholders de vídeo hoje existentes ficam com `videos: []` (renderiza "em breve").

## 6. Roteamento

Vue Router em history mode:

| Rota | View | Observação |
|------|------|------------|
| `/` | HomeView | Sobre + Instagram + Equipe |
| `/po1/:lessonId?` | DisciplinaView(po1) | sem `lessonId` → primeira aula |
| `/po2/:lessonId?` | DisciplinaView(po2) | |
| `/problemas/:itemId?` | ProblemasView | mesmo padrão sidebar+painel |
| `*` | NotFound → Home | fallback |

- `lessonId` = slug da aula, refletido na URL para links compartilháveis.
- **SPA fallback:** GitHub Pages usa o truque de `404.html` (cópia do `index.html`);
  produção roda em **Apache**, então usa um `.htaccess` com `mod_rewrite`
  (`RewriteRule . index.html`) para servir o `index.html` em qualquer rota. O
  `.htaccess` fica em `public/` para ser copiado no build. Atenção ao `RewriteBase`
  e ao `base`/`<base href>` casarem com o caminho onde o site é servido.

## 7. Layout, identidade visual e mobile

Mobile é o foco central — Bootstrap 5 (grid + utilitários responsivos) é a principal
alavanca.

- **AppNavbar:** navbar fixa no topo com logos UNIRIO à esquerda e links
  (Home / PO I / PO II / Problemas) à direita; no mobile colapsa em hambúrguer
  (`navbar-toggler` + `collapse`), com o link da rota atual destacado.
- **HeroBanner:** reutilizável, mantém o gradiente/identidade atual, mas com tamanhos
  fluidos (`clamp()`) para não quebrar em telas pequenas.
- **Tema:** `styles/theme.css` define as CSS variables UNIRIO e sobrescreve tokens do
  Bootstrap (`--bs-primary` etc.) para casar com a paleta. Fonte Poppins via Google Fonts.
- **Mobile-first:** todos os componentes começam pela largura estreita e escalam para
  cima; grid da equipe colapsa para 1 coluna; vídeos em `ratio 16:9`.

## 8. Navegação e conteúdo da disciplina

`DisciplinaView` recebe um `Discipline` e monta:

- **LessonSidebar** — lista das aulas.
  - **Desktop:** coluna fixa à esquerda; a aula ativa fica destacada; clicar navega
    para `/{slug}/{lessonId}`.
  - **Mobile:** vira um dropdown/seletor no topo (ou offcanvas) mostrando a aula atual;
    abrir lista as aulas para seleção. Nunca empilha conteúdo → acaba a "lista infinita".
- **LessonPanel** — conteúdo da aula selecionada:
  - Título, descrição, tópicos.
  - **Vídeo:** `LiteYouTube` (1 parte) ou `VideoTabs` de `LiteYouTube` (múltiplas partes).
  - **MaterialList:** links de download dos slides/materiais.

Só uma aula é exibida por vez; a navegação é por seleção, não por empilhamento.

## 9. Player de vídeo redesenhado

`LiteYouTube.vue`:

- Renderiza uma **fachada leve**: thumbnail (`https://i.ytimg.com/vi/{id}/hqdefault.jpg`)
  + botão de play. Nenhum iframe é carregado até o clique → carregamento inicial rápido
  (crucial no mobile).
- Ao clicar, injeta o iframe
  `https://www.youtube-nocookie.com/embed/{id}?rel=0&modestbranding=1&autoplay=1`,
  em container `ratio ratio-16x9`, com `loading="lazy"` e `title` acessível.
- `VideoTabs.vue` gerencia múltiplas partes; troca de aba não recarrega a página e
  mantém acessibilidade (roles/aria de tablist).

## 10. Deploy e CI/CD

- **`base` do Vite por ambiente:** `/` em produção (domínio próprio UNIRIO),
  subpath do repositório no GitHub Pages. Controlado por variável de ambiente no build.
- **GitHub Actions (validação):** em cada push/PR → instala, type-check, lint, build,
  (e2e opcional) e publica o `dist/` no **GitHub Pages**.
- **Produção (UNIRIO):** `npm run build` gera `dist/` estático que é servido pelo
  **Apache** da universidade. Como os vídeos ficam no YouTube, o servidor hospeda apenas
  o site estático + a pasta `materiais/` (slides) — sem arquivos pesados.
- **SPA fallback** configurado nos dois ambientes (`404.html` no Pages / `.htaccess`
  com `mod_rewrite` no Apache).

## 11. Docker (fase posterior)

Deixar o caminho pronto, ativar quando for containerizar o deploy na UNIRIO:

- `Dockerfile` multi-stage: estágio Node builda o app → estágio servidor estático serve
  o `dist/`. Como a produção da UNIRIO é Apache, usar a imagem **`httpd` (Apache)** no
  container mantém a paridade com produção (mesmo comportamento de `.htaccess`); nginx é
  alternativa possível.
- Config do servidor com fallback SPA (Apache: `.htaccess`/`mod_rewrite`), MIME e cache
  de assets.
- Espelha a organização `docker/` do esf-rio.

## 12. Migração e consolidação de assets

- **Slides/materiais:** mover os `.pptx`/`.ppt` de `assets/slides/po1|po2` para
  `website/public/materiais/po1|po2`, **renomeando** para remover espaços/`%20` e
  acentos problemáticos; atualizar as URLs no conteúdo tipado.
- **Imagens:** logos, fotos da equipe e background migram para `src/assets` (bundled/
  otimizados pelo Vite) ou `public/` quando fizer sentido.
- **Dados:** converter `po1_videos.json` / `po2_videos.json` para `content/po1.ts` /
  `content/po2.ts` no novo modelo; corrigir a página de Problemas Clássicos (hoje aponta
  erroneamente para `po2_videos.json`) com seu próprio `content/problemas.ts`.
- **Vídeos:** permanecem no YouTube — a "coleta/consolidação" se resume a garantir que
  todos os `youtubeId` estão preenchidos (o validador acusa faltantes).

## 13. Testes

- **Vitest (unitário):** modelo de conteúdo/validador, `LiteYouTube` (fachada → iframe
  no clique), seleção de aula no `LessonSidebar`.
- **Cypress (e2e):** navegação pela navbar entre disciplinas; seleção de aula pela
  sidebar (desktop) e pelo dropdown (mobile, viewport reduzido); download de material;
  deep-link `/po1/aula-5` abrindo a aula certa.
- Um smoke test de responsividade em viewport mobile para as telas principais.

## 14. Estratégia de execução (alto nível)

Sequência sugerida (detalhada depois no plano de implementação):

1. Scaffold do projeto Vite+Vue+TS+Bootstrap em `website/`, tema UNIRIO, ESLint/Prettier.
2. Layout base: `AppNavbar`, `AppFooter`, `HeroBanner`, roteador com as rotas vazias.
3. Modelo de conteúdo (`types/` + `content/`) + migração dos dados + validador.
4. HomeView (Sobre / Instagram / Equipe) responsiva.
5. DisciplinaView com `LessonSidebar` + `LessonPanel`; `LiteYouTube` + `VideoTabs`;
   `MaterialList`. Reuso em ProblemasView.
6. Consolidação de assets/materiais e correção da página de Problemas.
7. CI/CD para GitHub Pages + configuração de `base` por ambiente + SPA fallback.
8. Testes (Vitest + Cypress) e passada final de responsividade.
9. (Posterior) Docker + deploy de produção na UNIRIO.

## 15. Riscos e pontos de atenção

- **Roteamento SPA no servidor UNIRIO:** produção é **Apache** (confirmado) → fallback
  via `.htaccess`/`mod_rewrite`; validar que `AllowOverride` está habilitado no diretório
  do site (senão o `.htaccess` é ignorado) e que `base`/`RewriteBase` casam com o caminho.
- **Capacidade/pptx grandes:** materiais continuam pequenos; sem risco de storage.
- **Instagram:** decidido trocar o widget Elfsight (pesado no mobile) por um **cartão/
  link estático** para o perfil; feed ao vivo pode ser reavaliado depois.
- **IDs de vídeo faltando:** há placeholders no JSON atual; o validador precisa acusá-los
  para não publicar aulas quebradas.
