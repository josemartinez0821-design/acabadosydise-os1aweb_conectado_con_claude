import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Los RF citados siguen la numeración del documento oficial de requisitos (RF01-RF23) - ver
// docs/MATRIZ_TRAZABILIDAD.md. "Ampliación" = funcionalidad agregada sin un RF oficial.
const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') }, // RF22 - promociones en la página de inicio
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { hideChrome: true } }, // RF03/RF15
  { path: '/registro', name: 'registro', component: () => import('../views/RegistroView.vue'), meta: { hideChrome: true } }, // RF01
  { path: '/recuperar-password', name: 'recuperar-password', component: () => import('../views/RecuperarPasswordView.vue'), meta: { hideChrome: true } }, // ampliación
  { path: '/perfil', name: 'perfil', component: () => import('../views/PerfilView.vue'), meta: { requiresAuth: true } }, // ampliación (perfil) + RF13
  { path: '/pedidos', name: 'pedidos', component: () => import('../views/PedidosView.vue'), meta: { requiresAuth: true } }, // RF13 - historial de compras
  { path: '/productos', name: 'productos', component: () => import('../views/ProductosView.vue') }, // RF05
  { path: '/productos/:id', name: 'producto-detalle', component: () => import('../views/DetalleProductoView.vue'), props: true }, // RF06
  { path: '/carrito', name: 'carrito', component: () => import('../views/CarritoView.vue') }, // RF08 (y RF07: visible sin sesión; el login se pide al proceder al pago)
  { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { requiresAuth: true, hideChrome: true } }, // RF10/RF11/RF12
  { path: '/cotizaciones', name: 'cotizaciones', component: () => import('../views/CotizacionesView.vue') }, // ampliación - visible sin sesión; la propia vista muestra el aviso de inicio de sesión
  { path: '/servicios', name: 'servicios', component: () => import('../views/ServiciosView.vue') }, // ampliación
  { path: '/servicios/:id', name: 'servicio-detalle', component: () => import('../views/DetalleServicioView.vue'), props: true }, // ampliación
  { path: '/nosotros', name: 'nosotros', component: () => import('../views/NosotrosView.vue') }, // RNF11 - Quiénes somos
  { path: '/contacto', name: 'contacto', component: () => import('../views/ContactoView.vue') }, // RF20 + ampliación (formulario)
  { path: '/terminos-y-condiciones', name: 'terminos', component: () => import('../views/TerminosView.vue'), meta: { hideChrome: true } },
  { path: '/politica-privacidad', name: 'politica-privacidad', component: () => import('../views/PoliticaPrivacidadView.vue'), meta: { hideChrome: true } }, // RNF07
  { path: '/pqrs', name: 'pqrs', component: () => import('../views/PqrsView.vue') }, // ampliación - visible sin sesión; la propia vista muestra el aviso de inicio de sesión
  {
    path: '/admin',
    component: () => import('../components/layout/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, hideChrome: true },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/DashboardView.vue') }, // RF15
      { path: 'productos', name: 'admin-productos', component: () => import('../views/admin/AdminProductosView.vue') }, // RF16/RF17
      { path: 'servicios', name: 'admin-servicios', component: () => import('../views/admin/AdminServiciosView.vue') }, // ampliación
      { path: 'promociones', name: 'admin-promociones', component: () => import('../views/admin/AdminPromocionesView.vue') }, // RF18/RF22
      { path: 'inventario', name: 'admin-inventario', component: () => import('../views/admin/AdminInventarioView.vue') }, // RF17 - stock + movimientos_inventario
      { path: 'ventas', name: 'admin-ventas', component: () => import('../views/admin/AdminVentasView.vue') }, // RF12 - estado, guía y transportadora de cada pedido
      { path: 'cotizaciones', name: 'admin-cotizaciones', component: () => import('../views/admin/AdminCotizacionesView.vue') }, // ampliación
      { path: 'pqrs', name: 'admin-pqrs', component: () => import('../views/admin/AdminPqrsView.vue') }, // ampliación - gestión admin de PQRS
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
