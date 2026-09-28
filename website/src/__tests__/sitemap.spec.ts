import { describe, it, expect } from 'vitest'
import { sitemapUrls, sitemapXml } from '@/sitemap'
import { ssgRoutes } from '@/seo/routes'
import { canonicalUrl, PROD_ORIGIN } from '@/seo/head'

describe('sitemap — geração a partir de ssgRoutes + canonicalUrl', () => {
  it('tem uma URL por rota pré-renderizada (mesma contagem de ssgRoutes)', () => {
    expect(sitemapUrls()).toHaveLength(ssgRoutes().length)
  })

  it('cada <loc> é EXATAMENTE a canonical da rota correspondente', () => {
    const expected = ssgRoutes().map((r) => canonicalUrl(r))
    expect(sitemapUrls()).toEqual(expected)
  })

  it('todas as URLs são absolutas de produção (origem PROD_ORIGIN)', () => {
    for (const loc of sitemapUrls()) {
      expect(loc.startsWith(PROD_ORIGIN)).toBe(true)
    }
  })

  it('a home é a própria origem (sem barra final)', () => {
    expect(sitemapUrls()).toContain(PROD_ORIGIN)
  })

  it('o XML é um urlset 0.9 com um <loc> por rota', () => {
    const xml = sitemapXml()
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('http://www.sitemaps.org/schemas/sitemap/0.9')
    const locs = xml.match(/<loc>/g) ?? []
    expect(locs).toHaveLength(ssgRoutes().length)
  })

  it('inclui o <loc> da Aula de Simplex (canonical de /po1/aula-5)', () => {
    expect(sitemapXml()).toContain(`<loc>${canonicalUrl('/po1/aula-5')}</loc>`)
  })
})
