import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProblemasView from '@/views/ProblemasView.vue'

describe('ProblemasView', () => {
  it('mostra estado vazio quando não há conteúdo', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/problemas/:lessonId?', component: ProblemasView }] })
    router.push('/problemas')
    await router.isReady()
    const wrapper = mount(ProblemasView, { global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } } })
    expect(wrapper.text()).toContain('em breve')
  })
})
