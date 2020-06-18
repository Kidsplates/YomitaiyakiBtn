import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/control',
    name: 'control',
    component: () => import( '@/views/Control.vue')
  },
  {
    path: '/hee',
    name: 'hee',
    component: () => import( '@/views/Hee.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
