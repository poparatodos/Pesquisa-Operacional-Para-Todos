import { describe, it, expect, beforeEach } from 'vitest'
import { initialTheme, useTheme } from '@/theme'

describe('tema (runtime)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('sem escolha salva, o tema inicial é o padrão (verde)', () => {
    expect(initialTheme()).toBe('green')
  })

  it('respeita a escolha salva no localStorage', () => {
    localStorage.setItem('po-theme', 'blue')
    expect(initialTheme()).toBe('blue')
  })

  it('ignora valor inválido no localStorage e cai no padrão', () => {
    localStorage.setItem('po-theme', 'roxo')
    expect(initialTheme()).toBe('green')
  })

  it('set aplica data-theme na raiz e persiste', () => {
    const { set } = useTheme()
    set('blue')
    expect(document.documentElement.getAttribute('data-theme')).toBe('blue')
    expect(localStorage.getItem('po-theme')).toBe('blue')
  })

  it('toggle alterna entre azul e verde', () => {
    const { theme, set, toggle } = useTheme()
    set('green')
    toggle()
    expect(theme.value).toBe('blue')
    toggle()
    expect(theme.value).toBe('green')
  })
})
