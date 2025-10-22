import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'  // si todavía no existe, podés crearlo vacío

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/empleado', name: 'empleado', component: () => import('../views/EmpleadoView.vue') }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router