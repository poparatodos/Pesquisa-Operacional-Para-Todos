<template>
  <section class="hero">
    <div class="hero__motif" aria-hidden="true">
      <GraphMark :size="440" />
    </div>
    <div class="container">
      <div class="hero__inner">
        <span class="app-badge mb-3">Projeto de Extensão · UNIRIO</span>
        <h1 class="hero__title">Pesquisa Operacional <span>para Todos</span></h1>
        <p class="hero__subtitle">
          Videoaulas, materiais e problemas clássicos de Pesquisa Operacional —
          abertos, gratuitos e para além da sala de aula.
        </p>
        <div class="hero__actions">
          <RouterLink to="/po1" class="app-btn app-btn--solid app-btn--lg">
            <i class="bi bi-play-circle-fill"></i> Começar por PO I
          </RouterLink>
          <a
            href="https://www.youtube.com/@PesquisaOperacionalparatodos"
            target="_blank"
            rel="noopener"
            class="app-btn app-btn--lg"
          >
            <i class="bi bi-youtube"></i> Canal no YouTube
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import GraphMark from '@/components/GraphMark.vue'
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(155deg, var(--brand-soft), var(--surface) 68%);
  border-bottom: 1px solid var(--border);
}
.hero__motif {
  position: absolute;
  top: -70px;
  right: -50px;
  opacity: 0.12;
  transform: rotate(6deg);
  pointer-events: none;
}
.hero__inner {
  position: relative;
  max-width: 640px;
  padding: clamp(3rem, 8vw, 5.5rem) 0;
}
.hero__title {
  font-weight: 700;
  font-size: clamp(2rem, 5.5vw, 3.4rem);
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 1rem;
}
.hero__title span { color: var(--brand); }
.hero__subtitle {
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  color: var(--muted);
  max-width: 40ch;
  margin-bottom: 1.75rem;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (max-width: 575.98px) {
  .hero__motif { opacity: 0.08; right: -90px; }
}
</style>
