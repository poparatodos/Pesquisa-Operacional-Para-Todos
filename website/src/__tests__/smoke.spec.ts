import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { routes } from '@/router'

// O router "de produção" passou a ser criado pelo vite-ssg (ver src/main.ts),
// então o teste monta o seu próprio a partir de `routes`, como os demais specs.
const router = createRouter({ history: createMemoryHistory(), routes })

describe('App', () => {
  beforeEach(() => {
    router.push('/')
  })

  it('renderiza o título do projeto', async () => {
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Pesquisa Operacional Para Todos')
  })
})
