// Geração PURA do sitemap.xml. Deriva as URLs das MESMAS fontes de verdade do
// SEO do site: `ssgRoutes()` (enumeração de todas as rotas pré-renderizadas —
// home, catálogos e cada Aula) e `canonicalUrl()` (URL absoluta de produção,
// sem extensão e sem barra final). Assim os <loc> do sitemap são, por
// construção, IDÊNTICOS às canonical de cada página — sem reescrever nem
// duplicar a lógica de URL (que vive só em src/seo).
//
// Módulo sem efeitos colaterais: apenas monta a string XML. Quem escreve o
// arquivo no build é `scripts/generate-sitemap.ts`.
import { ssgRoutes } from '@/seo/routes'
import { canonicalUrl } from '@/seo/head'

/** Escapa os caracteres reservados de XML num texto de `<loc>`. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * URLs absolutas de produção do sitemap: uma por rota de `ssgRoutes()`, na
 * forma canônica (`canonicalUrl`). Pura e determinística.
 */
export function sitemapUrls(): string[] {
  return ssgRoutes().map((route) => canonicalUrl(route))
}

/**
 * Monta o documento sitemap.xml (urlset 0.9) com um `<loc>` por rota
 * pré-renderizada. Cada `<loc>` é a URL canônica ABSOLUTA de produção.
 */
export function sitemapXml(): string {
  const urls = sitemapUrls()
  const body = urls.map((loc) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`).join('\n')
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    body +
    '\n</urlset>\n'
  )
}
