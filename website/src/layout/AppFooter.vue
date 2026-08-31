<template>
  <footer class="text-center py-4 mt-5 text-white" style="background-color: var(--unirio-blue)">
    <p class="mb-0">&copy; {{ year }} Pesquisa Operacional Para Todos — UNIRIO.</p>
  </footer>
</template>
<script setup lang="ts">
const year = new Date().getFullYear()
</script>
