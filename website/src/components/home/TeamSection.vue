<template>
  <section class="container py-5">
    <h2 class="text-center mb-4" style="color: var(--unirio-blue)">Nossa Equipe</h2>
    <div class="row g-4 justify-content-center">
      <div v-for="m in team" :key="m.name" class="col-12 col-sm-6 col-lg-3">
        <TeamCard :member="m" />
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { team } from '@/content/team'
import TeamCard from './TeamCard.vue'
</script>
