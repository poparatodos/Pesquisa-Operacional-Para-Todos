import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import LiteYouTube from '@/components/ui/LiteYouTube.vue'

describe('LiteYouTube', () => {
  it('não monta iframe antes do clique', () => {
    const wrapper = mount(LiteYouTube, { props: { youtubeId: 'v5KRSzU2E4U', title: 'Aula' } })
    expect(wrapper.find('iframe').exists()).toBe(false)
    expect(wrapper.find('img').attributes('src')).toContain('v5KRSzU2E4U')
  })
  it('monta iframe nocookie após o clique', async () => {
    const wrapper = mount(LiteYouTube, { props: { youtubeId: 'v5KRSzU2E4U', title: 'Aula' } })
    await wrapper.find('button').trigger('click')
    const iframe = wrapper.find('iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toContain('youtube-nocookie.com/embed/v5KRSzU2E4U')
    expect(iframe.attributes('src')).toContain('rel=0')
  })
})
