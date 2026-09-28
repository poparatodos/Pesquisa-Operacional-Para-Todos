import { describe, it, expect } from 'vitest'
import { isValidYoutubeId, validateDiscipline } from '@/content/validate'
import type { Discipline } from '@/types/content'

const base: Discipline = {
  slug: 'po1',
  title: 'Pesquisa Operacional I',
  subtitle: 'sub',
  lessons: [
    { id: 'aula-1', number: 1, title: 'Aula 1', videos: [{ title: 'A', youtubeId: 'v5KRSzU2E4U' }], materials: [] },
  ],
}

describe('isValidYoutubeId', () => {
  it('aceita id de 11 chars', () => {
    expect(isValidYoutubeId('v5KRSzU2E4U')).toBe(true)
  })
  it('rejeita placeholder', () => {
    expect(isValidYoutubeId('CODIGO_DO_VIDEO_2')).toBe(false)
  })
})

describe('validateDiscipline', () => {
  it('não reporta erro para disciplina válida', () => {
    expect(validateDiscipline(base)).toEqual([])
  })
  it('reporta id de vídeo inválido', () => {
    const d: Discipline = { ...base, lessons: [{ ...base.lessons[0], videos: [{ title: 'X', youtubeId: 'BAD' }] }] }
    expect(validateDiscipline(d).join(' ')).toContain('youtubeId')
  })
  it('reporta slug de aula duplicado', () => {
    const d: Discipline = { ...base, lessons: [base.lessons[0], base.lessons[0]] }
    expect(validateDiscipline(d).join(' ')).toContain('duplicado')
  })
})
