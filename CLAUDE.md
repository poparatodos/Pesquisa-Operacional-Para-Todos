# CLAUDE.md — PO para Todos

Projeto de extensão universitária da UNIRIO para democratizar o ensino de Pesquisa Operacional. Site estático hospedado via GitHub Pages.

## Links

- **Produção:** https://poparatodos.github.io/Pesquisa-Operacional-Para-Todos/
- **Repositório:** https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos
- **Canal YouTube:** https://www.youtube.com/@PesquisaOperacionalparatodos

## Estrutura do projeto

```
index.html               # Landing page principal
pages/
  po1.html               # Pesquisa Operacional I
  po2.html               # Pesquisa Operacional II
  problemas.html         # Problemas Clássicos
assets/
  css/
    style.css            # Estilos globais: navbar, hero, landing, mobile
    pages.css            # Estilos das páginas internas: accordion, vídeos, materiais
  js/
    menu.js              # Toggle do menu de navegação
    main.js              # Carrossel da landing (será removido no redesign)
    video-loader.js      # Carrega accordion + vídeos a partir dos JSONs
  data/
    po1_videos.json      # Dados das aulas de PO1
    po2_videos.json      # Dados das aulas de PO2
  images/                # Logos, fotos da equipe, backgrounds
  slides/                # Arquivos .pptx para download
docs/
  superpowers/specs/     # Design specs gerados durante o processo de brainstorming
```

## Regra crítica — video-loader.js

O arquivo `assets/js/video-loader.js` gera HTML de accordion dinamicamente a partir dos JSONs de dados. Ele depende das classes CSS abaixo definidas em `pages.css`. **Nunca renomear ou remover essas classes:**

```
.accordion-item  .accordion-header  .accordion-arrow
.accordion-content  .accordion-content-inner  .lesson-details
.video-container  .video-tab-container  .tab-navigation
.tab-btn  .tab-content  .video-tab-pane
.material-section  .material-item
```

O script também chama `lucide.createIcons()` após renderizar — manter a lib Lucide carregada em todas as páginas que usam o loader.

## Identidade visual

- **Fonte:** Poppins (Google Fonts)
- **Esquema de cores** (pós-redesign dev branch):
  - `#1C1C1C` — hero, navbar, footer (dark)
  - `#2A2A2A` — seções escuras secundárias
  - `#A8D05A` — verde lima: destaques, CTAs, bordas ativas
  - `#F8F9FA` — fundo das seções de conteúdo (light)
  - `#003366` — azul UNIRIO: logos e links institucionais
- Referência visual: identidade do canal YouTube (cinza escuro + verde lima + grafo PO)

## Viewport

Todas as páginas devem usar `initial-scale=1.0`. O `index.html` original tinha `0.80` por engano — isso causa desalinhamentos em mobile.

## GitHub Pages

O site é servido diretamente da branch `main`. A branch `dev` é usada para desenvolvimento. PRs de `dev → main` publicam automaticamente.

Caminhos relativos nos JSONs usam `../assets/...` pois os JSONs são referenciados a partir de `pages/`.

## Bibliotecas externas

- **Lucide Icons:** carregado via CDN (`https://unpkg.com/lucide@latest`)
- **Elfsight:** feed do Instagram na landing page (widget externo)
- **Google Fonts:** Poppins
