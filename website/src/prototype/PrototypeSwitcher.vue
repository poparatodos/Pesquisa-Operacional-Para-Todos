<!-- PROTÓTIPO — descartável. Barra flutuante: troca de variante + toggle de tema. -->
<template>
  <div v-if="isDev" class="proto-switcher">
    <div class="proto-switcher__group">
      <button class="proto-switcher__arrow" aria-label="Variante anterior" @click="cycle(-1)">‹</button>
      <span class="proto-switcher__label">
        <strong>{{ current }}</strong> — {{ names[current] }}
      </span>
      <button class="proto-switcher__arrow" aria-label="Próxima variante" @click="cycle(1)">›</button>
    </div>
    <div class="proto-switcher__divider" />
    <div class="proto-switcher__group proto-switcher__themes">
      <button
        v-for="t in themes"
        :key="t.key"
        class="proto-switcher__theme"
        :class="{ 'is-active': theme === t.key }"
        :style="{ '--dot': t.dot }"
        @click="setTheme(t.key)"
      >
        <span class="proto-switcher__dot" /> {{ t.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const isDev = import.meta.env.DEV
const route = useRoute()
const router = useRouter()

const order = ['A', 'B', 'C'] as const
const names: Record<string, string> = {
  A: 'Catálogo → aula focada',
  B: 'Trilha + player dominante',
  C: 'Foco + drawer de aulas',
}
const themes = [
  { key: 'blue', label: 'Azul', dot: '#013a73' },
  { key: 'green', label: 'Verde', dot: '#8bc34a' },
]

const current = computed(() => (route.query.variant as string) || 'A')
const theme = computed(() => (route.query.theme as string) || 'green')

function go(variant: string, themeKey: string) {
  router.replace({ query: { ...route.query, variant, theme: themeKey } })
}
function cycle(dir: number) {
  const i = order.indexOf(current.value as (typeof order)[number])
  const next = order[(i + dir + order.length) % order.length]
  go(next, theme.value)
}
function setTheme(t: string) {
  go(current.value, t)
}

function onKey(e: KeyboardEvent) {
  const el = document.activeElement
  if (el && /input|textarea/i.test(el.tagName)) return
  if ((el as HTMLElement)?.isContentEditable) return
  if (e.key === 'ArrowLeft') cycle(-1)
  if (e.key === 'ArrowRight') cycle(1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.proto-switcher {
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #10151c;
  color: #fff;
  border-radius: 999px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
  font: 500 13px/1.2 system-ui, sans-serif;
}
.proto-switcher__group { display: flex; align-items: center; gap: 8px; }
.proto-switcher__arrow {
  width: 28px; height: 28px; border-radius: 50%;
  border: none; background: #263140; color: #fff;
  font-size: 18px; cursor: pointer; line-height: 1;
}
.proto-switcher__arrow:hover { background: #34435a; }
.proto-switcher__label { white-space: nowrap; }
.proto-switcher__divider { width: 1px; height: 22px; background: #34435a; }
.proto-switcher__theme {
  display: inline-flex; align-items: center; gap: 6px;
  border: 1px solid transparent; background: transparent; color: #c6cfda;
  border-radius: 999px; padding: 4px 10px; cursor: pointer; font-weight: 600;
}
.proto-switcher__theme.is-active { background: #263140; color: #fff; border-color: #46586f; }
.proto-switcher__dot { width: 10px; height: 10px; border-radius: 50%; background: var(--dot); }
</style>
