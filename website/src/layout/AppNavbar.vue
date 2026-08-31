<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: var(--unirio-blue)">
    <div class="container">
      <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
        <img :src="logo" alt="UNIRIO" height="32" />
        <span class="fw-semibold">PO Para Todos</span>
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/po1">Pesquisa Operacional I</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/po2">Pesquisa Operacional II</RouterLink></li>
          <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/problemas">Problemas Clássicos</RouterLink></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from '@/assets/logos/unirio-icone.png'
</script>
