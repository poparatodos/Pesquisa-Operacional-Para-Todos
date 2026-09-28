import { describe, it, expect } from 'vitest'
import {
  PROD_ORIGIN,
  OG_IMAGE_URL,
  canonicalUrl,
  headForRoute,
} from '@/seo/head'
import { toHeadInput } from '@/seo/apply'

describe('canonicalUrl — origem de produção + path', () => {
  it('aponta sempre para o domínio de produção', () => {
    expect(PROD_ORIGIN).toBe('https://pesquisaoperacional.uniriotec.br')
    expect(canonicalUrl('/po1/aula-5')).toBe(`${PROD_ORIGIN}/po1/aula-5`)
  })

  it('a home é a própria origem (sem barra final)', () => {
    expect(canonicalUrl('/')).toBe(PROD_ORIGIN)
    expect(canonicalUrl('')).toBe(PROD_ORIGIN)
  })

  it('não tem extensão .html', () => {
    expect(canonicalUrl('/po1/aula-5.html')).toBe(`${PROD_ORIGIN}/po1/aula-5`)
    expect(canonicalUrl('/po1.html')).toBe(`${PROD_ORIGIN}/po1`)
  })

  it('não tem barra final (exceto a origem)', () => {
    expect(canonicalUrl('/po1/')).toBe(`${PROD_ORIGIN}/po1`)
    expect(canonicalUrl('/po1/aula-5/')).toBe(`${PROD_ORIGIN}/po1/aula-5`)
  })

  it('é pura e determinística', () => {
    expect(canonicalUrl('/po2')).toBe(canonicalUrl('/po2'))
  })
})

describe('headForRoute — canonical/og.url/og.image quando recebe o path', () => {
  it('carimba canonical absoluto para a rota', () => {
    const d = headForRoute('po1', { lessonId: 'aula-5' }, '/po1/aula-5')
    expect(d.canonical).toBe(`${PROD_ORIGIN}/po1/aula-5`)
  })

  it('og.url é igual à canonical e og.image é o asset de marca absoluto', () => {
    const d = headForRoute('home', {}, '/')
    expect(d.og?.url).toBe(PROD_ORIGIN)
    expect(d.og?.url).toBe(d.canonical)
    expect(d.og?.image).toBe(OG_IMAGE_URL)
    expect(OG_IMAGE_URL.startsWith(PROD_ORIGIN)).toBe(true)
  })

  it('a canonical de homologação continua apontando para produção (path do router)', () => {
    // Mesmo que o site seja servido sob outro base, a canonical usa o path da rota.
    const d = headForRoute('po2', {}, '/po2')
    expect(d.canonical).toBe(`${PROD_ORIGIN}/po2`)
  })
})

describe('toHeadInput — og:url, og:image e twitter:card', () => {
  it('emite og:url, og:image e twitter:card=summary_large_image', () => {
    const input = toHeadInput(headForRoute('po1', { lessonId: 'aula-5' }, '/po1/aula-5'))
    const ogUrl = input.meta.find((m) => m.property === 'og:url')
    const ogImage = input.meta.find((m) => m.property === 'og:image')
    const twCard = input.meta.find((m) => m.name === 'twitter:card')
    expect(ogUrl?.content).toBe(`${PROD_ORIGIN}/po1/aula-5`)
    expect(ogImage?.content).toBe(OG_IMAGE_URL)
    expect(twCard?.content).toBe('summary_large_image')
  })

  it('emite <link rel="canonical"> absoluto', () => {
    const input = toHeadInput(headForRoute('home', {}, '/'))
    const canonical = input.link.find((l) => l.rel === 'canonical')
    expect(canonical?.href).toBe(PROD_ORIGIN)
  })
})
