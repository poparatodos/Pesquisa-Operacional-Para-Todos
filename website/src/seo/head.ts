// Módulo PURO de SEO. Dado o nome de uma rota (e seus params), devolve o
// descritor do <head> daquela página — apenas dados, sem Vue, sem DOM e sem
// nenhuma biblioteca de head. Toda a lógica de SEO do site vive aqui (e não
// dentro dos componentes); a aplicação no documento/SSR fica em `./apply.ts`.
//
// Glossário (ver CONTEXT.md): Disciplina, Aula, Parte, Material.

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

/**
 * Descritor de <head> para uma rota nomeada. Função pura e determinística:
 * a mesma entrada produz sempre a mesma saída, sem efeitos colaterais.
 *
 * Nesta fatia (tracer) apenas a `home` tem SEO próprio; as demais rotas caem no
 * fallback. As próximas fatias acrescentam Disciplina/Aula/Parte a partir de
 * `params` (ex.: `slug`, `lessonId`).
 */
export function headForRoute(routeName: RouteName, params: RouteParams = {}): HeadDescriptor {
  void params // reservado para Disciplina/Aula/Parte nas próximas fatias
  switch (routeName) {
    case 'home':
      return home
    default:
      return fallbackHead()
  }
}
