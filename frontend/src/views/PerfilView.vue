<script setup>
// RF04 - gestión del perfil de usuario -> tabla `usuarios`
// RF13 - historial de compras del usuario -> tabla `ventas`
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCotizacionesStore } from '../stores/cotizaciones'
import { useVentasStore } from '../stores/ventas'
import { useToast } from '../composables/useToast'
import api from '../services/api'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../data/colombia'

// Conjunto cerrado y pequeño (2 roles reales, "Vendedor" se quitó de la BD el 25/08/2026 por no
// tener ningún requisito funcional real detrás - ver RF15-19/RF01-23) - no vale la pena pedirlo
// al backend, solo se necesita el nombre para mostrarlo junto al badge.
const NOMBRES_ROL = { 1: 'Administrador', 2: 'Cliente' }

const auth = useAuthStore()
const cotizStore = useCotizacionesStore()
const ventasStore = useVentasStore()
const { showToast } = useToast()

const tabActiva = ref('info')

// ── Cabecera ──────────────────────────────────────────────────
const iniciales = computed(() => {
  const u = auth.usuario
  return u ? ((u.nombre?.[0] || '') + (u.apellido?.[0] || '')).toUpperCase() : '??'
})

const primerNombre = computed(() => auth.usuario?.nombre?.split(' ')[0] || '')

const rolInfo = computed(() => {
  const nombre = NOMBRES_ROL[auth.usuario?.id_rol] || 'Cliente'
  const estilos = {
    Administrador: { badge: 'role-admin', icon: 'ri-shield-star-line' },
    Cliente: { badge: 'role-cliente', icon: 'ri-user-3-line' },
  }
  return { nombre, ...(estilos[nombre] || estilos.Cliente) }
})

// GET /api/ventas ya devuelve solo las del usuario logueado - no hace falta filtrar por id_usuario.
const cantidadPedidos = computed(() => ventasStore.ventas.length)
const misCotizaciones = computed(() => (auth.usuario ? cotizStore.getCotizacionesDeUsuario(auth.usuario.id_usuario) : []))

// Cotizaciones/ventas son información privada, no se precargan globalmente en App.vue - se piden
// aquí para que los contadores de esta pantalla no dependan de haber visitado esas páginas antes.
onMounted(() => {
  if (auth.usuario) {
    cotizStore.cargarCotizaciones()
    ventasStore.cargarVentas()
  }
})

// ── Datos personales ─────────────────────────────────────────
const editando = ref(false)
const form = ref({})

const municipiosDisponibles = computed(() => MUNICIPIOS_POR_DEPARTAMENTO[form.value.departamento] || [])

function abrirEdicion() {
  form.value = { ...auth.usuario }
  editando.value = true
}
function cancelarEdicion() {
  editando.value = false
}

// ── Foto de perfil ────────────────────────────────────────────
const avatarInput = ref(null)
const subiendoFoto = ref(false)
function elegirFoto() {
  avatarInput.value?.click()
}
async function onFotoSeleccionada(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  if (!file.type.startsWith('image/')) {
    showToast('Selecciona un archivo de imagen válido.', 'danger')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    showToast('La imagen no debe superar los 2MB.', 'warning')
    return
  }
  const lector = new FileReader()
  lector.onload = async () => {
    subiendoFoto.value = true
    try {
      const { data } = await api.put(`/usuarios/${auth.usuario.id_usuario}/avatar`, { avatar: lector.result })
      auth.setSession(auth.token, data)
      showToast('¡Foto de perfil actualizada!', 'success')
    } catch (err) {
      showToast(err.response?.data?.mensaje || 'No se pudo actualizar la foto.', 'danger')
    } finally {
      subiendoFoto.value = false
    }
  }
  lector.readAsDataURL(file)
}

const guardandoPersonal = ref(false)
async function guardarPersonal() {
  if (!form.value.nombre?.trim() || !form.value.apellido?.trim()) {
    showToast('El nombre y el apellido son obligatorios.', 'danger')
    return
  }
  form.value.telefono = form.value.whatsapp
  guardandoPersonal.value = true
  try {
    const { data } = await api.put(`/usuarios/${auth.usuario.id_usuario}`, {
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      tipo_identificacion: form.value.tipo_identificacion,
      numero_identificacion: form.value.numero_identificacion,
      telefono: form.value.telefono,
      whatsapp: form.value.whatsapp,
      direccion: form.value.direccion,
      ciudad: form.value.ciudad,
      departamento: form.value.departamento,
    })
    auth.setSession(auth.token, data)
    editando.value = false
    showToast('¡Perfil actualizado correctamente!', 'success')
  } catch (err) {
    showToast(err.response?.data?.mensaje || 'No se pudo actualizar el perfil.', 'danger')
  } finally {
    guardandoPersonal.value = false
  }
}

const camposBasicos = computed(() => {
  const u = auth.usuario || {}
  return [
    { label: 'Nombre completo', valor: `${u.nombre || ''} ${u.apellido || ''}`.trim(), icon: 'ri-user-3-line' },
    { label: 'Identificación', valor: u.numero_identificacion ? `${u.tipo_identificacion} ${u.numero_identificacion}` : null, icon: 'ri-id-card-line' },
  ]
})

const camposContacto = computed(() => {
  const u = auth.usuario || {}
  return [
    { label: 'Correo electrónico', valor: u.email, icon: 'ri-mail-line' },
    { label: 'Teléfono / WhatsApp', valor: u.whatsapp || u.telefono, icon: 'ri-whatsapp-line' },
    { label: 'Dirección', valor: u.direccion, icon: 'ri-map-pin-line' },
    { label: 'Ciudad / Departamento', valor: u.ciudad ? `${u.ciudad}, ${u.departamento}` : null, icon: 'ri-building-4-line' },
  ]
})

// ── Seguridad ─────────────────────────────────────────────────
const passActual = ref('')
const passNueva = ref('')
const passConfirmar = ref('')
const verPass = reactive({ actual: false, nueva: false, confirmar: false })

const fuerzaPassword = computed(() => {
  const pass = passNueva.value
  if (!pass) return null
  let score = 0
  if (pass.length >= 8) score++
  if (pass.length >= 12) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[a-z]/.test(pass)) score++
  if (/\d/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  if (score <= 2) return { nivel: 'debil', label: 'Débil', pct: '33%' }
  if (score <= 4) return { nivel: 'media', label: 'Media', pct: '66%' }
  return { nivel: 'fuerte', label: 'Muy segura', pct: '100%' }
})

const cambiandoPassword = ref(false)
async function cambiarPassword() {
  if (passNueva.value.length < 8) {
    showToast('La nueva contraseña debe tener mínimo 8 caracteres.', 'warning')
    return
  }
  if (passNueva.value !== passConfirmar.value) {
    showToast('Las contraseñas nuevas no coinciden.', 'danger')
    return
  }
  cambiandoPassword.value = true
  try {
    await api.put(`/usuarios/${auth.usuario.id_usuario}/password`, {
      password_actual: passActual.value,
      password_nueva: passNueva.value,
    })
    passActual.value = ''
    passNueva.value = ''
    passConfirmar.value = ''
    showToast('¡Contraseña actualizada con éxito!', 'success')
  } catch (err) {
    showToast(err.response?.data?.mensaje || 'No se pudo cambiar la contraseña.', 'danger')
  } finally {
    cambiandoPassword.value = false
  }
}

</script>

<template>
  <section class="page-hero perfil-hero">
    <div class="perfil-hero-pattern"></div>
    <div class="perfil-hero-shape shape-1"></div>
    <div class="perfil-hero-shape shape-2"></div>
    <div class="container">
      <div class="page-hero-inner">
        <div class="page-hero-eyebrow">
          <i class="ri-user-smile-line"></i>
          <span>Mi cuenta</span>
        </div>
        <h1 class="page-hero-title">Mi <span class="highlight">Perfil</span></h1>
        <p class="page-hero-subtitle">¡Hola{{ primerNombre ? `, ${primerNombre}` : '' }}! Este es tu espacio: revisa tus datos, cuida tu seguridad y consulta todo lo que has hecho con nosotros.</p>
        <div class="breadcrumb">
          <span class="breadcrumb-item"><RouterLink to="/"><i class="ri-home-4-line"></i> Inicio</RouterLink></span>
          <span class="breadcrumb-sep"><i class="ri-arrow-right-s-line"></i></span>
          <span class="breadcrumb-item active">Mi perfil</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section perfil-section">
    <div class="container">
      <!-- Cabecera de perfil -->
      <div class="perfil-card">
        <div class="perfil-avatar-wrap">
          <div class="perfil-avatar" :style="auth.usuario?.avatar ? { backgroundImage: `url(${auth.usuario.avatar})` } : {}" :class="{ 'is-loading': subiendoFoto }" @click="!subiendoFoto && elegirFoto()">
            <span v-if="!auth.usuario?.avatar && !subiendoFoto">{{ iniciales }}</span>
            <i v-if="subiendoFoto" class="ri-loader-4-line perfil-avatar-spinner"></i>
            <div v-else class="perfil-avatar-overlay"><i class="ri-camera-line"></i></div>
          </div>
          <input ref="avatarInput" type="file" accept="image/*" class="perfil-avatar-input" @change="onFotoSeleccionada" />
        </div>
        <div class="perfil-card-info">
          <h2 class="perfil-nombre">{{ auth.usuario?.nombre }} {{ auth.usuario?.apellido }}</h2>
          <p class="perfil-email">{{ auth.usuario?.email }}</p>
          <span class="role-badge" :class="rolInfo.badge"><i :class="rolInfo.icon"></i> {{ rolInfo.nombre }}</span>
        </div>
        <div v-if="!auth.isAdmin" class="perfil-stats">
          <RouterLink to="/pedidos" class="perfil-stat">
            <div class="perfil-stat-value">{{ cantidadPedidos }}</div>
            <div class="perfil-stat-label">Pedidos</div>
          </RouterLink>
          <RouterLink to="/cotizaciones" class="perfil-stat">
            <div class="perfil-stat-value">{{ misCotizaciones.length }}</div>
            <div class="perfil-stat-label">Cotizaciones</div>
          </RouterLink>
        </div>
      </div>

      <!-- Tabs -->
      <div class="perfil-tabs">
        <button class="perfil-tab" :class="{ active: tabActiva === 'info' }" @click="tabActiva = 'info'">
          <i class="ri-user-line"></i> Información
        </button>
        <button class="perfil-tab" :class="{ active: tabActiva === 'seguridad' }" @click="tabActiva = 'seguridad'">
          <i class="ri-shield-keyhole-line"></i> Seguridad
        </button>
      </div>

      <!-- TAB: INFORMACIÓN -->
      <div v-if="tabActiva === 'info'" class="section-card">
        <div class="section-card-header">
          <span class="section-card-title"><i class="ri-user-3-line"></i> Datos personales</span>
          <button v-if="!editando" class="btn btn-outline-red btn-sm" @click="abrirEdicion">
            <i class="ri-edit-line"></i> Editar
          </button>
        </div>
        <div class="section-card-body">
          <!-- Modo lectura -->
          <div v-if="!editando">
            <div class="info-section">
              <h4 class="info-section-title">Información básica</h4>
              <div class="info-rows">
                <div v-for="campo in camposBasicos" :key="campo.label" class="info-row">
                  <div class="info-row-icon"><i :class="campo.icon"></i></div>
                  <div class="info-row-body">
                    <span class="info-row-label">{{ campo.label }}</span>
                    <span class="info-row-value" :class="{ empty: !campo.valor }">{{ campo.valor || 'No registrado' }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-section">
              <h4 class="info-section-title">Contacto y ubicación</h4>
              <div class="info-rows">
                <div v-for="campo in camposContacto" :key="campo.label" class="info-row">
                  <div class="info-row-icon"><i :class="campo.icon"></i></div>
                  <div class="info-row-body">
                    <span class="info-row-label">{{ campo.label }}</span>
                    <span class="info-row-value" :class="{ empty: !campo.valor }">{{ campo.valor || 'No registrado' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modo edición -->
          <form v-else class="form-grid-2" @submit.prevent="guardarPersonal">
            <div class="form-group">
              <label class="form-label required">Nombre(s)</label>
              <input v-model="form.nombre" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Apellido(s)</label>
              <input v-model="form.apellido" type="text" class="form-control" required />
            </div>
            <div class="form-group">
              <label class="form-label">Tipo de identificación</label>
              <select v-model="form.tipo_identificacion" class="form-control">
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Número de identificación</label>
              <input v-model="form.numero_identificacion" type="text" class="form-control" />
            </div>
            <div class="form-group">
              <label class="form-label">Correo electrónico</label>
              <div class="input-group"><i class="ri-mail-line input-icon"></i><input :value="form.email" type="email" class="form-control" disabled /></div>
              <small class="form-hint">Tu correo es tu usuario de acceso y no se puede modificar.</small>
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono / WhatsApp</label>
              <div class="input-group"><i class="ri-whatsapp-line input-icon"></i><input v-model="form.whatsapp" type="tel" class="form-control" /></div>
            </div>
            <div class="form-group full">
              <label class="form-label">Dirección</label>
              <input v-model="form.direccion" type="text" class="form-control" placeholder="Calle, carrera, número" />
            </div>
            <div class="form-group">
              <label class="form-label">Departamento</label>
              <select v-model="form.departamento" class="form-control">
                <option v-for="d in DEPARTAMENTOS" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Ciudad</label>
              <select v-model="form.ciudad" class="form-control" :disabled="!form.departamento">
                <option value="" disabled>{{ form.departamento ? 'Seleccionar...' : 'Elige primero un departamento' }}</option>
                <option v-for="c in municipiosDisponibles" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div class="form-actions full">
              <button type="button" class="btn btn-outline-red btn-sm" :disabled="guardandoPersonal" @click="cancelarEdicion">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-sm" :disabled="guardandoPersonal">
                <i class="ri-save-line"></i> {{ guardandoPersonal ? 'Guardando...' : 'Guardar cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- TAB: SEGURIDAD -->
      <div v-if="tabActiva === 'seguridad'" class="section-card">
        <div class="section-card-header">
          <span class="section-card-title"><i class="ri-lock-password-line"></i> Cambiar contraseña</span>
        </div>
        <div class="section-card-body">
          <div class="forgot-pass-banner">
            <div class="forgot-pass-icon"><i class="ri-mail-send-line"></i></div>
            <div class="forgot-pass-text">
              <strong>¿Olvidaste tu contraseña actual?</strong>
              <span>Te enviamos un código a tu correo para crear una nueva en minutos, sin complicaciones.</span>
            </div>
            <RouterLink to="/recuperar-password" class="btn btn-primary btn-sm">
              <i class="ri-key-2-line"></i> Recuperar contraseña
            </RouterLink>
          </div>

          <div class="seguridad-layout">
            <form class="perfil-pass-form" @submit.prevent="cambiarPassword">
              <div class="form-group">
                <label class="form-label required">Contraseña actual</label>
                <div class="input-group password-wrapper">
                  <i class="ri-lock-2-line input-icon"></i>
                  <input v-model="passActual" :type="verPass.actual ? 'text' : 'password'" class="form-control" placeholder="Tu contraseña actual" required />
                  <i class="toggle-pass" :class="verPass.actual ? 'ri-eye-line' : 'ri-eye-off-line'" @click="verPass.actual = !verPass.actual"></i>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label required">Nueva contraseña</label>
                <div class="input-group password-wrapper">
                  <i class="ri-lock-2-line input-icon"></i>
                  <input v-model="passNueva" :type="verPass.nueva ? 'text' : 'password'" class="form-control" placeholder="Mínimo 8 caracteres" required />
                  <i class="toggle-pass" :class="verPass.nueva ? 'ri-eye-line' : 'ri-eye-off-line'" @click="verPass.nueva = !verPass.nueva"></i>
                </div>
                <div v-if="fuerzaPassword" class="pw-strength">
                  <div class="pw-strength-bar"><div class="pw-strength-fill" :class="fuerzaPassword.nivel" :style="{ width: fuerzaPassword.pct }"></div></div>
                  <span class="pw-strength-label" :class="fuerzaPassword.nivel">{{ fuerzaPassword.label }}</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label required">Confirmar nueva contraseña</label>
                <div class="input-group password-wrapper">
                  <i class="ri-lock-2-line input-icon"></i>
                  <input v-model="passConfirmar" :type="verPass.confirmar ? 'text' : 'password'" class="form-control" placeholder="Repite la nueva contraseña" required />
                  <i class="toggle-pass" :class="verPass.confirmar ? 'ri-eye-line' : 'ri-eye-off-line'" @click="verPass.confirmar = !verPass.confirmar"></i>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="cambiandoPassword">
                <i class="ri-save-line"></i> {{ cambiandoPassword ? 'Actualizando...' : 'Actualizar contraseña' }}
              </button>
            </form>

            <aside class="seguridad-tips">
              <div class="seguridad-tips-title"><i class="ri-shield-check-line"></i> Consejos de seguridad</div>
              <ul>
                <li><i class="ri-checkbox-circle-line"></i> Usa mínimo 8 caracteres combinando mayúsculas, números y símbolos.</li>
                <li><i class="ri-checkbox-circle-line"></i> No reutilices esta contraseña en otros sitios web.</li>
                <li><i class="ri-checkbox-circle-line"></i> Actualízala cada pocos meses para mayor seguridad.</li>
              </ul>
              <p class="alert alert-warning" style="margin:14px 0 0;">
                <i class="ri-error-warning-fill"></i> Nunca compartas tu contraseña con nadie, ni siquiera con nuestro equipo de soporte.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero — degradado elegante de marca + textura diagonal sutil, sin foto de stock */
.perfil-hero {
  padding: 76px 0 74px; overflow: hidden;
  background: linear-gradient(135deg, var(--secondary) 0%, #232342 55%, var(--primary-dark) 140%);
}
.perfil-hero-pattern {
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(45deg, rgba(192,57,43,0.08) 0, rgba(192,57,43,0.08) 1px, transparent 0, transparent 26px);
}
.perfil-hero-shape {
  position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle, rgba(192,57,43,0.3) 0%, rgba(192,57,43,0) 70%);
}
.perfil-hero-shape.shape-1 { width: 340px; height: 340px; top: -140px; right: 6%; }
.perfil-hero-shape.shape-2 { width: 220px; height: 220px; bottom: -110px; left: 8%; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%); }

/* La tarjeta de perfil "flota" sobre el hero para una sensación más moderna */
.perfil-section { padding-top: 0; margin-top: -30px; position: relative; z-index: 5; }

/* Cabecera de perfil */
.perfil-card {
  background: white; border: 1px solid var(--border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); padding: 28px 32px; margin-bottom: 24px;
  display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
}
.perfil-avatar-wrap { position: relative; flex-shrink: 0; }
.perfil-avatar-input { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.perfil-avatar {
  width: 84px; height: 84px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  background-size: cover; background-position: center;
  color: white; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-main); font-weight: 800; font-size: 1.7rem;
  box-shadow: var(--shadow-red); position: relative; cursor: pointer; overflow: hidden;
  border: 3px solid white; transition: var(--transition);
}
.perfil-avatar:hover { transform: scale(1.03); }
.perfil-avatar-overlay {
  position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,0.5);
  color: white; font-size: 1.25rem; display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: var(--transition);
}
.perfil-avatar:hover .perfil-avatar-overlay { opacity: 1; }
.perfil-avatar.is-loading { cursor: default; }
.perfil-avatar-spinner { font-size: 1.5rem; animation: spin 1s linear infinite; }
.perfil-card-info { flex: 1; min-width: 180px; }
.perfil-nombre { font-family: var(--font-main); font-weight: 800; font-size: 1.35rem; color: var(--secondary); margin-bottom: 4px; }
.perfil-email { font-size: 0.88rem; color: var(--text-muted); margin-bottom: 10px; }
.role-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px;
  border-radius: 20px; font-size: 0.72rem; font-family: var(--font-main); font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.4px;
}
.role-admin { background: rgba(192,57,43,0.1); color: var(--primary); }
.role-cliente { background: rgba(39,174,96,0.1); color: var(--success); }

.perfil-stats { display: flex; gap: 32px; flex-wrap: wrap; }
.perfil-stat { text-align: center; min-width: 90px; padding: 4px 8px; border-radius: var(--radius-sm); transition: var(--transition); }
.perfil-stat:hover { background: var(--off-white); transform: translateY(-2px); }
.perfil-stat-value { font-family: var(--font-main); font-weight: 800; font-size: 1.3rem; color: var(--secondary); }
.perfil-stat:hover .perfil-stat-value { color: var(--primary); }
.perfil-stat-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

/* Tabs — barra tipo "underline", ancho natural en vez de pastillas estiradas */
.perfil-tabs {
  display: flex; align-items: center; gap: 6px; border-bottom: 2px solid var(--border);
  margin-bottom: 24px; flex-wrap: wrap;
}
.perfil-tab {
  flex: none; padding: 13px 6px; margin-bottom: -2px; border-bottom: 3px solid transparent;
  font-family: var(--font-main); font-size: 0.86rem; font-weight: 700; color: var(--text-muted);
  background: none; display: flex; align-items: center; gap: 8px; white-space: nowrap;
  transition: var(--transition);
}
.perfil-tab + .perfil-tab { margin-left: 20px; }
.perfil-tab i { font-size: 1.05rem; }
.perfil-tab:hover { color: var(--secondary); }
.perfil-tab.active { color: var(--primary); border-bottom-color: var(--primary); }

/* Section card */
.section-card { background: white; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.section-card-header {
  padding: 18px 24px; border-bottom: 1px solid var(--border); background: var(--off-white);
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
}
.section-card-title { font-family: var(--font-main); font-weight: 700; font-size: 0.92rem; color: var(--secondary); display: flex; align-items: center; gap: 8px; }
.section-card-title i { color: var(--primary); }
.section-card-body { padding: 26px; }

/* Info (modo lectura) — filas con icono, tipo lista de ajustes */
.info-section { margin-bottom: 28px; }
.info-section:last-child { margin-bottom: 0; }
.info-section-title {
  font-family: var(--font-main); font-weight: 700; font-size: 0.72rem; color: var(--text-muted);
  text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px; padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.info-rows { display: flex; flex-direction: column; }
.info-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--border); }
.info-row:last-child { border-bottom: none; }
.info-row-icon {
  width: 38px; height: 38px; border-radius: var(--radius-sm); background: var(--off-white);
  color: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: 1.05rem; flex-shrink: 0;
}
.info-row-body { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.info-row-label { font-size: 0.7rem; font-family: var(--font-main); font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
.info-row-value { font-size: 0.92rem; color: var(--secondary); font-weight: 600; }
.info-row-value.empty { color: var(--text-muted); font-style: italic; font-weight: 400; }

/* Form edición */
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
.form-grid-2 .form-group.full { grid-column: 1 / -1; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 4px; }

/* Seguridad */
.seguridad-layout { display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start; }
.perfil-pass-form { max-width: 460px; }
.pw-strength { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.pw-strength-bar { flex: 1; height: 4px; background: var(--light); border-radius: 2px; overflow: hidden; }
.pw-strength-fill { height: 100%; border-radius: 2px; transition: var(--transition); }
.pw-strength-fill.debil { background: var(--primary); }
.pw-strength-fill.media { background: var(--accent); }
.pw-strength-fill.fuerte { background: var(--success); }
.pw-strength-label { font-size: 0.75rem; font-weight: 700; font-family: var(--font-main); white-space: nowrap; }
.pw-strength-label.debil { color: var(--primary); }
.pw-strength-label.media { color: var(--accent); }
.pw-strength-label.fuerte { color: var(--success); }

.seguridad-tips { background: var(--off-white); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
.seguridad-tips-title { display: flex; align-items: center; gap: 8px; font-family: var(--font-main); font-weight: 700; font-size: 0.85rem; color: var(--secondary); margin-bottom: 14px; }
.seguridad-tips-title i { color: var(--success); font-size: 1.1rem; }
.seguridad-tips ul { display: flex; flex-direction: column; gap: 12px; }
.seguridad-tips li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.8rem; color: var(--text-light); line-height: 1.5; }
.seguridad-tips li i { color: var(--success); font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

.forgot-pass-banner {
  display: flex; align-items: center; gap: 18px; flex-wrap: wrap;
  background: rgba(192,57,43,0.05); border: 1px solid rgba(192,57,43,0.18);
  border-radius: var(--radius); padding: 18px 22px; margin-bottom: 26px;
}
.forgot-pass-icon {
  width: 46px; height: 46px; border-radius: 50%; background: rgba(192,57,43,0.1);
  color: var(--primary); display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; flex-shrink: 0;
}
.forgot-pass-text { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 2px; }
.forgot-pass-text strong { font-family: var(--font-main); font-size: 0.95rem; color: var(--secondary); }
.forgot-pass-text span { font-size: 0.83rem; color: var(--text-light); }

@media (max-width: 900px) {
  .seguridad-layout { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .perfil-section { margin-top: -20px; }
  .perfil-card { padding: 22px; }
  .perfil-stats { gap: 20px; width: 100%; justify-content: space-between; }
  .perfil-tab + .perfil-tab { margin-left: 12px; }
  .form-grid-2 { grid-template-columns: 1fr; }
}
</style>
