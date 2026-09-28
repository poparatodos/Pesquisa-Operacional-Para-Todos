import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import MaterialList from '@/components/lessons/MaterialList.vue'
import type { Material } from '@/types/content'

const materials: Material[] = [
  { title: 'Slides - Introdução', url: '/materiais/po1/introducao.pptx' },
  { title: 'Lista de Exercícios', url: '/materiais/po1/lista-1.pdf' },
]

describe('MaterialList', () => {
  it('prefixa os links de material com o base path do Vite', () => {
    const wrapper = mount(MaterialList, { props: { materials } })
    const links = wrapper.findAll('a')
    expect(links).toHaveLength(materials.length)
    links.forEach((link, i) => {
      const expectedHref = import.meta.env.BASE_URL.replace(/\/$/, '') + materials[i].url
      expect(link.attributes('href')).toBe(expectedHref)
    })
  })

  it('mostra mensagem de vazio quando não há materiais', () => {
    const wrapper = mount(MaterialList, { props: { materials: [] } })
    expect(wrapper.text()).toContain('Nenhum material disponível')
    expect(wrapper.findAll('a')).toHaveLength(0)
  })
})
