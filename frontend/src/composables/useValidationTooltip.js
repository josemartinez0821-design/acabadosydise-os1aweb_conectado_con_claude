import { ref } from 'vue'

// Reemplaza el globo nativo del navegador ("Completa este campo") por uno propio con la tipografía
// y colores del sitio. Mismo patrón de estado compartido (módulo, no por componente) que
// useCenterMessage.js/useToast.js. Se activa una sola vez desde App.vue escuchando el evento
// `invalid` en captura sobre document (ver ahí el porqué) - cubre cualquier <input required>/
// type=email/min/etc. de todo el sitio sin tocar formulario por formulario.
const tooltip = ref(null) // { texto, top, left }
let temporizador = null

export function useValidationTooltip() {
  function mostrarTooltip(target, texto) {
    if (temporizador) clearTimeout(temporizador)
    const r = target.getBoundingClientRect()
    const ALTO_ESTIMADO = 44
    const seVaArriba = r.bottom + 8 + ALTO_ESTIMADO > window.innerHeight
    tooltip.value = {
      texto,
      top: seVaArriba ? r.top - ALTO_ESTIMADO - 8 : r.bottom + 8,
      left: Math.min(Math.max(8, r.left), window.innerWidth - 296),
    }
    temporizador = setTimeout(() => { tooltip.value = null }, 4500)
  }
  function ocultarTooltip() {
    if (temporizador) clearTimeout(temporizador)
    tooltip.value = null
  }
  return { tooltip, mostrarTooltip, ocultarTooltip }
}
