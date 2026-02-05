import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isTokenExpired } from '../utils/jwtHelper'

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
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/estudiantes/consultar-todos',
    name: 'consultar-todos',
    component: () => import('../views/estudiantes/ConsultarTodosView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/estudiantes/consultar-por-id',
    name: 'consultar-por-id',
    component: () => import('../views/estudiantes/ConsultarPorIdView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/estudiantes/guardar',
    name: 'guardar',
    component: () => import('../views/estudiantes/GuardarView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/estudiantes/actualizar',
    name: 'actualizar',
    component: () => import('../views/estudiantes/ActualizarView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/estudiantes/actualizar-parcial',
    name: 'actualizar-parcial',
    component: () => import('../views/estudiantes/ActualizarParcialView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/estudiantes/borrar',
    name: 'borrar',
    component: () => import('../views/estudiantes/BorrarView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token && !isTokenExpired(token);

  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Guardar la ruta a la que intentaba acceder
    next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
  }
  // Si ya está autenticado e intenta ir al login
  else if (to.meta.requiresGuest && isAuthenticated) {
    next({ name: 'home' });
  }
  // En cualquier otro caso, permitir la navegación
  else {
    next();
  }
});

export default router
