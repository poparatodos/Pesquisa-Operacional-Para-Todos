import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TeamSection from '@/components/home/TeamSection.vue'
import { team } from '@/content/team'

describe('TeamSection', () => {
  it('renderiza um card por membro', () => {
    const wrapper = mount(TeamSection)
    expect(wrapper.findAll('.team-card')).toHaveLength(team.length)
  })
})
