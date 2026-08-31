<template>
  <HeroBanner :title="slug" />
</template>
<script setup lang="ts">
import HeroBanner from '@/layout/HeroBanner.vue'

defineProps<{ slug: string }>()
</script>
