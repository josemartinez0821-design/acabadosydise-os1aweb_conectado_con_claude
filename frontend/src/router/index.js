import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Rutas basadas en la matriz de trazabilidad RF01-RF14 del proyecto (Evidencia proyecto formativo.pdf, p.47)
const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') }, // RF13
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { hideChrome: true } }, // RF02
  { path: '/registro', name: 'registro', component: () => import('../views/RegistroView.vue'), meta: { hideChrome: true } }, // RF01
  { path: '/recuperar-password', name: 'recuperar-password', component: () => import('../views/RecuperarPasswordView.vue'), meta: { hideChrome: true } }, // RF03
  { path: '/perfil', name: 'perfil', component: () => import('../views/PerfilView.vue'), meta: { requiresAuth: true } }, // RF04
  { path: '/pedidos', name: 'pedidos', component: () => import('../views/PedidosView.vue'), meta: { requiresAuth: true } }, // RF13 - historial de compras
  { path: '/productos', name: 'productos', component: () => import('../views/ProductosView.vue') }, // RF05
  { path: '/productos/:id', name: 'producto-detalle', component: () => import('../views/DetalleProductoView.vue'), props: true }, // RF06
  { path: '/carrito', name: 'carrito', component: () => import('../views/CarritoView.vue') }, // RF07 - visible sin sesión; el login se pide al proceder al pago
  { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { requiresAuth: true } },
  { path: '/cotizaciones', name: 'cotizaciones', component: () => import('../views/CotizacionesView.vue') }, // RF08 - visible sin sesión; la propia vista muestra el aviso de inicio de sesión
  { path: '/servicios', name: 'servicios', component: () => import('../views/ServiciosView.vue') }, // RF09
  { path: '/servicios/:id', name: 'servicio-detalle', component: () => import('../views/DetalleServicioView.vue'), props: true },
  { path: '/nosotros', name: 'nosotros', component: () => import('../views/NosotrosView.vue') },
  { path: '/contacto', name: 'contacto', component: () => import('../views/ContactoView.vue') }, // RF10
  { path: '/terminos-y-condiciones', name: 'terminos', component: () => import('../views/TerminosView.vue'), meta: { hideChrome: true } },
  { path: '/politica-privacidad', name: 'politica-privacidad', component: () => import('../views/PoliticaPrivacidadView.vue'), meta: { hideChrome: true } }, // RNF07
  { path: '/pqrs', name: 'pqrs', component: () => import('../views/PqrsView.vue') }, // RF11 - visible sin sesión; la propia vista muestra el aviso de inicio de sesión
  {
    path: '/admin',
    component: () => import('../components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, hideChrome: true },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') }, // RF12
      { path: 'productos', name: 'admin-productos', component: () => import('../views/admin/AdminProductosView.vue') }, // RF16/RF17
      { path: 'servicios', name: 'admin-servicios', component: () => import('../views/admin/AdminServiciosView.vue') }, // RF09/RF10
      { path: 'inventario', name: 'admin-inventario', component: () => import('../views/admin/AdminInventarioView.vue') }, // stock + movimientos_inventario
      { path: 'ventas', name: 'admin-ventas', component: () => import('../views/admin/AdminVentasView.vue') },
      { path: 'cotizaciones', name: 'admin-cotizaciones', component: () => import('../views/admin/AdminCotizacionesView.vue') },
      { path: 'pqrs', name: 'admin-pqrs', component: () => import('../views/admin/AdminPqrsView.vue') }, // RF11 - gestión admin de PQRS
      { path: 'reportes', name: 'admin-reportes', component: () => import('../views/admin/AdminReportesView.vue') }, // RF19
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Al navegar entre páginas (ej. de un producto a otro) siempre arranca arriba;
    // al usar atrás/adelante del navegador respeta la posición donde ibas.
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'home' }
  }
})

export default router
