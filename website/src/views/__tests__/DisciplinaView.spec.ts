import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import DisciplinaView from '@/views/DisciplinaView.vue'

function mountAt(lessonId?: string) {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/po1/:lessonId?', component: DisciplinaView }] })
  router.push(lessonId ? `/po1/${lessonId}` : '/po1')
  return router.isReady().then(() =>
    mount(DisciplinaView, { props: { slug: 'po1' }, global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } } }),
  )
}

describe('DisciplinaView', () => {
  it('lista todas as aulas na sidebar', async () => {
    const wrapper = await mountAt()
    expect(wrapper.findAll('.lesson-nav-item')).toHaveLength(10)
  })
  it('sem lessonId, mostra a primeira aula no painel', async () => {
    const wrapper = await mountAt()
    expect(wrapper.find('.lesson-panel').text()).toContain('Introdução à Pesquisa Operacional')
  })
  it('com lessonId, mostra a aula selecionada', async () => {
    const wrapper = await mountAt('aula-5')
    expect(wrapper.find('.lesson-panel').text()).toContain('Algoritmo Simplex')
  })
})
