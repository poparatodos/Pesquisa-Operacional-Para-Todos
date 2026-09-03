<!-- PROTÓTIPO — assinatura visual: grafo (nós+arestas), ecoando o logo do canal. -->
<template>
  <svg :width="size" :height="size" viewBox="0 0 48 48" fill="none" aria-hidden="true" class="graph-mark">
    <line x1="10" y1="14" x2="26" y2="9" />
    <line x1="26" y1="9" x2="39" y2="20" />
    <line x1="10" y1="14" x2="18" y2="33" />
    <line x1="18" y1="33" x2="39" y2="20" />
    <line x1="18" y1="33" x2="34" y2="39" />
    <circle cx="10" cy="14" r="4.5" />
    <circle cx="26" cy="9" r="4" />
    <circle cx="39" cy="20" r="5" />
    <circle cx="18" cy="33" r="4" />
    <circle cx="34" cy="39" r="3.5" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 40 })
</script>

<style scoped>
.graph-mark line { stroke: var(--brand-graph); stroke-width: 2; opacity: 0.55; }
.graph-mark circle { fill: var(--brand-graph); }
</style>
