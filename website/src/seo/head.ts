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
  url?: string
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
 */
export function headForRoute(routeName: RouteName, params: RouteParams = {}): HeadDescriptor {
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
