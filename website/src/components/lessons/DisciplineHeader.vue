<!-- Cabeçalho compacto da disciplina (substitui o hero gigante). -->
<template>
  <header class="disc-head">
    <div class="container d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div class="d-flex align-items-center gap-3">
        <GraphMark :size="40" />
        <div>
          <h1 class="disc-head__title">{{ discipline.title }}</h1>
          <p class="disc-head__sub">{{ discipline.subtitle }}</p>
        </div>
      </div>
      <span v-if="discipline.lessons.length" class="app-badge">{{ discipline.lessons.length }} aulas</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Discipline } from '@/types/content'
import GraphMark from '@/components/GraphMark.vue'
defineProps<{ discipline: Discipline }>()
</script>

<style scoped>
.disc-head { background: var(--surface); border-bottom: 1px solid var(--border); padding: 1rem 0; }
.disc-head__title { font-size: 1.15rem; font-weight: 700; margin: 0; color: var(--brand-strong); }
.disc-head__sub { margin: 0; color: var(--muted); font-size: 0.9rem; }
</style>
