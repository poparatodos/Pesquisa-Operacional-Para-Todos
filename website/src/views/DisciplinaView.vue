<template>
  <HeroBanner v-if="discipline" :title="discipline.title" :subtitle="discipline.subtitle" />
  <div v-if="discipline" class="container py-4">
    <div v-if="discipline.lessons.length" class="row g-4">
      <div class="col-12 col-lg-4"><LessonSidebar :lessons="discipline.lessons" :active-id="activeLesson.id" :slug="slug" /></div>
      <div class="col-12 col-lg-8"><LessonPanel :lesson="activeLesson" /></div>
    </div>
    <p v-else class="alert alert-secondary">Conteúdo em breve.</p>
  </div>
  <NotFoundView v-else />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getDiscipline } from '@/content'
import HeroBanner from '@/layout/HeroBanner.vue'
import LessonSidebar from '@/components/lessons/LessonSidebar.vue'
import LessonPanel from '@/components/lessons/LessonPanel.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const discipline = computed(() => getDiscipline(props.slug))
const activeLesson = computed(() => {
  const lessons = discipline.value?.lessons ?? []
  return lessons.find((l) => l.id === route.params.lessonId) ?? lessons[0]
})
</script>
