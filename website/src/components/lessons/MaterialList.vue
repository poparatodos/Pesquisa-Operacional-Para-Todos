<template>
  <div>
    <h4 class="h6 mt-4">Materiais de Apoio</h4>
    <p v-if="!materials.length" class="text-muted">Nenhum material disponível para esta aula.</p>
    <ul v-else class="list-unstyled">
      <li v-for="m in sorted" :key="m.url" class="mb-2">
        <a v-if="kindOf(m) === 'link'" :href="m.url" target="_blank" rel="noopener"><i class="bi me-2" :class="ICONS.link"></i>{{ m.title }}</a>
        <a v-else :href="withBase(m.url)" target="_blank" rel="noopener" download><i class="bi me-2" :class="ICONS[kindOf(m)]"></i>{{ m.title }}</a>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { Material, MaterialKind } from '@/types/content'
const props = defineProps<{ materials: Material[] }>()

const ORDER: MaterialKind[] = ['slides', 'apostila', 'lista', 'gabarito', 'link']
const ICONS: Record<MaterialKind, string> = {
  slides: 'bi-file-earmark-slides',
  apostila: 'bi-journal-text',
  lista: 'bi-pencil-square',
  gabarito: 'bi-file-earmark-check',
  link: 'bi-box-arrow-up-right',
}

const kindOf = (m: Material): MaterialKind => m.kind ?? 'slides'
const sorted = computed(() =>
  [...props.materials].sort((a, b) => ORDER.indexOf(kindOf(a)) - ORDER.indexOf(kindOf(b))),
)
const withBase = (url: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + url
</script>
