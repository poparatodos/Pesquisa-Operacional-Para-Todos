import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { routes } from '@/router'

// A NotFoundView é pré-renderizada em dist/404.html (ver vite.config.ts) e
// servida pelo `ErrorDocument 404 /404.html` do .htaccess. Aqui garantimos que
// uma rota inexistente resolve para o catch-all e mostra conteúdo de "não
// encontrada" — distinto da home.
const router = createRouter({ history: createMemoryHistory(), routes })

describe('rota inexistente (404)', () => {
  it('renderiza a NotFoundView com conteúdo de "não encontrada"', async () => {
    router.push('/rota-que-nao-existe')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Página não encontrada')
    expect(wrapper.text()).toContain('404')
  })
})
