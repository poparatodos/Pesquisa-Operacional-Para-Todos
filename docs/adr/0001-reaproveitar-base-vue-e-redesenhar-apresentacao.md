# Reaproveitar a base Vue (vue-refactor) e redesenhar só a apresentação

A refatoração para Vue 3 + TS + Vite + vue-router + conteúdo tipado + testes (branch `vue-refactor`) está correta na arquitetura; a insatisfação era puramente visual e estrutural das telas. Decidimos **manter esse encanamento** (modelo de conteúdo `Disciplina → Aula → Parte/Material`, roteamento, testes) e **reescrever apenas a camada de apresentação**, em vez de recomeçar do zero — evita jogar fora 14 commits estruturados e refazer os mesmos bugs.

O novo fluxo de aula segue a **variante A** do protótipo (`/prototipo`): catálogo de aulas em grade → página de aula focada no player, com anterior/próxima, "Todas as aulas" e um drawer para saltar direto entre aulas. Elimina a sidebar + list-group que existiam antes.
