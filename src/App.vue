<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/layout/NavBar.vue'
import FooterSite from './components/layout/FooterSite.vue'
import ToastContainer from './components/layout/ToastContainer.vue'
import SessionWarningModal from './components/layout/SessionWarningModal.vue'
import CenterMessage from './components/layout/CenterMessage.vue'
import { useCatalogStore } from './stores/catalog'
import { useInactivityLogout } from './composables/useInactivityLogout'

const catalog = useCatalogStore()
const route = useRoute()

useInactivityLogout().iniciar()

const loaderHidden = ref(false)
const backTopVisible = ref(false)

function onScroll() {
  backTopVisible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  setTimeout(() => (loaderHidden.value = true), 2200)
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div id="page-loader" :class="{ hidden: loaderHidden }">
    <div class="loader-logo">ACABADOS <span>1A</span></div>
    <div class="loader-bar"><div class="loader-bar-fill"></div></div>
  </div>

  <NavBar v-if="!route.meta.hideChrome" />
  <main :class="{ 'main-content': !route.meta.hideChrome }">
    <RouterView v-slot="{ Component }">
      <!-- Nueva Cotización guarda un borrador (productos/servicios agregados, pestaña activa) en
           memoria mientras dura la sesión — si el cliente sale a leer los Términos y vuelve, lo
           encuentra exactamente como lo dejó, en vez de perder lo que llevaba armado. -->
      <keep-alive :include="['CotizacionesView']">
        <component :is="Component" />
      </keep-alive>
    </RouterView>
  </main>
  <FooterSite v-if="!route.meta.hideChrome" />

  <template v-if="!route.meta.hideChrome">
    <a
      :href="`https://wa.me/${catalog.configuracion.whatsapp}?text=Hola!%20Quiero%20más%20información`"
      target="_blank"
      rel="noopener"
      id="whatsapp-float"
      title="Contáctanos por WhatsApp"
    >
      <i class="ri-whatsapp-line"></i>
    </a>
    <button id="back-to-top" :class="{ visible: backTopVisible }" title="Volver arriba" @click="scrollToTop">
      <i class="ri-arrow-up-line"></i>
    </button>
  </template>

  <ToastContainer />
  <SessionWarningModal />
  <CenterMessage />
</template>
