/** Tipo de um Material; define ícone, ordem na lista e se é arquivo ou link externo. */
export type MaterialKind = 'slides' | 'apostila' | 'lista' | 'gabarito' | 'link'

export interface Material {
  title: string
  /** Caminho em `public/` (ex.: `/materiais/po1/x.pdf`) ou URL absoluta quando `kind` é `link`. */
  url: string
  /** Padrão: `slides`. */
  kind?: MaterialKind
}

export interface VideoPart {
  title: string
  youtubeId: string
}

export interface Lesson {
  id: string
  number: number
  title: string
  description?: string
  /**
   * Descrição de SEO opcional da Aula. Quando presente, sobrescreve a
   * `description` de conteúdo na geração do <head> (ver src/seo/head.ts) —
   * útil quando a descrição de conteúdo é fraca para busca, sem reescrevê-la.
   */
  seoDescription?: string
  topics?: string
  videos: VideoPart[]
  materials: Material[]
}

export interface Discipline {
  slug: string
  title: string
  subtitle: string
  /** Descrição de SEO opcional da Disciplina; sobrescreve o `subtitle` no <head>. */
  seoDescription?: string
  lessons: Lesson[]
}
