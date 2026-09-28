// Passo de build (rodado via vite-node APÓS `vite-ssg build`): escreve
// dist/sitemap.xml. Reaproveita a geração pura de `@/sitemap`, que por sua vez
// deriva as URLs de `ssgRoutes()` + `canonicalUrl()` (src/seo) — logo os <loc>
// batem exatamente com as canonical de cada página pré-renderizada.
//
// Não toca em nada além de dist/sitemap.xml; roda depois do SSG, então não
// interfere na pré-renderização nem no .htaccess/404 (ticket 06).
import { writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { sitemapUrls, sitemapXml } from '@/sitemap'

const outPath = fileURLToPath(new URL('../dist/sitemap.xml', import.meta.url))
writeFileSync(outPath, sitemapXml(), 'utf8')
console.log(`sitemap.xml gerado com ${sitemapUrls().length} URLs → ${outPath}`)
