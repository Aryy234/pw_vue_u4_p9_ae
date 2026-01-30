import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/estudiantes/consultar-todos',
    name: 'consultar-todos',
    component: () => import('../views/estudiantes/ConsultarTodosView.vue')
  },
  {
    path: '/estudiantes/consultar-por-id',
    name: 'consultar-por-id',
    component: () => import('../views/estudiantes/ConsultarPorIdView.vue')
  },
  {
    path: '/estudiantes/guardar',
    name: 'guardar',
    component: () => import('../views/estudiantes/GuardarView.vue')
  },
  {
    path: '/estudiantes/actualizar',
    name: 'actualizar',
    component: () => import('../views/estudiantes/ActualizarView.vue')
  },
  {
    path: '/estudiantes/actualizar-parcial',
    name: 'actualizar-parcial',
    component: () => import('../views/estudiantes/ActualizarParcialView.vue')
  },
  {
    path: '/estudiantes/borrar',
    name: 'borrar',
    component: () => import('../views/estudiantes/BorrarView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
