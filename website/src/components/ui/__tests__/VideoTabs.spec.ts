import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import VideoTabs from '@/components/ui/VideoTabs.vue'

const videos = [
  { title: 'Parte 1', youtubeId: 'aaaaaaaaaaa' },
  { title: 'Parte 2', youtubeId: 'bbbbbbbbbbb' },
]

describe('VideoTabs', () => {
  it('mostra uma aba por vídeo e troca a parte ativa', async () => {
    const wrapper = mount(VideoTabs, { props: { videos } })
    const tabs = wrapper.findAll('button.nav-link')
    expect(tabs).toHaveLength(2)
    expect(wrapper.find('img').attributes('src')).toContain('aaaaaaaaaaa')
    await tabs[1].trigger('click')
    expect(wrapper.find('img').attributes('src')).toContain('bbbbbbbbbbb')
  })
})
