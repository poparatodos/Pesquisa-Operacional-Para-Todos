<!-- PROTÓTIPO B — Trilha horizontal de aulas sempre visível + player dominante abaixo. -->
<template>
  <div class="vb" v-if="active">
    <header class="vb-head">
      <div class="container d-flex align-items-center justify-content-between gap-3">
        <div class="d-flex align-items-center gap-2">
          <GraphMark :size="34" />
          <strong>{{ discipline.title }}</strong>
        </div>
        <span class="text-muted small">Aula {{ position }} de {{ discipline.lessons.length }}</span>
      </div>
    </header>

    <!-- TRILHA horizontal -->
    <div class="vb-trail">
      <div class="container">
        <div class="vb-trail__scroll">
          <RouterLink
            v-for="l in discipline.lessons"
            :key="l.id"
            :to="linkTo(l.id)"
            class="vb-stop"
            :class="{ 'is-active': l.id === active.id }"
          >
            <span class="proto-num" :class="{ 'proto-num--active': l.id === active.id }">{{ l.number }}</span>
            <span class="vb-stop__title">{{ cleanTitle(l.title) }}</span>
            <span class="vb-stop__meta">{{ mediaLabel(l) }}</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <main class="container vb-body">
      <div class="vb-stage">
        <h1 class="vb-title">{{ cleanTitle(active.title) }}</h1>
        <div class="vb-chips">
          <span v-for="t in topicList(active.topics)" :key="t" class="proto-badge">{{ t }}</span>
        </div>
        <div class="vb-player">
          <VideoTabs v-if="active.videos.length > 1" :videos="active.videos" />
          <LiteYouTube v-else-if="active.videos.length === 1" :youtube-id="active.videos[0].youtubeId" :title="active.videos[0].title" />
          <div v-else class="proto-video-empty">O vídeo desta aula será disponibilizado em breve.</div>
        </div>
        <p v-if="active.description" class="vb-desc">{{ active.description }}</p>
      </div>

      <!-- Materiais como faixa horizontal -->
      <section class="vb-materials">
        <h2 class="vb-materials__h">Materiais de apoio</h2>
        <p v-if="!active.materials.length" class="text-muted">Nenhum material para esta aula.</p>
        <div v-else class="vb-materials__row">
          <a v-for="m in active.materials" :key="m.url" :href="withBase(m.url)" target="_blank" rel="noopener" download class="vb-mat proto-surface">
            <i class="bi bi-file-earmark-slides"></i>
            <span>{{ m.title }}</span>
            <i class="bi bi-download ms-auto"></i>
          </a>
        </div>
      </section>

      <nav class="vb-nav">
        <RouterLink v-if="prev" :to="linkTo(prev.id)" class="proto-btn"><i class="bi bi-arrow-left"></i> Anterior</RouterLink>
        <span v-else />
        <RouterLink v-if="next" :to="linkTo(next.id)" class="proto-btn proto-btn--solid">Próxima aula <i class="bi bi-arrow-right"></i></RouterLink>
      </nav>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Discipline, Lesson } from '@/types/content'
import VideoTabs from '@/components/ui/VideoTabs.vue'
import LiteYouTube from '@/components/ui/LiteYouTube.vue'
import GraphMark from '../GraphMark.vue'
import { cleanTitle, topicList, mediaLabel } from '../proto-utils'
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  discipline: Discipline
  active: Lesson | null
  linkTo: (lessonId?: string) => RouteLocationRaw
}>()

const withBase = (url: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + url
const idx = computed(() => props.discipline.lessons.findIndex((l) => l.id === props.active?.id))
const position = computed(() => idx.value + 1)
const prev = computed(() => (idx.value > 0 ? props.discipline.lessons[idx.value - 1] : null))
const next = computed(() => (idx.value >= 0 && idx.value < props.discipline.lessons.length - 1 ? props.discipline.lessons[idx.value + 1] : null))
</script>

<style scoped>
.vb-head { padding: 0.9rem 0; border-bottom: 1px solid var(--border); background: var(--surface); }
.vb-trail { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 5; }
.vb-trail__scroll { display: flex; gap: 0.6rem; overflow-x: auto; padding: 0.8rem 0; scrollbar-width: thin; }
.vb-stop {
  flex: 0 0 auto; width: 190px; display: flex; flex-direction: column; gap: 0.35rem;
  padding: 0.7rem 0.85rem; border: 1px solid var(--border); border-radius: 12px;
  background: var(--surface); text-decoration: none; color: inherit; transition: border-color 0.15s, background 0.15s;
}
.vb-stop:hover { border-color: var(--brand-bright); }
.vb-stop.is-active { border-color: var(--brand); background: var(--brand-soft); }
.vb-stop__title { font-size: 0.85rem; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.vb-stop__meta { font-size: 0.72rem; color: var(--muted); }
.vb-body { padding: 2rem 1rem 4rem; }
.vb-stage { max-width: 920px; margin: 0 auto; }
.vb-title { font-size: var(--fs-h2); font-weight: 700; margin-bottom: 0.6rem; }
.vb-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem; }
.vb-player { box-shadow: var(--shadow-md); border-radius: var(--radius); overflow: hidden; }
.vb-desc { margin-top: 1.1rem; line-height: 1.6; color: var(--text); }
.vb-materials { max-width: 920px; margin: 2rem auto 0; }
.vb-materials__h { font-size: var(--fs-h4); font-weight: 700; margin-bottom: 0.8rem; }
.vb-materials__row { display: flex; gap: 0.8rem; overflow-x: auto; padding-bottom: 0.5rem; }
.vb-mat { flex: 0 0 auto; width: 260px; display: flex; align-items: center; gap: 0.6rem; padding: 0.8rem 1rem; text-decoration: none; color: inherit; }
.vb-mat i:first-child { color: var(--accent); font-size: 1.2rem; }
.vb-nav { max-width: 920px; margin: 2.5rem auto 0; display: flex; justify-content: space-between; }
</style>
