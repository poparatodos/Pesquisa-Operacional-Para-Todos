<template>
  <HeroBanner
    title="Página não encontrada"
    subtitle="O endereço que você tentou acessar não existe ou foi movido."
  />
  <div class="container text-center py-5">
    <p class="text-body-secondary mb-4">Erro 404 — não encontramos esta página.</p>
    <RouterLink to="/" class="btn btn-primary">Voltar para a página inicial</RouterLink>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import HeroBanner from '@/layout/HeroBanner.vue'
</script>
