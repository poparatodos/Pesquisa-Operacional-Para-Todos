import { describe, it, expect } from 'vitest'
import { mediaLabel } from '@/lib/lesson-format'
import type { Lesson } from '@/types/content'

const lesson = (videos: number, materials: number): Lesson => ({
  id: 'x',
  number: 0,
  title: 'X',
  videos: Array.from({ length: videos }, () => ({ title: 'v', youtubeId: 'v5KRSzU2E4U' })),
  materials: Array.from({ length: materials }, (_, i) => ({ title: 'm', url: `/m${i}.pdf` })),
})

describe('mediaLabel', () => {
  it('"Em breve" sem vídeo e sem material', () => {
    expect(mediaLabel(lesson(0, 0))).toBe('Em breve')
  })
  it('"Material" sem vídeo mas com material', () => {
    expect(mediaLabel(lesson(0, 1))).toBe('Material')
  })
  it('conta as partes quando há vídeos', () => {
    expect(mediaLabel(lesson(1, 1))).toBe('Vídeo')
    expect(mediaLabel(lesson(3, 0))).toBe('3 partes')
  })
})
