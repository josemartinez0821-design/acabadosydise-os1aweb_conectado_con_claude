import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToast } from './useToast'

const MINUTOS_AVISO = 28
const MINUTOS_CIERRE = 30
const MS_AVISO = MINUTOS_AVISO * 60 * 1000
const MS_CIERRE = MINUTOS_CIERRE * 60 * 1000
const EVENTOS_ACTIVIDAD = ['mousemove', 'mousedown', 'keydown', 'wheel', 'scroll', 'touchstart']

const mostrarAviso = ref(false)
const segundosRestantes = ref(0)

let timerAviso = null
let timerCierre = null
let intervaloCuenta = null
let listenersListos = false
let ultimoRegistro = 0

export function useInactivityLogout() {
  const auth = useAuthStore()
  const router = useRouter()
  const { showToast } = useToast()

  function limpiarTimers() {
    clearTimeout(timerAviso)
    clearTimeout(timerCierre)
    clearInterval(intervaloCuenta)
  }

  function cerrarSesionPorInactividad() {
    limpiarTimers()
    mostrarAviso.value = false
    auth.logout()
    showToast('Tu sesión se cerró por inactividad.', 'info')
    if (router.currentRoute.value.meta.requiresAuth) router.push('/')
  }

  function activarAviso() {
    mostrarAviso.value = true
    segundosRestantes.value = Math.round((MS_CIERRE - MS_AVISO) / 1000)
    intervaloCuenta = setInterval(() => {
      segundosRestantes.value = Math.max(0, segundosRestantes.value - 1)
    }, 1000)
    timerCierre = setTimeout(cerrarSesionPorInactividad, MS_CIERRE - MS_AVISO)
  }

  function reiniciarTimers() {
    limpiarTimers()
    mostrarAviso.value = false
    if (!auth.isAuthenticated) return
    timerAviso = setTimeout(activarAviso, MS_AVISO)
  }

  function registrarActividad() {
    const ahora = Date.now()
    if (ahora - ultimoRegistro < 1000) return
    ultimoRegistro = ahora
    reiniciarTimers()
  }

  function seguirConectado() {
    showToast('Sesión extendida.', 'success')
    reiniciarTimers()
  }

  function iniciar() {
    if (listenersListos) return
    listenersListos = true
    EVENTOS_ACTIVIDAD.forEach((evt) => window.addEventListener(evt, registrarActividad, { passive: true, capture: true }))
    watch(
      () => auth.isAuthenticated,
      (activo) => {
        if (activo) reiniciarTimers()
        else {
          limpiarTimers()
          mostrarAviso.value = false
        }
      },
      { immediate: true }
    )
  }

  return { mostrarAviso, segundosRestantes, iniciar, seguirConectado, cerrarSesionPorInactividad }
}
