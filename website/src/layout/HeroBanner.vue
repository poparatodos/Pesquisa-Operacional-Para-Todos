<template>
  <header class="text-white text-center py-5" style="background: linear-gradient(120deg, var(--unirio-blue), var(--secondary-blue))">
    <div class="container">
      <h1 class="fw-bold" style="font-size: clamp(1.8rem, 5vw, 3rem)">{{ title }}</h1>
      <p v-if="subtitle" class="lead mb-0">{{ subtitle }}</p>
    </div>
  </header>
</template>
<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
