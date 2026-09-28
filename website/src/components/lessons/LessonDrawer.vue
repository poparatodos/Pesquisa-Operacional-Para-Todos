<!-- Drawer (offcanvas) com a lista de aulas, pra saltar direto pra qualquer uma. -->
<template>
  <div id="lessonDrawer" ref="root" class="offcanvas offcanvas-end" tabindex="-1" aria-labelledby="lessonDrawerLabel">
    <div class="offcanvas-header">
      <h2 id="lessonDrawerLabel" class="h6 mb-0">Aulas — {{ discipline.title }}</h2>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Fechar"></button>
    </div>
    <div class="drawer__progress"><span :style="{ width: progress + '%' }" /></div>
    <div class="offcanvas-body p-0">
      <RouterLink
        v-for="l in discipline.lessons"
        :key="l.id"
        :to="`/${discipline.slug}/${l.id}`"
        class="drawer__item"
        @click="close"
        :class="{ 'is-active': l.id === activeId }"
      >
        <span class="app-num" :class="{ 'app-num--active': l.id === activeId }">{{ l.number }}</span>
        <span class="drawer__body">
          <span class="drawer__title">{{ cleanTitle(l.title) }}</span>
          <span class="drawer__meta">{{ mediaLabel(l) }}</span>
        </span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Discipline } from '@/types/content'
import { cleanTitle, mediaLabel } from '@/lib/lesson-format'

const props = defineProps<{ discipline: Discipline; activeId: string }>()

// Fechamos o offcanvas via API em vez de `data-bs-dismiss`: o handler de dismiss
// do Bootstrap roda na fase de captura e dá preventDefault em <a>, o que barra a
// navegação do RouterLink. Sem o atributo, o link navega; aqui só fechamos o drawer.
//
// O `bootstrap` acessa window/document já no carregamento do módulo, então não
// pode ser importado estaticamente (quebraria a pré-renderização SSR desta view).
// Importamos sob demanda, só no cliente; no cliente o módulo já foi carregado por
// main.ts, então é a MESMA instância que `Offcanvas.getInstance()` conhece.
const root = ref<HTMLElement | null>(null)
async function close() {
  if (import.meta.env.SSR || !root.value) return
  const { Offcanvas } = await import('bootstrap')
  Offcanvas.getInstance(root.value)?.hide()
}
const progress = computed(() => {
  const i = props.discipline.lessons.findIndex((l) => l.id === props.activeId)
  const total = props.discipline.lessons.length || 1
  return ((i + 1) / total) * 100
})
</script>

<style scoped>
.drawer__progress { height: 4px; background: var(--surface-2); }
.drawer__progress span { display: block; height: 100%; background: var(--brand-bright); transition: width 0.2s; }
.drawer__item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; text-decoration: none; color: inherit; border-bottom: 1px solid var(--border); }
.drawer__item:hover { background: var(--surface-2); }
.drawer__item.is-active { background: var(--brand-soft); }
.drawer__body { display: flex; flex-direction: column; }
.drawer__title { font-size: 0.9rem; font-weight: 600; line-height: 1.3; }
.drawer__meta { font-size: 0.72rem; color: var(--muted); }
</style>
