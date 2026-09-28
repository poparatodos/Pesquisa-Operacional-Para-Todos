import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppNavbar from '@/layout/AppNavbar.vue'

describe('AppNavbar', () => {
  it('mostra os links das disciplinas', () => {
    const wrapper = mount(AppNavbar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const text = wrapper.text()
    expect(text).toContain('Pesquisa Operacional I')
    expect(text).toContain('Pesquisa Operacional II')
    expect(text).toContain('Problemas Clássicos')
  })
})
