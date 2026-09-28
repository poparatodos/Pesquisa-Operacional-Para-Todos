import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import { useTheme } from '@/theme'

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    useTheme().set('green')
  })

  it('ao clicar, alterna o tema (verde → azul)', async () => {
    const wrapper = mount(ThemeToggle)
    await wrapper.find('button').trigger('click')
    expect(document.documentElement.getAttribute('data-theme')).toBe('blue')
  })

  it('expõe o tema atual no rótulo acessível', () => {
    useTheme().set('blue')
    const wrapper = mount(ThemeToggle)
    expect(wrapper.find('button').attributes('aria-label')).toContain('azul')
  })
})
