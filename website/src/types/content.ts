export interface Material {
  title: string
  url: string
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
  topics?: string
  videos: VideoPart[]
  materials: Material[]
}

export interface Discipline {
  slug: string
  title: string
  subtitle: string
  lessons: Lesson[]
}
