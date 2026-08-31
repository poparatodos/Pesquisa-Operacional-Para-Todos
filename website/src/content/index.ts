import type { Discipline } from '@/types/content'
import { po1 } from './po1'
import { po2 } from './po2'
import { problemas } from './problemas'

export const disciplines: Record<string, Discipline> = { po1, po2, problemas }

export function getDiscipline(slug: string): Discipline | undefined {
  return disciplines[slug]
}
