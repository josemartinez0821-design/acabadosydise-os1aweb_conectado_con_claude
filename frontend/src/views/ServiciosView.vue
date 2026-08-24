<script setup>
// RF09 - catálogo de servicios: sidebar de categorías, búsqueda/orden, tarjetas y cotización (requiere sesión)
import { ref, computed } from 'vue'
import { useCatalogStore } from '../stores/catalog'
import { formatCOP } from '../composables/useFormat'
import { useCotizarGate } from '../composables/useCotizarGate'
import CotizarLoginModal from '../components/service/CotizarLoginModal.vue'

const catalog = useCatalogStore()
const { mostrarModalLogin, irACotizar, irALogin } = useCotizarGate()

const busqueda = ref('')
const tipoActivo = ref('')
const orden = ref('relevancia')

const TIPOS = [
  { value: '', label: 'Todos los servicios' },
  { value: 'drywall', label: 'Drywall' },
  { value: 'aplicacion_pintura', label: 'Aplicación de Pintura' },
  { value: 'asesoria', label: 'Asesoría' },
  { value: 'pvc', label: 'PVC' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'diseño_interiores', label: 'Diseño de Interiores' },
  { value: 'diseño_exteriores', label: 'Diseño de Exteriores' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'consultoria', label: 'Consultoría' },
]

function contarPorTipo(tipo) {
  if (!tipo) return catalog.serviciosCatalogo.length
  return catalog.serviciosCatalogo.filter((s) => s.tipo_servicio === tipo).length
}

function precioComparable(s) {
  return s.precio_hora || s.precio_dia || s.precio_proyecto || 0
}

const serviciosFiltrados = computed(() => {
  let lista = catalog.serviciosCatalogo.filter((s) => {
    const coincideTipo = !tipoActivo.value || s.tipo_servicio === tipoActivo.value
    const coincideBusqueda = s.nombre_servicio.toLowerCase().includes(busqueda.value.toLowerCase())
    return coincideTipo && coincideBusqueda
  })

  if (orden.value === 'precio-asc') lista = [...lista].sort((a, b) => precioComparable(a) - precioComparable(b))
  else if (orden.value === 'precio-desc') lista = [...lista].sort((a, b) => precioComparable(b) - precioComparable(a))
  else if (orden.value === 'rating') lista = [...lista].sort((a, b) => b.rating - a.rating)

  return lista
})

const pasos = [
  { titulo: 'Solicita cotización', desc: 'Cuéntanos tu proyecto. Es gratis y sin compromiso.' },
  { titulo: 'Revisamos y enviamos', desc: 'En máximo 24h recibirás la cotización formal en tu correo y WhatsApp.' },
  { titulo: 'Aprueba y agendamos', desc: 'Si aceptas, coordinamos la fecha y hora que mejor te convenga.' },
  { titulo: '¡Listo! Disfrútalo', desc: 'Nuestro equipo realiza el trabajo y garantizamos el resultado.' },
]
</script>

<template>
  <section class="services-hero">
    <div class="services-hero-bg">
      <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80" alt="Servicios Acabados 1A" />
    </div>
    <div class="container">
      <div class="breadcrumb">
        <span class="breadcrumb-item"><RouterLink to="/"><i class="ri-home-4-line"></i> Inicio</RouterLink></span>
        <span class="breadcrumb-sep"><i class="ri-arrow-right-s-line"></i></span>
        <span class="breadcrumb-item active">Servicios</span>
      </div>
      <h1 class="services-hero-title">Servicios <em>Profesionales</em></h1>
      <p class="services-hero-desc">
        Instalación, aplicación y diseño especializados para transformar tu visión en una realidad duradera con la calidad que nos caracteriza.
      </p>
    </div>
  </section>

  <div class="container">
    <div class="services-stats-card">
      <div class="services-stat"><i class="ri-history-line"></i><strong>10+ Años</strong><span>de experiencia</span></div>
      <div class="services-stat"><i class="ri-hammer-line"></i><strong>1000+</strong><span>Proyectos realizados</span></div>
      <div class="services-stat"><i class="ri-shield-check-line"></i><strong>100%</strong><span>Garantía de calidad</span></div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-header" style="text-align:left;margin-bottom:32px;">
        <span class="section-eyebrow">Lo que ofrecemos</span>
        <h2 class="section-title" style="text-align:left;">Catálogo de servicios</h2>
        <p class="section-subtitle" style="text-align:left;margin:0;">Soluciones profesionales para cada tipo de proyecto</p>
      </div>

      <div class="layout-sidebar">
        <aside class="sidebar">
          <div class="sidebar-card" style="margin-bottom:20px;">
            <div class="sidebar-section">
              <div class="sidebar-title"><i class="ri-price-tag-3-line"></i> Categorías</div>
              <nav class="services-cat-list">
                <a
                  v-for="t in TIPOS"
                  :key="t.value"
                  class="services-cat-item"
                  :class="{ active: tipoActivo === t.value }"
                  @click="tipoActivo = t.value"
                >
                  <span>{{ t.label }}</span>
                  <span class="services-cat-count">{{ contarPorTipo(t.value) }}</span>
                </a>
              </nav>
            </div>
          </div>

          <div class="services-help-card">
            <h4>¿Necesitas ayuda?</h4>
            <p>Agenda una visita técnica gratuita para evaluar tu proyecto.</p>
            <a :href="`https://wa.me/${catalog.configuracion.whatsapp}?text=Hola!%20Quiero%20agendar%20una%20visita%20técnica`" target="_blank" rel="noopener" class="btn btn-primary btn-block">
              <i class="ri-whatsapp-line"></i> Contactar Experto
            </a>
          </div>
        </aside>

        <div>
          <div class="services-toolbar">
            <div class="search-input-wrap">
              <i class="ri-search-line search-input-icon"></i>
              <input v-model="busqueda" type="search" class="form-control" placeholder="Buscar servicio... ej: pintura, drywall" style="padding-left:38px;" />
            </div>
            <select v-model="orden">
              <option value="relevancia">Ordenar por: Relevancia</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor calificados</option>
            </select>
          </div>

          <p class="text-muted mb-24">{{ serviciosFiltrados.length }} servicio(s) encontrado(s)</p>

          <div v-if="serviciosFiltrados.length" class="services-cards-grid">
            <div class="service-card" v-for="s in serviciosFiltrados" :key="s.id_servicio">
              <RouterLink :to="`/servicios/${s.id_servicio}`" class="service-card-img" style="height:224px;">
                <img :src="s.imagen_url" :alt="s.nombre_servicio" loading="lazy" />
                <span v-if="s.destacado" class="service-card-ribbon">Destacado</span>
                <span class="service-card-cat-badge">{{ s.tipo_servicio.replace('_', ' ') }}</span>
              </RouterLink>
              <div class="service-card-body">
                <div class="d-flex justify-between align-center" style="margin-bottom:8px;">
                  <h3 class="service-name" style="margin-bottom:0;"><RouterLink :to="`/servicios/${s.id_servicio}`" style="color:inherit;">{{ s.nombre_servicio }}</RouterLink></h3>
                  <div class="service-card-rating"><i class="ri-star-fill"></i> {{ s.rating }}</div>
                </div>
                <p class="service-desc">{{ s.descripcion }}</p>
                <div class="service-card-meta">
                  <span><i class="ri-time-line"></i> {{ s.duracion_estimada_horas }}h estimadas</span>
                  <span><i class="ri-shield-check-line"></i> {{ s.garantia_meses }} meses garantía</span>
                </div>
                <div class="d-flex align-center mb-16" style="margin-top:4px;">
                  <span v-if="s.precio_hora" class="service-price">{{ formatCOP(s.precio_hora) }} <small style="font-size:0.7rem;color:var(--text-muted);font-weight:500;">/hora</small></span>
                  <span v-else-if="s.precio_dia" class="service-price">{{ formatCOP(s.precio_dia) }} <small style="font-size:0.7rem;color:var(--text-muted);font-weight:500;">/día</small></span>
                  <span v-else-if="s.precio_proyecto" class="service-price">Desde {{ formatCOP(s.precio_proyecto) }}</span>
                </div>
                <div class="d-flex gap-10">
                  <RouterLink :to="`/servicios/${s.id_servicio}`" class="btn btn-outline-red btn-sm" style="flex:1;">Ver detalles</RouterLink>
                  <button class="btn btn-primary btn-sm" style="flex:1;" @click="irACotizar({ tipo: 'servicio', id: s.id_servicio })">Cotizar ahora</button>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-muted" style="padding:60px 0;">No se encontraron servicios con esos filtros.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--off-white);">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow">Simple y rápido</span>
        <h2 class="section-title">¿Cómo funciona?</h2>
        <p class="section-subtitle">Contratar nuestros servicios es fácil. Solo sigue estos pasos:</p>
      </div>
      <div class="process-steps">
        <div class="process-step" v-for="(p, i) in pasos" :key="p.titulo">
          <div class="process-step-num">{{ i + 1 }}</div>
          <h3 class="process-step-title">{{ p.titulo }}</h3>
          <p class="process-step-desc">{{ p.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="home-cta-section">
    <div class="container">
      <h2 class="home-cta-title">¿Tienes un proyecto en mente?</h2>
      <p class="home-cta-sub">
        Nuestro equipo de expertos está listo para ayudarte a transformar tus espacios con la calidad y puntualidad que tu obra merece.
      </p>
      <div class="home-cta-actions">
        <button class="btn btn-white btn-lg" @click="irACotizar">Solicitar Cotización</button>
        <RouterLink to="/productos" class="home-cta-link">Ver catálogo de productos</RouterLink>
      </div>
    </div>
  </section>

  <CotizarLoginModal :mostrar="mostrarModalLogin" @cerrar="mostrarModalLogin = false" @iniciar-sesion="irALogin" />
</template>
