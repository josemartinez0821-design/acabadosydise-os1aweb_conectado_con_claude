import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useToast } from '../composables/useToast'
import router from '../router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Si el backend se cuelga (ej: SMTP sin responder al enviar un código), sin esto la petición
  // espera para siempre y la pantalla queda "cargando" sin fin. Con el timeout, a los 20s se
  // cancela sola y el .catch(...) de cada vista muestra un mensaje de error normal.
  timeout: 20000,
})

// El token trae su propia fecha de vencimiento adentro (jwt.expiracion-horas=24,
// JwtService.java) - se puede leer sin llamar al backend. Se prefiere esto a esperar un 403 de
// respuesta porque el backend usa ese mismo 403 tanto para "sesión vencida" como para "no tienes
// permiso" (ej. cliente pegándole a un endpoint solo-admin) - no hay forma confiable de
// distinguir ambos casos solo mirando el código de estado. Detectarlo del lado del cliente evita
// esa ambigüedad por completo.
function tokenVencido(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const relleno = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(relleno))
    return !payload.exp || Date.now() >= payload.exp * 1000
  } catch {
    return true // token corrupto/ilegible - se trata igual que vencido, no se puede confiar en él
  }
}

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    if (tokenVencido(auth.token)) {
      // auth.logout() es síncrono y deja auth.token en null de inmediato, así que si ya hay otras
      // peticiones en camino (ej. las ~9 cargarX() en paralelo de App.vue onMounted), sus propias
      // pasadas por este interceptor ya no van a volver a entrar aquí - solo se avisa/redirige una vez.
      auth.logout()
      if (router.currentRoute.value.name !== 'login') {
        useToast().showToast('Tu sesión expiró. Inicia sesión de nuevo para continuar.', 'info')
        if (router.currentRoute.value.meta.requiresAuth) {
          router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } })
        }
      }
    } else {
      config.headers.Authorization = `Bearer ${auth.token}`
    }
  }
  return config
})

export default api
