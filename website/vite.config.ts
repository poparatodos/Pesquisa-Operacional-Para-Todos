import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// Importa o tipo do vite-ssg para trazer a augmentação de `ssgOptions` em UserConfig.
import type { ViteSSGOptions } from 'vite-ssg'

const ssgOptions: ViteSSGOptions = {
  script: 'async',
  formatting: 'minify',
  // Tracer: nesta fatia só a home é pré-renderizada. Evita rastrear as rotas
  // de Disciplina (que carregam bootstrap e não são SSR-safe ainda); elas
  // seguem servidas via SPA fallback (404.html gerado no postbuild).
  includedRoutes: () => ['/'],
}

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  ssgOptions,
})
