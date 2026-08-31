<template>
  <article class="lesson-panel">
    <h2 style="color: var(--unirio-blue)">{{ lesson.title }}</h2>
    <p v-if="lesson.description">{{ lesson.description }}</p>
    <p v-if="lesson.topics" class="text-muted"><strong>Tópicos:</strong> {{ lesson.topics }}</p>

    <VideoTabs v-if="lesson.videos.length > 1" :videos="lesson.videos" />
    <LiteYouTube v-else-if="lesson.videos.length === 1" :youtube-id="lesson.videos[0].youtubeId" :title="lesson.videos[0].title" />
    <p v-else class="alert alert-secondary">O vídeo desta aula será disponibilizado em breve.</p>

    <MaterialList :materials="lesson.materials" />
  </article>
</template>
<script setup lang="ts">
import type { Lesson } from '@/types/content'
import LiteYouTube from '@/components/ui/LiteYouTube.vue'
import VideoTabs from '@/components/ui/VideoTabs.vue'
import MaterialList from './MaterialList.vue'
defineProps<{ lesson: Lesson }>()
</script>
