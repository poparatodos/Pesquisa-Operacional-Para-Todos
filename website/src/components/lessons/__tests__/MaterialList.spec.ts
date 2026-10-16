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

  it('abre link externo sem base path e sem download', () => {
    const wrapper = mount(MaterialList, {
      props: { materials: [{ title: 'LINDO Systems', url: 'https://www.lindo.com/', kind: 'link' }] },
    })
    const a = wrapper.get('a')
    expect(a.attributes('href')).toBe('https://www.lindo.com/')
    expect(a.attributes('download')).toBeUndefined()
    expect(a.find('i').classes()).toContain('bi-box-arrow-up-right')
  })

  it('usa ícone por tipo e trata material sem tipo como slides', () => {
    const wrapper = mount(MaterialList, {
      props: {
        materials: [
          { title: 'Slides', url: '/materiais/po1/a.pptx' },
          { title: 'Gabarito', url: '/materiais/po1/b.pdf', kind: 'gabarito' },
        ],
      },
    })
    const icons = wrapper.findAll('a i').map((i) => i.classes())
    expect(icons[0]).toContain('bi-file-earmark-slides')
    expect(icons[1]).toContain('bi-file-earmark-check')
  })

  it('ordena por tipo: slides, apostila, lista, gabarito, link', () => {
    const wrapper = mount(MaterialList, {
      props: {
        materials: [
          { title: 'L', url: 'https://x.org/', kind: 'link' },
          { title: 'G', url: '/g.pdf', kind: 'gabarito' },
          { title: 'E', url: '/e.docx', kind: 'lista' },
          { title: 'A', url: '/a.pdf', kind: 'apostila' },
          { title: 'S', url: '/s.pptx', kind: 'slides' },
        ],
      },
    })
    expect(wrapper.findAll('a').map((a) => a.text())).toEqual(['S', 'A', 'E', 'G', 'L'])
  })
})
