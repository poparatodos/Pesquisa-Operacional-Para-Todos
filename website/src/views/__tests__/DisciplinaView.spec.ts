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
  it('sem lessonId, mostra o catálogo com todas as aulas', async () => {
    const wrapper = await mountAt()
    expect(wrapper.findAll('.catalog__card')).toHaveLength(10)
  })
  it('com lessonId, mostra a aula focada', async () => {
    const wrapper = await mountAt('aula-5')
    expect(wrapper.find('.focus__title').text()).toContain('Algoritmo Simplex')
    expect(wrapper.find('.catalog__grid').exists()).toBe(false)
  })
  it('lista todas as aulas no drawer da aula focada', async () => {
    const wrapper = await mountAt('aula-5')
    expect(wrapper.findAll('.drawer__item')).toHaveLength(10)
  })
})
