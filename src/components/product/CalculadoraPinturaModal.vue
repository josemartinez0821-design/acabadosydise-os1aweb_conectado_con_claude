<script setup>
import { ref, computed, watch } from 'vue'
import { useCatalogStore } from '../../stores/catalog'
import { useCartStore } from '../../stores/cart'
import { useToast } from '../../composables/useToast'
import { formatCOP } from '../../composables/useFormat'

const props = defineProps({
  producto: { type: Object, required: true },
  mostrar: { type: Boolean, default: false },
})
const emit = defineEmits(['cerrar'])

const catalog = useCatalogStore()
const cart = useCartStore()
const { showToast } = useToast()

const modo = ref('conozco') // 'conozco' | 'noconozco'
const areaDirecta = ref(null)

const alturaPared = ref(2.4)
const largoPared = ref(4)
const tienePuertas = ref(false)
const cantidadPuertas = ref(1)
const altoPuerta = ref(2.1)
const anchoPuerta = ref(0.9)
const tieneVentanas = ref(false)
const cantidadVentanas = ref(1)
const altoVentana = ref(1.2)
const anchoVentana = ref(1)

const manos = ref(2)

watch(
  () => props.mostrar,
  (val) => {
    if (val) {
      modo.value = 'conozco'
      areaDirecta.value = null
    }
  }
)

const areaBruta = computed(() => Math.max(0, (Number(alturaPared.value) || 0) * (Number(largoPared.value) || 0)))
const areaPuertas = computed(() =>
  tienePuertas.value ? (Number(cantidadPuertas.value) || 0) * (Number(altoPuerta.value) || 0) * (Number(anchoPuerta.value) || 0) : 0
)
const areaVentanas = computed(() =>
  tieneVentanas.value ? (Number(cantidadVentanas.value) || 0) * (Number(altoVentana.value) || 0) * (Number(anchoVentana.value) || 0) : 0
)
const areaNetaCalculada = computed(() => Math.max(0, areaBruta.value - areaPuertas.value - areaVentanas.value))

const areaAPintar = computed(() => (modo.value === 'conozco' ? Number(areaDirecta.value) || 0 : areaNetaCalculada.value))

// Usa el rendimiento propio del producto (ej. "Rendimiento 12-14 m²/L") si está disponible;
// si no se puede leer, usa un valor de referencia conservador.
const rendimientoPorGalon = computed(() => {
  const texto = props.producto?.especificaciones_tecnicas || ''
  const match = texto.match(/Rendimiento\s+([\d.]+)\s*-?\s*([\d.]+)?\s*m²\/L/i)
  if (match) {
    const min = parseFloat(match[1])
    const max = match[2] ? parseFloat(match[2]) : min
    return ((min + max) / 2) * 3.785
  }
  return 40
})

const galonesNecesarios = computed(() => {
  if (!areaAPintar.value || !rendimientoPorGalon.value) return 0
  const total = (areaAPintar.value * manos.value) / rendimientoPorGalon.value
  return Math.ceil(total * 10) / 10
})

const variantes = computed(() => catalog.getVariantesTamano(props.producto))

function tamanoAGalones(tamano) {
  const texto = String(tamano)
  const fraccion = texto.match(/(\d+)\s*\/\s*(\d+)/)
  if (fraccion) return parseFloat(fraccion[1]) / parseFloat(fraccion[2])
  const numero = texto.match(/[\d.]+/)
  return numero ? parseFloat(numero[0]) : 1
}

const sugerenciaCompra = computed(() => {
  if (!galonesNecesarios.value || variantes.value.length < 2) return []
  let restante = galonesNecesarios.value
  const ordenadas = [...variantes.value].sort((a, b) => tamanoAGalones(b.tamano) - tamanoAGalones(a.tamano))
  const resultado = []
  for (const v of ordenadas) {
    const galonesV = tamanoAGalones(v.tamano)
    const cantidad = Math.floor(restante / galonesV + 1e-6)
    if (cantidad > 0) {
      resultado.push({ producto: v, cantidad })
      restante = Math.round((restante - cantidad * galonesV) * 100) / 100
    }
  }
  if (restante > 0.01) {
    const menor = ordenadas[ordenadas.length - 1]
    const existente = resultado.find((r) => r.producto.id_producto === menor.id_producto)
    if (existente) existente.cantidad += 1
    else resultado.push({ producto: menor, cantidad: 1 })
  }
  return resultado
})

const totalSugerencia = computed(() => sugerenciaCompra.value.reduce((sum, r) => sum + r.producto.precio_venta * r.cantidad, 0))

function agregarSugerenciaAlCarrito() {
  sugerenciaCompra.value.forEach((r) => cart.agregarProducto(r.producto, r.cantidad))
  showToast('Productos sugeridos agregados al carrito.', 'success')
  emit('cerrar')
}

function cerrar() {
  emit('cerrar')
}
</script>

<template>
  <Transition name="confirm-modal-fade">
    <div v-if="mostrar" class="confirm-modal-overlay" @click.self="cerrar">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal calc-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="cerrar"><i class="ri-close-line"></i></button>
          <div class="confirm-modal-icon"><i class="ri-calculator-line"></i></div>
          <h3 class="confirm-modal-title">Calculadora de Pintura</h3>
          <p class="confirm-modal-text" style="margin-bottom:20px;">Descubre cuántos galones necesitas para tu proyecto.</p>

          <div class="calc-toggle">
            <button class="calc-toggle-btn" :class="{ active: modo === 'conozco' }" @click="modo = 'conozco'">
              <i class="ri-ruler-2-line"></i> Ya sé el área
            </button>
            <button class="calc-toggle-btn" :class="{ active: modo === 'noconozco' }" @click="modo = 'noconozco'">
              <i class="ri-question-line"></i> No sé el área
            </button>
          </div>

          <template v-if="modo === 'conozco'">
            <div class="form-group">
              <label class="form-label">Área a pintar (m²)</label>
              <input v-model.number="areaDirecta" type="number" min="0" step="0.5" class="form-control" placeholder="Ej. 45" />
            </div>
          </template>

          <template v-else>
            <div class="calc-section">
              <div class="calc-section-title"><i class="ri-layout-2-line"></i> Pared a pintar</div>
              <div class="calc-row">
                <div class="calc-field"><label>Alto (m)</label><input v-model.number="alturaPared" type="number" min="0" step="0.1" class="form-control" /></div>
                <div class="calc-field"><label>Largo (m)</label><input v-model.number="largoPared" type="number" min="0" step="0.1" class="form-control" /></div>
                <div class="calc-field"><label>Área (m²)</label><input :value="areaBruta.toFixed(1)" type="text" class="form-control" disabled /></div>
              </div>
            </div>

            <div class="calc-section">
              <label class="checkbox-label" style="margin-bottom:10px;"><input v-model="tienePuertas" type="checkbox" /> ¿Tiene puertas?</label>
              <div v-if="tienePuertas" class="calc-row">
                <div class="calc-field"><label>Cantidad</label><input v-model.number="cantidadPuertas" type="number" min="1" class="form-control" /></div>
                <div class="calc-field"><label>Alto (m)</label><input v-model.number="altoPuerta" type="number" min="0" step="0.1" class="form-control" /></div>
                <div class="calc-field"><label>Ancho (m)</label><input v-model.number="anchoPuerta" type="number" min="0" step="0.1" class="form-control" /></div>
              </div>
            </div>

            <div class="calc-section">
              <label class="checkbox-label" style="margin-bottom:10px;"><input v-model="tieneVentanas" type="checkbox" /> ¿Tiene ventanas?</label>
              <div v-if="tieneVentanas" class="calc-row">
                <div class="calc-field"><label>Cantidad</label><input v-model.number="cantidadVentanas" type="number" min="1" class="form-control" /></div>
                <div class="calc-field"><label>Alto (m)</label><input v-model.number="altoVentana" type="number" min="0" step="0.1" class="form-control" /></div>
                <div class="calc-field"><label>Ancho (m)</label><input v-model.number="anchoVentana" type="number" min="0" step="0.1" class="form-control" /></div>
              </div>
            </div>

            <div class="calc-result-line">
              <span>Área neta a pintar</span>
              <strong>{{ areaNetaCalculada.toFixed(1) }} m²</strong>
            </div>
          </template>

          <div class="calc-manos">
            <span>Manos de pintura:</span>
            <div class="filter-chips">
              <button class="filter-chip" :class="{ active: manos === 1 }" @click="manos = 1">1 mano</button>
              <button class="filter-chip" :class="{ active: manos === 2 }" @click="manos = 2">2 manos (recomendado)</button>
            </div>
          </div>

          <div v-if="areaAPintar > 0" class="calc-result-box">
            <div class="calc-result-box-value">{{ galonesNecesarios }} galones</div>
            <p class="calc-result-box-hint">
              Aproximado para {{ areaAPintar.toFixed(1) }} m² con {{ manos }} {{ manos === 1 ? 'mano' : 'manos' }} de pintura.
            </p>

            <div v-if="sugerenciaCompra.length" class="calc-suggestion">
              <div class="calc-suggestion-title">Te sugerimos comprar:</div>
              <div v-for="r in sugerenciaCompra" :key="r.producto.id_producto" class="calc-suggestion-item">
                <span>{{ r.cantidad }} x {{ r.producto.tamano }}</span>
                <span>{{ formatCOP(r.producto.precio_venta * r.cantidad) }}</span>
              </div>
              <div class="calc-suggestion-total">
                <span>Total estimado</span>
                <strong>{{ formatCOP(totalSugerencia) }}</strong>
              </div>
              <button class="btn btn-primary btn-lg btn-block" style="margin-top:14px;" @click="agregarSugerenciaAlCarrito">
                <i class="ri-shopping-cart-line"></i> Agregar sugerencia al carrito
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
