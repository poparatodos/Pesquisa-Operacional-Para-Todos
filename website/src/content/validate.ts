import type { Discipline } from '@/types/content'

export function isValidYoutubeId(id: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(id)
}

export function validateDiscipline(d: Discipline): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  for (const lesson of d.lessons) {
    if (seen.has(lesson.id)) errors.push(`[${d.slug}] slug de aula duplicado: ${lesson.id}`)
    seen.add(lesson.id)
    for (const v of lesson.videos) {
      if (!isValidYoutubeId(v.youtubeId)) {
        errors.push(`[${d.slug}/${lesson.id}] youtubeId inválido: "${v.youtubeId}" (${v.title})`)
      }
    }
  }
  return errors
}
