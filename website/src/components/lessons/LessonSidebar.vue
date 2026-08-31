<template>
  <details class="lesson-sidebar" :open="open">
    <summary class="d-lg-none btn btn-outline-primary w-100 mb-2">Aulas — {{ activeTitle }}</summary>
    <ul class="list-group">
      <li v-for="l in lessons" :key="l.id" class="list-group-item p-0 lesson-nav-item">
        <RouterLink class="d-block px-3 py-2 text-decoration-none" :class="{ 'fw-semibold text-white bg-primary': l.id === activeId }" :to="`/${slug}/${l.id}`">
          {{ l.title }}
        </RouterLink>
      </li>
    </ul>
  </details>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Lesson } from '@/types/content'
const props = defineProps<{ lessons: Lesson[]; activeId: string; slug: string }>()
const activeTitle = computed(() => props.lessons.find((l) => l.id === props.activeId)?.title ?? '')

function isDesktopViewport(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true
  try {
    return window.matchMedia('(min-width: 992px)').matches
  } catch {
    return true
  }
}

// Aberta por padrão no desktop (>= 992px / lg), colapsada no mobile.
const open = ref(isDesktopViewport())
</script>
