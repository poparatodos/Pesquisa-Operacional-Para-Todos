# 📘 Pesquisa Operacional Para Todos

Site do **projeto de extensão da UNIRIO** que disponibiliza videoaulas, materiais e
problemas clássicos de **Pesquisa Operacional** de forma aberta e gratuita.

Produção: <https://pesquisaoperacional.uniriotec.br/>

> Este repositório passou por uma refatoração de **HTML/CSS/JS vanilla → Vue 3 + TypeScript + Vite**.
> A aplicação vive em [`website/`](website/). O conteúdo antigo (site estático) foi substituído.

---

## 🛠️ Stack

- **Vue 3** (`<script setup>`) + **TypeScript**
- **Vite** (dev server e build)
- **vue-router** (SPA com history mode)
- **Bootstrap 5** + tema custom por CSS variables
- **Vitest** + **@vue/test-utils** (testes unitários)
- **Cypress** (testes e2e)

---

## 📂 Estrutura (`website/src/`)

```text
src/
├── main.ts                 # bootstrap do app; aplica o tema (data-theme) antes do mount
├── App.vue                 # shell: AppNavbar + <RouterView> + AppFooter
├── theme.ts                # flag de tema visual: 'blue' | 'green'
├── router/index.ts         # rotas: /, /po1, /po2, /problemas, 404
├── layout/
│   ├── AppNavbar.vue        # faixa institucional (UNIRIO/PROEXC) + navbar + link do GitHub
│   ├── AppFooter.vue        # rodapé com logo da PROEXC, redes e créditos
│   └── HeroBanner.vue       # banner reutilizável (usado no 404)
├── views/
│   ├── HomeView.vue         # home: hero, sobre, disciplinas, redes, equipe
│   ├── DisciplinaView.vue   # catálogo de aulas + aula em foco (PO1/PO2)
│   ├── ProblemasView.vue    # problemas clássicos (reusa o padrão de disciplina)
│   └── NotFoundView.vue
├── components/
│   ├── GraphMark.vue        # assinatura visual (grafo) da marca
│   ├── home/                # HomeHero, AboutSection, DisciplinesSection, SocialSection, TeamSection…
│   ├── lessons/             # LessonCatalog, LessonFocus, LessonDrawer, MaterialList
│   └── ui/                  # LiteYouTube (embed leve do YouTube)
├── content/                # DADOS tipados (fonte da verdade do conteúdo)
│   ├── po1.ts, po2.ts, problemas.ts
│   ├── team.ts
│   └── index.ts            # getDiscipline(slug)
├── types/content.ts        # tipos Discipline / Lesson / Video / Material
├── lib/                    # helpers (ex.: formatação de aula)
├── styles/
│   ├── theme.css           # tokens de tema (base + [data-theme='blue'|'green'])
│   ├── ui.css              # primitivos .app-* (botões, badges, cards)
│   └── main.css            # imports do Bootstrap + tema
└── assets/                 # logos e fotos da equipe
```

Glossário do domínio (Disciplina, Aula, Parte, Material, Problema Clássico): [`CONTEXT.md`](CONTEXT.md).
Decisões de arquitetura: [`docs/adr/`](docs/adr/).

---

## 🚀 Rodando o projeto

```bash
cd website
npm install
npm run dev        # servidor de desenvolvimento (Vite)
```

Outros scripts (`package.json`):

| Script | O que faz |
|---|---|
| `npm run build` | type-check (`vue-tsc`) + build de produção em `dist/` |
| `npm run preview` | serve o build de `dist/` |
| `npm run test` | testes unitários (Vitest) |
| `npm run validate:content` | valida a integridade dos dados de conteúdo |
| `npm run e2e` | testes end-to-end (Cypress) sobre o preview |

---

## ➕ Como adicionar conteúdo

O conteúdo é **dado tipado**, não HTML. Para adicionar/editar aulas basta mexer nos
arquivos de `src/content/` — o TypeScript garante o formato.

### Adicionar uma aula a uma disciplina existente

Abra `src/content/po1.ts` (ou `po2.ts`) e acrescente um item ao array `lessons`:

```ts
{
  id: 'aula-11', number: 11, title: 'Aula 11: ...',
  description: '...',
  topics: '...',
  videos: [
    { title: 'Parte 1', youtubeId: 'ID_DO_YOUTUBE' }, // só o ID, não a URL
  ],
  materials: [
    { title: 'Slides - ...', url: '/materiais/po1/arquivo.pptx' },
  ],
}
```

- Uma aula pode ter **várias partes** (`videos: [...]`) ou nenhuma (estado "em breve").
- Materiais de apoio vão em `website/public/materiais/…` e são referenciados por URL absoluta.
- Rode `npm run validate:content` para conferir.

### Criar uma nova disciplina

1. Crie `src/content/po3.ts` exportando um `Discipline`.
2. Registre-o em `src/content/index.ts`.
3. Adicione a rota em `src/router/index.ts` e o link em `src/layout/AppNavbar.vue`.

---

## 🎨 Tema visual

A identidade é plugável via `src/theme.ts` (`export const THEME: Theme = 'blue'`).
Os tokens de cada tema ficam em `src/styles/theme.css` (`[data-theme='blue']` / `[data-theme='green']`),
aplicados no `<html>` por `main.ts`. Ver [`docs/adr/0002-tema-visual-plugavel-blue-green.md`](docs/adr/).

---

## 📝 Créditos

Projeto de extensão **Pesquisa Operacional Para Todos** — UNIRIO / Pró-Reitoria de Extensão e Cultura (PROEXC).

- **Coordenação:** Profa. Dra. Andréa Bonifácio
- **Desenvolvimento do site:** Lucas Motta, Nathalia Ferreira
- **Criação das videoaulas:** João Meirelles

Redes: [YouTube](https://www.youtube.com/@PesquisaOperacionalparatodos) ·
[Instagram](https://www.instagram.com/pesquisaoperacionalparatodos)
