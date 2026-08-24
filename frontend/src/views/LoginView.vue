<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCenterMessage } from '../composables/useCenterMessage'
import { useToast } from '../composables/useToast'
import api from '../services/api'

const email = ref('')
const password = ref('')
const mostrarPassword = ref(false)
const recordarme = ref(false)
const error = ref('')
const errorCodigo = ref('')
const cargando = ref(false)

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { mostrarMensajeCentral } = useCenterMessage()
const { showToast } = useToast()

// El backend manda un `codigo` aparte del mensaje para este caso puntual (cuenta sin verificar) -
// así este check no depende de comparar el texto exacto de `mensaje`, que podría cambiar de
// redacción sin que nadie se acuerde de actualizar los dos lados (ver AuthController.login()).
const cuentaNoVerificada = computed(() => errorCodigo.value === 'CUENTA_NO_VERIFICADA')

async function reenviarCodigo() {
  try {
    await api.post('/auth/reenviar-codigo', { email: email.value })
    showToast('Te enviamos un nuevo código a tu correo.', 'info')
    router.push({ path: '/registro', query: { verificar: email.value } })
  } catch (e) {
    showToast(e.response?.data?.mensaje || 'No se pudo reenviar el código.', 'danger')
  }
}

async function iniciarSesion() {
  error.value = ''
  errorCodigo.value = ''
  cargando.value = true

  let usuario
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    auth.setSession(data.token, data.usuario)
    usuario = data.usuario
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'No se pudo iniciar sesión. Intenta de nuevo.'
    errorCodigo.value = e.response?.data?.codigo || ''
    cargando.value = false
    return
  }

  cargando.value = false
  if (usuario.id_rol === 1) {
    mostrarMensajeCentral(`Bienvenido de nuevo, ${usuario.nombre}.`, {
      icono: 'ri-shield-star-line',
      tipo: 'admin',
      duracion: 2800,
      badge: 'Acceso de Administrador',
    })
  } else {
    mostrarMensajeCentral(`¡Bienvenido de nuevo, ${usuario.nombre}! Qué gusto tenerte de vuelta.`, {
      icono: 'ri-emotion-happy-line',
      tipo: 'bienvenida',
      duracion: 2600,
    })
  }
  router.push(route.query.redirect || '/')
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-visual">
      <div class="auth-visual-bg">
        <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80" alt="Acabados y Diseños 1A" />
        <div class="auth-visual-overlay"></div>
      </div>

      <div class="auth-visual-content">
        <div class="auth-visual-eyebrow">
          <i class="ri-shield-check-line"></i>
          <span>Plataforma segura y confiable</span>
        </div>
        <h2 class="auth-visual-title">Bienvenido de nuevo</h2>
        <p class="auth-visual-desc">
          Accede a tu cuenta para gestionar tus pedidos, cotizaciones y compras de pinturas y materiales de acabado desde un solo lugar.
        </p>
        <div class="auth-visual-badges">
          <span class="auth-visual-badge"><i class="ri-shield-check-line"></i> Compra Segura</span>
          <span class="auth-visual-badge"><i class="ri-truck-line"></i> Seguimiento de Pedidos</span>
          <span class="auth-visual-badge"><i class="ri-whatsapp-line"></i> WhatsApp y Email</span>
        </div>
      </div>
    </div>

    <div class="auth-form-panel">
      <div class="auth-form-inner">
      <div class="auth-form-logo">
        <span class="brand-icon"><i class="ri-paint-brush-line"></i></span>
        ACABADOS <span class="text-primary">1A</span>
      </div>

      <div class="auth-form-top">
        <h1>Iniciar Sesión</h1>
        <p>Ingresa tus credenciales para continuar</p>
      </div>

      <form @submit.prevent="iniciarSesion">
        <div class="form-group">
          <label class="form-label required">Correo electrónico</label>
          <div class="input-group">
            <i class="ri-mail-line input-icon"></i>
            <input v-model="email" type="email" class="form-control" placeholder="correo@ejemplo.com" required autocomplete="email" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label required">Contraseña</label>
          <div class="input-group password-wrapper">
            <i class="ri-lock-2-line input-icon"></i>
            <input
              v-model="password"
              :type="mostrarPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Tu contraseña"
              required
              autocomplete="current-password"
            />
            <i
              class="toggle-pass"
              :class="mostrarPassword ? 'ri-eye-line' : 'ri-eye-off-line'"
              @click="mostrarPassword = !mostrarPassword"
            ></i>
          </div>
        </div>

        <div class="form-row-extra">
          <label class="checkbox-label"><input v-model="recordarme" type="checkbox" /> Recordarme</label>
          <RouterLink to="/recuperar-password" class="forgot-link">¿Olvidaste tu contraseña?</RouterLink>
        </div>

        <p v-if="error" class="alert alert-danger">
          <i class="ri-error-warning-fill"></i> {{ error }}
          <button v-if="cuentaNoVerificada" type="button" class="code-resend-btn" style="margin-left:6px;" @click="reenviarCodigo">Reenviar código</button>
        </p>

        <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="cargando">
          <i class="ri-login-box-line"></i> {{ cargando ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="auth-divider"><span>o</span></div>
      <p class="auth-prompt">¿No tienes cuenta? <RouterLink to="/registro">Crear cuenta gratis</RouterLink></p>
      </div>
    </div>
  </div>
</template>
