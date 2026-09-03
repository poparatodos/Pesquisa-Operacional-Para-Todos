import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
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
  // PROTÓTIPO — descartável (design exploration do fluxo de aula). Remover ao consolidar.
  {
    path: '/prototipo/:slug?/:lessonId?',
    name: 'prototipo',
    component: () => import('@/prototype/PrototipoView.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
