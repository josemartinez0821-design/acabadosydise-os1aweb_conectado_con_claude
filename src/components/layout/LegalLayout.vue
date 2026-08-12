<script setup>
import { useRoute, useRouter } from 'vue-router'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})

// Esta página se navega dentro de la misma pestaña (con router-link normal, sin target="_blank")
// para que el botón "Atrás" del navegador funcione como se espera. El botón "Volver" hace lo mismo
// a propósito: usa el historial si existe, y si no (ej. se entró por URL directa) cae a la página
// desde la que se aceptan estos términos, según `from`.
const ORIGEN_FALLBACK = {
  registro: '/registro',
  login: '/login',
  cotizaciones: '/cotizaciones',
}

const route = useRoute()
const router = useRouter()

function volverAtras() {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push(ORIGEN_FALLBACK[route.query.from] || '/')
  }
}
</script>

<template>
  <div class="legal-page">
    <header class="legal-topbar">
      <RouterLink to="/" class="legal-topbar-logo">
        <span class="brand-icon"><i class="ri-paint-brush-line"></i></span>
        ACABADOS <span class="text-primary">1A</span>
      </RouterLink>
      <button class="legal-back-btn" @click="volverAtras"><i class="ri-arrow-left-line"></i> Volver</button>
    </header>

    <div class="legal-hero">
      <div class="legal-hero-pattern"></div>
      <div class="legal-hero-shape shape-1"></div>
      <div class="legal-hero-shape shape-2"></div>
      <div class="container">
        <div class="legal-hero-eyebrow"><i class="ri-shield-check-line"></i><span>Documento legal</span></div>
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
    </div>

    <section class="section legal-section-wrap">
      <div class="container">
        <div class="legal-content-card">
          <slot />
        </div>
      </div>
    </section>

    <footer class="legal-footer">
      <p>&copy; 2026 Acabados y Diseños 1A — Documento informativo</p>
    </footer>
  </div>
</template>
