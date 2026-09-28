import { describe, it, expect } from 'vitest'
import { headForRoute } from '@/seo/head'
import { toHeadInput } from '@/seo/apply'

describe('headForRoute — home', () => {
  it('devolve title e description não vazios', () => {
    const d = headForRoute('home')
    expect(d.title.length).toBeGreaterThan(0)
    expect(d.description.length).toBeGreaterThan(0)
  })

  it('title e description falam de Pesquisa Operacional', () => {
    const d = headForRoute('home')
    expect(d.title).toContain('Pesquisa Operacional')
    expect(d.description).toContain('Pesquisa Operacional')
  })

  it('define Open Graph com title e description', () => {
    const og = headForRoute('home').og
    expect(og?.title).toBeTruthy()
    expect(og?.description).toBeTruthy()
    expect(og?.type).toBe('website')
  })

  it('é pura: mesma entrada produz a mesma saída', () => {
    expect(headForRoute('home')).toEqual(headForRoute('home'))
    // params extra não altera a home nesta fatia
    expect(headForRoute('home', { foo: 'bar' })).toEqual(headForRoute('home'))
  })
})

describe('headForRoute — fallback', () => {
  it('rota desconhecida ainda tem title e description', () => {
    const d = headForRoute('rota-que-nao-existe')
    expect(d.title.length).toBeGreaterThan(0)
    expect(d.description.length).toBeGreaterThan(0)
  })

  it('name undefined não quebra', () => {
    const d = headForRoute(undefined)
    expect(d.title.length).toBeGreaterThan(0)
  })
})

describe('toHeadInput', () => {
  it('mapeia description para <meta name="description">', () => {
    const home = headForRoute('home')
    const input = toHeadInput(home)
    const desc = input.meta.find((m) => m.name === 'description')
    expect(desc?.content).toBe(home.description)
    expect(input.title).toBe(home.title)
  })

  it('inclui og:title quando há Open Graph', () => {
    const input = toHeadInput(headForRoute('home'))
    const ogTitle = input.meta.find((m) => m.property === 'og:title')
    expect(ogTitle?.content).toBeTruthy()
  })

  it('serializa jsonLd em <script application/ld+json>', () => {
    const input = toHeadInput(headForRoute('home'))
    expect(input.script[0]?.type).toBe('application/ld+json')
    expect(() => JSON.parse(input.script[0]!.innerHTML)).not.toThrow()
  })
})
