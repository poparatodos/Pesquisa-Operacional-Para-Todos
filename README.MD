# 📘 Documentação do Projeto do Site - Pesquisa Operacional Para Todos

Este documento descreve a estrutura, a lógica de programação e o funcionamento do site estático "Pesquisa Operacional Para Todos", um projeto de extensão da UNIRIO.

# 📂 Estrutura de Diretórios

A organização do projeto segue o padrão de sites estáticos, separando estrutura (HTML), estilo (CSS), comportamento (JS) e dados (JSON).


```text
/
├── index.html                  # Página Inicial (Home)
├── assets/
│   ├── css/
│   │   ├── style.css           # Estilos globais, layout, menu e carrossel
│   │   └── pages.css           # Estilos específicos das páginas de aula (accordion, abas)
│   ├── js/
│   │   ├── main.js             # Lógica do Carrossel da Home
│   │   ├── menu.js             # Lógica de abrir/fechar o menu lateral
│   │   └── video-loader.js     # Carregamento dinâmico de aulas via JSON
│   ├── data/
│   │   ├── po1_videos.json     # Base de dados das aulas de PO1
│   │   └── po2_videos.json     # Base de dados das aulas de PO2
│   ├── images/                 # Imagens do site (logos, equipe, background)
│   └── slides/                 # Arquivos de apoio (PPT, PDF)
└── pages/
    ├── po1.html                # Página da disciplina PO1
    ├── po2.html                # Página da disciplina PO2
    └── problemas.html          # Página de problemas clássicos
```

# 🛠️ Tecnologias Utilizadas

* HTML5: 
Estrutura semântica.

* CSS3: 
Estilização com Flexbox, Grid Layout, Variáveis CSS e Animações.

* JavaScript (Vanilla ES6+): 
Manipulação do DOM, fetch API para dados e interatividade.

* Lucide Icons: 
Biblioteca de ícones leves (carregada via CDN).

* JSON: 
Formato para armazenamento dos dados das aulas.

# 🎨 Estilização (CSS)

## 1. Estilos Globais (style.css)
Arquivo responsável pela identidade visual principal.

Variáveis (:root): Define as cores principais (--unirio-blue, --secondary-blue) e dimensões do menu.

Menu Lateral (.side-menu): Menu fixo à esquerda, oculto por padrão (transform: translateX(-100%)). É ativado via classe .side-menu--open.

Hero Banner (.hero-banner): Possui um fundo com gradiente animado (@keyframes gradientShift) e uma sobreposição de imagem de grafo.

Carrossel (.carousel): Container responsivo que altera a opacidade dos slides (.carousel-slide) para transição.

## 2. Estilos das Páginas Internas (pages.css)
Focado na exibição do conteúdo das aulas.

Accordion (.accordion-item): Estiliza a lista de aulas. Usa max-height e transition para animar a abertura/fechamento dos detalhes.

Abas de Vídeo (.video-tab-container): Estiliza a navegação entre múltiplos vídeos dentro de uma mesma aula (ex: Parte 1, Parte 2).

Container de Vídeo (.video-container): Mantém a proporção 16:9 (padding-bottom: 56.25%) para os iframes do YouTube, garantindo responsividade.

# ⚙️ Lógica JavaScript

## 1. Menu Lateral (menu.js)
Script simples que escuta o clique no botão .menu-toggle.

Função: Alterna a classe side-menu--open no elemento .side-menu, fazendo o menu deslizar para dentro ou fora da tela.

## 2. Carrossel da Home (main.js)
Gerencia a rotação de slides na página inicial.

Inicialização: Cria dinamicamente os "tracinhos" indicadores (.indicator) com base no número de slides.

Autoplay: Muda o slide automaticamente a cada 20 segundos (autoplayDuration).

Ajuste de Altura: A função adjustCarouselHeight() calcula a altura do maior slide e ajusta o container para evitar que o rodapé "pule" durante a troca de slides.

Eventos: Pausa e reinicia o autoplay quando o usuário interage com as setas de navegação.

## 3. Carregador de Aulas (video-loader.js)
Este é o script mais complexo e importante para as páginas de conteúdo (po1.html, etc.).

### Funcionamento:

Detecção: Procura pelo elemento `<div id="accordion-wrapper">`.

Fonte de Dados: Lê o atributo data-json-source deste elemento para saber qual arquivo JSON carregar (ex: po1_videos.json).

Fetch API: Faz uma requisição assíncrona para buscar o JSON.

Renderização: Itera sobre os objetos do JSON e constrói o HTML dinamicamente:

Título e Descrição: Preenche os textos.

Lógica de Vídeos:

Se houver subVideos: Cria uma estrutura de Abas (Tabs) para navegar entre eles.

Se houver apenas youtubeId: Cria um iframe único.

Lógica de Materiais: Verifica se slidesUrl é uma string (link único) ou um array (múltiplos arquivos) e gera os links de download.

Interatividade: Adiciona os eventos de clique ("click listeners") para abrir/fechar o accordion e trocar as abas dos vídeos.

# 💾 Estrutura dos Dados (JSON)

Os arquivos em assets/data/ alimentam as páginas de aula. O sistema suporta dois formatos principais de objeto de aula.

Exemplo 1: Aula com Múltiplos Vídeos e Múltiplos Slides
Utilizado quando uma aula é quebrada em partes.

JSON
```
{
  "id": 4,
  "title": "Aula 04: Equivalência entre PPLs",
  "description": "Descrição da aula...",
  "topics": "Tópicos abordados...",
  "slidesUrl": [
    {
      "title": "Slides - Equivalência",
      "url": "../assets/slides/po1/equivalencia.pptx"
    },
    {
      "title": "Slides - Modelagem",
      "url": "../assets/slides/po1/modelagem.pptx"
    }
  ],
  "subVideos": [
    {
      "title": "Parte 1 - Teoria",
      "youtubeId": "ID_DO_VIDEO_1"
    },
    {
      "title": "Parte 2 - Exercício",
      "youtubeId": "ID_DO_VIDEO_2"
    }
  ]
}
```

Exemplo 2: Aula Simples (1 Vídeo, 1 Arquivo)
Utilizado para aulas diretas. youtubeId é usado diretamente se subVideos for nulo.

JSON
```
{
  "id": 1,
  "youtubeId": "v5KRSzU2E4U",
  "title": "Aula 1: Introdução",
  "description": "Aula introdutória...",
  "topics": "Definição de PO...",
  "slidesUrl": "../assets/slides/po1/introducao.ppt",
  "subVideos": null
}
```
# 🚀 Como Adicionar Novo Conteúdo
## 1. Adicionar uma Nova Aula
Abra o arquivo JSON correspondente em assets/data/ (ex: po1_videos.json).

Adicione um novo objeto ao array seguindo o modelo acima.

Se houver slides, faça o upload do arquivo para assets/slides/ e atualize o caminho no JSON.

Se for um vídeo do YouTube, pegue apenas o ID (a parte após v=), não a URL completa.

## 2. Criar uma Nova Página de Disciplina
Duplique o arquivo pages/po1.html e renomeie (ex: pages/po3.html).

Edite o título `<h1>` no HTML.

Crie um novo arquivo JSON em assets/data/ (ex: po3_videos.json).

No novo HTML, altere o atributo data-json-source para apontar para o novo JSON:

HTML
```
<div id="accordion-wrapper" data-json-source="po3_videos.json">
```
Adicione o link para a nova página no menu lateral em index.html e nas outras páginas.

# 📦 Dependências Externas

### Lucide Icons: 
`<script src="https://unpkg.com/lucide@latest"></script>`

Utilizado para renderizar ícones como setas, livros e logos de redes sociais.

### Elfsight (Opcional): 

Utilizado na Home para o feed do Instagram (script externo).

# 📝 Autores e Créditos

Desenvolvido pela equipe do projeto de extensão Pesquisa Operacional Para Todos - UNIRIO.

Coordenação: Profª Dra. Andréa Bonifácio.

Desenvolvimento: Lucas Motta, Nathalia Ferreira e Larissa Abreu.

Criação de Conteúdo: João Meirelles, Davi Pereira e Renato Lemos.