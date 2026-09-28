import type { Lesson } from '@/types/content'

/** Remove o prefixo "Aula N:" do título, já que o número é exibido à parte. */
export function cleanTitle(title: string): string {
  return title.replace(/^Aula\s*0*\d+\s*[:\-–]\s*/i, '').trim()
}

/** Quebra os tópicos (string separada por vírgula/ponto-e-vírgula) em uma lista. */
export function topicList(topics?: string): string[] {
  if (!topics) return []
  return topics
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

/** Rótulo curto de mídia de uma aula, sem inventar duração. */
export function mediaLabel(lesson: Lesson): string {
  if (!lesson.videos.length) return 'Em breve'
  if (lesson.videos.length === 1) return 'Vídeo'
  return `${lesson.videos.length} partes`
}
