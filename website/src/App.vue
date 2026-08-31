<template>
  <AppNavbar />
  <RouterView />
  <AppFooter />
</template>
<script setup lang="ts">
import AppNavbar from '@/layout/AppNavbar.vue'
import AppFooter from '@/layout/AppFooter.vue'
</script>
