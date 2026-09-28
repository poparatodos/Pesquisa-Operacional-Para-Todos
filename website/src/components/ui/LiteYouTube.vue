<template>
  <div class="ratio ratio-16x9 rounded overflow-hidden bg-dark">
    <iframe v-if="playing" :src="embedUrl" :title="title" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" />
    <button v-else type="button" class="btn p-0 border-0 w-100 h-100" :aria-label="`Reproduzir: ${title}`" @click="playing = true">
      <img :src="thumbnail" :alt="title" class="w-100 h-100" style="object-fit: cover" loading="lazy" />
      <span class="position-absolute top-50 start-50 translate-middle"><i class="bi bi-play-circle-fill text-white" style="font-size: 4rem; opacity: 0.9"></i></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{ youtubeId: string; title: string }>()
const playing = ref(false)
const thumbnail = computed(() => `https://i.ytimg.com/vi/${props.youtubeId}/hqdefault.jpg`)
const embedUrl = computed(() => `https://www.youtube-nocookie.com/embed/${props.youtubeId}?rel=0&modestbranding=1&autoplay=1`)
</script>
