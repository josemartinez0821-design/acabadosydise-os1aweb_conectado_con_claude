<script setup>
// RF01 - registro de usuarios (nombre, correo, contraseña, teléfono, dirección) -> tabla `usuarios`
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import { MockData } from '../data/mockData'
import { DEPARTAMENTOS, MUNICIPIOS_POR_DEPARTAMENTO } from '../data/colombia'

const form = ref({
  nombreCompleto: '',
  tipoIdentificacion: 'CC',
  numeroIdentificacion: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  departamento: 'Huila',
  password: '',
  confirmarPassword: '',
  aceptaTerminos: false,
})

const mostrarPassword = ref(false)
const mostrarConfirmarPassword = ref(false)
const error = ref('')
const cargando = ref(false)

const municipiosDisponibles = computed(() => MUNICIPIOS_POR_DEPARTAMENTO[form.value.departamento] || [])

watch(() => form.value.departamento, () => {
  if (!municipiosDisponibles.value.includes(form.value.ciudad)) {
    form.value.ciudad = ''
  }
})

// Duplicados en tiempo real: apenas escriben un número de identificación, teléfono o correo que ya
// existe, se los marcamos ahí mismo junto al campo — no hay que esperar a enviar el formulario para
// enterarse.
const cedulaDuplicada = computed(() => {
  const num = form.value.numeroIdentificacion.trim()
  return num.length > 0 && MockData.usuarios.some((u) => u.numero_identificacion === num)
})
const telefonoDuplicado = computed(() => {
  const tel = form.value.telefono.trim()
  return tel.length > 0 && MockData.usuarios.some((u) => u.telefono === tel)
})
const emailDuplicado = computed(() => {
  const em = form.value.email.trim().toLowerCase()
  return em.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em) && MockData.usuarios.some((u) => u.email.toLowerCase() === em)
})

const requisitos = computed(() => ({
  longitud: form.value.password.length >= 8,
  mayuscula: /[A-Z]/.test(form.value.password),
  numero: /\d/.test(form.value.password),
}))
const passwordValida = computed(() => requisitos.value.longitud && requisitos.value.mayuscula && requisitos.value.numero)

const fuerzaPassword = computed(() => {
  const pass = form.value.password
  if (!pass) return null
  let score = 0
  if (pass.length >= 8) score++
  if (pass.length >= 12) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[a-z]/.test(pass)) score++
  if (/\d/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  if (score <= 2) return { nivel: 'debil', label: 'Débil' }
  if (score <= 4) return { nivel: 'media', label: 'Media' }
  return { nivel: 'fuerte', label: 'Fuerte' }
})

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

// TODO: cuando exista el backend Spring, reemplazar esta validación/creación contra MockData
// por `await api.post('/usuarios/registro', form.value)` — el resto del flujo no cambia.
async function registrar() {
  error.value = ''

  const nombreCompleto = form.value.nombreCompleto.trim()
  if (!nombreCompleto) {
    error.value = 'Ingresa tu nombre completo.'
    return
  }
  if (!form.value.numeroIdentificacion.trim()) {
    error.value = 'Ingresa tu número de identificación.'
    return
  }
  if (cedulaDuplicada.value) {
    error.value = 'Ya existe una cuenta registrada con ese número de identificación.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    error.value = 'Ingresa un correo electrónico válido.'
    return
  }
  if (emailDuplicado.value) {
    error.value = 'Este correo ya está registrado. Intenta iniciar sesión.'
    return
  }
  if (!form.value.telefono.trim()) {
    error.value = 'Ingresa tu teléfono.'
    return
  }
  if (telefonoDuplicado.value) {
    error.value = 'Ya existe una cuenta registrada con ese número de teléfono.'
    return
  }
  if (!form.value.ciudad.trim()) {
    error.value = 'Ingresa tu ciudad.'
    return
  }
  if (!form.value.departamento) {
    error.value = 'Selecciona tu departamento.'
    return
  }
  if (!passwordValida.value) {
    error.value = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.'
    return
  }
  if (form.value.password !== form.value.confirmarPassword) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  if (!form.value.aceptaTerminos) {
    error.value = 'Debes aceptar los términos y condiciones y la política de privacidad.'
    return
  }

  cargando.value = true
  await new Promise((r) => setTimeout(r, 500))

  const [nombre, ...resto] = nombreCompleto.split(' ')
  const apellido = resto.join(' ')
  const nuevoUsuario = {
    id_usuario: Math.max(...MockData.usuarios.map((u) => u.id_usuario)) + 1,
    tipo_identificacion: form.value.tipoIdentificacion,
    numero_identificacion: form.value.numeroIdentificacion.trim(),
    nombre,
    apellido,
    fecha_nacimiento: null,
    email: form.value.email,
    telefono: form.value.telefono,
    whatsapp: form.value.telefono,
    direccion: form.value.direccion,
    ciudad: form.value.ciudad,
    departamento: form.value.departamento,
    id_rol: 2,
    estado: 1,
    password: form.value.password,
  }
  MockData.usuarios.push(nuevoUsuario)

  auth.setSession(`mock-token-${nuevoUsuario.id_usuario}`, nuevoUsuario)
  cargando.value = false
  showToast(`¡Cuenta creada! Bienvenido, ${nombre}.`, 'success')
  router.push('/')
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
          <i class="ri-team-line"></i>
          <span>Únete a nuestra familia</span>
        </div>
        <h2 class="auth-visual-title">Crea tu cuenta</h2>
        <p class="auth-visual-desc">
          Regístrate y disfruta de una experiencia sencilla para gestionar tus pedidos, cotizaciones y compras de
          pinturas y materiales de acabado.
        </p>
        <div class="auth-visual-feats">
          <div class="auth-feat"><i class="ri-file-list-3-line"></i> Gestiona tus pedidos</div>
          <div class="auth-feat"><i class="ri-draft-line"></i> Solicita cotizaciones</div>
          <div class="auth-feat"><i class="ri-shield-check-line"></i> Compra de forma segura</div>
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
          <h1>Crear una cuenta</h1>
          <p>Completa tus datos para comenzar con nosotros</p>
        </div>

        <form @submit.prevent="registrar">
          <div class="form-group">
            <label class="form-label required">Nombre completo</label>
            <div class="input-group">
              <i class="ri-user-line input-icon"></i>
              <input v-model="form.nombreCompleto" type="text" class="form-control" placeholder="Ingresa tu nombre completo" required autocomplete="name" />
            </div>
          </div>

          <div class="auth-form-row">
            <div class="form-group">
              <label class="form-label required">Tipo de documento</label>
              <select v-model="form.tipoIdentificacion" class="form-control" required>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Número de documento</label>
              <div class="input-group">
                <i class="ri-id-card-line input-icon"></i>
                <input
                  v-model="form.numeroIdentificacion"
                  type="text"
                  inputmode="numeric"
                  class="form-control"
                  :class="{ 'input-duplicado': cedulaDuplicada }"
                  required
                />
              </div>
              <p v-if="cedulaDuplicada" class="form-error-msg"><i class="ri-error-warning-fill"></i> Ya hay una cuenta registrada con este número de documento.</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">Correo electrónico</label>
            <div class="input-group">
              <i class="ri-mail-line input-icon"></i>
              <input v-model="form.email" type="email" class="form-control" :class="{ 'input-duplicado': emailDuplicado }" placeholder="correo@ejemplo.com" required autocomplete="email" />
            </div>
            <p v-if="emailDuplicado" class="form-error-msg"><i class="ri-error-warning-fill"></i> Este correo ya está registrado. ¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink>.</p>
          </div>

          <div class="auth-form-row">
            <div class="form-group">
              <label class="form-label required">Teléfono</label>
              <div class="input-group">
                <i class="ri-phone-line input-icon"></i>
                <input v-model="form.telefono" type="tel" class="form-control" :class="{ 'input-duplicado': telefonoDuplicado }" placeholder="300 000 0000" required autocomplete="tel" />
              </div>
              <p v-if="telefonoDuplicado" class="form-error-msg"><i class="ri-error-warning-fill"></i> Ya hay una cuenta registrada con este teléfono.</p>
            </div>
            <div class="form-group">
              <label class="form-label">Dirección</label>
              <div class="input-group">
                <i class="ri-map-pin-line input-icon"></i>
                <input v-model="form.direccion" type="text" class="form-control" placeholder="Ingresa tu dirección" autocomplete="street-address" />
              </div>
            </div>
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
            <label class="form-label required">Contraseña</label>
            <div class="input-group password-wrapper">
              <i class="ri-lock-2-line input-icon"></i>
              <input
                v-model="form.password"
                :type="mostrarPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="••••••••"
                required
                autocomplete="new-password"
              />
              <i
                class="toggle-pass"
                :class="mostrarPassword ? 'ri-eye-line' : 'ri-eye-off-line'"
                @click="mostrarPassword = !mostrarPassword"
              ></i>
            </div>

            <div v-if="fuerzaPassword" class="pass-strength" :class="fuerzaPassword.nivel">
              <div class="pass-strength-bar"><span></span><span></span><span></span></div>
              <span class="pass-strength-label">{{ fuerzaPassword.label }}</span>
            </div>

            <div class="pass-requirements">
              <div class="pass-req-title">Requisitos de contraseña</div>
              <div class="pass-req-item" :class="{ ok: requisitos.longitud }"><i :class="requisitos.longitud ? 'ri-check-line' : 'ri-close-line'"></i> Mínimo 8 caracteres</div>
              <div class="pass-req-item" :class="{ ok: requisitos.mayuscula }"><i :class="requisitos.mayuscula ? 'ri-check-line' : 'ri-close-line'"></i> Al menos una mayúscula</div>
              <div class="pass-req-item" :class="{ ok: requisitos.numero }"><i :class="requisitos.numero ? 'ri-check-line' : 'ri-close-line'"></i> Al menos un número</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">Confirmar contraseña</label>
            <div class="input-group password-wrapper">
              <i class="ri-lock-2-line input-icon"></i>
              <input
                v-model="form.confirmarPassword"
                :type="mostrarConfirmarPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="••••••••"
                required
                autocomplete="new-password"
              />
              <i
                class="toggle-pass"
                :class="mostrarConfirmarPassword ? 'ri-eye-line' : 'ri-eye-off-line'"
                @click="mostrarConfirmarPassword = !mostrarConfirmarPassword"
              ></i>
            </div>
          </div>

          <div class="auth-checkbox-row">
            <input id="acepta-terminos" v-model="form.aceptaTerminos" type="checkbox" />
            <label class="auth-checkbox-label" for="acepta-terminos">
              Acepto los <RouterLink to="/terminos-y-condiciones?from=registro">términos y condiciones</RouterLink>
              y la <RouterLink to="/politica-privacidad?from=registro">política de privacidad</RouterLink>.
            </label>
          </div>

          <p v-if="error" class="alert alert-danger"><i class="ri-error-warning-fill"></i> {{ error }}</p>

          <button type="submit" class="btn btn-primary btn-lg btn-block" :disabled="cargando">
            {{ cargando ? 'Creando cuenta...' : 'Crear cuenta' }} <i class="ri-arrow-right-line"></i>
          </button>
        </form>

        <p class="auth-prompt" style="margin-top:24px;">¿Ya tienes una cuenta? <RouterLink to="/login">Iniciar sesión</RouterLink></p>
      </div>
    </div>
  </div>
</template>
