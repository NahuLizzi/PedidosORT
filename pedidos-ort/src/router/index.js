import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import EmpleadoView from '../views/EmpleadoView.vue'
import ClienteView from '../views/ClienteView.vue'
import GerenteView from '../views/GerenteView.vue'
import HistorialView from '../views/HistorialView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomePublicoView from '../views/HomePublicoView.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: RegisterView },
  { path: '/', component: HomePublicoView },

  /*{Antes, sin Pinia
    path: '/',
    redirect: () => {
      const isAuth = localStorage.getItem('isAuth') === '1'
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      // Si no está logueado → ir al login
      if (!isAuth) return '/login'

      // Si está logueado → ir a su vista por rol
      if (user.role === 'cliente') return '/cliente'
      if (user.role === 'empleado') return '/empleado'
      if (user.role === 'gerente') return '/gerente'

      return '/login'
    }
  },
*/
  {
    path: '/cliente',
    component: ClienteView,
    meta: { requiresAuth: true, roles: ['cliente', 'gerente'] },
  },
  {
    path: '/empleado',
    component: EmpleadoView,
    meta: { requiresAuth: true, roles: ['empleado', 'gerente'] },
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
  routes
})


router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('isAuth') === '1'
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const role = user.role


  if (to.meta.requiresAuth && !isAuth) return next('/login')

  if (to.meta.roles && !to.meta.roles.includes(role)) {
    if (isAuth) {
      if (role === 'cliente') return next('/cliente')
      if (role === 'empleado') return next('/empleado')
      if (role === 'gerente') return next('/gerente')
    }
    return next('/login')
  }

  if (to.path === '/login' && isAuth) {
    if (role === 'cliente') return next('/cliente')
    if (role === 'empleado') return next('/empleado')
    if (role === 'gerente') return next('/gerente')
  }
//ale
    if (to.path === '/' && isAuth) {
    if (role === 'cliente') return next('/cliente')
    if (role === 'empleado') return next('/empleado')
    if (role === 'gerente') return next('/gerente')
  }

  next()
})

export default router