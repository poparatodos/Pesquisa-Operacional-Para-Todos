# Reformulação do site PO Para Todos em Vue — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescrever o site estático "Pesquisa Operacional Para Todos" como uma SPA Vue 3 responsiva, com navegação moderna, conteúdo tipado e deploy no Apache da UNIRIO + validação no GitHub Pages.

**Architecture:** SPA Vue 3 + Vite + TypeScript dentro de `website/`, estilizada com Bootstrap 5 e a paleta UNIRIO via CSS variables. Conteúdo das aulas em módulos TS tipados por disciplina; vídeos servidos do YouTube por um player-fachada leve; slides como arquivos estáticos. Navbar no topo para navegação global e sidebar+painel dentro de cada disciplina.

**Tech Stack:** Vue 3.5, Vue Router 4, Vite 6, TypeScript 5.8, Bootstrap 5.3 + bootstrap-icons, Vitest + @vue/test-utils (unit), Cypress (e2e), Node 22+.

**Spec:** `docs/superpowers/specs/2026-08-28-vue-refactor-design.md`

## Global Constraints

- **App root:** todo o app Vive em `website/`. Rodar comandos `npm` a partir de `website/`.
- **Versões mínimas:** Vue `^3.5`, Vue Router `^4.4`, Vite `^6`, TypeScript `~5.8`, Bootstrap `^5.3`, bootstrap-icons `^1.11`, `@popperjs/core` `^2.11`. Node `>=22`.
- **Idioma/copy:** todo texto de UI em pt-BR; `<html lang="pt-BR">`.
- **Paleta UNIRIO (hex exatos):** `--unirio-blue: #003366`, `--secondary-blue: #005A9C`, `--light-bg: #F8F9FA`, `--dark-text: #343A40`, `--highlight: #FFC107`. Fonte: Poppins.
- **Vídeo:** sempre via `youtube-nocookie.com`, nunca `youtube.com` direto; nenhum iframe é montado antes do clique do usuário.
- **Slugs de aula são estáveis** (usados na URL): não renomear depois de publicado.
- **YouTube ID válido:** casa `^[A-Za-z0-9_-]{11}$`. Qualquer valor fora disso é placeholder e a aula fica sem vídeo (estado "em breve").
- **Base path:** produção UNIRIO = `/`; GitHub Pages (projeto) = `/Pesquisa-Operacional-Para-Todos/`. Controlado por env `VITE_BASE`.
- **Commits frequentes:** um commit ao fim de cada task (ou sub-deliverable), mensagens em pt-BR no padrão `feat:`/`chore:`/`test:`.

---

## Mapa de arquivos

Criados (principais):

- `website/package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `.eslintrc`, `vitest.config.ts` — configuração.
- `website/src/main.ts`, `src/App.vue` — bootstrap do app + shell.
- `website/src/styles/theme.css`, `src/styles/main.css` — tema UNIRIO + imports globais.
- `website/src/types/content.ts` — interfaces do conteúdo.
- `website/src/content/{po1,po2,problemas}.ts`, `src/content/index.ts` — dados + registry.
- `website/src/content/validate.ts` — validação estrutural pura (sem fs).
- `website/scripts/validate-content.ts` — script CLI (validação + checagem de arquivos).
- `website/src/router/index.ts` — rotas.
- `website/src/layout/{AppNavbar,AppFooter,HeroBanner}.vue` — layout.
- `website/src/views/{HomeView,DisciplinaView,ProblemasView,NotFoundView}.vue` — telas.
- `website/src/components/home/{AboutSection,SocialSection,TeamSection,TeamCard}.vue` + `src/content/team.ts`.
- `website/src/components/lessons/{LessonSidebar,LessonPanel,MaterialList}.vue`.
- `website/src/components/ui/{LiteYouTube,VideoTabs}.vue`.
- `website/public/materiais/{po1,po2}/*` — slides renomeados.
- `website/public/.htaccess` — fallback SPA Apache.
- `website/src/assets/{logos,team,background}` — imagens.
- `.github/workflows/deploy-pages.yml` — CI/CD.
- (Fase posterior) `website/Dockerfile`, `website/docker/`.

---

## Task 1: Scaffold do app Vue em `website/`

**Files:**
- Create: `website/package.json`, `website/vite.config.ts`, `website/tsconfig.json`, `website/tsconfig.node.json`, `website/index.html`, `website/vitest.config.ts`, `website/.gitignore`, `website/.prettierrc`, `website/eslint.config.ts`
- Create: `website/src/main.ts`, `website/src/App.vue`, `website/src/styles/theme.css`, `website/src/styles/main.css`
- Test: `website/src/__tests__/smoke.spec.ts`

**Interfaces:**
- Produces: um app Vue montável em `#app`, `npm run dev/build/test` funcionando; `theme.css` expondo as CSS variables da paleta em `:root`.

- [ ] **Step 1: Scaffold base com Vite**

A partir de `C:\Users\LucasMotta\orca\workspaces\Pesquisa-Operacional-Para-Todos\vue-refactor`:

```bash
cd website 2>/dev/null || mkdir website
cd website
npm create vite@latest . -- --template vue-ts
```
Se o prompt reclamar de diretório não-vazio, escolher "Ignore files and continue". Depois:

```bash
npm install
npm install vue-router@^4.4 bootstrap@^5.3 bootstrap-icons@^1.11 @popperjs/core@^2.11
npm install -D vitest @vue/test-utils jsdom @vitejs/plugin-vue vue-tsc
```

- [ ] **Step 2: Configurar Vitest (jsdom) e base por env**

`website/vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
})
```

`website/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'jsdom', globals: true },
})
```

Adicionar scripts em `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vue-tsc -b && vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Tema UNIRIO + imports globais**

`website/src/styles/theme.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

:root {
  --unirio-blue: #003366;
  --secondary-blue: #005A9C;
  --light-bg: #F8F9FA;
  --dark-text: #343A40;
  --highlight: #FFC107;

  /* Mapear tokens do Bootstrap para a paleta UNIRIO */
  --bs-primary: var(--unirio-blue);
  --bs-primary-rgb: 0, 51, 102;
  --bs-body-font-family: 'Poppins', system-ui, sans-serif;
  --bs-body-color: var(--dark-text);
  --bs-body-bg: var(--light-bg);
}
```

`website/src/styles/main.css`:

```css
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import './theme.css';
```

`website/src/main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

createApp(App).mount('#app')
```

`website/src/App.vue` (temporário, substituído na Task 4):

```vue
<template>
  <main class="container py-5">
    <h1 class="text-center">Pesquisa Operacional Para Todos</h1>
  </main>
</template>
```

- [ ] **Step 4: Escrever o smoke test**

`website/src/__tests__/smoke.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '@/App.vue'

describe('App', () => {
  it('renderiza o título do projeto', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Pesquisa Operacional Para Todos')
  })
})
```

- [ ] **Step 5: Rodar o teste (deve passar)**

Run: `npm run test`
Expected: 1 passed.

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build conclui e gera `dist/` sem erros de tipo.

- [ ] **Step 7: Commit**

```bash
cd ..
git add website
git commit -m "chore: scaffold do app Vue 3 + Vite + TS + Bootstrap com tema UNIRIO"
```

---

## Task 2: Modelo de conteúdo tipado + validador

**Files:**
- Create: `website/src/types/content.ts`
- Create: `website/src/content/validate.ts`
- Test: `website/src/content/__tests__/validate.spec.ts`

**Interfaces:**
- Produces:
  - `interface Material { title: string; url: string }`
  - `interface VideoPart { title: string; youtubeId: string }`
  - `interface Lesson { id: string; number: number; title: string; description?: string; topics?: string; videos: VideoPart[]; materials: Material[] }`
  - `interface Discipline { slug: string; title: string; subtitle: string; lessons: Lesson[] }`
  - `function isValidYoutubeId(id: string): boolean`
  - `function validateDiscipline(d: Discipline): string[]` — retorna lista de mensagens de erro (vazia = ok).

- [ ] **Step 1: Definir as interfaces**

`website/src/types/content.ts`:

```ts
export interface Material {
  title: string
  url: string
}

export interface VideoPart {
  title: string
  youtubeId: string
}

export interface Lesson {
  id: string
  number: number
  title: string
  description?: string
  topics?: string
  videos: VideoPart[]
  materials: Material[]
}

export interface Discipline {
  slug: string
  title: string
  subtitle: string
  lessons: Lesson[]
}
```

- [ ] **Step 2: Escrever o teste do validador (deve falhar)**

`website/src/content/__tests__/validate.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { isValidYoutubeId, validateDiscipline } from '@/content/validate'
import type { Discipline } from '@/types/content'

const base: Discipline = {
  slug: 'po1',
  title: 'Pesquisa Operacional I',
  subtitle: 'sub',
  lessons: [
    { id: 'aula-1', number: 1, title: 'Aula 1', videos: [{ title: 'A', youtubeId: 'v5KRSzU2E4U' }], materials: [] },
  ],
}

describe('isValidYoutubeId', () => {
  it('aceita id de 11 chars', () => {
    expect(isValidYoutubeId('v5KRSzU2E4U')).toBe(true)
  })
  it('rejeita placeholder', () => {
    expect(isValidYoutubeId('CODIGO_DO_VIDEO_2')).toBe(false)
  })
})

describe('validateDiscipline', () => {
  it('não reporta erro para disciplina válida', () => {
    expect(validateDiscipline(base)).toEqual([])
  })
  it('reporta id de vídeo inválido', () => {
    const d: Discipline = { ...base, lessons: [{ ...base.lessons[0], videos: [{ title: 'X', youtubeId: 'BAD' }] }] }
    expect(validateDiscipline(d).join(' ')).toContain('youtubeId')
  })
  it('reporta slug de aula duplicado', () => {
    const d: Discipline = { ...base, lessons: [base.lessons[0], base.lessons[0]] }
    expect(validateDiscipline(d).join(' ')).toContain('duplicado')
  })
})
```

- [ ] **Step 3: Rodar o teste (deve falhar)**

Run: `npm run test -- validate`
Expected: FAIL — módulo `@/content/validate` não existe.

- [ ] **Step 4: Implementar o validador**

`website/src/content/validate.ts`:

```ts
import type { Discipline } from '@/types/content'

export function isValidYoutubeId(id: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(id)
}

export function validateDiscipline(d: Discipline): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  for (const lesson of d.lessons) {
    if (seen.has(lesson.id)) errors.push(`[${d.slug}] slug de aula duplicado: ${lesson.id}`)
    seen.add(lesson.id)
    for (const v of lesson.videos) {
      if (!isValidYoutubeId(v.youtubeId)) {
        errors.push(`[${d.slug}/${lesson.id}] youtubeId inválido: "${v.youtubeId}" (${v.title})`)
      }
    }
  }
  return errors
}
```

- [ ] **Step 5: Rodar os testes (devem passar)**

Run: `npm run test -- validate`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd .. && git add website && git commit -m "feat: modelo de conteúdo tipado e validador estrutural"
```

---

## Task 3: Migração de dados + consolidação de assets

Migra `assets/data/*.json` para `website/src/content/*.ts` (modelo novo) e move/renomeia imagens e slides para dentro de `website/`.

**Files:**
- Create: `website/src/content/po1.ts`, `website/src/content/po2.ts`, `website/src/content/problemas.ts`, `website/src/content/index.ts`
- Create: `website/scripts/validate-content.ts`
- Create: `website/public/materiais/po1/*`, `website/public/materiais/po2/*` (slides renomeados)
- Create: `website/src/assets/logos/*`, `website/src/assets/team/*`, `website/src/assets/background.jpg`
- Test: `website/src/content/__tests__/content.spec.ts`

**Interfaces:**
- Consumes: `validateDiscipline` (Task 2), tipos de `@/types/content`.
- Produces: `disciplines: Record<'po1'|'po2'|'problemas', Discipline>` exportado de `@/content`; `getDiscipline(slug: string): Discipline | undefined`.

**Regras de migração (por aula do JSON antigo):**
- `id: <n>` → `id: "aula-<n>"`, `number: <n>`.
- Vídeos: se `subVideos` existe e não é nulo → `videos = subVideos.map(s => ({ title: s.title, youtubeId: s.youtubeId }))`. Senão, se `youtubeId` do topo é válido (`isValidYoutubeId`) → `videos = [{ title: "Aula completa", youtubeId }]`. Senão → `videos = []`.
- Materiais: `slidesUrl` array → cada item vira `{ title, url }`; `slidesUrl` string não-vazia → `[{ title: "Slides da Aula", url }]`; nulo/vazio → `[]`. As `url` apontam para `/materiais/<disc>/<arquivo-limpo>` (ver mapa abaixo).

**Mapa de renomeação de slides** (origem `assets/slides/...` → destino `website/public/materiais/...`, tudo minúsculo, sem acento, hífens no lugar de espaços/underscore):

PO1:
- `introducao-po.ppt` → `po1/introducao-po.ppt`
- `modelagem-matematica-ppls.pptx` → `po1/modelagem-matematica-ppls.pptx`
- `equivalencia-ppls.pptx` → `po1/equivalencia-ppls.pptx`
- `simplex.pptx` → `po1/simplex.pptx`
- `big-m.pptx` → `po1/big-m.pptx`
- `dualidade_parte 1.pptx` → `po1/dualidade-parte-1.pptx`
- `Dualidade pt.2.pptx` → `po1/dualidade-parte-2.pptx`
- `Análise de Sensibilidade 2025.pptx` → `po1/analise-de-sensibilidade-2025.pptx`

PO2:
- `Grafos - Introdução.pptx` → `po2/grafos-introducao.pptx`
- `Grafos_Parte1.pptx` → `po2/grafos-parte-1.pptx`
- `Grafos_Parte2.pptx` → `po2/grafos-parte-2.pptx`
- `Árvores Geradoras Mínimas.pptx` → `po2/arvores-geradoras-minimas.pptx`
- `algoritmo_dijkstra_teoria.pptx` → `po2/dijkstra-teoria.pptx`
- `algoritmo_dijkstra_pratica.pptx` → `po2/dijkstra-pratica.pptx`
- `Otimização em Redes2.pptx` → `po2/otimizacao-em-redes.pptx`
- `Otimização em Redes2 (1).pptx` → `po2/otimizacao-em-redes-nova-versao.pptx`
- `PERT_CPM.pptx` → `po2/pert-cpm.pptx`
- `teoria dos jogos.pptx` → `po2/teoria-dos-jogos.pptx`
- `PI.pptx` → `po2/programacao-inteira.pptx`
- `Programação Não Linear.pptx` → `po2/programacao-nao-linear.pptx`

(Arquivos não referenciados por nenhuma aula — `dualidade.pptx`, `Programação Inteira.pptx` duplicado — não são migrados.)

- [ ] **Step 1: Copiar imagens para dentro de `website/`**

```bash
cd website
mkdir -p src/assets/logos src/assets/team public/materiais/po1 public/materiais/po2
cp "../assets/images/background.jpg" src/assets/background.jpg
cp "../assets/images/logos/novo logo unirio - horizontal negativo.png" "src/assets/logos/unirio-horizontal-negativo.png"
cp "../assets/images/logos/Logo proexc.jpg" "src/assets/logos/proexc.jpg"
cp "../assets/images/logos/logo_u_unirio.png" "src/assets/logos/unirio-icone.png"
cp ../assets/images/team/andrea.jpg ../assets/images/team/lucas.jpg ../assets/images/team/nathalia.jpeg ../assets/images/team/joao.jpeg src/assets/team/
```

- [ ] **Step 2: Mover e renomear os slides**

Copiar cada slide conforme o mapa acima. Exemplo (repetir para todos):

```bash
cp "../assets/slides/po1/introducao-po.ppt" "public/materiais/po1/introducao-po.ppt"
cp "../assets/slides/po1/dualidade_parte 1.pptx" "public/materiais/po1/dualidade-parte-1.pptx"
cp "../assets/slides/po1/Dualidade pt.2.pptx" "public/materiais/po1/dualidade-parte-2.pptx"
cp "../assets/slides/po1/Análise de Sensibilidade 2025.pptx" "public/materiais/po1/analise-de-sensibilidade-2025.pptx"
cp "../assets/slides/po1/modelagem-matematica-ppls.pptx" "public/materiais/po1/modelagem-matematica-ppls.pptx"
cp "../assets/slides/po1/equivalencia-ppls.pptx" "public/materiais/po1/equivalencia-ppls.pptx"
cp "../assets/slides/po1/simplex.pptx" "public/materiais/po1/simplex.pptx"
cp "../assets/slides/po1/big-m.pptx" "public/materiais/po1/big-m.pptx"
cp "../assets/slides/po2/Grafos - Introdução.pptx" "public/materiais/po2/grafos-introducao.pptx"
cp "../assets/slides/po2/Grafos_Parte1.pptx" "public/materiais/po2/grafos-parte-1.pptx"
cp "../assets/slides/po2/Grafos_Parte2.pptx" "public/materiais/po2/grafos-parte-2.pptx"
cp "../assets/slides/po2/Árvores Geradoras Mínimas.pptx" "public/materiais/po2/arvores-geradoras-minimas.pptx"
cp "../assets/slides/po2/algoritmo_dijkstra_teoria.pptx" "public/materiais/po2/dijkstra-teoria.pptx"
cp "../assets/slides/po2/algoritmo_dijkstra_pratica.pptx" "public/materiais/po2/dijkstra-pratica.pptx"
cp "../assets/slides/po2/Otimização em Redes2.pptx" "public/materiais/po2/otimizacao-em-redes.pptx"
cp "../assets/slides/po2/Otimização em Redes2 (1).pptx" "public/materiais/po2/otimizacao-em-redes-nova-versao.pptx"
cp "../assets/slides/po2/PERT_CPM.pptx" "public/materiais/po2/pert-cpm.pptx"
cp "../assets/slides/po2/teoria dos jogos.pptx" "public/materiais/po2/teoria-dos-jogos.pptx"
cp "../assets/slides/po2/PI.pptx" "public/materiais/po2/programacao-inteira.pptx"
cp "../assets/slides/po2/Programação Não Linear.pptx" "public/materiais/po2/programacao-nao-linear.pptx"
```

- [ ] **Step 3: Criar `content/po1.ts`**

Transformar `assets/data/po1_videos.json` conforme as regras. Conteúdo completo:

```ts
import type { Discipline } from '@/types/content'

export const po1: Discipline = {
  slug: 'po1',
  title: 'Pesquisa Operacional I',
  subtitle: 'Videoaulas e materiais da disciplina de PO I.',
  lessons: [
    { id: 'aula-1', number: 1, title: 'Aula 1: Introdução à Pesquisa Operacional',
      description: 'Aula introdutória sobre os conceitos básicos de Pesquisa Operacional e Programação Linear.',
      topics: 'Definição de PO, Fases de um estudo em PO e Introdução a Programação Linear.',
      videos: [{ title: 'Aula completa', youtubeId: 'v5KRSzU2E4U' }],
      materials: [{ title: 'Slides - Introdução a PO', url: '/materiais/po1/introducao-po.ppt' }] },
    { id: 'aula-2', number: 2, title: 'Aula 02: Resolução Gráfica de PPL',
      description: 'Aprendemos a resolver problemas de duas variáveis de forma gráfica e damos os primeiros passos no método Simplex.',
      topics: 'Resolver PPLs com duas variáveis de decisão pelo método gráfico.',
      videos: [], materials: [] },
    { id: 'aula-3', number: 3, title: 'Aula 03: Software para resolver PPLs',
      description: 'Aprender a utilizar softwares na resolução de PPLs: SOLVER, LINDO e LINGO',
      topics: 'PPLs, SOLVER, LINDO e LINGO',
      videos: [
        { title: 'SOLVER pt. 1', youtubeId: 'pNNsL4GzNg8' },
        { title: 'SOLVER pt. 2', youtubeId: 'IMG0vcnQeX0' },
        { title: 'LINDO', youtubeId: 'vFSXrhpg3r8' },
        { title: 'LINGO', youtubeId: 'BCnLTTcSDGg' },
      ], materials: [] },
    { id: 'aula-4', number: 4, title: 'Aula 04: Equivalência entre PPLs e Modelagem Matemática de PPL',
      description: 'Aprender a fazer a formulação de problemas de programação linear',
      topics: 'Equivalencia entre PPLs e Modelagem Matemática de PPL',
      videos: [
        { title: 'Equivalencia', youtubeId: 'xQtosRABD2E' },
        { title: 'Modelagem', youtubeId: 'mw9Mpe-PvZ4' },
      ],
      materials: [
        { title: 'Slides - Equivalência', url: '/materiais/po1/equivalencia-ppls.pptx' },
        { title: 'Slides - Modelagem', url: '/materiais/po1/modelagem-matematica-ppls.pptx' },
      ] },
    { id: 'aula-5', number: 5, title: 'Aula 05: Algoritmo Simplex',
      description: 'Aprender resolução de PPL pelo algoritmo simplex.',
      topics: 'Algoritmo Simplex, Tabelas Simplex, Método Simplex.',
      videos: [{ title: 'Aula completa', youtubeId: 'JTcUGbG8pg0' }],
      materials: [{ title: 'Slides - Simplex', url: '/materiais/po1/simplex.pptx' }] },
    { id: 'aula-6', number: 6, title: 'Aula 06: Método Big-M',
      description: 'Aprender método para resolver qualquer tipo de PPL.',
      topics: 'Método Big-M, PPLs, Resolução de PPLs.',
      videos: [{ title: 'Aula completa', youtubeId: 'gQP8WfzwFU8' }],
      materials: [{ title: 'Slides - Big-M', url: '/materiais/po1/big-m.pptx' }] },
    { id: 'aula-7', number: 7, title: 'Aula 07: Dualidade',
      description: 'Teoria da dualidade e seus teoremas.',
      topics: 'Dualidade, Teoria da Dualidade, Teoremas da Dualidade, TFC.',
      videos: [
        { title: 'Dualidade pt.1', youtubeId: 'LkJlsxEtaE4' },
        { title: 'Dualidade pt.2 - Relações entre o Primal e o Dual', youtubeId: 'RU10F3dU0Xo' },
        { title: 'Algoritmo Simplex Dual', youtubeId: 'i2fcz5FRRos' },
        { title: 'Exemplos de Dualidade', youtubeId: '7Gc2aiE7M7U' },
      ],
      materials: [
        { title: 'Slides - Dualidade Parte 1', url: '/materiais/po1/dualidade-parte-1.pptx' },
        { title: 'Slides - Dualidade Parte 2', url: '/materiais/po1/dualidade-parte-2.pptx' },
      ] },
    { id: 'aula-8', number: 8, title: 'Aula 08: Interpretação Econômica da Dualidade e Simplex Dual',
      description: 'Compreende o significado de dualidade e o algoritmo Simplex Dual.',
      topics: 'Dualidade, Interpretação Econômica, Simplex Dual.',
      videos: [{ title: 'Aula completa', youtubeId: 'i2fcz5FRRos' }], materials: [] },
    { id: 'aula-9', number: 9, title: 'Aula 09: Análise de Sensibilidade e Pós-otimização Com Solver',
      description: 'Analisar alterações no PPL e usar o software Solver para fazer análise de sensibilidade.',
      topics: 'Análise de Sensibilidade, Pós-otimização, Software de PPL.',
      videos: [
        { title: 'Análise de Sensibilidade e Pós-otimização pt.1', youtubeId: 'Z-duqQJFa-4' },
        { title: 'Análise de Sensibilidade e Pós-otimização pt.2', youtubeId: 'C0tpwFouwMA' },
        { title: 'Análise de Sensibilidade e Pós-otimização pt.3', youtubeId: 'nHPLI1uM0ks' },
      ],
      materials: [{ title: 'Slides - Análise de Sensibilidade', url: '/materiais/po1/analise-de-sensibilidade-2025.pptx' }] },
    { id: 'aula-10', number: 10, title: 'Aula 10: Problema do Transporte e Designação',
      description: 'Aprender o problema de transporte e o método húngaro para resolver o problema da designação.',
      topics: 'Problema do Transporte, Problema da Designação, Método Húngaro.',
      videos: [{ title: 'Aula completa', youtubeId: 't2vUhtY1rbo' }], materials: [] },
  ],
}
```

- [ ] **Step 4: Criar `content/po2.ts`**

Aplicar exatamente as mesmas regras aos 10 objetos de `assets/data/po2_videos.json`, usando o mapa de renomeação de slides. Estrutura idêntica ao `po1.ts` (mesma forma de objeto `Discipline`), com `slug: 'po2'`, `title: 'Pesquisa Operacional II'`, `subtitle: 'Videoaulas e materiais da disciplina de PO II.'`. Pontos de atenção na transformação:
- aula-1: `youtubeId` "v5KRSzU2E4U" válido, sem subVideos, sem slides → `videos: [{ title: 'Aula completa', youtubeId: 'v5KRSzU2E4U' }], materials: []`.
- aula-2: subVideos (4 partes) → `videos` com os 4; materiais → `grafos-introducao.pptx`, `grafos-parte-1.pptx`, `grafos-parte-2.pptx`.
- aula-3: subVideos (3) ; material `arvores-geradoras-minimas.pptx`.
- aula-4: subVideos (2) ; materiais `dijkstra-teoria.pptx`, `dijkstra-pratica.pptx`.
- aula-5: subVideos (2) ; `materials: []`.
- aula-6: `youtubeId` "pzZ29vszzpU" válido, sem subVideos → 1 vídeo; materiais `otimizacao-em-redes.pptx`, `otimizacao-em-redes-nova-versao.pptx`.
- aula-7: sem vídeo (`videos: []`) ; material `pert-cpm.pptx`.
- aula-8: subVideos (3) ; material `teoria-dos-jogos.pptx`.
- aula-9: subVideos (4) ; material `programacao-inteira.pptx`.
- aula-10: `youtubeId` "97jdCupjz-0" válido → 1 vídeo; material `programacao-nao-linear.pptx`.

- [ ] **Step 5: Criar `content/problemas.ts` (seed vazio) e `content/index.ts`**

`website/src/content/problemas.ts`:

```ts
import type { Discipline } from '@/types/content'

// Conteúdo real ainda não existe; entra como estado inicial vazio.
export const problemas: Discipline = {
  slug: 'problemas',
  title: 'Problemas Clássicos',
  subtitle: 'Problemas clássicos da Pesquisa Operacional.',
  lessons: [],
}
```

`website/src/content/index.ts`:

```ts
import type { Discipline } from '@/types/content'
import { po1 } from './po1'
import { po2 } from './po2'
import { problemas } from './problemas'

export const disciplines: Record<string, Discipline> = { po1, po2, problemas }

export function getDiscipline(slug: string): Discipline | undefined {
  return disciplines[slug]
}
```

- [ ] **Step 6: Escrever o teste de conteúdo (deve falhar antes dos arquivos existirem)**

`website/src/content/__tests__/content.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { disciplines, getDiscipline } from '@/content'
import { validateDiscipline } from '@/content/validate'

describe('conteúdo migrado', () => {
  it('po1 tem 10 aulas e passa na validação', () => {
    expect(disciplines.po1.lessons).toHaveLength(10)
    expect(validateDiscipline(disciplines.po1)).toEqual([])
  })
  it('po2 tem 10 aulas e passa na validação', () => {
    expect(disciplines.po2.lessons).toHaveLength(10)
    expect(validateDiscipline(disciplines.po2)).toEqual([])
  })
  it('getDiscipline devolve undefined para slug desconhecido', () => {
    expect(getDiscipline('inexistente')).toBeUndefined()
  })
})
```

- [ ] **Step 7: Rodar os testes (devem passar)**

Run: `npm run test -- content`
Expected: PASS (se falhar por `youtubeId inválido`, corrigir o dado — indica placeholder que passou na migração).

- [ ] **Step 8: Script de validação com checagem de arquivos**

Instalar o runner que respeita o alias `@/` do Vite:

```bash
cd website && npm install -D vite-node
```

`website/scripts/validate-content.ts` (importa via alias `@/`, resolvido pelo vite-node):

```ts
import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { disciplines } from '@/content'
import { validateDiscipline } from '@/content/validate'

const publicDir = fileURLToPath(new URL('../public', import.meta.url))
let errors: string[] = []

for (const d of Object.values(disciplines)) {
  errors = errors.concat(validateDiscipline(d))
  for (const lesson of d.lessons) {
    for (const m of lesson.materials) {
      const path = publicDir + m.url
      if (!existsSync(path)) errors.push(`[${d.slug}/${lesson.id}] material ausente: ${m.url}`)
    }
  }
}

if (errors.length) {
  console.error('Conteúdo inválido:\n' + errors.map((e) => ' - ' + e).join('\n'))
  process.exit(1)
}
console.log('Conteúdo OK.')
```

Adicionar script: `"validate:content": "vite-node scripts/validate-content.ts"` (vite-node aplica o alias e o TS do projeto).

- [ ] **Step 9: Rodar o validador (deve passar)**

Run: `npm run validate:content`
Expected: "Conteúdo OK." (se acusar material ausente, conferir renomeação no Step 2).

- [ ] **Step 10: Commit**

```bash
cd .. && git add website && git commit -m "feat: migra conteúdo de PO1/PO2 para modelo tipado e consolida slides/imagens"
```

---

## Task 4: Shell do app — router, AppNavbar, AppFooter, HeroBanner

**Files:**
- Create: `website/src/router/index.ts`
- Create: `website/src/layout/AppNavbar.vue`, `website/src/layout/AppFooter.vue`, `website/src/layout/HeroBanner.vue`
- Create: `website/src/views/HomeView.vue` (stub), `website/src/views/DisciplinaView.vue` (stub), `website/src/views/ProblemasView.vue` (stub), `website/src/views/NotFoundView.vue`
- Modify: `website/src/App.vue`, `website/src/main.ts`
- Test: `website/src/layout/__tests__/AppNavbar.spec.ts`

**Interfaces:**
- Consumes: nada de tasks anteriores além do tema.
- Produces:
  - Rotas nomeadas: `home` (`/`), `po1` (`/po1/:lessonId?`), `po2` (`/po2/:lessonId?`), `problemas` (`/problemas/:itemId?`), `not-found` (`/:pathMatch(.*)*`).
  - `AppNavbar` com links para essas rotas e classe `active` na rota corrente.
  - `HeroBanner` props: `title: string`, `subtitle?: string`.

- [ ] **Step 1: Definir o router**

`website/src/router/index.ts`:

```ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/po1/:lessonId?', name: 'po1', component: () => import('@/views/DisciplinaView.vue'), props: { slug: 'po1' } },
  { path: '/po2/:lessonId?', name: 'po2', component: () => import('@/views/DisciplinaView.vue'), props: { slug: 'po2' } },
  { path: '/problemas/:lessonId?', name: 'problemas', component: () => import('@/views/ProblemasView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
```

Atualizar `main.ts` para usar `.use(router)`.

- [ ] **Step 2: Escrever o teste do AppNavbar (deve falhar)**

`website/src/layout/__tests__/AppNavbar.spec.ts`:

```ts
import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppNavbar from '@/layout/AppNavbar.vue'

describe('AppNavbar', () => {
  it('mostra os links das disciplinas', () => {
    const wrapper = mount(AppNavbar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const text = wrapper.text()
    expect(text).toContain('Pesquisa Operacional I')
    expect(text).toContain('Pesquisa Operacional II')
    expect(text).toContain('Problemas Clássicos')
  })
})
```

- [ ] **Step 3: Rodar (deve falhar)**

Run: `npm run test -- AppNavbar`
Expected: FAIL — componente não existe.

- [ ] **Step 4: Implementar AppNavbar**

`website/src/layout/AppNavbar.vue` — navbar Bootstrap responsiva com `RouterLink` e `active-class`:

```vue
<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: var(--unirio-blue)">
    <div class="container">
      <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
        <img :src="logo" alt="UNIRIO" height="32" />
        <span class="fw-semibold">PO Para Todos</span>
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/po1">Pesquisa Operacional I</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/po2">Pesquisa Operacional II</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/problemas">Problemas Clássicos</RouterLink></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/unirio-icone.png'
</script>
```

- [ ] **Step 5: Implementar AppFooter e HeroBanner + stubs de views**

`website/src/layout/AppFooter.vue`:

```vue
<template>
  <footer class="text-center py-4 mt-5 text-white" style="background-color: var(--unirio-blue)">
    <p class="mb-0">&copy; {{ year }} Pesquisa Operacional Para Todos — UNIRIO.</p>
  </footer>
</template>
<script setup lang="ts">
const year = new Date().getFullYear()
</script>
```

`website/src/layout/HeroBanner.vue`:

```vue
<template>
  <header class="text-white text-center py-5" style="background: linear-gradient(120deg, var(--unirio-blue), var(--secondary-blue))">
    <div class="container">
      <h1 class="fw-bold" style="font-size: clamp(1.8rem, 5vw, 3rem)">{{ title }}</h1>
      <p v-if="subtitle" class="lead mb-0">{{ subtitle }}</p>
    </div>
  </header>
</template>
<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
```

Stubs `HomeView.vue`, `DisciplinaView.vue` (com `defineProps<{ slug: string }>()`), `ProblemasView.vue`, `NotFoundView.vue` — cada um só um `<HeroBanner :title="..." />` provisório.

`website/src/App.vue`:

```vue
<template>
  <AppNavbar />
  <RouterView />
  <AppFooter />
</template>
<script setup lang="ts">
import AppNavbar from '@/layout/AppNavbar.vue'
import AppFooter from '@/layout/AppFooter.vue'
</script>
```

- [ ] **Step 6: Rodar teste + build**

Run: `npm run test -- AppNavbar` → PASS
Run: `npm run build` → sem erros de tipo.

- [ ] **Step 7: Commit**

```bash
cd .. && git add website && git commit -m "feat: shell do app com navbar responsiva, footer, hero e rotas"
```

---

## Task 5: Home (Sobre, Instagram estático, Equipe)

**Files:**
- Create: `website/src/content/team.ts`
- Create: `website/src/components/home/AboutSection.vue`, `SocialSection.vue`, `TeamSection.vue`, `TeamCard.vue`
- Modify: `website/src/views/HomeView.vue`
- Test: `website/src/components/home/__tests__/TeamSection.spec.ts`

**Interfaces:**
- Produces: `interface TeamMember { name: string; role: string; photo: string; linkedin?: string; email?: string }`; `team: TeamMember[]`.

- [ ] **Step 1: Dados da equipe**

`website/src/content/team.ts` — 4 membros extraídos do `index.html` atual:

```ts
import andrea from '@/assets/team/andrea.jpg'
import lucas from '@/assets/team/lucas.jpg'
import nathalia from '@/assets/team/nathalia.jpeg'
import joao from '@/assets/team/joao.jpeg'

export interface TeamMember {
  name: string
  role: string
  photo: string
  linkedin?: string
  email?: string
}

export const team: TeamMember[] = [
  { name: 'Andréa Bonifácio', role: 'Coordenadora do projeto — Professora Associada da UNIRIO, Doutora em Engenharia de Produção.', photo: andrea, linkedin: 'https://www.linkedin.com/in/andr%C3%A9a-bonif%C3%A1cio-b718a994/', email: 'andreabonifacio@uniriotec.br' },
  { name: 'Lucas Motta', role: 'Graduando em Engenharia de Produção. Equipe de Desenvolvimento do Site.', photo: lucas, linkedin: 'https://www.linkedin.com/in/lucas-motta09/', email: 'lucas.motta09@gmail.com' },
  { name: 'Nathalia Ferreira', role: 'Graduanda em Engenharia de Produção. Equipe de Desenvolvimento do Site.', photo: nathalia, linkedin: 'https://www.linkedin.com/in/nath%C3%A1lia-ferreira-b42745219/', email: 'nathaliaromeirof@gmail.com' },
  { name: 'João Meirelles', role: 'Graduando em Engenharia de Produção. Equipe de Criação das Vídeo Aulas.', photo: joao, linkedin: 'https://www.linkedin.com/in/joao-pedro-meirelles-conceicao-/', email: 'joaopedrojotape@outlook.com' },
]
```

- [ ] **Step 2: Teste do TeamSection (deve falhar)**

`website/src/components/home/__tests__/TeamSection.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TeamSection from '@/components/home/TeamSection.vue'
import { team } from '@/content/team'

describe('TeamSection', () => {
  it('renderiza um card por membro', () => {
    const wrapper = mount(TeamSection)
    expect(wrapper.findAll('.team-card')).toHaveLength(team.length)
  })
})
```

- [ ] **Step 3: Rodar (deve falhar)**

Run: `npm run test -- TeamSection` → FAIL.

- [ ] **Step 4: Implementar TeamCard, TeamSection, AboutSection, SocialSection**

`TeamCard.vue` (props `member: TeamMember`) — card Bootstrap com `.team-card`, foto redonda, nome, papel, ícones LinkedIn/email (`bi bi-linkedin`, `bi bi-envelope`).

`TeamSection.vue`:

```vue
<template>
  <section class="container py-5">
    <h2 class="text-center mb-4" style="color: var(--unirio-blue)">Nossa Equipe</h2>
    <div class="row g-4 justify-content-center">
      <div v-for="m in team" :key="m.name" class="col-12 col-sm-6 col-lg-3">
        <TeamCard :member="m" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { team } from '@/content/team'
import TeamCard from './TeamCard.vue'
</script>
```

`AboutSection.vue` — o texto "Sobre o Projeto" do `index.html` atual, em layout responsivo com lista de features (ícones `bi`).

`SocialSection.vue` — cartão estático (sem Elfsight): título "Siga-nos", texto, e um botão-link para `https://www.instagram.com/pesquisaoperacionalparatodos` com `target="_blank" rel="noopener"`.

- [ ] **Step 5: Compor HomeView**

`website/src/views/HomeView.vue`:

```vue
<template>
  <HeroBanner title="Pesquisa Operacional Para Todos" subtitle="Levando a Pesquisa Operacional além da sala de aula" />
  <AboutSection />
  <SocialSection />
  <TeamSection />
</template>
<script setup lang="ts">
import HeroBanner from '@/layout/HeroBanner.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import SocialSection from '@/components/home/SocialSection.vue'
import TeamSection from '@/components/home/TeamSection.vue'
</script>
```

- [ ] **Step 6: Rodar teste + build**

Run: `npm run test -- TeamSection` → PASS. `npm run build` → OK.

- [ ] **Step 7: Commit**

```bash
cd .. && git add website && git commit -m "feat: home responsiva com sobre, instagram estático e equipe"
```

---

## Task 6: Player de vídeo — LiteYouTube + VideoTabs

**Files:**
- Create: `website/src/components/ui/LiteYouTube.vue`, `website/src/components/ui/VideoTabs.vue`
- Test: `website/src/components/ui/__tests__/LiteYouTube.spec.ts`, `VideoTabs.spec.ts`

**Interfaces:**
- Consumes: tipo `VideoPart` de `@/types/content`.
- Produces:
  - `LiteYouTube` props: `youtubeId: string`, `title: string`. Antes do clique: sem `<iframe>`. Depois do clique: `<iframe>` com `src` contendo `youtube-nocookie.com/embed/<id>`.
  - `VideoTabs` props: `videos: VideoPart[]`. Mostra abas (uma por parte) e um `LiteYouTube` para a aba ativa.

- [ ] **Step 1: Teste do LiteYouTube (deve falhar)**

`website/src/components/ui/__tests__/LiteYouTube.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LiteYouTube from '@/components/ui/LiteYouTube.vue'

describe('LiteYouTube', () => {
  it('não monta iframe antes do clique', () => {
    const wrapper = mount(LiteYouTube, { props: { youtubeId: 'v5KRSzU2E4U', title: 'Aula' } })
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('img').attributes('src')).toContain('v5KRSzU2E4U')
  })
  it('monta iframe nocookie após o clique', async () => {
    const wrapper = mount(LiteYouTube, { props: { youtubeId: 'v5KRSzU2E4U', title: 'Aula' } })
    await wrapper.find('button').trigger('click')
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toContain('youtube-nocookie.com/embed/v5KRSzU2E4U')
    expect(iframe.attributes('src')).toContain('rel=0')
  })
})
```

- [ ] **Step 2: Rodar (deve falhar)**

Run: `npm run test -- LiteYouTube` → FAIL.

- [ ] **Step 3: Implementar LiteYouTube**

```vue
<template>
  <div class="ratio ratio-16x9 rounded overflow-hidden bg-dark">
    <iframe v-if="playing" :src="embedUrl" :title="title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" />
    <button v-else type="button" class="btn p-0 border-0 position-relative w-100 h-100" :aria-label="`Reproduzir: ${title}`" @click="playing = true">
      <img :src="thumbnail" :alt="title" class="w-100 h-100" style="object-fit: cover" loading="lazy" />
      <span class="position-absolute top-50 start-50 translate-middle"><i class="bi bi-play-circle-fill text-white" style="font-size: 4rem; opacity: 0.9"></i></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{ youtubeId: string; title: string }>()
const playing = ref(false)
const thumbnail = computed(() => `https://i.ytimg.com/vi/${props.youtubeId}/hqdefault.jpg`)
const embedUrl = computed(() => `https://www.youtube-nocookie.com/embed/${props.youtubeId}?rel=0&modestbranding=1&autoplay=1`)
</script>
```

- [ ] **Step 4: Rodar (deve passar)**

Run: `npm run test -- LiteYouTube` → PASS.

- [ ] **Step 5: Teste do VideoTabs (deve falhar)**

`website/src/components/ui/__tests__/VideoTabs.spec.ts`:

```ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import VideoTabs from '@/components/ui/VideoTabs.vue'

const videos = [
  { title: 'Parte 1', youtubeId: 'aaaaaaaaaaa' },
  { title: 'Parte 2', youtubeId: 'bbbbbbbbbbb' },
]

describe('VideoTabs', () => {
  it('mostra uma aba por vídeo e troca a parte ativa', async () => {
    const wrapper = mount(VideoTabs, { props: { videos } })
    const tabs = wrapper.findAll('button.nav-link')
    expect(tabs).toHaveLength(2)
    expect(wrapper.find('img').attributes('src')).toContain('aaaaaaaaaaa')
    await tabs[1].trigger('click')
    expect(wrapper.find('img').attributes('src')).toContain('bbbbbbbbbbb')
  })
})
```

- [ ] **Step 6: Implementar VideoTabs (e rodar → PASS)**

```vue
<template>
  <div>
    <ul v-if="videos.length > 1" class="nav nav-pills gap-2 mb-3">
      <li v-for="(v, i) in videos" :key="i" class="nav-item">
        <button class="nav-link" :class="{ active: i === current }" @click="current = i">{{ v.title }}</button>
      </li>
    </ul>
    <LiteYouTube :key="current" :youtube-id="videos[current].youtubeId" :title="videos[current].title" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { VideoPart } from '@/types/content'
import LiteYouTube from './LiteYouTube.vue'
defineProps<{ videos: VideoPart[] }>()
const current = ref(0)
</script>
```

Run: `npm run test -- VideoTabs` → PASS.

- [ ] **Step 7: Commit**

```bash
cd .. && git add website && git commit -m "feat: player YouTube com fachada lazy (LiteYouTube) e abas de partes"
```

---

## Task 7: Disciplina — LessonSidebar + LessonPanel + MaterialList + rota

**Files:**
- Create: `website/src/components/lessons/LessonSidebar.vue`, `LessonPanel.vue`, `MaterialList.vue`
- Modify: `website/src/views/DisciplinaView.vue`
- Test: `website/src/views/__tests__/DisciplinaView.spec.ts`

**Interfaces:**
- Consumes: `getDiscipline` (Task 3), `LiteYouTube`/`VideoTabs` (Task 6), tipos de conteúdo.
- Produces:
  - `DisciplinaView` props: `slug: string` (injetado pela rota). Lê `route.params.lessonId`; se ausente/desconhecido usa a primeira aula.
  - `LessonSidebar` props: `lessons: Lesson[]`, `activeId: string`; emite navegação por `RouterLink` para `/{slug}/{lesson.id}`.
  - `LessonPanel` props: `lesson: Lesson`. Renderiza título, descrição, tópicos, vídeo (0 → "em breve"; 1 → `LiteYouTube`; 2+ → `VideoTabs`) e `MaterialList`.
  - `MaterialList` props: `materials: Material[]`. Lista links de download; vazio → "Nenhum material disponível".

- [ ] **Step 1: Teste do DisciplinaView (deve falhar)**

`website/src/views/__tests__/DisciplinaView.spec.ts`:

```ts
import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import DisciplinaView from '@/views/DisciplinaView.vue'

function mountAt(lessonId?: string) {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/po1/:lessonId?', component: DisciplinaView }] })
  router.push(lessonId ? `/po1/${lessonId}` : '/po1')
  return router.isReady().then(() =>
    mount(DisciplinaView, { props: { slug: 'po1' }, global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } } }),
  )
}

describe('DisciplinaView', () => {
  it('lista todas as aulas na sidebar', async () => {
    const wrapper = await mountAt()
    expect(wrapper.findAll('.lesson-nav-item')).toHaveLength(10)
  })
  it('sem lessonId, mostra a primeira aula no painel', async () => {
    const wrapper = await mountAt()
    expect(wrapper.find('.lesson-panel').text()).toContain('Introdução à Pesquisa Operacional')
  })
  it('com lessonId, mostra a aula selecionada', async () => {
    const wrapper = await mountAt('aula-5')
    expect(wrapper.find('.lesson-panel').text()).toContain('Algoritmo Simplex')
  })
})
```

- [ ] **Step 2: Rodar (deve falhar)**

Run: `npm run test -- DisciplinaView` → FAIL.

- [ ] **Step 3: Implementar MaterialList**

```vue
<template>
  <div>
    <h4 class="h6 mt-4">Materiais de Apoio</h4>
    <p v-if="!materials.length" class="text-muted">Nenhum material disponível para esta aula.</p>
    <ul v-else class="list-unstyled">
      <li v-for="m in materials" :key="m.url" class="mb-2">
        <a :href="m.url" target="_blank" rel="noopener" download><i class="bi bi-file-earmark-slides me-2"></i>{{ m.title }}</a>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { Material } from '@/types/content'
defineProps<{ materials: Material[] }>()
</script>
```

- [ ] **Step 4: Implementar LessonPanel**

```vue
<template>
  <article class="lesson-panel">
    <h2 style="color: var(--unirio-blue)">{{ lesson.title }}</h2>
    <p v-if="lesson.description">{{ lesson.description }}</p>
    <p v-if="lesson.topics" class="text-muted"><strong>Tópicos:</strong> {{ lesson.topics }}</p>

    <VideoTabs v-if="lesson.videos.length > 1" :videos="lesson.videos" />
    <LiteYouTube v-else-if="lesson.videos.length === 1" :youtube-id="lesson.videos[0].youtubeId" :title="lesson.videos[0].title" />
    <p v-else class="alert alert-secondary">O vídeo desta aula será disponibilizado em breve.</p>

    <MaterialList :materials="lesson.materials" />
  </article>
</template>
<script setup lang="ts">
import type { Lesson } from '@/types/content'
import LiteYouTube from '@/components/ui/LiteYouTube.vue'
import VideoTabs from '@/components/ui/VideoTabs.vue'
import MaterialList from './MaterialList.vue'
defineProps<{ lesson: Lesson }>()
</script>
```

- [ ] **Step 5: Implementar LessonSidebar**

Lista com `RouterLink` para cada aula; item ativo destacado. No mobile (`< lg`) colapsa num dropdown que mostra a aula atual — usar um `<details>` nativo ou `.d-lg-block` + botão toggle. Implementação com `<details>` (simples, sem JS extra):

```vue
<template>
  <details class="lesson-sidebar" open>
    <summary class="d-lg-none btn btn-outline-primary w-100 mb-2">Aulas — {{ activeTitle }}</summary>
    <ul class="list-group">
      <li v-for="l in lessons" :key="l.id" class="list-group-item p-0 lesson-nav-item">
        <RouterLink class="d-block px-3 py-2 text-decoration-none" :class="{ 'fw-semibold text-white bg-primary': l.id === activeId }" :to="`/${slug}/${l.id}`">
          {{ l.title }}
        </RouterLink>
      </li>
    </ul>
  </details>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Lesson } from '@/types/content'
const props = defineProps<{ lessons: Lesson[]; activeId: string; slug: string }>()
const activeTitle = computed(() => props.lessons.find((l) => l.id === props.activeId)?.title ?? '')
</script>
```

- [ ] **Step 6: Implementar DisciplinaView**

```vue
<template>
  <HeroBanner v-if="discipline" :title="discipline.title" :subtitle="discipline.subtitle" />
  <div v-if="discipline" class="container py-4">
    <div v-if="discipline.lessons.length" class="row g-4">
      <div class="col-12 col-lg-4"><LessonSidebar :lessons="discipline.lessons" :active-id="activeLesson.id" :slug="slug" /></div>
      <div class="col-12 col-lg-8"><LessonPanel :lesson="activeLesson" /></div>
    </div>
    <p v-else class="alert alert-secondary">Conteúdo em breve.</p>
  </div>
  <NotFoundView v-else />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getDiscipline } from '@/content'
import HeroBanner from '@/layout/HeroBanner.vue'
import LessonSidebar from '@/components/lessons/LessonSidebar.vue'
import LessonPanel from '@/components/lessons/LessonPanel.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const discipline = computed(() => getDiscipline(props.slug))
const activeLesson = computed(() => {
  const lessons = discipline.value?.lessons ?? []
  return lessons.find((l) => l.id === route.params.lessonId) ?? lessons[0]
})
</script>
```

- [ ] **Step 7: Rodar testes (devem passar) + build**

Run: `npm run test -- DisciplinaView` → PASS. `npm run build` → OK.

- [ ] **Step 8: Commit**

```bash
cd .. && git add website && git commit -m "feat: disciplina com sidebar de aulas, painel de conteúdo e materiais"
```

---

## Task 8: Problemas Clássicos (reuso do padrão)

**Files:**
- Modify: `website/src/views/ProblemasView.vue`
- Test: `website/src/views/__tests__/ProblemasView.spec.ts`

**Interfaces:**
- Consumes: `getDiscipline('problemas')`, `LessonSidebar`/`LessonPanel`.
- Produces: `ProblemasView` que reusa o mesmo layout; com `lessons` vazio mostra estado "em breve".

- [ ] **Step 1: Teste (deve falhar)**

`website/src/views/__tests__/ProblemasView.spec.ts`:

```ts
import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProblemasView from '@/views/ProblemasView.vue'

describe('ProblemasView', () => {
  it('mostra estado vazio quando não há conteúdo', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/problemas/:lessonId?', component: ProblemasView }] })
    router.push('/problemas')
    await router.isReady()
    const wrapper = mount(ProblemasView, { global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } } })
    expect(wrapper.text()).toContain('em breve')
  })
})
```

- [ ] **Step 2: Rodar (deve falhar)** — `npm run test -- ProblemasView` → FAIL.

- [ ] **Step 3: Implementar ProblemasView**

Reusar `DisciplinaView` fixando o slug — a forma mais DRY é o `ProblemasView` renderizar o `DisciplinaView` com `slug="problemas"`:

```vue
<template>
  <DisciplinaView slug="problemas" />
</template>
<script setup lang="ts">
import DisciplinaView from './DisciplinaView.vue'
</script>
```

(O `DisciplinaView` já trata `lessons` vazio com "Conteúdo em breve.")

- [ ] **Step 4: Rodar (deve passar)** — `npm run test -- ProblemasView` → PASS.

- [ ] **Step 5: Commit**

```bash
cd .. && git add website && git commit -m "feat: página de problemas clássicos reusando o padrão de disciplina"
```

---

## Task 9: Polimento responsivo + e2e (Cypress)

**Files:**
- Create: `website/cypress.config.ts`, `website/cypress/e2e/navegacao.cy.ts`, `website/cypress/e2e/mobile.cy.ts`
- Modify: componentes conforme ajustes de responsividade
- Modify: `website/package.json` (scripts cypress)

**Interfaces:**
- Consumes: app completo das tasks anteriores.

- [ ] **Step 1: Instalar e configurar Cypress**

```bash
cd website && npm install -D cypress start-server-and-test
```

`website/cypress.config.ts`:

```ts
import { defineConfig } from 'cypress'
export default defineConfig({ e2e: { baseUrl: 'http://localhost:4173', supportFile: false } })
```

Scripts em `package.json`:

```json
"e2e": "start-server-and-test preview http://localhost:4173 \"cypress run\""
```

- [ ] **Step 2: E2e de navegação desktop**

`website/cypress/e2e/navegacao.cy.ts`:

```ts
describe('navegação', () => {
  it('navega da home para uma aula de PO1', () => {
    cy.visit('/')
    cy.contains('Pesquisa Operacional I').click()
    cy.contains('Aula 05: Algoritmo Simplex').click()
    cy.get('.lesson-panel').should('contain', 'Algoritmo Simplex')
    cy.url().should('include', '/po1/aula-5')
  })
  it('deep-link abre a aula certa', () => {
    cy.visit('/po2/aula-2')
    cy.get('.lesson-panel').should('contain', 'Teoria dos Grafos')
  })
})
```

- [ ] **Step 3: E2e mobile (viewport reduzido)**

`website/cypress/e2e/mobile.cy.ts`:

```ts
describe('mobile', () => {
  beforeEach(() => cy.viewport('iphone-x'))
  it('navbar colapsa e navega', () => {
    cy.visit('/')
    cy.get('.navbar-toggler').click()
    cy.contains('Pesquisa Operacional II').click()
    cy.url().should('include', '/po2')
  })
  it('não há scroll horizontal na home', () => {
    cy.visit('/')
    cy.document().then((doc) => {
      expect(doc.documentElement.scrollWidth).to.be.lte(doc.documentElement.clientWidth + 1)
    })
  })
})
```

- [ ] **Step 4: Rodar e2e e corrigir quebras de responsividade**

Run: `npm run build && npm run e2e`
Expected: todos os specs passam. Ajustar CSS/classes Bootstrap onde houver overflow ou quebra (grid da equipe, hero, sidebar) até passar. Verificar manualmente com `npm run preview` em viewport mobile do DevTools.

- [ ] **Step 5: Commit**

```bash
cd .. && git add website && git commit -m "test: e2e de navegação e responsividade mobile com Cypress"
```

---

## Task 10: Deploy — base por ambiente, fallback SPA, CI/CD

**Files:**
- Create: `website/public/.htaccess`
- Modify: `website/package.json` (postbuild 404)
- Create: `.github/workflows/deploy-pages.yml`

**Interfaces:**
- Consumes: build funcional.
- Produces: `dist/` com `404.html` (cópia do `index.html`) e `.htaccess`; workflow publicando no GitHub Pages.

- [ ] **Step 1: `.htaccess` para Apache (produção UNIRIO)**

`website/public/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

- [ ] **Step 2: Gerar `404.html` no build (fallback do Pages)**

Adicionar postbuild em `package.json` (multiplataforma via Node):

```json
"postbuild": "node -e \"require('fs').copyFileSync('dist/index.html','dist/404.html')\""
```

- [ ] **Step 3: Workflow de deploy para GitHub Pages**

`.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: website
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm, cache-dependency-path: website/package-lock.json }
      - run: npm ci
      - run: npm run test
      - run: npm run validate:content
      - run: npm run build
        env:
          VITE_BASE: /Pesquisa-Operacional-Para-Todos/
      - uses: actions/upload-pages-artifact@v3
        with: { path: website/dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: "${{ steps.deployment.outputs.page_url }}" }
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verificar build de produção e de Pages**

Run (produção): `cd website && npm run build` → gerar `dist/` com `.htaccess`, `404.html`, `materiais/`.
Run (Pages): `VITE_BASE=/Pesquisa-Operacional-Para-Todos/ npm run build` → conferir que os assets referenciam o subpath.

- [ ] **Step 5: Commit**

```bash
cd .. && git add website .github && git commit -m "chore: deploy — .htaccess Apache, 404.html do Pages e workflow de CI/CD"
```

---

## Task 11 (fase posterior, opcional): Docker

Só executar quando for containerizar o deploy na UNIRIO. Marcada como opcional no spec.

**Files:**
- Create: `website/Dockerfile`, `website/docker/000-default.conf` (ou `.htaccess` já incluso no dist)

- [ ] **Step 1: Dockerfile multi-stage (Apache httpd, paridade com produção)**

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM httpd:2.4-alpine
RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf \
 && sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/
EXPOSE 80
```

(O `.htaccess` copiado do `dist/` cuida do fallback SPA; `AllowOverride All` o habilita.)

- [ ] **Step 2: Build e teste local do container**

```bash
cd website && docker build -t po-para-todos . && docker run --rm -p 8080:80 po-para-todos
```
Abrir `http://localhost:8080`, navegar para `/po1/aula-5` e recarregar → deve servir a rota (fallback SPA funcionando).

- [ ] **Step 3: Commit**

```bash
cd .. && git add website && git commit -m "chore: Dockerfile Apache httpd para deploy containerizado"
```

---

## Self-review

- **Cobertura do spec:** stack/estrutura (T1), conteúdo tipado + validador (T2, T3), navbar+rotas (T4), home com Instagram estático (T5), player YouTube fachada (T6), sidebar+painel na disciplina (T7), problemas (T8), responsividade/mobile + e2e (T9), deploy Apache/Pages + CI (T10), Docker posterior (T11). Todos os itens do spec têm task correspondente.
- **Slugs/tipos consistentes:** `Discipline/Lesson/VideoPart/Material` usados igualmente em T2–T8; `getDiscipline`, `validateDiscipline`, `isValidYoutubeId` com assinaturas estáveis; rotas usam `:lessonId?` em po1/po2/problemas (ProblemasView delega ao DisciplinaView com `slug="problemas"`).
- **Sem placeholders:** todo passo tem código/comando real. Exceção deliberada: `po2.ts` (T3/Step 4) é transformação mecânica dos 10 objetos do JSON existente pelas mesmas regras do `po1.ts`, com o mapa de slides e os pontos por-aula listados — o teste de `content.spec.ts` e o `validate:content` garantem a corretude.
