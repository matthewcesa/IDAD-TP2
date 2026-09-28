import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import HomeView from '../views/HomeView.vue'
import StatsView from '../views/StatView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/stats', name: 'stats', component: StatsView },
    { path: '/login', name: 'login', component: LoginView }
  ]
})

router.beforeEach(to => {
  const authenticated = store.getters['cookies/isAuthenticated']
  if (!authenticated && to.name !== 'login') return { name: 'login' }
  if (authenticated && to.name === 'login') return { name: 'home' }
})

export default router