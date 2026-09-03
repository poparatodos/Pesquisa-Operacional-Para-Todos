# Padrões de UX e design visual para sites de vídeo-aulas

Pesquisa de referência para embasar o redesign do **Pesquisa Operacional Para Todos** (projeto de extensão da UNIRIO). O objetivo é adaptar padrões consagrados de plataformas de curso (Coursera, Udemy, Khan Academy, freeCodeCamp, edX, MIT OCW) ao que é **implementável num site estático pequeno com Vue 3 + Bootstrap 5** — não um LMS completo.

> **Nota sobre evidência.** Onde há pesquisa/medição por trás (ex.: comportamento de consumo de vídeo, comprimento de linha), a fonte é citada. Onde é convenção de design sem número medido, o texto marca explicitamente **[heurística]**. Não inventei tamanhos "oficiais" de plataformas — os valores concretos são escalas/relações padrão de design que você pode adotar, não medições extraídas do CSS da Coursera.

---

## 1. Layout da página de aula

**Padrão dominante:** o player é o elemento âncora, colocado **no topo e ocupando a coluna principal**, com a navegação do currículo numa **coluna lateral estreita** e os textos/materiais **logo abaixo do player**.

O achado mais forte e mais bem medido vem da Nielsen Norman Group sobre vídeo instrucional:

- **Vídeo no topo é o mais assistido.** Vídeos colocados no topo da seção relevante são os mais descobertos; vídeos no rodapé são "frequentemente perdidos" porque as pessoas rolam pouco e percebem baixa prioridade. (NN/g)
- **Cuidado com o "right-rail blindness".** Vídeos colocados numa coluna à direita sofrem cegueira de barra lateral direita e são confundidos com anúncios. (NN/g)

Isso gera uma consequência prática importante para o seu caso: **quem vai à direita é a *lista de aulas* (navegação), nunca o vídeo.** O vídeo fica na coluna principal. A lista de aulas pode ir à esquerda ou à direita — a Udemy usa currículo à direita, a Coursera à esquerda; ambas mantêm o player como conteúdo central e dominante **[heurística]**. Para um projeto pequeno, **lista à esquerda ou player-first com lista colapsável** é a aposta mais segura, porque evita qualquer chance de o conteúdo principal parecer "coluna secundária".

**Larguras e proporções (valores concretos que você pode adotar):**

- **Player:** embed 16:9 responsivo, ocupando 100% da coluna principal. No Bootstrap 5 use `.ratio .ratio-16x9` (sem CSS custom). O `.container` principal pode ir a ~**960–1140px** de largura máxima.
- **Coluna de texto (descrição, tópicos):** limite a largura da *leitura* a **50–75 caracteres por linha**, alvo ~66 CPL — a faixa consolidada por décadas de pesquisa tipográfica (Dyson & Haselgrove; WCAG recomenda não passar de 80). Na prática, ~**60–70ch** ou ~**640–720px** de `max-width` no bloco de texto. O vídeo pode ser mais largo que o texto; só o texto precisa desse teto.
- **Sidebar de aulas:** ~**280–340px** fixos, o resto para o conteúdo **[heurística]**.

**Above the fold (o que precisa aparecer sem rolar):** player + título da aula + duração + um affordance de "onde estou / próxima aula". A descrição longa e os materiais podem ficar logo abaixo da dobra.

---

## 2. Navegação / trilha de aulas

O que ajuda o aluno a se localizar, em ordem de impacto:

1. **Aula ativa destacada de forma inequívoca** — cor de fundo + barra/acento à esquerda + peso de fonte. Estado atual precisa de destaque explícito (cor, negrito, realce). (Eleken)
2. **Estados de progresso: concluída / atual / a seguir.** Concluídas marcadas (✓), atual realçada, próximas visíveis porém "apagadas" (muted). Combine cor **com** rótulo/ícone por acessibilidade — não confie só na cor. (Eleken)
3. **Duração visível em cada aula.** Saber a duração deixa o usuário decidir se assiste agora; mostre a duração de forma proeminente (título/thumbnail), não escondida na barra de progresso. (NN/g)
4. **Numeração explícita** ("Aula 01, 02…") e, se houver módulos, **accordion por módulo**. Para currículos curtos, uma lista numerada plana é melhor que accordion — accordion só compensa quando há muitos itens para agrupar **[heurística]**.
5. **"Step X of Y" / barra de progresso do curso.** Trackers multi-etapa são o padrão para sequências; um "Aula 3 de 10" + barra fina comunica progresso melhor que uma porcentagem solta. Bônus psicológico: **creditar progresso já feito** aumenta a conclusão (começar com algo já marcado). (Eleken)
6. **"Próxima aula" como ação de continuidade** — botão/atalho ao fim do player para o próximo item, reduzindo o custo de navegar de volta à lista.

Como o site é estático, "progresso" pode ser **client-side via `localStorage`** (marcar aula assistida) — barato e de alto valor percebido.

---

## 3. Hierarquia de conteúdo na aula

Ordem e peso visual recomendados, de cima para baixo:

1. **Título da aula** — maior elemento textual da página (ver escala no §4).
2. **Metadados curtos** — duração + número da aula ("Aula 3 de 10 · 14 min"), em texto muted, logo abaixo do título. Duração deve estar acima/junto do vídeo, não só na scrub bar. (NN/g)
3. **Player** (âncora visual).
4. **Descrição** — parágrafo curto, largura limitada a ~65ch.
5. **Tópicos abordados** — como lista ou "chips"/badges, escaneáveis. No seu JSON, o campo `topics` é uma string separada por vírgula; renderize como lista/badges, não como frase corrida.
6. **Materiais para download** — logo após os tópicos, **não** no rodapé de uma página longa (vídeos/recursos no rodapé são perdidos — NN/g). 
7. **Sub-vídeos** (campo `subVideos`), quando houver, como sublista dentro da aula.

Princípio transversal da NN/g: **nunca deixe o vídeo como única fonte.** Sempre ofereça texto/materiais alternativos — descrição, tópicos e slides cumprem esse papel e ainda ajudam SEO e acessibilidade.

---

## 4. Identidade visual com credibilidade acadêmica (sem parecer template genérico)

**Cor.**
- Azul é a cor mais usada em educação por ligação a confiança, inteligência e calma; verde adiciona equilíbrio. **Teal e roxo** vêm sendo adotados por "fugirem do azul corporativo genérico mantendo autoridade". (Verpex; ColorArchive)
- **Base neutra + 1 acento** é a estrutura recomendada: neutros (branco, cinza claro, bege) como base estrutural que reduz fadiga; acento só em CTAs, links e estado ativo. Para público **adulto/superior, use 2–3 cores contidas e mais dessaturadas** (paletas saturadas demais lêem como "infantil"). (Verpex; ColorArchive)
- Ideia aplicável ao seu multi-disciplina: **um acento por disciplina, da mesma família de saturação** (ex.: PO I, PO II, Problemas Clássicos cada um com um tom), mantendo unidade e diferenciando contexto. (ColorArchive)
- Regra prática de dominância: ~60% neutro / ~30% secundário / ~10% acento **[heurística — regra 60-30-10]**.

**Tipografia.**
- **Pareamento serif (título) + sans-serif (corpo)** é o combo clássico que transmite autoridade/tradição no cabeçalho e legibilidade no corpo. (Webflow; JOX-A)
- **Escala modular Major Third (1.25)** — calma, boa para UI com muito conteúdo. Base 16px → **16 / 20 / 25 / 31 / 39 / 49px**. (Figr; type-scale)
- **Corpo 16–18px, line-height 1.5–1.7.** (guias de web typography)
- **Comprimento de linha 50–75 caracteres** (alvo ~66). (UXPin/Baymard; WCAG ≤80)

**Espaçamento.**
- **Grade de 8pt** (espaçamentos múltiplos de 8: 8/16/24/32/48…) dá ritmo consistente. (guias de design system)

**Superfícies.**
- Cards são úteis para itens repetíveis (lista de aulas, materiais), mas **"card em tudo" vira ruído** — para blocos de leitura, superfícies planas com bom espaçamento parecem mais maduras **[heurística]**.

**Erros comuns que fazem parecer amador:**
- Deixar o **azul e os cinzas default do Bootstrap** sem customizar — leitura imediata de "template não-configurado".
- **Muitas cores de acento** / saturação alta demais para público adulto.
- **Espaçamento inconsistente** (valores arbitrários em vez de escala).
- **Hero com foto de banco de imagem** genérica.
- **Sombras pesadas / cantos muito arredondados / gradientes** datados.
- Texto de corpo em largura total da tela (linhas longas demais).
- Hierarquia tipográfica fraca (título pouco maior que o corpo).

---

## 5. Mobile (≤768px)

- **Duas colunas colapsam para uma.** A sidebar de aulas deixa de ser coluna fixa e vira **drawer/acordeão colapsável** (um botão "Aulas / Conteúdo do curso" que abre a lista), ou uma seção colapsável **abaixo** do player. Padrão comum: sidebar some ≤768px e o conteúdo principal ocupa 100%.
- **Player primeiro, full-width, no topo** — mantém o elemento mais assistido acima da dobra. Considere torná-lo *sticky* no topo enquanto o usuário rola a lista **[heurística]**.
- **Ordem vertical recomendada:** player → título → metadados (nº da aula, duração) → botão que abre a lista de aulas → descrição → tópicos → materiais.
- **Progresso vira stepper vertical** ou "Aula X de Y" compacto / barra fina no topo — steppers verticais são citados como a forma adequada ao mobile. (Eleken)
- Alvos de toque ≥44px, tópicos/badges com quebra fluida.

---

## 6. Cinco "moves" de alto impacto e baixo esforço

Elevam um Bootstrap genérico a algo com identidade própria com pouco código:

1. **Sobrescrever as variáveis Sass do Bootstrap** (`$font-family-base`, `$headings-font-family`, `$font-size-base`, `$primary`, `$body-bg`, `$border-radius`, `$spacers`). Trocar a fonte de títulos por **uma serif de display** + definir a **escala 1.25** (16/20/25/31/39/49) e uma paleta neutro+acento já muda 80% da percepção, sem reescrever componentes. *Esforço: baixo. Impacto: altíssimo.*
2. **Componente "Trilha de Aula" bem-feito** — lista numerada com duração, ✓ de concluída (via `localStorage`), aula ativa com acento à esquerda, e "próxima aula". É o componente que mais diferencia de um "menu de links". *Esforço: médio. Impacto: alto.*
3. **Tratamento do hero** institucional mas não genérico: logos da UNIRIO/PROEXC **pequenos e discretos** (não dominando), título em serif de display, um **acento de cor por disciplina** (barra/underline), fundo em cor sólida sutil em vez de foto de banco. *Esforço: baixo. Impacto: alto.*
4. **Sistema de espaçamento 8pt** aplicado com as utilitárias do Bootstrap (`.py-*`, `.gap-*` mapeadas para múltiplos de 8) — dá o "respiro" que separa amador de profissional. *Esforço: baixo. Impacto: médio-alto.*
5. **Microinterações discretas** — transição suave no hover/ativo da lista de aulas, player *sticky*, badge de duração, marca de "assistida". *Esforço: baixo. Impacto: médio.*

---

## Recomendações para o PO Para Todos (mapa padrão → componente)

Estado atual: páginas HTML com `hero-banner` + `accordion-wrapper` que carrega aulas de JSON (`po1_videos.json` etc.). Modelo de dados por aula: `title`, `description`, `topics` (string separada por vírgula), `slidesUrl` (array `{title,url}`), `subVideos`. Alvo do redesign: componentes Vue **HeroBanner**, **DisciplinaView** (sidebar de aulas), **LessonPanel/player**, **MaterialList**.

### HeroBanner
- Logos institucionais **pequenos**; título da disciplina em **serif de display** (escala ~39–49px desktop); subtítulo curto em sans muted.
- **Acento de cor por disciplina** (PO I / PO II / Problemas Clássicos), da mesma família de saturação — barra ou underline, não fundo colorido inteiro.
- Fundo neutro/sólido sutil, sem foto genérica. Fonte: NN/g (evitar genérico), ColorArchive (acento por área/mesma saturação).

### DisciplinaView — sidebar / trilha de aulas
- Trocar o accordion atual por uma **trilha lateral** (esquerda, ~300px, *sticky*): lista **numerada**, **duração** por aula, **aula ativa** com acento à esquerda + fundo, **✓ de concluída** via `localStorage`, indicador **"Aula X de N"** + barra fina de progresso.
- Nunca colocar o *vídeo* à direita (right-rail blindness); a lista pode ir à direita, mas à esquerda é mais seguro para currículo curto.
- **Mobile:** vira drawer/acordeão colapsável ("Conteúdo do curso") abaixo do player. Fontes: Eleken (estados/progresso), NN/g (duração, right-rail), padrão responsivo ≤768px.

### LessonPanel / player
- **Player 16:9 no topo** da coluna principal (`.ratio.ratio-16x9`), largura total da coluna.
- Ordem: **título → metadados (nº + duração) → player → descrição (max ~65ch) → tópicos como badges → materiais → subVideos**.
- Botão **"Próxima aula"** ao fim. Fontes: NN/g (vídeo no topo; duração proeminente; nunca vídeo como única fonte; comprimento de linha).

### MaterialList
- **Logo abaixo da descrição/tópicos**, não no rodapé. Cada item = card compacto com **ícone do tipo de arquivo** (.ppt/.pptx), título e affordance de download claro.
- Renderizar `slidesUrl` (array) como lista de cards; tratar `slidesUrl: null` escondendo a seção. Fonte: NN/g (recursos no rodapé são perdidos; oferecer alternativa textual ao vídeo).

### Tokens transversais (aplicar via Sass override do Bootstrap)
- **Tipografia:** serif display em `$headings-font-family`; sans legível em `$font-family-base`; `$font-size-base: 1rem` (16px) com escala 1.25 → 20/25/31/39/49; line-height corpo 1.5–1.7.
- **Cor:** base neutra + 1 acento primário (azul/teal/verde) + acento por disciplina; 2–3 cores contidas (público universitário). Regra 60-30-10 [heurística].
- **Espaçamento:** escala de 8pt via `$spacers`.
- **Superfícies:** cards só para itens repetíveis (aulas, materiais); blocos de leitura em superfície plana.

---

## Fontes

- Nielsen Norman Group — *Videos as Instructional Content: User Behaviors and UX Guidelines* — https://www.nngroup.com/articles/instructional-video-guidelines/ (posição do vídeo no topo, right-rail blindness, mostrar duração, segmentar em vídeos curtos com capítulos, nunca deixar o vídeo como única fonte)
- Eleken — *Progress Indicator UX Types, Best Practices, and Examples* — https://www.eleken.co/blog-posts/progress-indicator-ux (estados concluída/atual/próxima, "Step X of Y", creditar progresso, steppers verticais no mobile)
- UXPin — *Optimal Line Length for Readability: The 50–75 Character Rule* — https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/ (50–75 CPL, alvo ~66)
- Baymard Institute — *Readability: The Optimal Line Length* — https://baymard.com/blog/line-length-readability
- Verpex — *Best Color Combinations for Educational Websites* — https://verpex.com/blog/best-color-combinations-for-educational-websites (azul=confiança; base neutra + acento; combos recomendados)
- ColorArchive — *Education Brand Color Palettes* — https://colorarchive.org/guides/education-brand-color-palette/ (teal/roxo com autoridade; 2–3 cores contidas para adulto; acento por área na mesma saturação)
- Webflow Blog — *Color and typography pairings: A designer's cheatsheet* — https://webflow.com/blog/color-and-typography-pairings (serif título + sans corpo)
- JOX-A Design — *How to Pair Serif and Sans-Serif Fonts on Websites* — https://www.joxadesign.com/how-to-pair-serif-and-sans-serif-fonts-on-websites-7-combinations-that-actually-work/
- Figr — *Typography System Design: Building Type Scales* — https://figr.design/blog/typography-system-design (Major Third 1.25; base 16 → 20/25/31/39/49)
- iSpring — *UI/UX best practices for your online courses* — https://www.ispringsolutions.com/blog/how-to-create-online-course/lesson-7
- UXPin — *Progress Tracker Design: UX Best Practices* — https://www.uxpin.com/studio/blog/design-progress-trackers/ (stepper vertical / "Step X of Y" / barra fina no mobile)
- Verpex/Adobe/Progress — psicologia da cor em educação (referências corroborantes de azul/verde para confiança e foco)
