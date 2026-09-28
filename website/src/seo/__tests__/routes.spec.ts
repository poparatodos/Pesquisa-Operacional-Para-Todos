import { describe, it, expect } from 'vitest'
import { ssgRoutes } from '@/seo/routes'
import { disciplines } from '@/content'
import type { Discipline } from '@/types/content'

describe('ssgRoutes — enumeração para pré-render', () => {
  it('inclui a home', () => {
    expect(ssgRoutes(disciplines)).toContain('/')
  })

  it('inclui a página de catálogo de cada Disciplina', () => {
    const routes = ssgRoutes(disciplines)
    for (const slug of Object.keys(disciplines)) {
      expect(routes).toContain(`/${slug}`)
    }
  })

  it('cobre TODAS as Aulas de todas as Disciplinas', () => {
    const routes = ssgRoutes(disciplines)
    for (const d of Object.values(disciplines)) {
      for (const l of d.lessons) {
        expect(routes).toContain(`/${d.slug}/${l.id}`)
      }
    }
  })

  it('gera exatamente home + catálogos + uma rota por Aula, sem duplicatas', () => {
    const routes = ssgRoutes(disciplines)
    const totalLessons = Object.values(disciplines).reduce((n, d) => n + d.lessons.length, 0)
    const expected = 1 + Object.keys(disciplines).length + totalLessons
    expect(routes).toHaveLength(expected)
    expect(new Set(routes).size).toBe(routes.length)
  })

  it('inclui a Aula de Simplex (/po1/aula-5)', () => {
    expect(ssgRoutes(disciplines)).toContain('/po1/aula-5')
  })

  it('é pura: usa as Disciplinas passadas por parâmetro', () => {
    const only: Record<string, Discipline> = {
      x: { slug: 'x', title: 'X', subtitle: 's', lessons: [{ id: 'aula-1', number: 1, title: 'A', videos: [], materials: [] }] },
    }
    expect(ssgRoutes(only)).toEqual(['/', '/x', '/x/aula-1'])
  })
})
