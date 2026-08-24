import { ref } from 'vue'

// Mensaje central de bienvenida/despedida (login/logout) — separado del toast de esquina porque
// este es un momento puntual que merece resaltar más: aparece en el centro de la pantalla, con
// colores de marca, y se cierra solo. Mismo patrón de estado compartido (módulo, no por componente)
// que useToast.js, para que sobreviva a la navegación que ocurre justo después de iniciar sesión.
const mensaje = ref(null) // { texto, icono, tipo, badge }
let temporizador = null

export function useCenterMessage() {
  function mostrarMensajeCentral(texto, { icono = 'ri-emotion-happy-line', tipo = 'bienvenida', duracion = 2600, badge = null } = {}) {
    if (temporizador) clearTimeout(temporizador)
    mensaje.value = { texto, icono, tipo, badge }
    temporizador = setTimeout(() => {
      mensaje.value = null
    }, duracion)
  }

  function ocultarMensajeCentral() {
    if (temporizador) clearTimeout(temporizador)
    mensaje.value = null
  }

  return { mensaje, mostrarMensajeCentral, ocultarMensajeCentral }
}
