<!-- PROTÓTIPO C — Modo foco: player no topo + coluna de leitura estreita; currículo num drawer. -->
<template>
  <div class="vc" v-if="active">
    <!-- barra minimalista -->
    <header class="vc-bar">
      <div class="d-flex align-items-center gap-2">
        <GraphMark :size="30" />
        <span class="vc-bar__disc">{{ discipline.title }}</span>
      </div>
      <button class="proto-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#protoDrawer">
        <i class="bi bi-list-ul"></i> Aulas ({{ position }}/{{ discipline.lessons.length }})
      </button>
    </header>

    <!-- player dominante, largura total -->
    <div class="vc-player">
      <div class="vc-player__inner">
        <VideoTabs v-if="active.videos.length > 1" :videos="active.videos" />
        <LiteYouTube v-else-if="active.videos.length === 1" :youtube-id="active.videos[0].youtubeId" :title="active.videos[0].title" />
        <div v-else class="proto-video-empty">O vídeo desta aula será disponibilizado em breve.</div>
      </div>
    </div>

    <!-- coluna de leitura estreita -->
    <main class="vc-read">
      <span class="proto-badge mb-2">Aula {{ active.number }}</span>
      <h1 class="vc-title">{{ cleanTitle(active.title) }}</h1>
      <div class="vc-chips">
        <span v-for="t in topicList(active.topics)" :key="t" class="va-chip">{{ t }}</span>
      </div>
      <p v-if="active.description" class="vc-desc">{{ active.description }}</p>
      <MaterialList :materials="active.materials" />

      <nav class="vc-nav">
        <RouterLink v-if="prev" :to="linkTo(prev.id)" class="proto-btn"><i class="bi bi-arrow-left"></i> Anterior</RouterLink>
        <span v-else />
        <RouterLink v-if="next" :to="linkTo(next.id)" class="proto-btn proto-btn--solid">Próxima <i class="bi bi-arrow-right"></i></RouterLink>
      </nav>
    </main>

    <!-- DRAWER de currículo -->
    <div id="protoDrawer" class="offcanvas offcanvas-end" tabindex="-1">
      <div class="offcanvas-header">
        <h2 class="h6 mb-0">Currículo — {{ discipline.title }}</h2>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar"></button>
      </div>
      <div class="vc-progress"><span :style="{ width: (position / discipline.lessons.length) * 100 + '%' }" /></div>
      <div class="offcanvas-body p-0">
        <RouterLink
          v-for="l in discipline.lessons"
          :key="l.id"
          :to="linkTo(l.id)"
          data-bs-dismiss="offcanvas"
          class="vc-item"
          :class="{ 'is-active': l.id === active.id }"
        >
          <span class="proto-num" :class="{ 'proto-num--active': l.id === active.id }">{{ l.number }}</span>
          <span class="vc-item__body">
            <span class="vc-item__title">{{ cleanTitle(l.title) }}</span>
            <span class="vc-item__meta">{{ mediaLabel(l) }}</span>
          </span>
        </RouterLink>
      </div>
    </div>
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

const idx = computed(() => props.discipline.lessons.findIndex((l) => l.id === props.active?.id))
const position = computed(() => idx.value + 1)
const prev = computed(() => (idx.value > 0 ? props.discipline.lessons[idx.value - 1] : null))
const next = computed(() => (idx.value >= 0 && idx.value < props.discipline.lessons.length - 1 ? props.discipline.lessons[idx.value + 1] : null))
</script>

<style scoped>
.vc-bar { display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1.2rem; background: var(--surface); border-bottom: 1px solid var(--border); }
.vc-bar__disc { font-weight: 700; }
.vc-player { background: #0b0f14; }
.vc-player__inner { max-width: 1100px; margin: 0 auto; padding: 1.2rem; }
/* abas do player sobre fundo escuro: texto claro pra contraste */
.vc-player :deep(.nav-pills .nav-link) { color: rgba(255, 255, 255, 0.82); }
.vc-player :deep(.nav-pills .nav-link:hover) { color: #fff; }
.vc-player :deep(.nav-pills .nav-link.active) { background: var(--brand-bright); color: #10151c; }
.vc-read { max-width: 720px; margin: 0 auto; padding: 2rem 1.2rem 4rem; }
.vc-title { font-size: var(--fs-h2); font-weight: 700; margin: 0.3rem 0 0.8rem; }
.vc-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
.va-chip { font-size: 0.72rem; color: var(--muted); background: var(--surface-2); border-radius: 999px; padding: 0.15rem 0.55rem; }
.vc-desc { line-height: 1.7; font-size: 1.05rem; }
.vc-nav { display: flex; justify-content: space-between; margin-top: 2.5rem; }
.vc-progress { height: 4px; background: var(--surface-2); }
.vc-progress span { display: block; height: 100%; background: var(--brand-bright); transition: width 0.2s; }
.vc-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; text-decoration: none; color: inherit; border-bottom: 1px solid var(--border); }
.vc-item:hover { background: var(--surface-2); }
.vc-item.is-active { background: var(--brand-soft); }
.vc-item__body { display: flex; flex-direction: column; }
.vc-item__title { font-size: 0.9rem; font-weight: 600; line-height: 1.3; }
.vc-item__meta { font-size: 0.72rem; color: var(--muted); }
</style>
