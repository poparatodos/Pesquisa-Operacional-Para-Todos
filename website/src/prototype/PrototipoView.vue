<!-- PROTÓTIPO — descartável. Hospeda as 3 variantes numa rota, com dados reais.
     Troca de variante/tema pela barra flutuante. Alvo: fluxo de disciplina/aula.
     Rota: /prototipo/:slug?/:lessonId?   (ex.: /prototipo/po1/aula-5?variant=A&theme=green) -->
<template>
  <div class="proto-root" :data-preview-theme="theme">
    <template v-if="discipline">
      <VariantA v-if="variant === 'A'" :discipline="discipline" :active="active" :link-to="linkTo" />
      <VariantB v-else-if="variant === 'B'" :discipline="discipline" :active="active ?? firstLesson" :link-to="linkTo" />
      <VariantC v-else :discipline="discipline" :active="active ?? firstLesson" :link-to="linkTo" />
    </template>
    <div v-else class="container py-5">
      <p>Disciplina desconhecida: <code>{{ slug }}</code>. Tente <RouterLink :to="linkFor('po1')">/prototipo/po1</RouterLink>.</p>
    </div>
    <PrototypeSwitcher />
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { getDiscipline } from '@/content'
import VariantA from './variants/VariantA.vue'
import VariantB from './variants/VariantB.vue'
import VariantC from './variants/VariantC.vue'
import PrototypeSwitcher from './PrototypeSwitcher.vue'
import './theme-preview.css'

const route = useRoute()

const slug = computed(() => (route.params.slug as string) || 'po1')
const variant = computed(() => (route.query.variant as string) || 'A')
const theme = computed(() => (route.query.theme as string) || 'green')

const discipline = computed(() => getDiscipline(slug.value))
const firstLesson = computed(() => discipline.value?.lessons[0] ?? null)
const active = computed(() => {
  const id = route.params.lessonId as string | undefined
  if (!id) return null
  return discipline.value?.lessons.find((l) => l.id === id) ?? null
})

// espelha o tema no <html> pra o navbar real (fora do .proto-root) acompanhar
const applyTheme = (t: string) => document.documentElement.setAttribute('data-proto-theme', t)
onMounted(() => applyTheme(theme.value))
watch(theme, applyTheme)
onUnmounted(() => document.documentElement.removeAttribute('data-proto-theme'))

function linkFor(targetSlug: string, lessonId?: string): RouteLocationRaw {
  const path = `/prototipo/${targetSlug}${lessonId ? '/' + lessonId : ''}`
  return { path, query: { variant: variant.value, theme: theme.value } }
}
function linkTo(lessonId?: string): RouteLocationRaw {
  return linkFor(slug.value, lessonId)
}
</script>
