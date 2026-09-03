# Identidade visual com tema plugável (blue/green)

O site tem duas identidades legítimas: o azul institucional da UNIRIO e o verde da marca do canal no YouTube (logo de grafo). Em vez de escolher uma e perder a outra, adotamos um **sistema de tema com uma flag de configuração `theme: 'blue' | 'green'`** — base neutra light comum, e apenas as cores de marca (mais uma cor de acento complementar) trocam via `data-theme` na raiz do app, propagando também para os tokens do Bootstrap.

**Padrão: `green`** (alinhado à identidade do canal). O azul fica disponível trocando a flag, sem reescrever componentes. Escala tipográfica Major Third (1.25) e grade de 8pt, conforme a pesquisa em `docs/research/video-lesson-ux-patterns.md`.
