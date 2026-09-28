<template>
  <template v-if="discipline">
    <LessonFocus v-if="activeLesson" :discipline="discipline" :lesson="activeLesson" />
    <LessonCatalog v-else :discipline="discipline" />
  </template>
  <NotFoundView v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getDiscipline } from '@/content'
import LessonCatalog from '@/components/lessons/LessonCatalog.vue'
import LessonFocus from '@/components/lessons/LessonFocus.vue'
import NotFoundView from './NotFoundView.vue'

const props = defineProps<{ slug: string }>()
const route = useRoute()

const discipline = computed(() => getDiscipline(props.slug))
const activeLesson = computed(() => {
  const id = route.params.lessonId as string | undefined
  if (!id) return null
  return discipline.value?.lessons.find((l) => l.id === id) ?? null
})
</script>
