<template>
  <header>
    <!-- Faixa institucional (somente desktop) -->
    <div class="inst-strip d-none d-lg-block">
      <div class="container d-flex align-items-center gap-3">
        <img
          :src="unirioLogo"
          alt="UNIRIO — Universidade Federal do Estado do Rio de Janeiro"
          class="inst-strip__logo"
        />
        <span class="inst-strip__sep" aria-hidden="true"></span>
        <span class="inst-strip__text">Pró-Reitoria de Extensão e Cultura</span>
      </div>
    </div>

    <!-- Navbar principal -->
    <nav class="navbar navbar-expand-lg navbar-dark" :style="{ backgroundColor: 'var(--brand)' }">
      <div class="container">
        <RouterLink class="navbar-brand d-flex align-items-center gap-2" to="/">
          <GraphMark :size="28" light />
          <span class="fw-semibold">PO Para Todos</span>
        </RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="nav" class="collapse navbar-collapse">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/po1">Pesquisa Operacional I</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/po2">Pesquisa Operacional II</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" active-class="active" to="/problemas">Problemas Clássicos</RouterLink></li>
            <li class="nav-item ms-lg-2">
              <a
                class="nav-link nav-link--icon"
                href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
                target="_blank"
                rel="noopener"
                aria-label="Código do projeto no GitHub"
                title="Código no GitHub"
              >
                <i class="bi bi-github"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import GraphMark from '@/components/GraphMark.vue'
import unirioLogo from '@/assets/logos/unirio-horizontal-negativo.png'
</script>

<style scoped>
.inst-strip {
  background: var(--brand-strong);
  height: 60px;            /* altura FIXA da faixa — não cresce com a logo */
  display: flex;
  align-items: end;     /* centra o conteúdo (e o recorte da logo) na faixa */
  overflow: hidden;        /* recorta o excedente/whitespace da logo maior */
}
.inst-strip__logo {
  height: 55px;           /* > altura da faixa: a marca aparece bem maior */
  width: auto;
  flex: 0 0 auto;
}
.inst-strip__sep {
  width: 1px;
  height: 34px;
  background: rgba(255, 255, 255, 0.28);
}
.inst-strip__text {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.01em;
}
.nav-link--icon {
  font-size: 1.3rem;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}
</style>
