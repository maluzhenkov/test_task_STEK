import { createRouter, createWebHistory } from 'vue-router';

const base = import.meta.env.BASE_URL;

export const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),
    },
  ],
});

export default router;
