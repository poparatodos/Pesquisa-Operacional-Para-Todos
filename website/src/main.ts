import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import { installRouteHead } from './seo/apply'
import { initialTheme } from './theme'
import './styles/main.css'

// vite-ssg cuida da criação do app e do router (memory history no build,
// web history no cliente) e injeta o @unhead/vue. Exportamos `createApp` para
// ele consumir tanto na pré-renderização quanto na hidratação.
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL, scrollBehavior: () => ({ top: 0 }) },
  ({ router, head }) => {
    // Toda a lógica de SEO vem do módulo puro src/seo — nunca dos componentes.
    if (head) installRouteHead(router, head)

    if (!import.meta.env.SSR) {
      // Bootstrap só no cliente: acessa window/document e registra o data-api
      // (offcanvas/collapse). O import mantém a mesma instância de módulo usada
      // por Offcanvas.getInstance() nos componentes (senão o hide() vira no-op).
      void import('bootstrap')
      // Aplica o tema (salvo ou padrão) antes do mount, evitando flash.
      document.documentElement.setAttribute('data-theme', initialTheme())
    }
  },
)
