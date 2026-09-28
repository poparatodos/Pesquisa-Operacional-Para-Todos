<template>
  <div>
    <ul v-if="videos.length > 1" class="nav nav-pills gap-2 mb-3">
      <li v-for="(v, i) in videos" :key="i" class="nav-item">
        <button class="nav-link" :class="{ active: i === current }" @click="current = i">{{ v.title }}</button>
      </li>
    </ul>
    <LiteYouTube :key="current" :youtube-id="videos[current].youtubeId" :title="videos[current].title" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { VideoPart } from '@/types/content'
import LiteYouTube from './LiteYouTube.vue'
defineProps<{ videos: VideoPart[] }>()
const current = ref(0)
</script>
