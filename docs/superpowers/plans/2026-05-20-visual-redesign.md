# Redesign Visual — PO para Todos

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Alinhar identidade visual do site com o canal YouTube (dark gray + verde lima + grafo PO), corrigir bugs de mobile/viewport, substituir carrossel por seções em scroll, e adicionar links para o repositório GitHub.

**Architecture:** Híbrido dark/light — navbar, hero, seção GitHub e footer usam `#1C1C1C`; seções de conteúdo usam `#F8F9FA`. Nova navbar horizontal substitui o side-menu. Landing page vira scroll de seções. Páginas internas recebem apenas navbar e page-banner atualizados; toda a infraestrutura do video-loader é preservada intacta.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, flexbox, grid), vanilla JS, Lucide Icons (CDN), Poppins (Google Fonts CDN). Site estático hospedado via GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-05-20-visual-redesign-design.md`

---

## Arquivos Alterados

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `assets/css/style.css` | Modificar | Tokens, navbar, hero, seções landing, footer, mobile |
| `assets/css/pages.css` | Modificar | Page-banner dark, acento verde no accordion |
| `assets/js/menu.js` | Reescrever | Dropdown navbar com backdrop |
| `assets/js/main.js` | Remover referência | Lógica do carrossel — não mais necessária |
| `index.html` | Reescrever | Navbar + hero + seções em scroll substituindo carrossel |
| `pages/po1.html` | Modificar | Atualização da navbar HTML |
| `pages/po2.html` | Modificar | Atualização da navbar HTML |
| `pages/problemas.html` | Modificar | Atualização da navbar HTML |

**Arquivos NÃO tocados (restrição video-loader):**
`assets/js/video-loader.js` · `assets/data/*.json` · nomes de classes do accordion em `pages.css`

---

### Task 1: CSS Design Tokens + Correção do Viewport

**Arquivos:**
- Modificar: `assets/css/style.css` — bloco `:root`
- Modificar: `index.html` — meta viewport

- [ ] **Step 1: Atualizar `:root` em `style.css`**

Substituir o bloco `:root` existente (linhas 4–12) por:

```css
:root {
    /* Dark identity (hero, navbar, footer) */
    --color-bg-dark:    #1C1C1C;
    --color-bg-mid:     #2A2A2A;
    /* Lime green accent */
    --color-green:      #A8D05A;
    --color-green-dim:  #7BA040;
    /* Light content areas */
    --color-bg-light:   #F8F9FA;
    --color-surface:    #FFFFFF;
    /* Text */
    --color-text-light: #FFFFFF;
    --color-text-muted: #AAAAAA;
    --color-text-dark:  #343A40;
    /* Institutional */
    --unirio-blue:      #003366;
    --secondary-blue:   #005A9C;
    /* Navbar height — usado para padding-top das seções */
    --navbar-height:    64px;
}
```

- [ ] **Step 2: Corrigir viewport em `index.html`**

Substituir:
```html
<meta name="viewport" content="width=device-width, initial-scale=0.80">
```
Por:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

- [ ] **Step 3: Verificar tokens no browser**

Abrir `index.html` no browser. DevTools → Elements → selecionar `<html>` → aba Computed. Confirmar `--color-green` resolve `#A8D05A`.

- [ ] **Step 4: Commit**

```
git add assets/css/style.css index.html
git commit -m "style: add design tokens and fix viewport scale"
```

---

### Task 2: Navbar CSS

**Arquivos:**
- Modificar: `assets/css/style.css` — substituir blocos `.side-menu`/`.menu-toggle` por `.navbar`

- [ ] **Step 1: Remover CSS antigo do menu em `style.css`**

Deletar todas as regras para: `.side-menu`, `.side-menu:hover`, `.side-menu__brand`, `.side-menu__logo`, `.side-menu__title`, `.side-menu__list`, `.side-menu__list a`, `.side-menu__list a:hover`, `.side-menu--open`, `.menu-toggle`, `.menu-toggle span`, `.menu-toggle:hover`, `body:has(.side-menu:hover)`.

- [ ] **Step 2: Adicionar navbar CSS em `style.css`** (após o bloco `:root`, antes de `.main-content`)

```css
/* === NAVBAR === */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--navbar-height);
    background-color: var(--color-bg-dark);
    z-index: 1000;
    border-bottom: 1px solid rgba(168, 208, 90, 0.15);
}

.navbar__container {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.navbar__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: var(--color-text-light);
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.navbar__brand:hover { color: var(--color-green); }

.navbar__graph-icon {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
}

.navbar__links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.navbar__links a {
    color: var(--color-text-muted);
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.5rem 0.85rem;
    border-radius: 6px;
    transition: color 0.2s, background-color 0.2s;
    white-space: nowrap;
}

.navbar__links a:hover {
    color: var(--color-text-light);
    background-color: rgba(255, 255, 255, 0.07);
}

.navbar__links a.active { color: var(--color-green); }

.navbar__github-btn {
    display: flex !important;
    align-items: center;
    gap: 0.4rem;
    background-color: transparent !important;
    color: var(--color-green) !important;
    border: 1.5px solid var(--color-green) !important;
    border-radius: 6px !important;
    padding: 0.4rem 0.9rem !important;
    margin-left: 0.5rem;
    font-weight: 600 !important;
    transition: background-color 0.2s, color 0.2s !important;
}

.navbar__github-btn:hover {
    background-color: var(--color-green) !important;
    color: var(--color-bg-dark) !important;
}

.navbar__toggle {
    display: none;
    background: transparent;
    border: none;
    color: var(--color-text-light);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: background-color 0.2s;
}

.navbar__toggle:hover { background-color: rgba(255, 255, 255, 0.1); }

/* Mobile dropdown */
.navbar__dropdown {
    display: none;
    position: fixed;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    background-color: var(--color-bg-dark);
    border-bottom: 1px solid rgba(168, 208, 90, 0.2);
    z-index: 999;
    padding: 0.5rem 0 1rem;
}

.navbar__dropdown.open { display: block; }

.navbar__dropdown ul {
    list-style: none;
    margin: 0;
    padding: 0 1rem;
}

.navbar__dropdown ul a {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-text-muted);
    text-decoration: none;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    padding: 0.9rem 0.75rem;
    border-radius: 8px;
    transition: color 0.2s, background-color 0.2s;
}

.navbar__dropdown ul a:hover {
    color: var(--color-text-light);
    background-color: rgba(255, 255, 255, 0.07);
}

.navbar__dropdown .navbar__github-btn {
    margin-left: 0 !important;
    margin-top: 0.5rem;
}

.navbar__backdrop {
    display: none;
    position: fixed;
    inset: 0;
    top: var(--navbar-height);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
}

.navbar__backdrop.open { display: block; }
```

- [ ] **Step 3: Commit**

```
git add assets/css/style.css
git commit -m "style: add navbar CSS replacing side-menu"
```

---

### Task 3: Reescrever menu.js

**Arquivos:**
- Reescrever: `assets/js/menu.js`

- [ ] **Step 1: Substituir todo o conteúdo de `assets/js/menu.js`**

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.navbar__toggle');
    const dropdown = document.querySelector('.navbar__dropdown');
    const backdrop = document.querySelector('.navbar__backdrop');

    if (!toggle || !dropdown || !backdrop) return;

    function openMenu() {
        dropdown.classList.add('open');
        backdrop.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        dropdown.classList.remove('open');
        backdrop.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
        dropdown.classList.contains('open') ? closeMenu() : openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    dropdown.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});
```

- [ ] **Step 2: Commit**

```
git add assets/js/menu.js
git commit -m "feat: rewrite menu.js for dropdown navbar with backdrop"
```

---

### Task 4: Reescrita completa do index.html

**Arquivos:**
- Reescrever: `index.html`

- [ ] **Step 1: Ler `assets/js/main.js` e confirmar que contém apenas lógica do carrossel**

Abrir o arquivo. Se confirmar que só tem lógica do carrossel (função `moveSlide`, indicadores, autoplay), o arquivo pode ser removido — a referência ao script será removida do HTML.

- [ ] **Step 2: Substituir `index.html` pelo arquivo completo abaixo**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PO para Todos — UNIRIO</title>
    <link rel="icon" type="image/png" href="assets/images/logos/logo_u_unirio.png">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>

    <!-- ===== NAVBAR ===== -->
    <nav class="navbar" aria-label="Navegação principal">
        <div class="navbar__container">
            <a href="index.html" class="navbar__brand">
                <svg class="navbar__graph-icon" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="6"  cy="6"  r="4"   fill="#A8D05A"/>
                    <circle cx="6"  cy="18" r="3"   fill="#A8D05A"/>
                    <circle cx="6"  cy="30" r="3.5" fill="#A8D05A"/>
                    <circle cx="16" cy="12" r="5"   fill="#A8D05A"/>
                    <line x1="6" y1="6"  x2="16" y2="12" stroke="#A8D05A" stroke-width="1.5"/>
                    <line x1="6" y1="6"  x2="6"  y2="18" stroke="#A8D05A" stroke-width="1.5"/>
                    <line x1="6" y1="18" x2="16" y2="12" stroke="#A8D05A" stroke-width="1.5"/>
                    <line x1="6" y1="18" x2="6"  y2="30" stroke="#A8D05A" stroke-width="1.5"/>
                    <circle cx="26" cy="8"  r="3.5" fill="#A8D05A"/>
                    <circle cx="32" cy="18" r="4"   fill="#A8D05A"/>
                    <circle cx="26" cy="28" r="3.5" fill="#A8D05A"/>
                    <circle cx="20" cy="18" r="3"   fill="#A8D05A"/>
                    <line x1="26" y1="8"  x2="32" y2="18" stroke="#A8D05A" stroke-width="1.5"/>
                    <line x1="32" y1="18" x2="26" y2="28" stroke="#A8D05A" stroke-width="1.5"/>
                    <line x1="26" y1="28" x2="20" y2="18" stroke="#A8D05A" stroke-width="1.5"/>
                    <line x1="20" y1="18" x2="26" y2="8"  stroke="#A8D05A" stroke-width="1.5"/>
                </svg>
                <span>PO para Todos</span>
            </a>
            <ul class="navbar__links">
                <li><a href="index.html" class="active">Home</a></li>
                <li><a href="pages/po1.html">PO I</a></li>
                <li><a href="pages/po2.html">PO II</a></li>
                <li><a href="pages/problemas.html">Problemas Clássicos</a></li>
                <li>
                    <a href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
                       class="navbar__github-btn" target="_blank" rel="noopener noreferrer">
                        <i data-lucide="github"></i> GitHub
                    </a>
                </li>
            </ul>
            <button class="navbar__toggle" aria-label="Abrir menu" aria-expanded="false">
                <i data-lucide="menu"></i>
            </button>
        </div>
    </nav>

    <div class="navbar__dropdown" aria-hidden="true">
        <ul>
            <li><a href="index.html"><i data-lucide="home"></i> Home</a></li>
            <li><a href="pages/po1.html"><i data-lucide="book-open"></i> Pesquisa Operacional I</a></li>
            <li><a href="pages/po2.html"><i data-lucide="book-open-check"></i> Pesquisa Operacional II</a></li>
            <li><a href="pages/problemas.html"><i data-lucide="puzzle"></i> Problemas Clássicos</a></li>
            <li>
                <a href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
                   class="navbar__github-btn" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="github"></i> GitHub
                </a>
            </li>
        </ul>
    </div>
    <div class="navbar__backdrop"></div>

    <!-- ===== HERO ===== -->
    <header class="hero">
        <div class="hero__graph" aria-hidden="true">
            <svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                <!-- P -->
                <line x1="60"  y1="50"  x2="60"  y2="300" stroke="#A8D05A" stroke-width="2"/>
                <line x1="60"  y1="50"  x2="160" y2="100" stroke="#A8D05A" stroke-width="2"/>
                <line x1="160" y1="100" x2="160" y2="175" stroke="#A8D05A" stroke-width="2"/>
                <line x1="160" y1="175" x2="60"  y2="175" stroke="#A8D05A" stroke-width="2"/>
                <circle cx="60"  cy="50"  r="18" fill="#A8D05A"/>
                <circle cx="60"  cy="175" r="14" fill="#A8D05A"/>
                <circle cx="60"  cy="300" r="12" fill="#A8D05A"/>
                <circle cx="160" cy="100" r="20" fill="#A8D05A"/>
                <circle cx="160" cy="175" r="16" fill="#A8D05A"/>
                <!-- O -->
                <line x1="310" y1="50"  x2="420" y2="80"  stroke="#A8D05A" stroke-width="2"/>
                <line x1="420" y1="80"  x2="460" y2="175" stroke="#A8D05A" stroke-width="2"/>
                <line x1="460" y1="175" x2="420" y2="270" stroke="#A8D05A" stroke-width="2"/>
                <line x1="420" y1="270" x2="310" y2="300" stroke="#A8D05A" stroke-width="2"/>
                <line x1="310" y1="300" x2="250" y2="270" stroke="#A8D05A" stroke-width="2"/>
                <line x1="250" y1="270" x2="210" y2="175" stroke="#A8D05A" stroke-width="2"/>
                <line x1="210" y1="175" x2="250" y2="80"  stroke="#A8D05A" stroke-width="2"/>
                <line x1="250" y1="80"  x2="310" y2="50"  stroke="#A8D05A" stroke-width="2"/>
                <circle cx="310" cy="50"  r="16" fill="#A8D05A"/>
                <circle cx="420" cy="80"  r="14" fill="#A8D05A"/>
                <circle cx="460" cy="175" r="20" fill="#A8D05A"/>
                <circle cx="420" cy="270" r="14" fill="#A8D05A"/>
                <circle cx="310" cy="300" r="18" fill="#A8D05A"/>
                <circle cx="250" cy="270" r="12" fill="#A8D05A"/>
                <circle cx="210" cy="175" r="16" fill="#A8D05A"/>
                <circle cx="250" cy="80"  r="10" fill="#A8D05A"/>
            </svg>
        </div>
        <div class="hero__content">
            <div class="hero__logos">
                <img src="assets/images/logos/novo logo unirio - horizontal negativo.png"
                     alt="Logo UNIRIO" class="hero__logo">
                <img src="assets/images/logos/Logo proexc.jpg"
                     alt="Logo Pró-Reitoria de Extensão" class="hero__logo hero__logo--proex">
            </div>
            <h1 class="hero__title">Pesquisa Operacional<br>Para Todos</h1>
            <p class="hero__subtitle">Levando a Pesquisa Operacional além da sala de aula</p>
            <div class="hero__ctas">
                <a href="#content" class="btn btn--outline">Explorar Conteúdo ↓</a>
                <a href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
                   class="btn btn--green" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="github"></i> Ver no GitHub
                </a>
            </div>
        </div>
    </header>

    <!-- ===== ACESSE O CONTEÚDO ===== -->
    <section id="content" class="section section--light">
        <div class="section__inner">
            <h2 class="section__title">Acesse o Conteúdo</h2>
            <div class="content-cards">
                <a href="pages/po1.html" class="content-card">
                    <i data-lucide="book-open" class="content-card__icon"></i>
                    <h3>Pesquisa Operacional I</h3>
                    <p>PPL, Simplex, Big-M, Dualidade e Análise de Sensibilidade.</p>
                    <span class="content-card__link">Acessar →</span>
                </a>
                <a href="pages/po2.html" class="content-card">
                    <i data-lucide="book-open-check" class="content-card__icon"></i>
                    <h3>Pesquisa Operacional II</h3>
                    <p>Programação Inteira, Não Linear e outros tópicos avançados.</p>
                    <span class="content-card__link">Acessar →</span>
                </a>
                <a href="pages/problemas.html" class="content-card">
                    <i data-lucide="puzzle" class="content-card__icon"></i>
                    <h3>Problemas Clássicos</h3>
                    <p>Problemas clássicos da PO com exemplos e soluções detalhadas.</p>
                    <span class="content-card__link">Acessar →</span>
                </a>
            </div>
        </div>
    </section>

    <!-- ===== SOBRE O PROJETO ===== -->
    <section id="sobre" class="section section--light section--border-top">
        <div class="section__inner section__inner--narrow">
            <h2 class="section__title">Sobre o Projeto</h2>
            <p>O Projeto de Extensão em Pesquisa Operacional nasceu com o objetivo de democratizar o acesso ao conhecimento dessa disciplina fundamental da Engenharia de Produção e de áreas correlatas. A iniciativa busca aproximar a universidade da comunidade acadêmica e do público em geral, oferecendo conteúdos didáticos em formato acessível, atualizado e gratuito.</p>
            <p>Aqui você encontrará:</p>
            <ul class="about-features-list">
                <li>
                    <i data-lucide="layers"></i>
                    <span><strong>Materiais organizados</strong> das disciplinas PO1 e PO2, com aulas em vídeo e apoio em textos e exercícios.</span>
                </li>
                <li>
                    <i data-lucide="puzzle"></i>
                    <span><strong>Explicações de problemas clássicos</strong> da Pesquisa Operacional, com exemplos práticos.</span>
                </li>
                <li>
                    <i data-lucide="code-2"></i>
                    <span><strong>Algoritmos implementados em Python</strong>, prontos para download e aplicação.</span>
                </li>
                <li>
                    <i data-lucide="github"></i>
                    <span><strong>Código aberto no GitHub</strong> — o site e os algoritmos estão disponíveis publicamente para estudo e contribuição.</span>
                </li>
                <li>
                    <i data-lucide="users"></i>
                    <span>Um <strong>espaço de integração</strong> com as redes sociais do projeto e com a equipe de estudantes que o desenvolve.</span>
                </li>
            </ul>
            <p>Nosso propósito é tornar o ensino de Pesquisa Operacional mais interativo, aberto e inclusivo, contribuindo para a formação de novos profissionais e ampliando o alcance da extensão universitária.</p>
        </div>
    </section>

    <!-- ===== CÓDIGO ABERTO ===== -->
    <section id="github" class="section section--dark">
        <div class="section__inner">
            <div class="github-section">
                <i data-lucide="github" class="github-section__icon"></i>
                <h2>Código Aberto</h2>
                <p>O site e os algoritmos em Python desenvolvidos pelo projeto estão disponíveis publicamente no GitHub. Explore, aprenda com o código e contribua.</p>
                <a href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
                   class="btn btn--green" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="github"></i> Ver repositório no GitHub
                </a>
            </div>
        </div>
    </section>

    <!-- ===== NOSSA EQUIPE ===== -->
    <section id="equipe" class="section section--light section--border-top">
        <div class="section__inner">
            <h2 class="section__title">Nossa Equipe</h2>
            <div class="team-grid">
                <div class="team-card">
                    <img src="assets/images/team/andrea.jpg" alt="Foto de Andréa Bonifácio">
                    <h3>Andréa Bonifácio</h3>
                    <p>Doutora em Engenharia de Produção com Pós-doutorado na COPPE/UFRJ. Professora Associada da UNIRIO, leciona Pesquisa Operacional no curso de Engenharia de Produção e coordena o projeto de extensão "Pesquisa Operacional para todos".</p>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/in/andr%C3%A9a-bonif%C3%A1cio-b718a994/" target="_blank" aria-label="LinkedIn de Andréa"><i data-lucide="linkedin"></i></a>
                        <a href="mailto:andreabonifacio@uniriotec.br" aria-label="Email de Andréa"><i data-lucide="mail"></i></a>
                    </div>
                </div>
                <div class="team-card">
                    <img src="assets/images/team/lucas.jpg" alt="Foto de Lucas Motta">
                    <h3>Lucas Motta</h3>
                    <p>Graduando em Engenharia de Produção. Entusiasta de tecnologia e programação, voltado para dados. Equipe de Desenvolvimento do Site do Projeto.</p>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/in/lucas-motta09/" target="_blank" aria-label="LinkedIn de Lucas"><i data-lucide="linkedin"></i></a>
                        <a href="mailto:lucas.motta09@gmail.com" aria-label="Email de Lucas"><i data-lucide="mail"></i></a>
                    </div>
                </div>
                <div class="team-card">
                    <img src="assets/images/team/nathalia.jpeg" alt="Foto de Nathalia Ferreira">
                    <h3>Nathalia Ferreira</h3>
                    <p>Graduanda em Engenharia de Produção pela UNIRIO. Técnica em Petróleo e Gás pelo Instituto Federal Fluminense (IFF). Interessada em gestão de pessoas e análise de dados. Equipe de Desenvolvimento do Site do Projeto.</p>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/in/nath%C3%A1lia-ferreira-b42745219/" target="_blank" aria-label="LinkedIn de Nathalia"><i data-lucide="linkedin"></i></a>
                        <a href="mailto:nathaliaromeirof@gmail.com" aria-label="Email de Nathalia"><i data-lucide="mail"></i></a>
                    </div>
                </div>
                <div class="team-card">
                    <img src="assets/images/team/joao.jpeg" alt="Foto de João Meirelles">
                    <h3>João Meirelles</h3>
                    <p>Graduando em Engenharia de Produção. Interesse em Cultura Digital, transformação orientada por dados e entusiasta de programação. Equipe de Criação das Vídeo Aulas.</p>
                    <div class="social-icons">
                        <a href="https://www.linkedin.com/in/joao-pedro-meirelles-conceicao-/" target="_blank" aria-label="LinkedIn de João"><i data-lucide="linkedin"></i></a>
                        <a href="mailto:joaopedrojotape@outlook.com" aria-label="Email de João"><i data-lucide="mail"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ===== REDES SOCIAIS ===== -->
    <section id="redes" class="section section--light section--border-top">
        <div class="section__inner">
            <h2 class="section__title">
                <i data-lucide="instagram"></i> Siga-nos
            </h2>
            <p>Acompanhe nosso conteúdo e novidades pelo Instagram!</p>
            <script src="https://elfsightcdn.com/platform.js" async></script>
            <div class="elfsight-app-86d3eb83-cd8c-4958-bda4-680712181bfe" data-elfsight-app-lazy></div>
        </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
        <div class="footer__inner">
            <p>&copy; 2025 Pesquisa Operacional Para Todos — UNIRIO</p>
            <div class="footer__links">
                <a href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
                   target="_blank" rel="noopener noreferrer">
                    <i data-lucide="github"></i> GitHub
                </a>
                <a href="https://www.instagram.com/pesquisaoperacionalparatodos"
                   target="_blank" rel="noopener noreferrer">
                    <i data-lucide="instagram"></i> Instagram
                </a>
            </div>
        </div>
    </footer>

    <script src="assets/js/menu.js" defer></script>
    <script>lucide.createIcons();</script>
</body>
</html>
```

- [ ] **Step 3: Verificar no browser**

Abrir `index.html`. Checar:
- Navbar dark no topo
- Hero com SVG do grafo PO à direita, título branco, subtítulo verde, 2 CTAs
- Scroll revela todas as seções sem corte de conteúdo
- Link "Explorar Conteúdo ↓" faz scroll suave até `#content`
- Botão GitHub abre `https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos` em nova aba

- [ ] **Step 4: Commit**

```
git add index.html
git commit -m "feat: rewrite landing page — scroll sections replacing carousel"
```

---

### Task 5: CSS das Seções da Landing Page

**Arquivos:**
- Modificar: `assets/css/style.css` — remover CSS do carrossel + hero-banner, adicionar CSS de hero, seções, cards, GitHub section e footer

- [ ] **Step 1: Remover CSS obsoleto de `style.css`**

Deletar todos os blocos CSS para:
- `.carousel`, `.carousel-slides`, `.carousel-slide`, `.carousel-slide.active-slide`
- `.carousel-indicators`, `.indicator`, `.indicator::before`, `.indicator.active-indicator::before`
- `.carousel-control`, `.carousel-control:hover`, `.carousel-control.prev`, `.carousel-control.next`
- `.hero-banner`, `.hero-banner::before`, `.hero-banner::after`, `.hero-banner > *`
- `.hero-banner__logo`, `.hero-banner h1`, `.hero-banner p`, `.hero-banner__logo-container`, `.hero-banner__logo--proex`
- `.instagram-title`, `.instagram-button`, `.instagram-button:hover`
- `.index-box`, `.index-list`

**Manter:** `@keyframes gradientShift` — ainda usado por `pages.css`.

- [ ] **Step 2: Adicionar CSS novo em `style.css`** (antes do bloco `@keyframes gradientShift`)

```css
/* === HERO === */
.hero {
    position: relative;
    min-height: 90vh;
    background-color: var(--color-bg-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: var(--navbar-height);
    overflow: hidden;
}

.hero__graph {
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    width: 55%;
    max-width: 600px;
    opacity: 0.18;
    pointer-events: none;
}

.hero__graph svg {
    width: 100%;
    height: auto;
}

.hero__content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem 1.5rem;
    max-width: 700px;
}

.hero__logos {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2.5rem;
}

.hero__logo {
    max-height: 70px;
    width: auto;
}

.hero__logo--proex { max-height: 50px; }

.hero__title {
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 700;
    color: var(--color-text-light);
    line-height: 1.2;
    margin-bottom: 1rem;
}

.hero__subtitle {
    font-size: clamp(1rem, 2vw, 1.25rem);
    font-weight: 300;
    color: var(--color-green);
    margin-bottom: 2.5rem;
}

.hero__ctas {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* === BUTTONS === */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.15s;
}

.btn:hover { transform: translateY(-2px); }

.btn--outline {
    background: transparent;
    color: var(--color-text-light);
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.btn--outline:hover {
    border-color: var(--color-text-light);
    background: rgba(255, 255, 255, 0.08);
}

.btn--green {
    background-color: var(--color-green);
    color: var(--color-bg-dark);
    border: 2px solid var(--color-green);
}

.btn--green:hover {
    background-color: var(--color-green-dim);
    border-color: var(--color-green-dim);
}

/* === SECTIONS === */
.section { padding: 5rem 1.5rem; }
.section--light { background-color: var(--color-bg-light); }
.section--dark  { background-color: var(--color-bg-mid); }
.section--border-top { border-top: 1px solid #e0e0e0; }
.section--dark.section--border-top { border-top: 1px solid rgba(255,255,255,0.08); }

.section__inner {
    max-width: 1100px;
    margin: 0 auto;
}

.section__inner--narrow { max-width: 800px; }

.section__title {
    font-size: 2rem;
    font-weight: 600;
    color: var(--unirio-blue);
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section--dark .section__title { color: var(--color-text-light); }

/* === CONTENT CARDS === */
.content-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.content-card {
    background: var(--color-surface);
    border: 2px solid transparent;
    border-left: 4px solid var(--color-green);
    border-radius: 10px;
    padding: 2rem 1.5rem;
    text-decoration: none;
    color: var(--color-text-dark);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}

.content-card:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.13);
    transform: translateY(-3px);
    border-color: var(--color-green);
}

.content-card__icon {
    color: var(--color-green);
    width: 32px;
    height: 32px;
    flex-shrink: 0;
}

.content-card h3 {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--unirio-blue);
    margin: 0;
}

.content-card p {
    font-size: 0.92rem;
    color: #666;
    line-height: 1.6;
    margin: 0;
    flex: 1;
}

.content-card__link {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-green-dim);
    margin-top: auto;
}

/* === GITHUB SECTION === */
.github-section {
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    color: var(--color-text-light);
}

.github-section__icon {
    width: 56px;
    height: 56px;
    color: var(--color-green);
    margin-bottom: 1.5rem;
}

.github-section h2 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.github-section p {
    font-size: 1rem;
    color: var(--color-text-muted);
    line-height: 1.7;
    margin-bottom: 2rem;
}

/* === SOBRE === */
#sobre p {
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
    color: var(--color-text-dark);
}

/* === TEAM === */
.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}

.team-card { text-align: center; }

.team-card img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 0.5rem;
    border: 3px solid var(--color-green);
}

.team-card h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--unirio-blue);
    margin: 0.5rem 0 0.25rem;
}

.team-card p {
    font-size: 0.88rem;
    color: #555;
    line-height: 1.5;
}

.social-icons { margin-top: 0.75rem; }

.social-icons a {
    color: var(--color-green-dim);
    margin: 0 0.4rem;
    transition: color 0.2s;
}

.social-icons a:hover { color: var(--unirio-blue); }

/* === FOOTER === */
.footer {
    background-color: var(--color-bg-dark);
    border-top: 1px solid rgba(168, 208, 90, 0.15);
    padding: 2rem 1.5rem;
}

.footer__inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    color: var(--color-text-muted);
    font-size: 0.9rem;
}

.footer__links {
    display: flex;
    gap: 1.5rem;
}

.footer__links a {
    color: var(--color-text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: color 0.2s;
}

.footer__links a:hover { color: var(--color-green); }
```

- [ ] **Step 3: Verificar visualmente**

Abrir `index.html` e rolar por todas as seções:
- Hero: fundo `#1C1C1C`, grafo SVG à direita com opacidade baixa, título branco, subtítulo verde
- Cards de conteúdo: fundo branco com borda esquerda verde, hover eleva card
- Seção GitHub: fundo `#2A2A2A`, ícone verde, botão verde
- Equipe: fotos com borda verde no lugar de azul
- Footer: fundo escuro com links brancos que ficam verdes no hover

- [ ] **Step 4: Commit**

```
git add assets/css/style.css
git commit -m "style: hero, sections, cards, github section, footer CSS"
```

---

### Task 6: Navbar HTML nas Páginas Internas

**Arquivos:**
- Modificar: `pages/po1.html`, `pages/po2.html`, `pages/problemas.html`

Atenção: caminhos nas páginas internas usam prefixo `../` para assets do diretório raiz.

- [ ] **Step 1: Ler `pages/problemas.html`**

Verificar se a estrutura é consistente com `po1.html` (mesmo padrão `<header class="main-header">` / `<nav class="side-menu">` / `<main class="main-content">`).

- [ ] **Step 2: Substituir navbar em `pages/po1.html`**

Remover:
```html
<header class="main-header">
    <button class="menu-toggle" ...>...</button>
</header>
<nav class="side-menu">
    <ul class="side-menu__list">...</ul>
</nav>
```

Substituir por (antes da tag `<main>`):

```html
<nav class="navbar" aria-label="Navegação principal">
    <div class="navbar__container">
        <a href="../index.html" class="navbar__brand">
            <svg class="navbar__graph-icon" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="6"  cy="6"  r="4"   fill="#A8D05A"/>
                <circle cx="6"  cy="18" r="3"   fill="#A8D05A"/>
                <circle cx="6"  cy="30" r="3.5" fill="#A8D05A"/>
                <circle cx="16" cy="12" r="5"   fill="#A8D05A"/>
                <line x1="6" y1="6"  x2="16" y2="12" stroke="#A8D05A" stroke-width="1.5"/>
                <line x1="6" y1="6"  x2="6"  y2="18" stroke="#A8D05A" stroke-width="1.5"/>
                <line x1="6" y1="18" x2="16" y2="12" stroke="#A8D05A" stroke-width="1.5"/>
                <line x1="6" y1="18" x2="6"  y2="30" stroke="#A8D05A" stroke-width="1.5"/>
                <circle cx="26" cy="8"  r="3.5" fill="#A8D05A"/>
                <circle cx="32" cy="18" r="4"   fill="#A8D05A"/>
                <circle cx="26" cy="28" r="3.5" fill="#A8D05A"/>
                <circle cx="20" cy="18" r="3"   fill="#A8D05A"/>
                <line x1="26" y1="8"  x2="32" y2="18" stroke="#A8D05A" stroke-width="1.5"/>
                <line x1="32" y1="18" x2="26" y2="28" stroke="#A8D05A" stroke-width="1.5"/>
                <line x1="26" y1="28" x2="20" y2="18" stroke="#A8D05A" stroke-width="1.5"/>
                <line x1="20" y1="18" x2="26" y2="8"  stroke="#A8D05A" stroke-width="1.5"/>
            </svg>
            <span>PO para Todos</span>
        </a>
        <ul class="navbar__links">
            <li><a href="../index.html">Home</a></li>
            <li><a href="po1.html" class="active">PO I</a></li>
            <li><a href="po2.html">PO II</a></li>
            <li><a href="problemas.html">Problemas Clássicos</a></li>
            <li>
                <a href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
                   class="navbar__github-btn" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="github"></i> GitHub
                </a>
            </li>
        </ul>
        <button class="navbar__toggle" aria-label="Abrir menu" aria-expanded="false">
            <i data-lucide="menu"></i>
        </button>
    </div>
</nav>

<div class="navbar__dropdown" aria-hidden="true">
    <ul>
        <li><a href="../index.html"><i data-lucide="home"></i> Home</a></li>
        <li><a href="po1.html"><i data-lucide="book-open"></i> Pesquisa Operacional I</a></li>
        <li><a href="po2.html"><i data-lucide="book-open-check"></i> Pesquisa Operacional II</a></li>
        <li><a href="problemas.html"><i data-lucide="puzzle"></i> Problemas Clássicos</a></li>
        <li>
            <a href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
               class="navbar__github-btn" target="_blank" rel="noopener noreferrer">
                <i data-lucide="github"></i> GitHub
            </a>
        </li>
    </ul>
</div>
<div class="navbar__backdrop"></div>
```

- [ ] **Step 3: Repetir para `pages/po2.html`**

Aplicar a mesma navbar HTML do Step 2, alterando apenas o link ativo:
```html
<li><a href="po2.html" class="active">PO II</a></li>
```
(remover `class="active"` do link PO I)

- [ ] **Step 4: Repetir para `pages/problemas.html`**

Aplicar a mesma navbar HTML, com `active` no link de Problemas:
```html
<li><a href="problemas.html" class="active">Problemas Clássicos</a></li>
```

- [ ] **Step 5: Verificar**

Abrir `pages/po1.html` no browser:
- Navbar dark no topo
- Link "PO I" aparece em verde (active)
- Accordion carrega corretamente (video-loader.js intacto)
- GitHub abre em nova aba

- [ ] **Step 6: Commit**

```
git add pages/po1.html pages/po2.html pages/problemas.html
git commit -m "feat: update inner pages with new navbar"
```

---

### Task 7: pages.css — Page Banner Dark + Acento Verde no Accordion

**Arquivos:**
- Modificar: `assets/css/pages.css`

- [ ] **Step 1: Adicionar `.main-content` padding-top no topo de `pages.css`**

Inserir como primeira regra do arquivo:

```css
.main-content {
    padding-top: var(--navbar-height);
}
```

Isso evita que o page-banner fique escondido atrás da navbar fixa.

- [ ] **Step 2: Atualizar gradiente do `.page-banner::before` para esquema dark**

Substituir o bloco `.page-banner::before` existente por:

```css
.page-banner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(-45deg, #0a0a0a, #1C1C1C, #003366, #005A9C);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
    opacity: 0.92;
}
```

- [ ] **Step 3: Adicionar acento verde ao accordion item ativo**

Substituir a regra `.accordion-item` existente por:

```css
.accordion-item {
    background-color: #fff;
    border: 1px solid #ddd;
    border-left: 4px solid transparent;
    border-radius: 8px;
    margin-bottom: 1rem;
    overflow: hidden;
    transition: border-left-color 0.2s;
}

.accordion-item:has(.accordion-header.active) {
    border-left-color: var(--color-green);
}
```

- [ ] **Step 4: Verificar**

Abrir `pages/po1.html`. Checar:
- Page banner é dark (gradiente escuro com azul UNIRIO)
- Conteúdo do banner não está coberto pela navbar
- Ao clicar em uma aula, a borda esquerda do item fica verde
- Video-loader ainda carrega accordion e vídeos corretamente

- [ ] **Step 5: Commit**

```
git add assets/css/pages.css
git commit -m "style: dark page banner and green accordion accent"
```

---

### Task 8: Mobile Media Queries

**Arquivos:**
- Modificar: `assets/css/style.css` — substituir bloco `@media (max-width: 768px)` existente

- [ ] **Step 1: Substituir o bloco mobile em `style.css`**

Encontrar e substituir o bloco `@media (max-width: 768px)` existente por:

```css
/* ==========================================================================
   RESPONSIVIDADE MOBILE
   ========================================================================== */

@media (max-width: 768px) {

    /* Navbar: mostrar hamburguer, esconder links */
    .navbar__links { display: none; }

    .navbar__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Hero */
    .hero {
        min-height: 80vh;
        padding-top: calc(var(--navbar-height) + 1rem);
    }

    .hero__graph {
        width: 85%;
        right: -40px;
        opacity: 0.10;
    }

    .hero__logos {
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .hero__logo { max-height: 50px; }
    .hero__logo--proex { max-height: 36px; }

    .hero__ctas {
        flex-direction: column;
        align-items: center;
    }

    .hero__ctas .btn {
        width: 100%;
        max-width: 280px;
        justify-content: center;
    }

    /* Sections */
    .section { padding: 3rem 1rem; }
    .section__title { font-size: 1.6rem; }

    /* Cards */
    .content-cards { grid-template-columns: 1fr; }

    /* Team */
    .team-grid { grid-template-columns: 1fr; }

    /* Footer */
    .footer__inner {
        flex-direction: column;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .navbar__brand span { display: none; }
}
```

- [ ] **Step 2: Verificar layout mobile**

Abrir browser DevTools → Device Toolbar → iPhone SE (375px).

Checar:
- Navbar exibe apenas logo + ícone hamburguer
- Tap no hamburguer abre dropdown com todos os links + backdrop escuro
- Tap no backdrop fecha o dropdown
- Hero é legível, grafo no fundo com opacidade reduzida
- Cards empilham verticalmente
- Nenhum scroll horizontal em qualquer seção

- [ ] **Step 3: Commit**

```
git add assets/css/style.css
git commit -m "style: mobile responsive layout for new design"
```

---

## Self-Review

### Cobertura do spec

| Requisito | Task |
|---|---|
| Tokens dark + verde lima | 1 |
| Correção viewport `0.80 → 1.0` | 1 |
| Navbar horizontal substituindo side-menu | 2, 3, 4, 6 |
| Hero dark com grafo SVG PO | 4, 5 |
| Identidade YouTube (dark + verde lima) | 1, 5 |
| Carrossel → seções em scroll | 4 |
| Conteúdo cortado corrigido | 4 (carrossel removido) |
| 3 cards de navegação | 4, 5 |
| Seção Sobre o Projeto | 4, 5 |
| Seção Código Aberto | 4, 5 |
| GitHub na navbar | 2, 4, 6 |
| GitHub seção dedicada | 4, 5 |
| Seção Equipe | 4, 5 |
| Seção Redes Sociais | 4 |
| Footer dark com links GitHub/Instagram | 4, 5 |
| Navbar nas páginas internas | 6 |
| Page banner dark | 7 |
| Acento verde no accordion ativo | 7 |
| `padding-top` em `.main-content` | 7 |
| Menu mobile com hamburguer + backdrop | 2, 3, 8 |
| Layout mobile empilhado | 8 |
| `video-loader.js` intocado | ✓ fora do escopo de todas as tasks |
| Classes CSS do accordion preservadas | ✓ Task 7 só adiciona, nunca renomeia |
| Lucide carregado em todas as páginas | ✓ todos os HTMLs mantêm CDN script |
| `CLAUDE.md` criado | ✓ já commitado no brainstorming |

Todos os requisitos cobertos. Nenhuma lacuna encontrada.
