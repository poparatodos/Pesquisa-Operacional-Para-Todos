import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from '@/App.vue'

describe('App', () => {
  it('renderiza o título do projeto', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Pesquisa Operacional Para Todos')
  })
})
