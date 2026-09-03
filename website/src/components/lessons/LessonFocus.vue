<!-- Página de aula focada no player, com anterior/próxima e drawer de aulas. -->
<template>
  <main class="container focus">
    <div class="focus__topbar">
      <RouterLink :to="`/${discipline.slug}`" class="focus__back"><i class="bi bi-grid"></i> Todas as aulas</RouterLink>
      <button class="app-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#lessonDrawer">
        <i class="bi bi-list-ul"></i> Aulas ({{ position }}/{{ discipline.lessons.length }})
      </button>
    </div>

    <div class="focus__meta">
      <span class="app-num">{{ lesson.number }}</span>
      <span class="text-muted">Aula {{ position }} de {{ discipline.lessons.length }}</span>
    </div>
    <h1 class="focus__title">{{ cleanTitle(lesson.title) }}</h1>

    <div class="focus__player">
      <VideoTabs v-if="lesson.videos.length > 1" :videos="lesson.videos" />
      <LiteYouTube v-else-if="lesson.videos.length === 1" :youtube-id="lesson.videos[0].youtubeId" :title="lesson.videos[0].title" />
      <div v-else class="app-video-empty">O vídeo desta aula será disponibilizado em breve.</div>
    </div>

    <div v-if="topics.length" class="focus__chips">
      <span v-for="t in topics" :key="t" class="app-chip">{{ t }}</span>
    </div>
    <p v-if="lesson.description" class="focus__desc">{{ lesson.description }}</p>

    <MaterialList :materials="lesson.materials" />

    <nav class="focus__nav">
      <RouterLink v-if="prev" :to="`/${discipline.slug}/${prev.id}`" class="app-btn">
        <i class="bi bi-arrow-left"></i> <span class="focus__nav-txt">{{ cleanTitle(prev.title) }}</span>
      </RouterLink>
      <span v-else />
      <RouterLink v-if="next" :to="`/${discipline.slug}/${next.id}`" class="app-btn app-btn--solid">
        <span class="focus__nav-txt">Próxima: {{ cleanTitle(next.title) }}</span> <i class="bi bi-arrow-right"></i>
      </RouterLink>
    </nav>

    <LessonDrawer :discipline="discipline" :active-id="lesson.id" />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Discipline, Lesson } from '@/types/content'
import VideoTabs from '@/components/ui/VideoTabs.vue'
import LiteYouTube from '@/components/ui/LiteYouTube.vue'
import MaterialList from '@/components/lessons/MaterialList.vue'
import LessonDrawer from '@/components/lessons/LessonDrawer.vue'
import { cleanTitle, topicList } from '@/lib/lesson-format'

const props = defineProps<{ discipline: Discipline; lesson: Lesson }>()

const idx = computed(() => props.discipline.lessons.findIndex((l) => l.id === props.lesson.id))
const position = computed(() => idx.value + 1)
const topics = computed(() => topicList(props.lesson.topics))
const prev = computed(() => (idx.value > 0 ? props.discipline.lessons[idx.value - 1] : null))
const next = computed(() =>
  idx.value >= 0 && idx.value < props.discipline.lessons.length - 1 ? props.discipline.lessons[idx.value + 1] : null,
)
</script>

<style scoped>
.focus { max-width: 880px; padding: 1.5rem 1rem 4rem; }
.focus__topbar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1.25rem; }
.focus__back { display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; font-weight: 600; }
.focus__meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.focus__title { font-size: var(--fs-h2); font-weight: 700; margin-bottom: 1rem; }
.focus__player { margin-bottom: 1rem; }
.focus__chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
.focus__desc { line-height: 1.6; max-width: 68ch; }
.focus__nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
.focus__nav-txt { display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; max-width: 40vw; }
</style>
