<script setup>
// RF11 - PQRS: radicación (tipo/asunto/descripción) e historial con estado -> tabla `pqrs`. Requiere sesión.
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCatalogStore } from '../stores/catalog'
import { usePqrsStore } from '../stores/pqrs'
import { useToast } from '../composables/useToast'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../data/colombia'
import CotizarLoginModal from '../components/service/CotizarLoginModal.vue'

const auth = useAuthStore()
const router = useRouter()
const catalog = useCatalogStore()
const pqrsStore = usePqrsStore()
const { showToast } = useToast()

// PQRS es información privada (no se precarga en App.vue) - se pide aquí, una sola vez, si hay
// sesión iniciada. Mismo patrón que cotizaciones/ventas en PerfilView.vue.
onMounted(() => {
  if (auth.usuario) pqrsStore.cargarPqrs()
})

// Aviso de sesión: aparece de inmediato si no hay usuario autenticado (mismo patrón que Cotizaciones).
const mostrarModalLogin = ref(!auth.isAuthenticated)
function irALogin() {
  mostrarModalLogin.value = false
  router.push({ path: '/login', query: { redirect: '/pqrs' } })
}

const tabActiva = ref('nueva')
const misPqrs = computed(() => (auth.usuario ? pqrsStore.getPqrsDeUsuario(auth.usuario.id_usuario) : []))

// Al abrir "Mis Solicitudes" se apagan las respuestas nuevas (punto rojo del navbar) — entrar aquí
// es lo que cuenta como "ya las vi", ver contarRespuestasNuevas()/marcarPqrsVistas() en el store.
watch(
  tabActiva,
  (v) => { if (v === 'historial' && auth.usuario) pqrsStore.marcarPqrsVistas(auth.usuario.id_usuario) },
  { immediate: true }
)

function fechaLarga(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}

const pasos = [
  { titulo: 'Radicas tu solicitud', desc: 'Elige el tipo y describe tu caso con el mayor detalle posible.' },
  { titulo: 'Confirmación de recibido', desc: 'Tu solicitud queda registrada con un número de radicado único.' },
  { titulo: 'Análisis y gestión', desc: 'Nuestro equipo revisa y da trámite a tu caso.' },
  { titulo: 'Respuesta final', desc: 'Recibes la respuesta en máximo 48 horas hábiles.' },
]

// ── Nueva PQRS ──────────────────────────────────────────────────
// Departamento/ciudad se prellenan con la ubicación registrada del usuario, pero quedan editables
// por si la solicitud es sobre un proyecto o dirección distinta a la de su cuenta.
function formVacio() {
  return {
    tipo: '',
    asunto: '',
    descripcion: '',
    departamento: auth.usuario?.departamento || '',
    ciudad: auth.usuario?.ciudad || '',
  }
}
const form = ref(formVacio())
const enviando = ref(false)
const LIMITE_DESCRIPCION = 1500

const municipiosDisponibles = computed(() => MUNICIPIOS_POR_DEPARTAMENTO[form.value.departamento] || [])

watch(() => form.value.departamento, () => {
  if (!municipiosDisponibles.value.includes(form.value.ciudad)) {
    form.value.ciudad = ''
  }
})

function elegirTipo(tipo) {
  form.value.tipo = tipo
}

// ── Evidencia adjunta: solo se guarda el nombre en memoria (no hay backend/almacenamiento real todavía) ──
const archivoInput = ref(null)
const archivoNombre = ref('')
const LIMITE_ARCHIVO_MB = 5

function abrirSelectorArchivo() {
  archivoInput.value?.click()
}
function onArchivoSeleccionado(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > LIMITE_ARCHIVO_MB * 1024 * 1024) {
    showToast(`El archivo supera el límite de ${LIMITE_ARCHIVO_MB} MB.`, 'danger')
    e.target.value = ''
    return
  }
  archivoNombre.value = file.name
}
function quitarArchivo() {
  archivoNombre.value = ''
  if (archivoInput.value) archivoInput.value.value = ''
}

async function radicar() {
  if (!form.value.tipo) {
    showToast('Selecciona el tipo de solicitud.', 'danger')
    return
  }
  if (!form.value.asunto.trim() || !form.value.descripcion.trim()) {
    showToast('Completa el asunto y la descripción.', 'danger')
    return
  }
  if (!form.value.departamento || !form.value.ciudad) {
    showToast('Selecciona el departamento y la ciudad/municipio.', 'danger')
    return
  }

  enviando.value = true

  let nueva
  try {
    nueva = await pqrsStore.crearPqrs({
      tipo: form.value.tipo,
      asunto: form.value.asunto.trim(),
      descripcion: form.value.descripcion.trim(),
      departamento: form.value.departamento,
      ciudad: form.value.ciudad,
      evidencia_nombre: archivoNombre.value || null,
    })
  } catch (e) {
    enviando.value = false
    showToast(e.response?.data?.mensaje || 'No se pudo radicar la solicitud. Intenta de nuevo.', 'danger')
    return
  }

  form.value = formVacio()
  quitarArchivo()
  enviando.value = false
  showToast(`¡Solicitud radicada! Tu número es ${nueva.numero_pqrs}.`, 'success')
  tabActiva.value = 'historial'
}
</script>

<template>
  <section class="page-hero">
    <div class="page-hero-bg">
      <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1400&q=60" alt="" />
    </div>
    <div class="container">
      <div class="page-hero-inner">
        <div class="page-hero-eyebrow">
          <i class="ri-customer-service-line"></i>
          <span>Atención al cliente</span>
        </div>
        <h1 class="page-hero-title">
          Peticiones, Quejas,<br>
          <span class="highlight">Reclamos y Sugerencias</span>
        </h1>
        <p class="page-hero-subtitle">
          Tu opinión es importante para nosotros. Cuéntanos cómo podemos mejorar y nos comprometemos a
          responderte en menos de 48 horas hábiles.
        </p>
        <div class="breadcrumb">
          <span class="breadcrumb-item"><RouterLink to="/"><i class="ri-home-4-line"></i> Inicio</RouterLink></span>
          <span class="breadcrumb-sep"><i class="ri-arrow-right-s-line"></i></span>
          <span class="breadcrumb-item active">PQRS</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <!-- SIN SESIÓN -->
      <template v-if="!auth.isAuthenticated">
        <div class="cotiz-landing">
          <div class="cotiz-landing-icon"><i class="ri-customer-service-line"></i></div>
          <h2 class="cotiz-landing-title">Radica tu PQRS y haz seguimiento</h2>
          <p class="cotiz-landing-desc">
            Necesitas iniciar sesión para que tu solicitud quede asociada a tu cuenta — así podemos darle
            seguimiento y avisarte cuando tengamos una respuesta.
          </p>

          <div class="cotiz-landing-benefits">
            <div class="cotiz-landing-benefit">
              <i class="ri-time-line"></i>
              <strong>Respuesta en 48h</strong>
              <span>Tiempo máximo hábil</span>
            </div>
            <div class="cotiz-landing-benefit">
              <i class="ri-radar-line"></i>
              <strong>Seguimiento en línea</strong>
              <span>Consulta el estado cuando quieras</span>
            </div>
            <div class="cotiz-landing-benefit">
              <i class="ri-lock-2-line"></i>
              <strong>Confidencial</strong>
              <span>Solo tú y nuestro equipo la ven</span>
            </div>
          </div>

          <div class="cotiz-landing-actions">
            <button class="btn btn-primary btn-lg" @click="mostrarModalLogin = true">
              <i class="ri-login-box-line"></i> Iniciar Sesión para Continuar
            </button>
            <RouterLink to="/registro" class="cotiz-landing-link">¿No tienes cuenta? Regístrate gratis</RouterLink>
          </div>
        </div>
      </template>

      <!-- CON SESIÓN -->
      <template v-else>
        <div class="pqrs-layout">
          <div>
            <div class="cotiz-tabs">
              <button class="cotiz-tab" :class="{ active: tabActiva === 'nueva' }" @click="tabActiva = 'nueva'">
                <i class="ri-add-circle-line"></i> Radicar PQRS
              </button>
              <button class="cotiz-tab" :class="{ active: tabActiva === 'historial' }" @click="tabActiva = 'historial'">
                <i class="ri-history-line"></i> Mis Solicitudes <span class="badge-count">{{ misPqrs.length }}</span>
              </button>
            </div>

            <!-- NUEVA PQRS -->
            <div v-if="tabActiva === 'nueva'">
              <div class="pqrs-type-grid">
                <div
                  v-for="(t, key) in pqrsStore.TIPOS"
                  :key="key"
                  class="pqrs-type-card"
                  :class="{ active: form.tipo === key }"
                  @click="elegirTipo(key)"
                >
                  <div class="pqrs-type-icon"><i :class="t.icon"></i></div>
                  <div class="pqrs-type-name">{{ t.label }}</div>
                  <div class="pqrs-type-desc">{{ t.desc }}</div>
                </div>
              </div>

              <div class="auth-info-box">
                <i class="ri-user-line"></i>
                <span>Enviando como <strong>{{ auth.usuario.nombre }} {{ auth.usuario.apellido }}</strong> ({{ auth.usuario.email }})</span>
              </div>

              <form @submit.prevent="radicar">
                <div class="form-group">
                  <label class="form-label required">Asunto</label>
                  <input v-model="form.asunto" type="text" class="form-control" placeholder="Resumen breve del motivo de tu solicitud" maxlength="200" required />
                </div>

                <div class="auth-form-row">
                  <div class="form-group">
                    <label class="form-label required">Departamento</label>
                    <select v-model="form.departamento" class="form-control" required>
                      <option value="" disabled>Seleccionar...</option>
                      <option v-for="depto in DEPARTAMENTOS" :key="depto" :value="depto">{{ depto }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label required">Ciudad / Municipio</label>
                    <select v-model="form.ciudad" class="form-control" required :disabled="!form.departamento">
                      <option value="" disabled>{{ form.departamento ? 'Seleccionar...' : 'Elige primero un departamento' }}</option>
                      <option v-for="mun in municipiosDisponibles" :key="mun" :value="mun">{{ mun }}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label required">Descripción detallada</label>
                  <textarea
                    v-model="form.descripcion"
                    class="form-control"
                    rows="6"
                    placeholder="Describe con detalle tu petición, queja, reclamo o sugerencia. Incluye fechas, hechos y cualquier información relevante..."
                    :maxlength="LIMITE_DESCRIPCION"
                    required
                  ></textarea>
                  <div class="pqrs-char-count" :class="{ 'near-limit': form.descripcion.length > LIMITE_DESCRIPCION - 100 }">
                    {{ form.descripcion.length }} / {{ LIMITE_DESCRIPCION }} caracteres
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Adjuntar evidencia (opcional)</label>
                  <div class="file-upload-area" @click="abrirSelectorArchivo">
                    <div class="file-upload-icon"><i class="ri-upload-cloud-2-line"></i></div>
                    <div class="file-upload-text"><strong>Haz clic para subir</strong> una foto o documento</div>
                    <div class="file-upload-hint">PNG, JPG o PDF hasta {{ LIMITE_ARCHIVO_MB }} MB</div>
                  </div>
                  <input ref="archivoInput" type="file" accept=".jpg,.jpeg,.png,.pdf" style="display:none;" @change="onArchivoSeleccionado" />
                  <div v-if="archivoNombre" class="file-upload-selected">
                    <i class="ri-attachment-2"></i> {{ archivoNombre }}
                    <i class="ri-close-line" @click.stop="quitarArchivo" title="Quitar"></i>
                  </div>
                </div>

                <p class="alert alert-info">
                  <i class="ri-information-line"></i>
                  Al radicar tu solicitud recibirás un número de radicado y podrás consultar el estado en la pestaña "Mis Solicitudes".
                </p>

                <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="enviando">
                  <i class="ri-send-plane-fill"></i> {{ enviando ? 'Radicando...' : 'Radicar PQRS' }}
                </button>
              </form>
            </div>

            <!-- MIS SOLICITUDES -->
            <div v-else>
              <div v-if="!misPqrs.length" class="cotiz-empty">
                <i class="ri-file-list-3-line"></i>
                <h2 class="section-title">Aún no tienes solicitudes</h2>
                <p class="section-subtitle mb-24">Radica tu primera PQRS y le haremos seguimiento hasta resolverla.</p>
                <button class="btn btn-primary" @click="tabActiva = 'nueva'"><i class="ri-add-line"></i> Radicar PQRS</button>
              </div>

              <div v-else>
                <div v-for="p in misPqrs" :key="p.id_pqrs" class="cotiz-card">
                  <div class="cotiz-card-header">
                    <div>
                      <div class="cotiz-card-numero">{{ p.numero_pqrs }}</div>
                      <div class="cotiz-card-fecha">{{ fechaLarga(p.fecha_creacion) }}</div>
                    </div>
                    <div class="d-flex gap-10" style="flex-wrap:wrap;">
                      <span class="badge" :class="pqrsStore.TIPOS[p.tipo].badge">
                        <i :class="pqrsStore.TIPOS[p.tipo].icon"></i> {{ pqrsStore.TIPOS[p.tipo].label }}
                      </span>
                      <span class="badge" :class="pqrsStore.ESTADOS[p.estado].badge">
                        <i :class="pqrsStore.ESTADOS[p.estado].icon"></i> {{ pqrsStore.ESTADOS[p.estado].label }}
                      </span>
                    </div>
                  </div>

                  <h3 style="font-family:var(--font-main);font-weight:700;font-size:0.95rem;color:var(--secondary);margin-bottom:6px;">{{ p.asunto }}</h3>
                  <p v-if="p.ciudad && p.departamento" class="text-muted" style="font-size:0.8rem;margin-bottom:6px;">
                    <i class="ri-map-pin-line"></i> {{ p.ciudad }}, {{ p.departamento }}
                  </p>
                  <p class="cotiz-card-obs" style="margin-bottom:0;">{{ p.descripcion }}</p>
                  <div v-if="p.evidencia_nombre" class="pqrs-evidencia-tag"><i class="ri-attachment-2"></i> {{ p.evidencia_nombre }}</div>

                  <div v-if="p.respuesta" class="pqrs-response-box">
                    <div class="pqrs-response-label"><i class="ri-reply-line"></i> Respuesta del equipo</div>
                    <p class="pqrs-response-text">{{ p.respuesta }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="sidebar">
            <div class="sidebar-card" style="margin-bottom:20px;">
              <div class="sidebar-section">
                <div class="sidebar-title"><i class="ri-roadmap-line"></i> ¿Cómo funciona?</div>
                <div class="pqrs-timeline">
                  <div class="pqrs-timeline-step" v-for="(p, i) in pasos" :key="p.titulo">
                    <div class="pqrs-timeline-line">
                      <div class="pqrs-timeline-dot" :class="{ done: i === 0 }">
                        <i v-if="i === 0" class="ri-check-line"></i><template v-else>{{ i + 1 }}</template>
                      </div>
                      <div v-if="i < pasos.length - 1" class="pqrs-timeline-connector" :class="{ done: i === 0 }"></div>
                    </div>
                    <div class="pqrs-timeline-content">
                      <div class="pqrs-timeline-title">{{ p.titulo }}</div>
                      <div class="pqrs-timeline-desc">{{ p.desc }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="sidebar-card">
              <div class="sidebar-section">
                <div class="sidebar-title"><i class="ri-phone-line"></i> Contacto directo</div>
                <div class="info-item">
                  <div class="info-item-icon"><i class="ri-whatsapp-line"></i></div>
                  <div>
                    <div class="info-item-label">WhatsApp</div>
                    <div class="info-item-value">{{ catalog.configuracion.telefono }}</div>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-item-icon"><i class="ri-mail-line"></i></div>
                  <div>
                    <div class="info-item-label">Email</div>
                    <div class="info-item-value">{{ catalog.configuracion.email }}</div>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-item-icon"><i class="ri-time-line"></i></div>
                  <div>
                    <div class="info-item-label">Horario de atención</div>
                    <div class="info-item-value">{{ catalog.configuracion.horario }}</div>
                  </div>
                </div>
                <a :href="`https://wa.me/${catalog.configuracion.whatsapp}?text=Hola!%20Quiero%20radicar%20una%20PQRS`" target="_blank" rel="noopener" class="btn btn-primary btn-block mt-20">
                  <i class="ri-whatsapp-line"></i> Escribir por WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </template>
    </div>
  </section>

  <CotizarLoginModal
    :mostrar="mostrarModalLogin"
    icono="ri-customer-service-line"
    titulo="Inicia sesión para radicar tu PQRS"
    texto="Necesitas una cuenta para que tu solicitud quede asociada a tu perfil y podamos darle seguimiento."
    @cerrar="mostrarModalLogin = false"
    @iniciar-sesion="irALogin"
  />
</template>
