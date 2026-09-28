import { describe, it, expect } from 'vitest'
import { headForRoute, lessonHead, disciplineHead } from '@/seo/head'
import { disciplines } from '@/content'
import type { Discipline, Lesson } from '@/types/content'

const SITE = 'Pesquisa Operacional Para Todos'

const disc: Discipline = { slug: 'po1', title: 'Pesquisa Operacional I', subtitle: 'Sub da disciplina.', lessons: [] }
const lessonBase: Lesson = { id: 'aula-5', number: 5, title: 'Aula 05: Algoritmo Simplex', videos: [], materials: [] }

describe('lessonHead — título da Aula', () => {
  it('usa o formato "{Aula} — {Disciplina} | Pesquisa Operacional Para Todos"', () => {
    const d = lessonHead(disc, lessonBase)
    expect(d.title).toBe(`Algoritmo Simplex — Pesquisa Operacional I | ${SITE}`)
  })

  it('title é não vazio', () => {
    expect(lessonHead(disc, lessonBase).title.length).toBeGreaterThan(0)
  })
})

describe('lessonHead — descrição e fallback de seoDescription', () => {
  it('seoDescription sobrescreve a descrição de conteúdo quando presente', () => {
    const lesson: Lesson = { ...lessonBase, description: 'Descrição de conteúdo fraca.', seoDescription: 'Aprenda o método Simplex passo a passo com exemplos resolvidos.' }
    expect(lessonHead(disc, lesson).description).toBe('Aprenda o método Simplex passo a passo com exemplos resolvidos.')
  })

  it('usa a descrição de conteúdo quando não há seoDescription', () => {
    const lesson: Lesson = { ...lessonBase, description: 'Resolução de PPL pelo algoritmo Simplex.' }
    expect(lessonHead(disc, lesson).description).toBe('Resolução de PPL pelo algoritmo Simplex.')
  })

  it('cai num fallback não vazio quando não há descrição nem seoDescription', () => {
    const lesson: Lesson = { ...lessonBase, description: undefined }
    const d = lessonHead(disc, lesson)
    expect(d.description.length).toBeGreaterThan(0)
  })

  it('define Open Graph do tipo article', () => {
    expect(lessonHead(disc, lessonBase).og?.type).toBe('article')
  })
})

describe('disciplineHead — catálogo da Disciplina', () => {
  it('title contém a Disciplina e o nome do site', () => {
    const d = disciplineHead(disc)
    expect(d.title).toContain('Pesquisa Operacional I')
    expect(d.title).toContain(SITE)
  })

  it('description usa o subtitle por padrão e seoDescription quando presente', () => {
    expect(disciplineHead(disc).description).toBe('Sub da disciplina.')
    expect(disciplineHead({ ...disc, seoDescription: 'Descrição SEO da disciplina.' }).description).toBe('Descrição SEO da disciplina.')
  })
})

describe('headForRoute — rotas de Disciplina e Aula (conteúdo real)', () => {
  it('cada Aula produz um title único e não vazio', () => {
    const titles: string[] = []
    for (const d of Object.values(disciplines)) {
      for (const l of d.lessons) {
        const head = headForRoute(d.slug, { lessonId: l.id })
        expect(head.title.length).toBeGreaterThan(0)
        titles.push(head.title)
      }
    }
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('a Aula de Simplex tem título e descrição específicos', () => {
    const d = headForRoute('po1', { lessonId: 'aula-5' })
    expect(d.title).toBe(`Algoritmo Simplex — Pesquisa Operacional I | ${SITE}`)
    expect(d.description).toContain('simplex')
  })

  it('rota de Disciplina sem lessonId devolve o head do catálogo', () => {
    const d = headForRoute('po1')
    expect(d.title).toContain('Pesquisa Operacional I')
    expect(d.title).toContain(SITE)
  })

  it('lessonId inexistente não quebra: cai no head da Disciplina', () => {
    const d = headForRoute('po1', { lessonId: 'aula-999' })
    expect(d.title.length).toBeGreaterThan(0)
    expect(d.title).toContain('Pesquisa Operacional I')
  })

  it('é pura: mesma entrada, mesma saída', () => {
    expect(headForRoute('po1', { lessonId: 'aula-5' })).toEqual(headForRoute('po1', { lessonId: 'aula-5' }))
  })
})
