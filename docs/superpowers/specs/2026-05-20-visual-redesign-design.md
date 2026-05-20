# Redesign Visual — PO para Todos

**Data:** 2026-05-20
**Branch:** dev
**Abordagem aprovada:** Híbrido dark hero / light content

---

## 1. Contexto e Motivação

O site atual tem identidade visual desalinhada com o canal do YouTube do projeto, que usa um esquema moderno de cinza escuro + verde lima com motivo de grafo representando a sigla "PO". Além disso, há problemas técnicos concretos:

- `initial-scale=0.80` no `<meta viewport>` do `index.html` causa desalinhamentos em mobile
- O carrossel (`overflow: hidden` + CSS Grid stack) corta conteúdo de altura variável
- O menu lateral não tem backdrop, botão de fechar visível, nem comportamento confiável em touch
- Sem link para o repositório público no GitHub
- Inconsistência entre páginas (index usa viewport 0.80, po1.html usa 1.0)

---

## 2. Sistema de Design

### Tokens de cor

| Token CSS | Valor | Uso |
|---|---|---|
| `--color-bg-dark` | `#1C1C1C` | Hero, navbar, footer |
| `--color-bg-mid` | `#2A2A2A` | Seção GitHub, cards escuros |
| `--color-green` | `#A8D05A` | CTAs, hovers, bordas ativas, destaques |
| `--color-green-dim` | `#7BA040` | Hover state do verde |
| `--color-bg-light` | `#F8F9FA` | Fundo de seções de conteúdo |
| `--color-surface` | `#FFFFFF` | Cards, accordion |
| `--color-text-light` | `#FFFFFF` | Texto sobre fundos escuros |
| `--color-text-muted` | `#AAAAAA` | Texto secundário em fundos escuros |
| `--color-text-dark` | `#343A40` | Texto sobre fundos claros |
| `--unirio-blue` | `#003366` | Logos e links institucionais (mantido) |
| `--secondary-blue` | `#005A9C` | Links secundários em contexto claro |

### Tipografia

- Fonte: Poppins (já carregada via Google Fonts) — mantida
- Hero title: `clamp(2.2rem, 5vw, 3.5rem)` / weight 700
- Section heading: `2rem` / weight 600
- Card title: `1.2rem` / weight 600
- Body: `1rem` / line-height 1.7

### Viewport — correção crítica

```html
<!-- Todas as páginas devem usar: -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 3. Componentes

### 3.1 Navbar (novo — substitui o side-menu)

**Desktop (≥ 768px):**
- Barra horizontal fixa no topo, `height: 64px`, `bg: #1C1C1C`
- Esquerda: ícone do grafo PO (SVG inline) + texto "PO para Todos" em branco
- Direita: links de texto (Home, PO I, PO II, Problemas Clássicos) + botão "⬡ GitHub" com borda verde lima
- Link ativo com underline verde lima

**Mobile (< 768px):**
- Logo à esquerda, botão hamburger (☰) à direita
- Ao clicar: menu dropdown de largura total desliza de cima para baixo
- Backdrop semitransparente escuro fecha o menu ao clicar fora
- Botão "✕ Fechar" no topo do dropdown

**Arquivos afetados:** `assets/css/style.css`, `assets/js/menu.js`, `index.html`, `pages/po1.html`, `pages/po2.html`, `pages/problemas.html`

---

### 3.2 Landing Page — substituição do carrossel por scroll sections

O carrossel é removido inteiramente. O `index.html` passa a ter seções verticais em sequência:

#### Hero (70vh mínimo)
- Background: `#1C1C1C`
- Grafo animado SVG com nós verdes (baseado na identidade do YouTube) — posicionado à direita, `opacity: 0.25`
- Título: "Pesquisa Operacional Para Todos" — branco, tipografia grande
- Subtítulo: "Levando a PO além da sala de aula" — verde lima
- 2 CTAs: `[ Explorar Conteúdo ↓ ]` (botão outline branco) e `[ ⬡ Ver no GitHub ]` (botão sólido verde)
- Logos UNIRIO + PROEX mantidos no topo do hero

#### Acesse o Conteúdo (bg claro)
- 3 cards em grid responsivo: PO I, PO II, Problemas Clássicos
- Cada card: ícone Lucide + título + descrição curta + botão "Acessar →"
- Hover: borda esquerda verde lima + leve elevação de sombra

#### Sobre o Projeto (bg claro)
- Texto existente mantido
- Lista com ícones Lucide mantida

#### Código Aberto (bg `#2A2A2A` — dark)
- Bloco centralizado com ícone GitHub
- Texto: "Este projeto é open source. O código do site e os algoritmos em Python estão disponíveis publicamente."
- Botão: `[ ⬡ Ver repositório no GitHub ]` — verde lima, link para `https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos`

#### Nossa Equipe (bg claro)
- Grid de cards existente mantido (foto circular + nome + bio + ícones sociais)
- Ajuste: `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`

#### Redes Sociais (bg claro)
- Feed do Instagram via Elfsight mantido

#### Footer (bg `#1C1C1C`)
- Texto de copyright
- Links rápidos: GitHub, Instagram
- Logo UNIRIO pequena

---

### 3.3 Páginas internas (PO1, PO2, Problemas)

- Navbar idêntica ao index (com link "Home" incluso)
- Page banner: `40vh`, mesmo esquema dark do hero principal, mas sem CTA buttons
- Accordion: mantido, com adição de borda esquerda `4px solid var(--color-green)` no item ativo
- Conteúdo (accordion, vídeos, materiais): fundo claro, sem alteração funcional
- Footer idêntico

---

## 4. Mobile

| Problema atual | Solução |
|---|---|
| `initial-scale=0.80` no index.html | Corrigir para `1.0` |
| Carrossel corta conteúdo | Eliminado, substituído por scroll |
| Menu sem backdrop/fechar | Novo dropdown com backdrop + botão X |
| Botão "Menu" sem contexto no hero | Substituído por navbar estruturada |
| Logos do hero muito grandes em mobile | `max-height: 60px` via media query |

Breakpoints:
- Mobile: `< 768px`
- Tablet: `768px – 1024px`
- Desktop: `> 1024px`

---

## 5. Estrutura de arquivos

Nenhum arquivo novo de HTML é criado. As alterações se distribuem em:

```
assets/
  css/
    style.css        ← tokens, navbar, hero, sections, footer, mobile
    pages.css        ← page banner atualizado, accordion com destaque verde
  js/
    menu.js          ← lógica do novo dropdown com backdrop
index.html           ← viewport corrigido, estrutura de seções substituindo carrossel
pages/po1.html       ← navbar atualizada
pages/po2.html       ← navbar atualizada
pages/problemas.html ← navbar atualizada
CLAUDE.md            ← novo: documentação do projeto para Claude Code
```

---

## 6. Restrição crítica — video-loader.js

O arquivo `assets/js/video-loader.js` gera accordion HTML dinamicamente a partir dos JSONs de vídeos (`po1_videos.json`, `po2_videos.json`). Ele depende das seguintes classes CSS em `pages.css`:

```
.accordion-item
.accordion-header
.accordion-arrow
.accordion-content
.accordion-content-inner
.lesson-details
.video-container
.video-tab-container
.tab-navigation
.tab-btn
.tab-content
.video-tab-pane
.material-section
.material-item
```

**Nenhuma dessas classes pode ser renomeada, removida ou ter seu comportamento funcional alterado.** Apenas propriedades visuais (cores, bordas, sombras) podem ser modificadas. O script também chama `lucide.createIcons()` após renderizar o HTML — a biblioteca Lucide deve continuar carregada em todas as páginas que usam o loader.

A estrutura HTML das páginas internas (`po1.html`, `po2.html`) também não pode ser alterada além da navbar e do banner: o container `<div id="accordion-wrapper" data-json-source="...">` deve ser mantido intacto.

---

## 7. Fora do escopo

- Alteração no `video-loader.js` ou na estrutura dos JSONs de vídeos
- Novos conteúdos ou páginas
- Modo escuro completo nas páginas internas
- Animações complexas além do grafo SVG no hero
