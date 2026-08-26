<script setup>
// Modal de crear/editar promoción para el panel admin. Calca la estructura de
// ServicioFormModal.vue/ProductoFormModal.vue (mismo confirm-modal + resync vía la store), pero
// el formulario cambia de forma según `tipo` (descuento/combo/servicio) - ver PromocionService en
// el backend para las mismas reglas de validación replicadas aquí del lado del cliente.
import { ref, computed, watch } from 'vue'
import { useCatalogStore } from '../../stores/catalog'
import { formatCOP } from '../../composables/useFormat'

const props = defineProps({
  mostrar: { type: Boolean, default: false },
  promocion: { type: Object, default: null }, // null = crear, objeto = editar
})
const emit = defineEmits(['cerrar', 'guardado'])

const catalog = useCatalogStore()

const TIPOS = [
  { value: 'descuento', label: 'Descuento en producto', icon: 'ri-price-tag-3-line', desc: 'Un producto, con % o precio especial.' },
  { value: 'combo', label: 'Combo de productos', icon: 'ri-gift-line', desc: 'Varios productos juntos por un precio de paquete.' },
  { value: 'servicio', label: 'Descuento en servicio', icon: 'ri-tools-line', desc: 'Un servicio, con % o precio especial.' },
]

const productosActivos = computed(() => catalog.productos.filter((p) => p.activo))

const vacio = () => ({
  titulo: '', descripcion: '', imagen_url: '', tipo: 'descuento',
  productos: [], id_servicio: null,
  descuento_porcentaje: null, precio_especial: null,
  fecha_inicio: '', fecha_fin: '', activo: true, destacado: false,
})

const form = ref(vacio())
const guardando = ref(false)
const error = ref('')
const busquedaProducto = ref('')

watch(
  () => props.mostrar,
  (val) => {
    if (!val) return
    error.value = ''
    busquedaProducto.value = ''
    if (props.promocion) {
      const p = props.promocion
      form.value = {
        ...p,
        productos: [...(p.productos || [])],
        fecha_inicio: p.fecha_inicio || '',
        fecha_fin: p.fecha_fin || '',
        activo: !!p.activo,
        destacado: !!p.destacado,
      }
    } else {
      form.value = vacio()
    }
  }
)

// Cambiar de tipo limpia el "otro eje" (productos vs servicio) para que no quede una selección
// vieja invisible arrastrándose - solo en interacción real del usuario, no al precargar el form
// en edición (por eso esto es un @click, no un watch sobre form.tipo).
function elegirTipo(tipo) {
  if (form.value.tipo === tipo) return
  form.value.tipo = tipo
  form.value.productos = []
  form.value.id_servicio = null
  form.value.descuento_porcentaje = null
  form.value.precio_especial = null
}

const productosFiltrados = computed(() => {
  const term = busquedaProducto.value.trim().toLowerCase()
  if (!term) return productosActivos.value
  return productosActivos.value.filter((p) => p.nombre.toLowerCase().includes(term))
})

function toggleProducto(id_producto) {
  const idx = form.value.productos.indexOf(id_producto)
  if (idx === -1) form.value.productos.push(id_producto)
  else form.value.productos.splice(idx, 1)
}

// El selector de producto único (tipo descuento) reusa el mismo arreglo `productos` que combo,
// para mandar exactamente la misma forma al backend en los 2 casos.
const productoUnico = computed({
  get: () => form.value.productos[0] ?? '',
  set: (val) => { form.value.productos = val ? [Number(val)] : [] },
})

// ── Vista previa — mismo cálculo que ve el cliente real en catálogo/detalle/slider, para que el
// admin no tenga que adivinar cómo se ve esto antes de guardar. ──
const productoPreview = computed(() => catalog.getProductById(productoUnico.value))
const servicioPreview = computed(() => catalog.servicios.find((s) => s.id_servicio === Number(form.value.id_servicio)))
const productosComboPreview = computed(() => form.value.productos.map((id) => catalog.getProductById(id)).filter(Boolean))
const precioFinalPreview = computed(() => {
  const base = form.value.tipo === 'servicio'
    ? (servicioPreview.value?.precio_hora ?? servicioPreview.value?.precio_proyecto ?? servicioPreview.value?.precio_dia)
    : productoPreview.value?.precio_venta
  if (base == null) return null
  if (form.value.precio_especial) return Number(form.value.precio_especial)
  if (form.value.descuento_porcentaje) return Math.round(base * (1 - form.value.descuento_porcentaje / 100))
  return null
})
const sumaIndividualCombo = computed(() => productosComboPreview.value.reduce((acc, p) => acc + Number(p.precio_venta), 0))
const ahorroComboPreview = computed(() => {
  if (!form.value.precio_especial || !productosComboPreview.value.length) return 0
  return Math.max(0, sumaIndividualCombo.value - Number(form.value.precio_especial))
})

function validar() {
  if (!form.value.titulo?.trim()) return 'El título de la promoción es obligatorio.'
  if (!form.value.descripcion?.trim()) return 'La descripción de la promoción es obligatoria.'
  if (form.value.fecha_inicio && form.value.fecha_fin && form.value.fecha_fin < form.value.fecha_inicio) {
    return 'La fecha de fin no puede ser anterior a la de inicio.'
  }
  if (form.value.tipo === 'descuento') {
    if (!form.value.productos.length) return 'Selecciona el producto de la promoción.'
    if (!form.value.descuento_porcentaje && !form.value.precio_especial) return 'Indica un porcentaje de descuento o un precio especial.'
  }
  if (form.value.tipo === 'combo') {
    if (form.value.productos.length < 2) return 'Un combo necesita al menos 2 productos.'
    if (!form.value.precio_especial) return 'Indica el precio del combo completo.'
  }
  if (form.value.tipo === 'servicio') {
    if (!form.value.id_servicio) return 'Selecciona el servicio de la promoción.'
    if (!form.value.descuento_porcentaje && !form.value.precio_especial) return 'Indica un porcentaje de descuento o un precio especial.'
  }
  return ''
}

async function guardar() {
  const mensaje = validar()
  if (mensaje) {
    error.value = mensaje
    return
  }
  guardando.value = true
  error.value = ''
  const datos = { ...form.value, fecha_inicio: form.value.fecha_inicio || null, fecha_fin: form.value.fecha_fin || null }
  try {
    if (props.promocion) {
      await catalog.actualizarPromocion(props.promocion.id_promocion, datos)
    } else {
      await catalog.crearPromocion(datos)
    }
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'No se pudo guardar la promoción. Intenta de nuevo.'
    guardando.value = false
    return
  }
  guardando.value = false
  emit('guardado', { esNuevo: !props.promocion })
  emit('cerrar')
}
</script>

<template>
  <Transition name="confirm-modal-fade">
    <div v-if="mostrar" class="confirm-modal-overlay" @click.self="$emit('cerrar')">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal promo-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="$emit('cerrar')"><i class="ri-close-line"></i></button>
          <h3 class="confirm-modal-title">{{ promocion ? 'Editar promoción' : 'Nueva promoción' }}</h3>

          <form class="form-grid-2" @submit.prevent="guardar">
            <div class="form-group full">
              <label class="form-label required">Tipo de promoción</label>
              <div class="promo-tipo-grid">
                <button
                  v-for="t in TIPOS" :key="t.value" type="button"
                  class="promo-tipo-card" :class="{ active: form.tipo === t.value }"
                  @click="elegirTipo(t.value)"
                >
                  <i :class="t.icon"></i>
                  <strong>{{ t.label }}</strong>
                  <span>{{ t.desc }}</span>
                </button>
              </div>
            </div>

            <div class="form-group full">
              <label class="form-label required">Título</label>
              <input v-model="form.titulo" type="text" class="form-control" placeholder="Ej. 20% OFF en Vinilo Tipo 1" required />
            </div>

            <!-- Descuento: 1 producto -->
            <div v-if="form.tipo === 'descuento'" class="form-group full">
              <label class="form-label required">Producto</label>
              <select v-model="productoUnico" class="form-control">
                <option value="" disabled>Selecciona un producto...</option>
                <option v-for="p in productosActivos" :key="p.id_producto" :value="p.id_producto">{{ p.nombre }} — {{ formatCOP(p.precio_venta) }}</option>
              </select>
            </div>

            <!-- Servicio: 1 servicio -->
            <div v-if="form.tipo === 'servicio'" class="form-group full">
              <label class="form-label required">Servicio</label>
              <select v-model.number="form.id_servicio" class="form-control">
                <option :value="null" disabled>Selecciona un servicio...</option>
                <option v-for="s in catalog.servicios" :key="s.id_servicio" :value="s.id_servicio">{{ s.nombre_servicio }}</option>
              </select>
            </div>

            <!-- Combo: varios productos -->
            <div v-if="form.tipo === 'combo'" class="form-group full">
              <label class="form-label required">Productos del combo (mínimo 2)</label>
              <div class="promo-picker">
                <div class="promo-picker-search">
                  <input v-model="busquedaProducto" type="search" class="form-control" placeholder="Buscar producto..." />
                </div>
                <div class="promo-picker-list">
                  <label v-for="p in productosFiltrados" :key="p.id_producto" class="promo-picker-row">
                    <input type="checkbox" :checked="form.productos.includes(p.id_producto)" @change="toggleProducto(p.id_producto)" />
                    <img :src="p.imagen_url" :alt="p.nombre" />
                    <span>{{ p.nombre }}</span>
                    <small>{{ formatCOP(p.precio_venta) }}</small>
                  </label>
                  <div v-if="!productosFiltrados.length" class="promo-picker-empty">Sin resultados.</div>
                </div>
              </div>
              <span class="promo-picker-count"><strong>{{ form.productos.length }}</strong> producto(s) seleccionado(s)</span>
            </div>

            <!-- Precio: % y/o precio especial (descuento/servicio), o precio de paquete (combo) -->
            <template v-if="form.tipo !== 'combo'">
              <div class="form-group full" style="margin-bottom:-6px;">
                <span class="form-hint">* Obligatorio: indica el descuento en % o un precio especial (con uno de los dos basta).</span>
              </div>
              <div class="form-group">
                <label class="form-label">Descuento (%)</label>
                <input v-model.number="form.descuento_porcentaje" type="number" min="0" max="100" step="1" class="form-control" placeholder="20" />
              </div>
              <div class="form-group">
                <label class="form-label">Precio especial ($)</label>
                <input v-model.number="form.precio_especial" type="number" min="0" class="form-control" placeholder="Alternativa al %" />
              </div>
            </template>
            <div v-else class="form-group full">
              <label class="form-label required">Precio del combo completo ($)</label>
              <input v-model.number="form.precio_especial" type="number" min="0" class="form-control" placeholder="Ej. 85000" required />
            </div>

            <div class="form-group">
              <label class="form-label">Fecha de inicio</label>
              <input v-model="form.fecha_inicio" type="date" class="form-control" />
              <span class="form-hint">Opcional — vacío = empieza ya.</span>
            </div>
            <div class="form-group">
              <label class="form-label">Fecha de fin</label>
              <input v-model="form.fecha_fin" type="date" class="form-control" />
              <span class="form-hint">Opcional — vacío = sin fecha límite.</span>
            </div>

            <div class="form-group full">
              <label class="form-label">Imagen para el slider de inicio (URL)</label>
              <input v-model="form.imagen_url" type="text" class="form-control" placeholder="https://..." />
              <span class="form-hint">Opcional — solo hace falta si vas a marcar esta promoción como "Destacada" abajo.</span>
            </div>
            <div class="form-group full">
              <label class="form-label required">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="2" placeholder="Frase corta para la tarjeta de la promoción..." required></textarea>
            </div>

            <!-- Vista previa: lo que el cliente va a ver -->
            <div class="form-group full">
              <div class="promo-preview">
                <div class="promo-preview-label"><i class="ri-eye-line"></i> Así se ve para el cliente</div>

                <div v-if="form.tipo === 'combo'">
                  <div v-if="productosComboPreview.length" class="promo-preview-card">
                    <div class="promo-preview-thumbs">
                      <img v-for="p in productosComboPreview.slice(0, 4)" :key="p.id_producto" :src="p.imagen_url" :alt="p.nombre" />
                    </div>
                    <div class="promo-preview-info">
                      <strong>{{ form.titulo || 'Título de la promoción' }}</strong>
                      <div class="promo-preview-price">
                        <span class="new">{{ form.precio_especial ? formatCOP(form.precio_especial) : '—' }}</span>
                        <span class="old" v-if="sumaIndividualCombo">antes {{ formatCOP(sumaIndividualCombo) }} por separado</span>
                      </div>
                      <span v-if="ahorroComboPreview > 0" class="promo-preview-ahorro">Ahorran {{ formatCOP(ahorroComboPreview) }}</span>
                    </div>
                  </div>
                  <p v-else class="promo-preview-empty">Elige al menos 2 productos para ver la vista previa.</p>
                </div>

                <div v-else>
                  <div v-if="(form.tipo === 'descuento' && productoPreview) || (form.tipo === 'servicio' && servicioPreview)" class="promo-preview-card">
                    <img class="promo-preview-thumb" :src="(productoPreview || servicioPreview).imagen_url" :alt="(productoPreview || servicioPreview).nombre || (productoPreview || servicioPreview).nombre_servicio" />
                    <div class="promo-preview-info">
                      <strong>{{ (productoPreview?.nombre) || (servicioPreview?.nombre_servicio) }}</strong>
                      <div class="promo-preview-price">
                        <template v-if="precioFinalPreview != null">
                          <span class="new">{{ formatCOP(precioFinalPreview) }}</span>
                          <span class="old">antes {{ formatCOP(productoPreview ? productoPreview.precio_venta : (servicioPreview.precio_hora ?? servicioPreview.precio_proyecto ?? servicioPreview.precio_dia)) }}</span>
                        </template>
                        <span v-else style="color:var(--text-muted); font-size:0.85rem;">Indica un % o precio especial para ver el precio final.</span>
                      </div>
                    </div>
                  </div>
                  <p v-else class="promo-preview-empty">Selecciona {{ form.tipo === 'servicio' ? 'un servicio' : 'un producto' }} para ver la vista previa.</p>
                </div>
              </div>
            </div>

            <div class="form-group full">
              <label class="form-check-label">
                <input v-model="form.destacado" type="checkbox" />
                Destacar en el inicio (slider "Promociones del Mes")
              </label>
            </div>
            <div class="form-group full">
              <label class="form-check-label">
                <input v-model="form.activo" type="checkbox" />
                Promoción activa (visible en la tienda)
              </label>
            </div>

            <p v-if="error" class="alert alert-danger full" style="grid-column:1/-1;">
              <i class="ri-error-warning-fill"></i> {{ error }}
            </p>

            <div class="form-actions full">
              <button type="button" class="btn btn-outline-red btn-sm" @click="$emit('cerrar')">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-sm" :disabled="guardando">
                <i class="ri-save-line"></i> {{ promocion ? 'Guardar cambios' : 'Crear promoción' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
