import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // Si el backend se cuelga (ej: SMTP sin responder al enviar un código), sin esto la petición
  // espera para siempre y la pantalla queda "cargando" sin fin. Con el timeout, a los 20s se
  // cancela sola y el .catch(...) de cada vista muestra un mensaje de error normal.
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export default api
