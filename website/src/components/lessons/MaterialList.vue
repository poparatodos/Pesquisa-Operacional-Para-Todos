<template>
  <div>
    <h4 class="h6 mt-4">Materiais de Apoio</h4>
    <p v-if="!materials.length" class="text-muted">Nenhum material disponível para esta aula.</p>
    <ul v-else class="list-unstyled">
      <li v-for="m in materials" :key="m.url" class="mb-2">
        <a :href="m.url" target="_blank" rel="noopener" download><i class="bi bi-file-earmark-slides me-2"></i>{{ m.title }}</a>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { Material } from '@/types/content'
defineProps<{ materials: Material[] }>()
</script>
