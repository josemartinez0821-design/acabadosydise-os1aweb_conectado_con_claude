import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Compartido entre el listado y el detalle de servicios/productos: pedir cotización
// requiere sesión (igual que el checkout del carrito), con el mismo aviso amigable.
// `irACotizar` acepta opcionalmente el ítem que se quiere cotizar para que "Nueva cotización"
// lo precargue automáticamente en vez de abrir la pestaña vacía.
export function useCotizarGate() {
  const mostrarModalLogin = ref(false)
  const auth = useAuthStore()
  const router = useRouter()

  function irACotizar(item = null) {
    if (!auth.isAuthenticated) {
      mostrarModalLogin.value = true
      return
    }
    const query = {}
    if (item?.tipo === 'servicio') {
      query.nuevoServicio = item.id
      if (item.horas) query.horas = item.horas
      if (item.modo) query.modo = item.modo
    }
    if (item?.tipo === 'producto') {
      query.nuevoProducto = item.id
      if (item.mayorista) query.mayorista = '1'
    }
    router.push({ path: '/cotizaciones', query })
  }

  function irALogin() {
    mostrarModalLogin.value = false
    router.push({ path: '/login', query: { redirect: '/cotizaciones' } })
  }

  return { mostrarModalLogin, irACotizar, irALogin }
}
