# Pré-renderizar com vite-ssg + @unhead/vue para SEO

A apresentação é uma **SPA com renderização no cliente (CSR)**: o HTML inicial entregue é uma casca vazia (`<div id="app">`) e todo o conteúdo — catálogo de disciplinas, aulas, materiais — só existe depois que o JavaScript executa. Isso quebra o SEO em dois pontos. Crawlers e, principalmente, **scrapers de preview** (WhatsApp, Telegram, LinkedIn, Slack) que não rodam JS não enxergam nada além da casca, então links compartilhados não geram cartão nem indexação de conteúdo. Além disso, o `index.html` traz um **título único para todas as rotas**, de modo que cada aula/disciplina não tem `<title>` nem meta description próprios.

Decidimos adotar **`vite-ssg` para pré-renderizar (SSG) as rotas em HTML estático no build** e **`@unhead/vue` para gerenciar `<title>` e meta tags por rota**. Assim cada página é servida já com seu conteúdo e seus metadados no HTML inicial — o que crawlers e scrapers precisam — mantendo a hidratação e a navegação SPA no cliente após o carregamento. É a mudança de menor custo que resolve a casca vazia sem trocar de stack.

Alternativas descartadas:

- **Migrar para Nuxt** — resolveria SSG/SEO nativamente, mas exigiria **reescrita desproporcional** ao problema (novo framework, novas convenções de roteamento e de estrutura), jogando fora a base Vue já consolidada.
- **Manter CSR e só injetar meta tags via JS** — daria títulos por rota, mas **não resolve a casca vazia**: quem não executa JavaScript (os scrapers de preview) continua recebendo HTML sem conteúdo.

O **encanamento definido no [ADR 0001](0001-reaproveitar-base-vue-e-redesenhar-apresentacao.md) é mantido**: o modelo de conteúdo `Disciplina → Aula → Parte/Material`, o roteamento (vue-router) e os testes permanecem como estão. O `vite-ssg` roda por cima da mesma aplicação Vue e do mesmo router; esta decisão adiciona a camada de pré-renderização e de metadados, sem reestruturar o conteúdo nem a arquitetura já existentes.
