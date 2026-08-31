import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import App from '@/App.vue'
import { router } from '@/router'

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
