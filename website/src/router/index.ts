import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// Definição das rotas. A criação do Router (history/scroll) fica a cargo do
// vite-ssg (ver src/main.ts): no build ele usa memory history para pré-render
// e, no cliente, web history. Os testes montam seu próprio router a partir
// desta lista.
export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/po1/:lessonId?',
    name: 'po1',
    component: () => import('@/views/DisciplinaView.vue'),
    props: { slug: 'po1' },
  },
  {
    path: '/po2/:lessonId?',
    name: 'po2',
    component: () => import('@/views/DisciplinaView.vue'),
    props: { slug: 'po2' },
  },
  {
    path: '/problemas/:lessonId?',
    name: 'problemas',
    component: () => import('@/views/ProblemasView.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]
