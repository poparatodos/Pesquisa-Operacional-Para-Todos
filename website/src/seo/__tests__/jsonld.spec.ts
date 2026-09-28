import { describe, it, expect } from 'vitest'
import {
  headForRoute,
  disciplineHead,
  lessonHead,
  canonicalUrl,
  PROD_ORIGIN,
} from '@/seo/head'
import { toHeadInput } from '@/seo/apply'
import type { Discipline, Lesson } from '@/types/content'

const SITE = 'Pesquisa Operacional Para Todos'

const disc: Discipline = {
  slug: 'po1',
  title: 'Pesquisa Operacional I',
  subtitle: 'Sub da disciplina.',
  lessons: [],
}
const lesson: Lesson = {
  id: 'aula-5',
  number: 5,
  title: 'Aula 05: Algoritmo Simplex',
  videos: [],
  materials: [],
}

/** Normaliza o `jsonLd` do descritor (objeto único ou array) numa lista. */
function jsonLdNodes(jsonLd: unknown): Record<string, unknown>[] {
  if (!jsonLd) return []
  return (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) as Record<string, unknown>[]
}

/** Primeiro nó JSON-LD com o `@type` pedido. */
function nodeOfType(jsonLd: unknown, type: string): Record<string, unknown> | undefined {
  return jsonLdNodes(jsonLd).find((n) => n['@type'] === type)
}

describe('JSON-LD — EducationalOrganization do site (home)', () => {
  it('a home emite um EducationalOrganization com nome, url de produção e logo', () => {
    const org = nodeOfType(headForRoute('home').jsonLd, 'EducationalOrganization')
    expect(org).toBeTruthy()
    expect(org?.['@context']).toBe('https://schema.org')
    expect(org?.name).toBe(SITE)
    expect(org?.url).toBe(PROD_ORIGIN)
    expect(typeof org?.logo).toBe('string')
    expect((org?.logo as string).startsWith(PROD_ORIGIN)).toBe(true)
  })
})

describe('JSON-LD — Course por Disciplina', () => {
  it('tem @context, @type Course, name e description obrigatórios', () => {
    const course = nodeOfType(disciplineHead(disc).jsonLd, 'Course')
    expect(course).toBeTruthy()
    expect(course?.['@context']).toBe('https://schema.org')
    expect(course?.name).toBe(disc.title)
    expect(typeof course?.description).toBe('string')
    expect((course?.description as string).length).toBeGreaterThan(0)
  })

  it('provider aponta para a EducationalOrganization do site', () => {
    const course = nodeOfType(disciplineHead(disc).jsonLd, 'Course')
    const provider = course?.provider as Record<string, unknown> | undefined
    expect(provider?.['@type']).toBe('EducationalOrganization')
    expect(provider?.name).toBe(SITE)
    expect(provider?.url).toBe(PROD_ORIGIN)
  })
})

describe('JSON-LD — BreadcrumbList (Site › Disciplina)', () => {
  it('emite Site › Disciplina com posições, nomes e URLs absolutas', () => {
    const bc = nodeOfType(disciplineHead(disc).jsonLd, 'BreadcrumbList')
    expect(bc).toBeTruthy()
    expect(bc?.['@context']).toBe('https://schema.org')
    const items = bc?.itemListElement as Record<string, unknown>[]
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({ '@type': 'ListItem', position: 1, name: SITE, item: PROD_ORIGIN })
    expect(items[1]).toMatchObject({
      '@type': 'ListItem',
      position: 2,
      name: disc.title,
      item: canonicalUrl(`/${disc.slug}`),
    })
  })
})

describe('JSON-LD — BreadcrumbList (Site › Disciplina › Aula)', () => {
  it('acrescenta a Aula como terceiro nível com URL absoluta', () => {
    const bc = nodeOfType(lessonHead(disc, lesson).jsonLd, 'BreadcrumbList')
    expect(bc).toBeTruthy()
    const items = bc?.itemListElement as Record<string, unknown>[]
    expect(items).toHaveLength(3)
    expect(items[0]).toMatchObject({ position: 1, name: SITE, item: PROD_ORIGIN })
    expect(items[1]).toMatchObject({
      position: 2,
      name: disc.title,
      item: canonicalUrl(`/${disc.slug}`),
    })
    expect(items[2]).toMatchObject({
      position: 3,
      name: 'Algoritmo Simplex',
      item: canonicalUrl(`/${disc.slug}/${lesson.id}`),
    })
  })
})

describe('toHeadInput — múltiplos blocos JSON-LD', () => {
  it('serializa cada nó JSON-LD num <script application/ld+json> válido', () => {
    const input = toHeadInput(disciplineHead(disc))
    const ld = input.script.filter((s) => s.type === 'application/ld+json')
    expect(ld.length).toBeGreaterThanOrEqual(2)
    for (const s of ld) {
      expect(() => JSON.parse(s.innerHTML)).not.toThrow()
    }
    const types = ld.map((s) => (JSON.parse(s.innerHTML) as Record<string, unknown>)['@type'])
    expect(types).toContain('Course')
    expect(types).toContain('BreadcrumbList')
  })

  it('a home serializa WebSite e EducationalOrganization', () => {
    const input = toHeadInput(headForRoute('home'))
    const types = input.script
      .filter((s) => s.type === 'application/ld+json')
      .map((s) => (JSON.parse(s.innerHTML) as Record<string, unknown>)['@type'])
    expect(types).toContain('WebSite')
    expect(types).toContain('EducationalOrganization')
  })
})
