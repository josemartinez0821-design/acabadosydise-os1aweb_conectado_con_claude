<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useCenterMessage } from '../../composables/useCenterMessage'

const auth = useAuthStore()
const cart = useCartStore()
const { mostrarMensajeCentral } = useCenterMessage()

const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function closeMobile() {
  mobileOpen.value = false
}

function logout() {
  auth.logout()
  mostrarMensajeCentral('Has cerrado sesión correctamente.', {
    icono: 'ri-shield-check-line',
    tipo: 'despedida',
    duracion: 2200,
  })
}
</script>

<template>
  <nav class="navbar" :class="{ scrolled }">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-icon"><i class="ri-paint-brush-line"></i></span>
        ACABADOS <span class="brand-highlight">&nbsp;1A</span>
      </RouterLink>

      <div class="navbar-nav">
        <RouterLink to="/">Inicio</RouterLink>
        <RouterLink to="/productos">Catálogo</RouterLink>
        <RouterLink to="/servicios">Servicios</RouterLink>
        <RouterLink to="/cotizaciones">Cotizaciones</RouterLink>
        <RouterLink to="/nosotros">Nosotros</RouterLink>
        <RouterLink to="/contacto">Contacto</RouterLink>
      </div>

      <div class="navbar-actions">
        <RouterLink to="/carrito" class="nav-icon-btn" title="Carrito">
          <i class="ri-shopping-cart-line"></i>
          <span class="cart-badge" :class="{ show: cart.cantidadTotal }">{{ cart.cantidadTotal }}</span>
        </RouterLink>

        <RouterLink v-if="!auth.isAuthenticated" to="/login" class="btn-nav-login" title="Iniciar Sesión">
          <i class="ri-user-line"></i> <span class="btn-nav-login-text">Iniciar Sesión</span>
        </RouterLink>

        <div v-else class="nav-user-menu">
          <div
            class="nav-user-avatar"
            :style="auth.usuario?.avatar ? { backgroundImage: `url(${auth.usuario.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}"
          >{{ auth.usuario?.avatar ? '' : (auth.usuario?.nombre?.[0] || '') + (auth.usuario?.apellido?.[0] || '') }}</div>
          <span class="nav-user-name">{{ auth.usuario?.nombre }}</span>
          <i class="ri-arrow-down-s-line" style="color:rgba(255,255,255,0.5);font-size:0.9rem;"></i>
          <div class="nav-dropdown">
            <RouterLink to="/perfil"><i class="ri-user-line"></i> Mi Perfil</RouterLink>
            <RouterLink to="/pedidos"><i class="ri-shopping-bag-line"></i> Historial de Mis Pedidos</RouterLink>
            <RouterLink to="/cotizaciones"><i class="ri-file-list-line"></i> Cotizaciones</RouterLink>
            <RouterLink v-if="auth.isAdmin" to="/admin/dashboard"><i class="ri-dashboard-line"></i> Dashboard Admin</RouterLink>
            <a href="#" @click.prevent="logout"><i class="ri-logout-box-line"></i> Cerrar Sesión</a>
          </div>
        </div>
      </div>

      <button class="hamburger" :class="{ open: mobileOpen }" aria-label="Menú" @click="mobileOpen = !mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="mobile-menu" :class="{ open: mobileOpen }">
    <nav class="mobile-menu-nav">
      <RouterLink to="/" @click="closeMobile"><i class="ri-home-line"></i> Inicio</RouterLink>
      <RouterLink to="/productos" @click="closeMobile"><i class="ri-store-line"></i> Productos</RouterLink>
      <RouterLink to="/servicios" @click="closeMobile"><i class="ri-tools-line"></i> Servicios</RouterLink>
      <RouterLink to="/cotizaciones" @click="closeMobile"><i class="ri-file-list-line"></i> Cotizaciones</RouterLink>
      <RouterLink to="/nosotros" @click="closeMobile"><i class="ri-team-line"></i> Nosotros</RouterLink>
      <RouterLink to="/pqrs" @click="closeMobile"><i class="ri-customer-service-line"></i> PQRS</RouterLink>
      <RouterLink to="/contacto" @click="closeMobile"><i class="ri-map-pin-line"></i> Contacto</RouterLink>
      <RouterLink to="/carrito" @click="closeMobile"><i class="ri-shopping-cart-line"></i> Carrito</RouterLink>
      <RouterLink v-if="!auth.isAuthenticated" to="/login" @click="closeMobile"><i class="ri-user-line"></i> Iniciar Sesión</RouterLink>
      <template v-else>
        <RouterLink to="/perfil" @click="closeMobile"><i class="ri-user-3-line"></i> Mi Perfil</RouterLink>
        <RouterLink to="/pedidos" @click="closeMobile"><i class="ri-shopping-bag-line"></i> Historial de Mis Pedidos</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin/dashboard" @click="closeMobile"><i class="ri-dashboard-line"></i> Dashboard Admin</RouterLink>
        <a href="#" @click.prevent="logout(); closeMobile()"><i class="ri-logout-box-line"></i> Cerrar Sesión</a>
      </template>
    </nav>
  </div>
</template>
