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

## 🌐 Deploy de produção

Quem publica é o **próprio servidor da UNIRIO**, com o script
[`ops/deploy-servidor.sh`](ops/deploy-servidor.sh). Todo dia à **00:00** (cron) ele
puxa a `main`; se houver commit novo, roda `npm ci` + testes + build + gate de SEO e
só então sincroniza o `dist/` no DocumentRoot do Apache. Se algo falhar, nada é
publicado e o site continua na versão anterior.

Instalação (uma vez, no servidor, como o usuário de deploy; pede `sudo` só para
ajustar as permissões do DocumentRoot):

```bash
curl -fsSLO https://raw.githubusercontent.com/poparatodos/Pesquisa-Operacional-Para-Todos/main/ops/deploy-servidor.sh
bash deploy-servidor.sh instalar
```

Também uma vez: habilitar o `.htaccess` no Apache com
[`ops/apache/pesquisaoperacional.conf`](ops/apache/pesquisaoperacional.conf) (instruções no
próprio arquivo). Sem ele as URLs das aulas (`/po1/aula-5`) dão 404 e `/po1` lista a pasta.

Pré-requisitos: `git`, `rsync`, `flock`, `cron` e Node `^22.22.2 || ^24.15.0 || >=26`
(ex.: `nvm install 24`). Depois disso, o dia a dia é:

| Comando (`~/po-deploy/bin/deploy-servidor.sh …`) | O que faz |
|---|---|
| `status` | versão no ar, última da `main`, releases guardadas e fim do log |
| `executar --forcar` | publica agora, sem esperar a meia-noite |
| `reverter` | volta para a release anterior e não republica aquele commit até entrar outro na `main` |
| `desinstalar` | remove o cron (mantém site e arquivos) |

Logs ficam em `~/po-deploy/logs/`. O workflow *Gate Prod* do GitHub roda os mesmos
testes/build/gate a cada push na `main` como aviso antecipado.

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
  O campo opcional `kind` (`slides` · `apostila` · `lista` · `gabarito` · `link`) define ícone e
  ordem; `link` é para sites externos (URL `https://…`).
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
