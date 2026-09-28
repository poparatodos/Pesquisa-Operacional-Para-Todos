import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// Importa o tipo do vite-ssg para trazer a augmentação de `ssgOptions` em UserConfig.
import type { ViteSSGOptions } from 'vite-ssg'
// Enumeração das rotas de pré-render derivada do conteúdo tipado. `ssgRoutes`
// usa imports relativos justamente para ser carregável aqui (o loader de config
// não conhece o alias `@/`); os `import type` do conteúdo são apagados no bundle.
import { ssgRoutes } from './src/seo/routes'

const ssgOptions: ViteSSGOptions = {
  script: 'async',
  formatting: 'minify',
  // Pré-renderiza a home, o catálogo de cada Disciplina e CADA Aula como HTML
  // próprio (cada Aula é uma landing page por palavra-chave). As views de
  // Disciplina/Aula já são SSR-safe (bootstrap é importado sob demanda só no
  // cliente — ver LessonDrawer.vue e main.ts).
  //
  // Acrescenta '/404' (fora de src/seo, que é a enumeração de rotas de SEO) para
  // gerar uma dist/404.html REAL a partir da NotFoundView — usada pelo
  // `ErrorDocument 404 /404.html` do public/.htaccess. Substitui o antigo
  // postbuild que copiava a index.html (soft-404).
  includedRoutes: () => [...ssgRoutes(), '/404'],
}

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  ssgOptions,
})
