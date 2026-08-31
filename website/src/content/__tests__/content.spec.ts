import { describe, it, expect } from 'vitest'
import { disciplines, getDiscipline } from '@/content'
import { validateDiscipline } from '@/content/validate'

describe('conteúdo migrado', () => {
  it('po1 tem 10 aulas e passa na validação', () => {
    expect(disciplines.po1.lessons).toHaveLength(10)
    expect(validateDiscipline(disciplines.po1)).toEqual([])
  })
  it('po2 tem 10 aulas e passa na validação', () => {
    expect(disciplines.po2.lessons).toHaveLength(10)
    expect(validateDiscipline(disciplines.po2)).toEqual([])
  })
  it('getDiscipline devolve undefined para slug desconhecido', () => {
    expect(getDiscipline('inexistente')).toBeUndefined()
  })
})
