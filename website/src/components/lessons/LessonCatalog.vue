<!-- Catálogo de aulas em grade. Cada card leva à página de aula focada. -->
<template>
  <main class="container catalog">
    <h2 class="catalog__title">Aulas da disciplina</h2>

    <p v-if="!discipline.lessons.length" class="app-surface p-4 text-muted">
      O conteúdo desta disciplina será disponibilizado em breve.
    </p>

    <div v-else class="catalog__grid">
      <RouterLink
        v-for="l in discipline.lessons"
        :key="l.id"
        :to="`/${discipline.slug}/${l.id}`"
        class="catalog__card app-surface"
      >
        <div class="d-flex align-items-center gap-3 mb-2">
          <span class="app-num">{{ l.number }}</span>
          <span class="app-badge" :class="{ 'app-badge--accent': !l.videos.length }">{{ mediaLabel(l) }}</span>
        </div>
        <h3 class="catalog__card-title">{{ cleanTitle(l.title) }}</h3>
        <div class="catalog__chips">
          <span v-for="t in topicList(l.topics).slice(0, 2)" :key="t" class="app-chip">{{ t }}</span>
        </div>
        <span class="catalog__go">Assistir <i class="bi bi-arrow-right"></i></span>
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Discipline } from '@/types/content'
import { cleanTitle, topicList, mediaLabel } from '@/lib/lesson-format'
defineProps<{ discipline: Discipline }>()
</script>

<style scoped>
.catalog { padding: 2rem 1rem 4rem; }
.catalog__title { font-size: var(--fs-h2); font-weight: 700; margin-bottom: 1.5rem; }
.catalog__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.1rem; }
.catalog__card { padding: 1.1rem; text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: transform 0.15s, box-shadow 0.15s; }
.catalog__card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
.catalog__card-title { font-size: 1.02rem; font-weight: 600; line-height: 1.35; margin: 0 0 0.6rem; }
.catalog__chips { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.8rem; }
.catalog__go { margin-top: auto; color: var(--brand); font-weight: 600; font-size: 0.9rem; }
</style>
