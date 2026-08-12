<script setup>
// RF02/RF03 - recuperación de contraseña: correo -> código de verificación -> nueva contraseña
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { MockData } from '../data/mockData'

const router = useRouter()
const auth = useAuthStore()
const { showToast } = useToast()

const paso = ref(1) // 1 correo, 2 código, 3 nueva contraseña, 4 éxito
const cargando = ref(false)
const error = ref('')

const email = ref('')

const codigoDigitos = ref(['', '', '', '', '', ''])
const codigoInputs = ref([])
let codigoGenerado = ''

const reenviarSegundos = ref(60)
let reenviarTimer = null

const nuevaPassword = ref('')
const confirmarNuevaPassword = ref('')
const mostrarNuevaPassword = ref(false)
const mostrarConfirmarPassword = ref(false)

const emailOculto = computed(() => {
  const [usuario, dominio] = email.value.split('@')
  if (!usuario || !dominio) return email.value
  return `${usuario[0]}***@${dominio}`
})

const requisitos = computed(() => ({
  longitud: nuevaPassword.value.length >= 8,
  mayuscula: /[A-Z]/.test(nuevaPassword.value),
  numero: /[0-9]/.test(nuevaPassword.value),
}))
const passwordValida = computed(() => requisitos.value.longitud && requisitos.value.mayuscula && requisitos.value.numero)

const VISUAL_POR_PASO = {
  1: { eyebrow: 'Recupera tu cuenta', titulo: 'Vuelve a tener el control de tu cuenta', desc: 'Te ayudaremos a recuperar tu acceso de forma rápida y segura. Solo necesitas ingresar el correo electrónico asociado a tu cuenta.' },
  2: { eyebrow: 'Verificación segura', titulo: 'Estamos confirmando que eres tú', desc: 'Ingresa el código de 6 dígitos que enviamos a tu correo para proteger el acceso a tu cuenta.' },
  3: { eyebrow: 'Último paso', titulo: 'Elige una contraseña segura', desc: 'Una buena contraseña combina mayúsculas, números y al menos 8 caracteres, para mantener tu cuenta protegida.' },
  4: { eyebrow: '¡Todo listo!', titulo: 'Tu cuenta está protegida de nuevo', desc: 'Ya puedes iniciar sesión con tu nueva contraseña y seguir gestionando tus pedidos y cotizaciones.' },
}
const visual = computed(() => VISUAL_POR_PASO[paso.value])

const PASO_INFO = {
  1: { icon: 'ri-lock-password-line', titulo: '¿Olvidaste tu contraseña?', subtitulo: 'Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un código de verificación para recuperar tu acceso.' },
  2: { icon: 'ri-mail-check-line', titulo: 'Revisa tu correo', subtitulo: `Hemos enviado un código de verificación de 6 dígitos a ${email.value ? emailOculto.value : 'tu correo electrónico'}.` },
  3: { icon: 'ri-key-2-line', titulo: 'Crea una nueva contraseña', subtitulo: 'Elige una contraseña segura para proteger tu cuenta.' },
  4: { icon: 'ri-shield-check-fill', titulo: '¡Contraseña actualizada!', subtitulo: 'Tu contraseña fue cambiada exitosamente.' },
}
const pasoInfo = computed(() => PASO_INFO[paso.value])

// TODO: cuando exista el backend Spring, reemplazar la generación/verificación del código
// por endpoints reales (`/auth/recuperar-password`, `/auth/verificar-codigo`, `/auth/nueva-password`)
// que envíen el código por correo de verdad — el resto del flujo no cambia.
async function enviarCodigo() {
  error.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Ingresa un correo electrónico válido.'
    return
  }
  const usuario = MockData.usuarios.find((u) => u.email.toLowerCase() === email.value.toLowerCase())
  if (!usuario) {
    error.value = 'Este correo no está registrado. ¿Quieres crear una cuenta nueva?'
    return
  }

  cargando.value = true
  await new Promise((r) => setTimeout(r, 600))
  cargando.value = false

  codigoGenerado = String(Math.floor(100000 + Math.random() * 900000))
  showToast(`Código de prueba: ${codigoGenerado} (en producción llegaría a tu correo)`, 'info', 10000)

  paso.value = 2
  iniciarConteoReenvio()
  nextTick(() => codigoInputs.value[0]?.focus())
}

function iniciarConteoReenvio() {
  reenviarSegundos.value = 60
  clearInterval(reenviarTimer)
  reenviarTimer = setInterval(() => {
    reenviarSegundos.value -= 1
    if (reenviarSegundos.value <= 0) clearInterval(reenviarTimer)
  }, 1000)
}

function reenviarCodigo() {
  codigoGenerado = String(Math.floor(100000 + Math.random() * 900000))
  codigoDigitos.value = ['', '', '', '', '', '']
  showToast(`Nuevo código de prueba: ${codigoGenerado}`, 'info', 10000)
  iniciarConteoReenvio()
  nextTick(() => codigoInputs.value[0]?.focus())
}

function cambiarCorreo() {
  clearInterval(reenviarTimer)
  codigoDigitos.value = ['', '', '', '', '', '']
  paso.value = 1
}

function onCodigoInput(idx, evento) {
  const valor = evento.target.value.replace(/\D/g, '').slice(-1)
  codigoDigitos.value[idx] = valor
  if (valor && idx < 5) codigoInputs.value[idx + 1]?.focus()
}
function onCodigoKeydown(idx, evento) {
  if (evento.key === 'Backspace' && !codigoDigitos.value[idx] && idx > 0) {
    codigoInputs.value[idx - 1]?.focus()
  }
}
function onCodigoPaste(evento) {
  const pegado = (evento.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  evento.preventDefault()
  pegado.split('').forEach((c, i) => (codigoDigitos.value[i] = c))
  nextTick(() => codigoInputs.value[Math.min(pegado.length, 5)]?.focus())
}

async function verificarCodigo() {
  const codigo = codigoDigitos.value.join('')
  if (codigo.length < 6) {
    showToast('Ingresa los 6 dígitos del código.', 'danger')
    return
  }

  cargando.value = true
  await new Promise((r) => setTimeout(r, 500))
  cargando.value = false

  if (codigo === codigoGenerado) {
    paso.value = 3
  } else {
    showToast('El código ingresado no es válido. Intenta de nuevo.', 'danger')
    codigoDigitos.value = ['', '', '', '', '', '']
    nextTick(() => codigoInputs.value[0]?.focus())
  }
}

async function actualizarPassword() {
  error.value = ''
  if (!passwordValida.value) {
    error.value = 'Tu contraseña no cumple los requisitos mínimos.'
    return
  }
  if (nuevaPassword.value !== confirmarNuevaPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  cargando.value = true
  await new Promise((r) => setTimeout(r, 600))

  const usuario = MockData.usuarios.find((u) => u.email.toLowerCase() === email.value.toLowerCase())
  if (usuario) {
    usuario.password = nuevaPassword.value
    if (auth.usuario?.id_usuario === usuario.id_usuario) {
      auth.setSession(auth.token, { ...usuario })
    }
  }

  cargando.value = false
  paso.value = 4
}

function irALogin() {
  router.push('/login')
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-visual">
      <div class="auth-visual-bg">
        <img src="https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80" alt="Acabados y Diseños 1A" />
        <div class="auth-visual-overlay"></div>
      </div>

      <div class="auth-visual-content">
        <div class="auth-visual-eyebrow">
          <i class="ri-shield-check-line"></i>
          <span>{{ visual.eyebrow }}</span>
        </div>
        <h2 class="auth-visual-title">{{ visual.titulo }}</h2>
        <p class="auth-visual-desc">{{ visual.desc }}</p>
      </div>
    </div>

    <div class="auth-form-panel">
      <div class="auth-form-inner">
        <div class="auth-form-logo">
          <span class="brand-icon"><i class="ri-paint-brush-line"></i></span>
          ACABADOS <span class="text-primary">1A</span>
        </div>

        <div class="auth-form-top">
          <div class="step-icon-badge"><i :class="pasoInfo.icon"></i></div>
          <h1>{{ pasoInfo.titulo }}</h1>
          <p>{{ pasoInfo.subtitulo }}</p>
        </div>

        <!-- PASO 1: correo -->
        <template v-if="paso === 1">
          <form @submit.prevent="enviarCodigo">
            <div class="form-group">
              <label class="form-label required">Correo electrónico</label>
              <div class="input-group">
                <i class="ri-mail-line input-icon"></i>
                <input v-model="email" type="email" class="form-control" placeholder="correo@ejemplo.com" required autocomplete="email" />
              </div>
            </div>

            <div class="auth-info-box">
              <i class="ri-shield-check-line"></i>
              <span>Tu información está protegida y el código será enviado de forma segura a tu correo electrónico.</span>
            </div>

            <p v-if="error" class="alert alert-danger"><i class="ri-error-warning-fill"></i> {{ error }}</p>

            <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="cargando">
              {{ cargando ? 'Enviando...' : 'Enviar código de verificación' }} <i class="ri-arrow-right-line"></i>
            </button>
          </form>
          <p class="auth-prompt" style="margin-top:24px;">¿Recordaste tu contraseña? <RouterLink to="/login">Volver a iniciar sesión</RouterLink></p>
        </template>

        <!-- PASO 2: código -->
        <template v-else-if="paso === 2">
          <p class="code-email-display">{{ emailOculto }}</p>

          <div class="code-inputs">
            <input
              v-for="(_, idx) in 6"
              :key="idx"
              :ref="(el) => (codigoInputs[idx] = el)"
              v-model="codigoDigitos[idx]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="code-input"
              :class="{ filled: codigoDigitos[idx] }"
              @input="onCodigoInput(idx, $event)"
              @keydown="onCodigoKeydown(idx, $event)"
              @paste="idx === 0 && onCodigoPaste($event)"
            />
          </div>

          <p class="code-resend-info">
            ¿No recibiste el código?
            <button v-if="reenviarSegundos > 0" class="code-resend-btn" disabled>Reenviar en {{ reenviarSegundos }}s</button>
            <button v-else class="code-resend-btn" @click="reenviarCodigo">Reenviar código</button>
          </p>

          <button type="button" class="btn btn-primary btn-lg btn-block" :disabled="cargando" @click="verificarCodigo">
            {{ cargando ? 'Verificando...' : 'Continuar' }} <i class="ri-arrow-right-line"></i>
          </button>
          <button type="button" class="back-link" style="display:flex;width:fit-content;margin:20px auto 0;" @click="cambiarCorreo">
            <i class="ri-arrow-left-line"></i> Volver a cambiar el correo
          </button>
        </template>

        <!-- PASO 3: nueva contraseña -->
        <template v-else-if="paso === 3">
          <form @submit.prevent="actualizarPassword">
            <div class="form-group">
              <label class="form-label required">Nueva contraseña</label>
              <div class="input-group password-wrapper">
                <i class="ri-lock-2-line input-icon"></i>
                <input
                  v-model="nuevaPassword"
                  :type="mostrarNuevaPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Mínimo 8 caracteres"
                  required
                  autocomplete="new-password"
                />
                <i class="toggle-pass" :class="mostrarNuevaPassword ? 'ri-eye-line' : 'ri-eye-off-line'" @click="mostrarNuevaPassword = !mostrarNuevaPassword"></i>
              </div>
              <div class="pass-requirements">
                <div class="pass-req-title">Requisitos de contraseña</div>
                <div class="pass-req-item" :class="{ ok: requisitos.longitud }"><i :class="requisitos.longitud ? 'ri-check-line' : 'ri-close-line'"></i> Mínimo 8 caracteres</div>
                <div class="pass-req-item" :class="{ ok: requisitos.mayuscula }"><i :class="requisitos.mayuscula ? 'ri-check-line' : 'ri-close-line'"></i> Al menos una mayúscula</div>
                <div class="pass-req-item" :class="{ ok: requisitos.numero }"><i :class="requisitos.numero ? 'ri-check-line' : 'ri-close-line'"></i> Al menos un número</div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">Confirmar nueva contraseña</label>
              <div class="input-group password-wrapper">
                <i class="ri-lock-2-line input-icon"></i>
                <input
                  v-model="confirmarNuevaPassword"
                  :type="mostrarConfirmarPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Repite tu contraseña"
                  required
                  autocomplete="new-password"
                />
                <i class="toggle-pass" :class="mostrarConfirmarPassword ? 'ri-eye-line' : 'ri-eye-off-line'" @click="mostrarConfirmarPassword = !mostrarConfirmarPassword"></i>
              </div>
            </div>

            <p v-if="error" class="alert alert-danger"><i class="ri-error-warning-fill"></i> {{ error }}</p>

            <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="cargando">
              {{ cargando ? 'Actualizando...' : 'Cambiar contraseña' }} <i class="ri-lock-line"></i>
            </button>
          </form>
        </template>

        <!-- PASO 4: éxito -->
        <template v-else>
          <div class="recover-success">
            <div class="recover-success-check"><i class="ri-check-line"></i></div>
            <button type="button" class="btn btn-primary btn-lg btn-block" @click="irALogin">
              <i class="ri-login-box-line"></i> Ir a iniciar sesión
            </button>
            <RouterLink to="/" class="back-link" style="display:flex;width:fit-content;margin:16px auto 0;">
              <i class="ri-home-line"></i> Volver al inicio
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
