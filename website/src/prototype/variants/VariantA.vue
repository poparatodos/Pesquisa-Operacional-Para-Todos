<!-- PROTÓTIPO A — Catálogo de aulas → página de aula focada no player. Sem sidebar. -->
<template>
  <div class="va">
    <!-- header compacto, sem hero gigante -->
    <header class="va-head">
      <div class="container d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div class="d-flex align-items-center gap-3">
          <GraphMark />
          <div>
            <RouterLink :to="linkTo()" class="va-crumb">{{ discipline.title }}</RouterLink>
            <p class="va-sub">{{ discipline.subtitle }}</p>
          </div>
        </div>
        <span class="proto-badge">{{ discipline.lessons.length }} aulas</span>
      </div>
    </header>

    <!-- ÍNDICE (grade) -->
    <main v-if="!active" class="container va-body">
      <h1 class="va-h1">Aulas da disciplina</h1>
      <div class="va-grid">
        <RouterLink
          v-for="l in discipline.lessons"
          :key="l.id"
          :to="linkTo(l.id)"
          class="va-card proto-surface"
        >
          <div class="d-flex align-items-center gap-3 mb-2">
            <span class="proto-num">{{ l.number }}</span>
            <span class="proto-badge" :class="{ 'proto-badge--accent': !l.videos.length }">{{ mediaLabel(l) }}</span>
          </div>
          <h3 class="va-card__title">{{ cleanTitle(l.title) }}</h3>
          <div class="va-chips">
            <span v-for="t in topicList(l.topics).slice(0, 2)" :key="t" class="va-chip">{{ t }}</span>
          </div>
          <span class="va-card__go">Assistir <i class="bi bi-arrow-right"></i></span>
        </RouterLink>
      </div>
    </main>

    <!-- AULA FOCADA -->
    <main v-else class="container va-body va-focus">
      <RouterLink :to="linkTo()" class="va-back"><i class="bi bi-grid"></i> Todas as aulas</RouterLink>

      <div class="va-focus__meta">
        <span class="proto-num">{{ active.number }}</span>
        <span class="text-muted">Aula {{ position }} de {{ discipline.lessons.length }}</span>
      </div>
      <h1 class="va-h1">{{ cleanTitle(active.title) }}</h1>

      <div class="va-player">
        <VideoTabs v-if="active.videos.length > 1" :videos="active.videos" />
        <LiteYouTube v-else-if="active.videos.length === 1" :youtube-id="active.videos[0].youtubeId" :title="active.videos[0].title" />
        <div v-else class="proto-video-empty">O vídeo desta aula será disponibilizado em breve.</div>
      </div>

      <div class="va-chips mt-3">
        <span v-for="t in topicList(active.topics)" :key="t" class="va-chip">{{ t }}</span>
      </div>
      <p v-if="active.description" class="va-desc">{{ active.description }}</p>

      <MaterialList :materials="active.materials" />

      <nav class="va-nav">
        <RouterLink v-if="prev" :to="linkTo(prev.id)" class="proto-btn"><i class="bi bi-arrow-left"></i> {{ cleanTitle(prev.title) }}</RouterLink>
        <span v-else />
        <RouterLink v-if="next" :to="linkTo(next.id)" class="proto-btn proto-btn--solid">Próxima: {{ cleanTitle(next.title) }} <i class="bi bi-arrow-right"></i></RouterLink>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Discipline, Lesson } from '@/types/content'
import VideoTabs from '@/components/ui/VideoTabs.vue'
import LiteYouTube from '@/components/ui/LiteYouTube.vue'
import MaterialList from '@/components/lessons/MaterialList.vue'
import GraphMark from '../GraphMark.vue'
import { cleanTitle, topicList, mediaLabel } from '../proto-utils'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  discipline: Discipline
  active: Lesson | null
  linkTo: (lessonId?: string) => RouteLocationRaw
}>()

const idx = computed(() => (props.active ? props.discipline.lessons.findIndex((l) => l.id === props.active!.id) : -1))
const position = computed(() => idx.value + 1)
const prev = computed(() => (idx.value > 0 ? props.discipline.lessons[idx.value - 1] : null))
const next = computed(() => (idx.value >= 0 && idx.value < props.discipline.lessons.length - 1 ? props.discipline.lessons[idx.value + 1] : null))
</script>

<style scoped>
.va-head { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem 0; position: sticky; top: 0; z-index: 5; }
.va-crumb { font-weight: 700; font-size: 1.15rem; text-decoration: none; }
.va-sub { margin: 0; color: var(--muted); font-size: 0.9rem; }
.va-body { padding: 2rem 1rem 4rem; }
.va-h1 { font-size: var(--fs-h2); font-weight: 700; margin-bottom: 1.5rem; }
.va-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.1rem; }
.va-card { padding: 1.1rem; text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: transform 0.15s, box-shadow 0.15s; }
.va-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.va-card__title { font-size: 1.02rem; font-weight: 600; line-height: 1.35; margin: 0 0 0.6rem; }
.va-card__go { margin-top: auto; color: var(--brand); font-weight: 600; font-size: 0.9rem; }
.va-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.va-chip { font-size: 0.72rem; color: var(--muted); background: var(--surface-2); border-radius: 999px; padding: 0.15rem 0.55rem; }
.va-focus { max-width: 880px; }
.va-back { display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; font-weight: 600; margin-bottom: 1rem; }
.va-focus__meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
.va-player { margin: 0.5rem 0 1rem; }
.va-desc { margin-top: 1rem; line-height: 1.6; max-width: 68ch; }
.va-nav { display: flex; justify-content: space-between; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
</style>
