// Módulo PURO de SEO. Dado o nome de uma rota (e seus params), devolve o
// descritor do <head> daquela página — apenas dados, sem Vue, sem DOM e sem
// nenhuma biblioteca de head. Toda a lógica de SEO do site vive aqui (e não
// dentro dos componentes); a aplicação no documento/SSR fica em `./apply.ts`.
//
// Glossário (ver CONTEXT.md): Disciplina, Aula, Parte, Material.
import type { Discipline, Lesson } from '@/types/content'
import { getDiscipline } from '@/content'
import { cleanTitle } from '@/lib/lesson-format'

/** Metadados Open Graph de uma página. */
export interface OpenGraph {
  title: string
  description: string
  /** Tipo OG (ex.: `website`, `article`). */
  type: string
  siteName: string
  /** URL canônica ABSOLUTA da página (`og:url`); igual à `canonical`. */
  url?: string
  /** URL ABSOLUTA da imagem de card social (`og:image`). */
  image?: string
}

/** Descritor de <head> de uma página — a saída canônica deste módulo. */
export interface HeadDescriptor {
  title: string
  description: string
  canonical?: string
  og?: OpenGraph
  /** Bloco JSON-LD (schema.org) a ser serializado em <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>
}

/** Nome de rota do vue-router (string, símbolo, `null` ou `undefined`). */
export type RouteName = string | symbol | null | undefined

/** Params de rota do vue-router. */
export type RouteParams = Record<string, string | string[]>

const SITE_NAME = 'Pesquisa Operacional Para Todos'

/**
 * Origem canônica de PRODUÇÃO. A `canonical` (e a `og:url`) de TODAS as rotas
 * aponta sempre para este domínio, mesmo quando o site é servido em homologação
 * (GitHub Pages, sob outro base). Convenção combinada com o ticket 06 — NÃO
 * divergir: URL SEM extensão `.html` e SEM barra final (a home é a própria
 * origem).
 */
export const PROD_ORIGIN = 'https://pesquisaoperacional.uniriotec.br'

/**
 * Caminho (relativo à origem de produção) do asset de OG image de marca
 * (1200×630) servido em `website/public/og-image.png`. É um card de marca
 * gerado (gradiente verde institucional + logo UNIRIO + título) — pode ser
 * trocado por uma arte final sem alterar este módulo. Ver `og:image` absoluto
 * abaixo.
 */
export const OG_IMAGE_PATH = '/og-image.png'

/** URL ABSOLUTA da OG image de marca em produção (`og:image` de todas as rotas). */
export const OG_IMAGE_URL = `${PROD_ORIGIN}${OG_IMAGE_PATH}`

/**
 * URL canônica ABSOLUTA de uma rota: `PROD_ORIGIN` + o path da rota, SEM a
 * extensão `.html` e SEM barra final (a home vira a própria origem). Função
 * pura e determinística; o path vem do router (`to.path`).
 */
export function canonicalUrl(path: string): string {
  let p = path.split(/[?#]/)[0] // descarta query/hash defensivamente
  p = p.replace(/\.html$/i, '') // sem extensão
  p = p.replace(/\/+$/, '') // sem barra final → a home ('/') vira ''
  if (p.length > 0 && !p.startsWith('/')) p = `/${p}`
  return `${PROD_ORIGIN}${p}`
}

/**
 * Carimba no descritor a `canonical` absoluta da rota e, quando há Open Graph,
 * a `og:url` (= canonical) e a `og:image` de marca. Mantém a lógica de URL num
 * só lugar (módulo puro), fora dos componentes.
 */
function withUrls(descriptor: HeadDescriptor, path: string): HeadDescriptor {
  const canonical = canonicalUrl(path)
  return {
    ...descriptor,
    canonical,
    og: descriptor.og ? { ...descriptor.og, url: canonical, image: OG_IMAGE_URL } : descriptor.og,
  }
}

const HOME_DESCRIPTION =
  'Videoaulas, materiais e problemas clássicos de Pesquisa Operacional — abertos, ' +
  'gratuitos e para além da sala de aula. Projeto de extensão da UNIRIO.'

const home: HeadDescriptor = {
  title: 'Pesquisa Operacional Para Todos — videoaulas e materiais abertos',
  description: HOME_DESCRIPTION,
  og: {
    title: SITE_NAME,
    description: HOME_DESCRIPTION,
    type: 'website',
    siteName: SITE_NAME,
  },
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: HOME_DESCRIPTION,
    inLanguage: 'pt-BR',
  },
}

/**
 * Descritor mínimo usado quando uma rota ainda não tem SEO próprio nesta fatia.
 * Garante que toda página tenha ao menos um title e uma description válidos.
 */
function fallbackHead(): HeadDescriptor {
  return { title: SITE_NAME, description: HOME_DESCRIPTION }
}

/** Primeira string não vazia (após trim) de uma lista, ou `undefined`. */
function firstNonEmpty(...values: (string | undefined)[]): string | undefined {
  for (const v of values) {
    if (v && v.trim().length > 0) return v
  }
  return undefined
}

/**
 * Descritor de <head> do catálogo de uma Disciplina.
 * `title`: `"{Disciplina} | Pesquisa Operacional Para Todos"`.
 * `description`: `seoDescription` (se houver) senão o `subtitle`, com fallback.
 */
export function disciplineHead(discipline: Discipline): HeadDescriptor {
  const title = `${discipline.title} | ${SITE_NAME}`
  const description = firstNonEmpty(discipline.seoDescription, discipline.subtitle) ?? HOME_DESCRIPTION
  return {
    title,
    description,
    og: { title: discipline.title, description, type: 'website', siteName: SITE_NAME },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: discipline.title,
      description,
      inLanguage: 'pt-BR',
      provider: { '@type': 'Organization', name: SITE_NAME },
    },
  }
}

/**
 * Descritor de <head> de uma Aula — uma landing page por palavra-chave.
 * `title`: `"{Aula} — {Disciplina} | Pesquisa Operacional Para Todos"` (a
 * Aula sem o prefixo "Aula N:", que já vem no título de conteúdo).
 * `description`: `seoDescription` sobrescreve a `description` de conteúdo quando
 * presente; na ausência de ambas, cai num fallback derivado da Disciplina.
 */
export function lessonHead(discipline: Discipline, lesson: Lesson): HeadDescriptor {
  const title = `${cleanTitle(lesson.title)} — ${discipline.title} | ${SITE_NAME}`
  const description =
    firstNonEmpty(lesson.seoDescription, lesson.description) ??
    firstNonEmpty(discipline.seoDescription, discipline.subtitle) ??
    HOME_DESCRIPTION
  return {
    title,
    description,
    og: { title: `${cleanTitle(lesson.title)} — ${discipline.title}`, description, type: 'article', siteName: SITE_NAME },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: cleanTitle(lesson.title),
      description,
      inLanguage: 'pt-BR',
      isPartOf: { '@type': 'Course', name: discipline.title },
    },
  }
}

/**
 * Descritor de <head> para uma rota nomeada. Função pura e determinística:
 * a mesma entrada produz sempre a mesma saída, sem efeitos colaterais.
 *
 * `home` tem SEO próprio; as rotas de Disciplina (`po1`/`po2`/`problemas`, cujo
 * nome coincide com o `slug`) derivam o <head> do conteúdo tipado: com
 * `lessonId` presente e válido, o head da Aula; senão o do catálogo. Rotas
 * desconhecidas caem no fallback.
 *
 * Quando `path` é informado (o `to.path` do router), carimba a `canonical`
 * absoluta de produção, a `og:url` e a `og:image` de marca. Sem `path`, devolve
 * apenas os metadados de conteúdo (usado nos testes puros de conteúdo).
 */
export function headForRoute(
  routeName: RouteName,
  params: RouteParams = {},
  path?: string,
): HeadDescriptor {
  const descriptor = headContent(routeName, params)
  return path === undefined ? descriptor : withUrls(descriptor, path)
}

/** Descritor de conteúdo (title/description/og/jsonLd), sem URLs de rota. */
function headContent(routeName: RouteName, params: RouteParams): HeadDescriptor {
  if (routeName === 'home') return home

  if (typeof routeName === 'string') {
    const discipline = getDiscipline(routeName)
    if (discipline) {
      const lessonId = params.lessonId
      if (typeof lessonId === 'string' && lessonId.length > 0) {
        const lesson = discipline.lessons.find((l) => l.id === lessonId)
        return lesson ? lessonHead(discipline, lesson) : disciplineHead(discipline)
      }
      return disciplineHead(discipline)
    }
  }

  return fallbackHead()
}
