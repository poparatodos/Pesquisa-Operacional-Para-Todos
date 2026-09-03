<template>
  <section id="disciplinas" class="container py-5">
    <div class="text-center mb-5">
      <h2 class="section-title">Explore as trilhas</h2>
      <p class="text-muted mb-0">Escolha por onde começar a estudar.</p>
    </div>
    <div class="row g-4 justify-content-center">
      <div v-for="d in cards" :key="d.slug" class="col-12 col-sm-6 col-lg-4">
        <RouterLink :to="d.to" class="disc-card">
          <span class="disc-card__icon"><i :class="d.icon"></i></span>
          <h3 class="disc-card__title">{{ d.title }}</h3>
          <p class="disc-card__desc">{{ d.subtitle }}</p>
          <div class="disc-card__foot">
            <span class="app-chip">{{ d.meta }}</span>
            <span class="disc-card__cta">Acessar <i class="bi bi-arrow-right"></i></span>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { disciplines } from '@/content'

const icons: Record<string, string> = {
  po1: 'bi bi-1-circle-fill',
  po2: 'bi bi-2-circle-fill',
  problemas: 'bi bi-puzzle-fill',
}

const cards = Object.values(disciplines).map((d) => ({
  slug: d.slug,
  to: `/${d.slug}`,
  title: d.title,
  subtitle: d.subtitle,
  meta: d.lessons.length > 0 ? `${d.lessons.length} aulas` : 'Em breve',
  icon: icons[d.slug] ?? 'bi bi-collection-fill',
}))
</script>

<style scoped>
.disc-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  text-decoration: none;
  color: var(--text);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}
.disc-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--brand-bright);
}
.disc-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: var(--brand-soft);
  color: var(--brand);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.disc-card__title {
  font-size: var(--fs-h4);
  font-weight: 600;
  color: var(--brand-strong);
  margin-bottom: 0.4rem;
}
.disc-card__desc {
  color: var(--muted);
  font-size: 0.95rem;
  flex-grow: 1;
  margin-bottom: 1.25rem;
}
.disc-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.disc-card__cta {
  font-weight: 600;
  color: var(--brand);
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}
.disc-card:hover .disc-card__cta i {
  transform: translateX(3px);
}
.disc-card__cta i { transition: transform 0.15s ease; }
</style>
