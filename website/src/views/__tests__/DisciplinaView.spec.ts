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
    expect(wrapper.findAll('.catalog__card')).toHaveLength(11)
  })
  it('no catálogo, a apostila chama para ver o material em vez de assistir', async () => {
    const wrapper = await mountAt()
    const [apostila, aula1] = wrapper.findAll('.catalog__card')
    expect(apostila.find('.catalog__go').text()).toBe('Ver material')
    expect(aula1.find('.catalog__go').text()).toBe('Assistir')
  })
  it('com lessonId, mostra a aula focada', async () => {
    const wrapper = await mountAt('aula-5')
    expect(wrapper.find('.focus__title').text()).toContain('Algoritmo Simplex')
    expect(wrapper.find('.catalog__grid').exists()).toBe(false)
  })
  it('na aula focada, o breadcrumb linka de volta para a disciplina', async () => {
    const wrapper = await mountAt('aula-5')
    const crumb = wrapper.find('.focus__crumb')
    expect(crumb.exists()).toBe(true)
    expect(crumb.text()).toContain('Pesquisa Operacional')
    expect(crumb.text()).toContain('Aula 5 de 10')
  })
  it('na apostila da disciplina, o breadcrumb mostra o título em vez de número', async () => {
    const wrapper = await mountAt('apostila')
    const crumb = wrapper.find('.focus__crumb')
    expect(crumb.text()).toContain('Apostila da Disciplina')
    expect(crumb.text()).not.toMatch(/Aula \d+ de/)
    expect(wrapper.find('.focus__player').exists()).toBe(false)
  })
  it('lista todas as aulas no drawer da aula focada', async () => {
    const wrapper = await mountAt('aula-5')
    expect(wrapper.findAll('.drawer__item')).toHaveLength(11)
  })
})
