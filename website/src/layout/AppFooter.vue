<template>
  <footer class="app-footer">
    <div class="container">
      <div class="app-footer__top">
        <img
          :src="rodapeProexc"
          alt="UNIRIO — Pró-Reitoria de Extensão e Cultura (PROEXC)"
          class="app-footer__logo"
        />
        <p class="app-footer__inst">
          Projeto de Extensão · Universidade Federal do Estado do Rio de Janeiro ·
          Pró-Reitoria de Extensão e Cultura
        </p>
        <div class="app-footer__social">
          <a
            href="https://www.youtube.com/@PesquisaOperacionalparatodos"
            target="_blank"
            rel="noopener"
            aria-label="Canal no YouTube"
            title="YouTube"
          ><i class="bi bi-youtube"></i></a>
          <a
            href="https://www.instagram.com/pesquisaoperacionalparatodos"
            target="_blank"
            rel="noopener"
            aria-label="Perfil no Instagram"
            title="Instagram"
          ><i class="bi bi-instagram"></i></a>
          <a
            href="https://github.com/poparatodos/Pesquisa-Operacional-Para-Todos"
            target="_blank"
            rel="noopener"
            aria-label="Código no GitHub"
            title="GitHub"
          ><i class="bi bi-github"></i></a>
        </div>
      </div>
      <hr class="app-footer__rule" />
      <p class="app-footer__copy">
        &copy; {{ year }} Pesquisa Operacional Para Todos — UNIRIO.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import rodapeProexc from '@/assets/logos/rodape_proexc.png'
const year = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 2.5rem 0 1.5rem;
  margin-top: 3rem;
}
.app-footer__top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.9rem;
}
.app-footer__logo {
  height: 56px;
  width: auto;
  border-radius: 6px;
}
.app-footer__inst {
  color: var(--muted);
  font-size: 0.9rem;
  max-width: 46ch;
  margin: 0;
}
.app-footer__social {
  display: flex;
  gap: 1rem;
  font-size: 1.5rem;
}
.app-footer__social a {
  color: var(--brand);
  transition: color 0.15s ease;
}
.app-footer__social a:hover { color: var(--brand-strong); }
.app-footer__rule {
  border-color: var(--border);
  margin: 1.75rem 0 1rem;
}
.app-footer__copy {
  text-align: center;
  color: var(--muted);
  font-size: 0.85rem;
  margin: 0;
}
</style>
