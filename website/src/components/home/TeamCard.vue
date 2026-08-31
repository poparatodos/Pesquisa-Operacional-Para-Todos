<template>
  <div class="team-card card h-100 text-center shadow-sm border-0 p-3">
    <img
      :src="member.photo"
      :alt="`Foto de ${member.name}`"
      class="rounded-circle mx-auto mb-3"
      width="120"
      height="120"
      style="object-fit: cover; width: 120px; height: 120px"
    />
    <h3 class="h5 mb-1" style="color: var(--unirio-blue)">{{ member.name }}</h3>
    <p class="text-muted small flex-grow-1">{{ member.role }}</p>
    <div class="d-flex justify-content-center gap-3 mt-2">
      <a
        v-if="member.linkedin"
        :href="member.linkedin"
        target="_blank"
        rel="noopener"
        :aria-label="`LinkedIn de ${member.name}`"
        style="color: var(--unirio-blue)"
      >
        <i class="bi bi-linkedin fs-5"></i>
      </a>
      <a
        v-if="member.email"
        :href="`mailto:${member.email}`"
        :aria-label="`Email de ${member.name}`"
        style="color: var(--unirio-blue)"
      >
        <i class="bi bi-envelope fs-5"></i>
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TeamMember } from '@/content/team'

defineProps<{ member: TeamMember }>()
</script>
