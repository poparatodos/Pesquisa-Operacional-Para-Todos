// Ponte entre o módulo PURO de SEO (`./head.ts`) e o mundo com efeitos: o
// vue-router e o @unhead/vue (instalado pelo vite-ssg). Mantém os componentes
// `.vue` livres de qualquer lógica de SEO — quem decide o <head> é `headForRoute`,
// quem o aplica ao documento/SSR é este arquivo.
import type { Router } from 'vue-router'
import type { UseHeadInput, VueHeadClient } from '@unhead/vue'
import { headForRoute, type HeadDescriptor, type RouteParams } from './head'

/** Uma tag <meta>: `name` OU `property`, sempre com `content`. */
export interface MetaEntry {
  name?: string
  property?: string
  content: string
}

/** Entrada no formato que o @unhead/vue consome (subconjunto que usamos). */
export interface HeadInput {
  title: string
  meta: MetaEntry[]
  link: { rel: string; href: string }[]
  script: { type: string; innerHTML: string }[]
}

/**
 * Converte um `HeadDescriptor` (dados puros) na entrada do @unhead/vue.
 * Função pura: sem tocar em DOM nem no router.
 */
export function toHeadInput(descriptor: HeadDescriptor): HeadInput {
  const meta: MetaEntry[] = [{ name: 'description', content: descriptor.description }]

  if (descriptor.og) {
    const og = descriptor.og
    meta.push(
      { property: 'og:title', content: og.title },
      { property: 'og:description', content: og.description },
      { property: 'og:type', content: og.type },
      { property: 'og:site_name', content: og.siteName },
    )
    if (og.url) meta.push({ property: 'og:url', content: og.url })
    if (og.image) {
      // Card social grande com a imagem de marca. `twitter:card` só faz sentido
      // com uma imagem; emitimos os dois juntos.
      meta.push(
        { property: 'og:image', content: og.image },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: og.image },
      )
    }
  }

  const link = descriptor.canonical ? [{ rel: 'canonical', href: descriptor.canonical }] : []
  // `jsonLd` pode ser um objeto único OU uma lista: cada nó vira um <script>
  // próprio, pois um <script application/ld+json> carrega um único objeto.
  const jsonLdNodes = descriptor.jsonLd
    ? Array.isArray(descriptor.jsonLd)
      ? descriptor.jsonLd
      : [descriptor.jsonLd]
    : []
  const script = jsonLdNodes.map((node) => ({
    type: 'application/ld+json',
    innerHTML: JSON.stringify(node),
  }))

  return { title: descriptor.title, meta, link, script }
}

/**
 * Liga o router ao head: a cada navegação, calcula o descritor da rota de
 * destino e o aplica via @unhead/vue. Uma única entrada de head é criada e
 * reaproveitada (patch), evitando acúmulo de tags entre navegações.
 *
 * Chamado uma vez no bootstrap (ver `src/main.ts`), tanto no SSG quanto no
 * cliente — nunca dentro de um componente.
 */
export function installRouteHead(router: Router, head: VueHeadClient): void {
  let entry: ReturnType<VueHeadClient['push']> | null = null

  router.afterEach((to) => {
    // `to.path` alimenta a canonical/og:url absolutas (sempre de produção).
    const input = toHeadInput(headForRoute(to.name, to.params as RouteParams, to.path))
    if (entry) entry.patch(input as UseHeadInput)
    else entry = head.push(input as UseHeadInput)
  })
}
