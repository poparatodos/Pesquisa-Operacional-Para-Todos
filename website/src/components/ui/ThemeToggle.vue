<!-- Botão que alterna o tema entre azul (UNIRIO) e verde (canal). -->
<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="`Alternar tema — atual: ${label}`"
    :title="`Tema ${label} — clique para alternar`"
    @click="toggle"
  >
    <i class="bi bi-palette" aria-hidden="true"></i>
    <span class="theme-toggle__txt">Tema</span>
    <span class="theme-toggle__dot" :class="`theme-toggle__dot--${theme}`" aria-hidden="true"></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/theme'

const { theme, toggle } = useTheme()
const label = computed(() => (theme.value === 'blue' ? 'azul' : 'verde'))
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  border-radius: 999px;
  padding: 0.2rem 0.7rem;
  font-size: 0.85rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.6);
}
.theme-toggle__dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.7);
}
.theme-toggle__dot--blue { background: #013a73; }
.theme-toggle__dot--green { background: #3e7d22; }
</style>
