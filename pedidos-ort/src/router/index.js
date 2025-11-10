import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import EmpleadoView from '../views/EmpleadoView.vue'
import ClienteView from '../views/ClienteView.vue'
import GerenteView from '../views/GerenteView.vue'
import HistorialView from '../views/HistorialView.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/empleado',
    component: EmpleadoView,
    meta: { requiresAuth: true, roles: ['empleado', 'gerente'] },
  },
  {
    path: '/cliente',
    component: ClienteView,
    meta: { requiresAuth: true, roles: ['cliente', 'gerente'] },
  },
  {
    path: '/gerente',
    component: GerenteView,
    meta: { requiresAuth: true, roles: ['gerente'] },
  },
  {
    path: '/historial',
    component: HistorialView,
    meta: { requiresAuth: true, roles: ['cliente', 'gerente'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('isAuth') === '1'
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user.role

  if (to.meta.requiresAuth && !isAuth) return next('/login')
  if (to.meta.roles && !to.meta.roles.includes(role)) return next('/')
  next()
})

export default router
