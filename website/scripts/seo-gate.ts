// Gate de SEO (rodado via vite-node APÓS o build): varre o `dist/` e AFIRMA,
// por página HTML de rota, os invariantes de SEO que os tickets 04/05 passaram a
// garantir. É a verificação objetiva que barra regressões no CI — não altera
// nada em src/seo, apenas LÊ e valida o artefato de build.
//
// Fonte das rotas: `ssgRoutes()` (src/seo) — a MESMA enumeração usada pelo SSG
// (vite.config.ts) e pelo sitemap. Assim o gate cobre exatamente as páginas
// pré-renderizadas; a `dist/404.html` fica de fora de propósito (reaproveita o
// title/description da home e não é uma rota de conteúdo).
//
// Afirma, por rota:
//   - <title> presente, não vazio e ÚNICO entre as rotas
//   - <meta name="description"> presente e não vazio
//   - <link rel="canonical"> presente
// Sai com código ≠ 0 e lista as páginas que falharem.
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { JSDOM } from 'jsdom'
import { ssgRoutes } from '../src/seo/routes'

const distDir = fileURLToPath(new URL('../dist', import.meta.url))

/** Caminho do HTML pré-renderizado de uma rota: `/` → index.html; `/po1` →
 * po1.html; `/po1/aula-1` → po1/aula-1.html. */
function routeToHtmlPath(route: string): string {
  if (route === '/') return `${distDir}/index.html`
  return `${distDir}/${route.replace(/^\//, '')}.html`
}

/** Metadados de SEO extraídos de um documento HTML. */
interface PageSeo {
  title: string | null
  description: string | null
  hasCanonical: boolean
}

function readSeo(html: string): PageSeo {
  const { document } = new JSDOM(html).window
  const titleEl = document.querySelector('title')
  const descEl = document.querySelector('meta[name="description"]')
  const canonicalEl = document.querySelector('link[rel="canonical"]')
  return {
    title: titleEl ? titleEl.textContent : null,
    description: descEl ? descEl.getAttribute('content') : null,
    hasCanonical: canonicalEl != null,
  }
}

const nonEmpty = (v: string | null): boolean => v != null && v.trim().length > 0

const errors: string[] = []
// route -> title, para checar unicidade só entre páginas cujo title é válido.
const titlesByRoute = new Map<string, string>()

for (const route of ssgRoutes()) {
  const file = routeToHtmlPath(route)
  if (!existsSync(file)) {
    errors.push(`[${route}] HTML de rota ausente em dist: ${file}`)
    continue
  }
  const seo = readSeo(readFileSync(file, 'utf8'))

  if (!nonEmpty(seo.title)) {
    errors.push(`[${route}] <title> ausente ou vazio`)
  } else {
    titlesByRoute.set(route, seo.title!.trim())
  }
  if (!nonEmpty(seo.description)) {
    errors.push(`[${route}] <meta name="description"> ausente ou vazio`)
  }
  if (!seo.hasCanonical) {
    errors.push(`[${route}] <link rel="canonical"> ausente`)
  }
}

// Unicidade de <title>: agrupa rotas por título e reporta cada colisão.
const routesByTitle = new Map<string, string[]>()
for (const [route, title] of titlesByRoute) {
  const list = routesByTitle.get(title) ?? []
  list.push(route)
  routesByTitle.set(title, list)
}
for (const [title, routes] of routesByTitle) {
  if (routes.length > 1) {
    errors.push(`<title> duplicado em ${routes.join(', ')}: "${title}"`)
  }
}

if (errors.length) {
  console.error('Gate de SEO FALHOU:\n' + errors.map((e) => ' - ' + e).join('\n'))
  process.exit(1)
}
console.log(`Gate de SEO OK: ${ssgRoutes().length} rotas com title único/description/canonical.`)
