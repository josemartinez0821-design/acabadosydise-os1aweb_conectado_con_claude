<script setup>
// Modal de crear/editar producto para el panel admin. Reutiliza .confirm-modal global
// (mismo patrón que CalculadoraPinturaModal/SelectorColorModal) con la variante .producto-modal.
import { ref, watch } from 'vue'
import { useCatalogStore } from '../../stores/catalog'

const props = defineProps({
  mostrar: { type: Boolean, default: false },
  producto: { type: Object, default: null }, // null = crear, objeto = editar
})
const emit = defineEmits(['cerrar', 'guardado'])

const catalog = useCatalogStore()

const UNIDADES = [
  { value: 'unidad', label: 'Unidad' },
  { value: 'metro2', label: 'Metro cuadrado (m²)' },
  { value: 'metro', label: 'Metro lineal' },
  { value: 'litro', label: 'Litro' },
  { value: 'galon', label: 'Galón' },
  { value: 'kilogramo', label: 'Kilogramo' },
  { value: 'caja', label: 'Caja' },
  { value: 'rollo', label: 'Rollo' },
  { value: 'bulto', label: 'Bulto' },
]

// Primera categoría real disponible por defecto — no hardcodear un id, el backend real no numera
// las categorías igual que el mock (ver memoria del proyecto).
const vacio = () => ({
  nombre: '', descripcion: '', id_categoria: catalog.categorias[0]?.id_categoria ?? null, marca: '', unidad_medida: 'unidad',
  presentacion: '', color: '', acabado: '', material: '', imagen_url: '',
  precio_venta: null, precio_mayorista: null, stock_inicial: 0, activo: true,
})

const form = ref(vacio())
const guardando = ref(false)
const error = ref('')

watch(
  () => props.mostrar,
  (val) => {
    if (!val) return
    error.value = ''
    if (props.producto) {
      const inv = catalog.inventario.find((i) => i.id_producto === props.producto.id_producto)
      form.value = {
        ...props.producto,
        stock_inicial: inv?.cantidad_disponible ?? 0,
        activo: !!props.producto.activo,
      }
    } else {
      form.value = vacio()
    }
  }
)

// Todo el formulario es obligatorio menos "Precio mayorista" (pedido explícito del admin: sin
// esto, quien lo llena asume que solo Nombre/Precio de venta son obligatorios y deja el resto en
// blanco). Un solo arreglo en vez de un if por campo, para no repetir el mismo mensaje 9 veces.
const CAMPOS_OBLIGATORIOS = [
  { campo: 'nombre', label: 'Nombre del producto' },
  { campo: 'id_categoria', label: 'Categoría' },
  { campo: 'marca', label: 'Marca' },
  { campo: 'unidad_medida', label: 'Unidad de medida' },
  { campo: 'presentacion', label: 'Presentación' },
  { campo: 'color', label: 'Color' },
  { campo: 'acabado', label: 'Acabado' },
  { campo: 'imagen_url', label: 'Imagen (URL)' },
  { campo: 'precio_venta', label: 'Precio de venta' },
  { campo: 'stock_inicial', label: 'Stock' },
  { campo: 'descripcion', label: 'Descripción' },
]

function campoVacio(valor) {
  if (valor === null || valor === undefined) return true
  if (typeof valor === 'string') return !valor.trim()
  return false // 0 es un stock/precio válido, no cuenta como vacío
}

async function guardar() {
  for (const { campo, label } of CAMPOS_OBLIGATORIOS) {
    if (campoVacio(form.value[campo])) {
      error.value = `Llena el campo "${label}" antes de guardar.`
      return
    }
  }
  if (form.value.precio_venta <= 0) {
    error.value = 'Ingresa un precio de venta válido.'
    return
  }
  guardando.value = true
  error.value = ''
  try {
    if (props.producto) {
      await catalog.actualizarProducto(props.producto.id_producto, form.value)
    } else {
      await catalog.crearProducto(form.value)
    }
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'No se pudo guardar el producto. Intenta de nuevo.'
    guardando.value = false
    return
  }
  guardando.value = false
  emit('guardado', { esNuevo: !props.producto })
  emit('cerrar')
}
</script>

<template>
  <Transition name="confirm-modal-fade">
    <div v-if="mostrar" class="confirm-modal-overlay" @click.self="$emit('cerrar')">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal producto-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="$emit('cerrar')"><i class="ri-close-line"></i></button>
          <h3 class="confirm-modal-title">{{ producto ? 'Editar producto' : 'Nuevo producto' }}</h3>

          <form class="form-grid-2" @submit.prevent="guardar">
            <div class="form-group full">
              <label class="form-label required">Nombre del producto</label>
              <input v-model="form.nombre" type="text" class="form-control" placeholder="Ej. Vinilo Interior Tipo 1 Blanco" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Categoría</label>
              <select v-model.number="form.id_categoria" class="form-control" required>
                <option v-for="c in catalog.categorias" :key="c.id_categoria" :value="c.id_categoria">{{ c.nombre }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Marca</label>
              <input v-model="form.marca" type="text" class="form-control" placeholder="Ej. Pintuco" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Unidad de medida</label>
              <select v-model="form.unidad_medida" class="form-control" required>
                <option v-for="u in UNIDADES" :key="u.value" :value="u.value">{{ u.label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Presentación</label>
              <input v-model="form.presentacion" type="text" class="form-control" placeholder="Ej. 1 Galón" required />
            </div>

            <div class="form-group">
              <label class="form-label required">Color</label>
              <input v-model="form.color" type="text" class="form-control" placeholder="Ej. Blanco" required />
            </div>
            <div class="form-group">
              <label class="form-label required">Acabado</label>
              <input v-model="form.acabado" type="text" class="form-control" placeholder="Ej. Mate" required />
            </div>

            <div class="form-group full">
              <label class="form-label required">Imagen (URL)</label>
              <input v-model="form.imagen_url" type="text" class="form-control" placeholder="https://..." required />
            </div>

            <div class="form-group">
              <label class="form-label required">Precio de venta</label>
              <input v-model.number="form.precio_venta" type="number" min="0" class="form-control" placeholder="45000" required />
            </div>
            <div class="form-group">
              <label class="form-label">Precio mayorista</label>
              <input v-model.number="form.precio_mayorista" type="number" min="0" class="form-control" placeholder="Opcional" />
            </div>

            <div class="form-group full">
              <label class="form-label required">{{ producto ? 'Stock disponible' : 'Stock inicial' }}</label>
              <input v-model.number="form.stock_inicial" type="number" min="0" class="form-control" required />
            </div>

            <div class="form-group full">
              <label class="form-label required">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="3" placeholder="Descripción del producto..." required></textarea>
            </div>

            <div class="form-group full">
              <label class="form-check-label">
                <input v-model="form.activo" type="checkbox" />
                Producto activo (visible en la tienda)
              </label>
            </div>

            <p v-if="error" class="alert alert-danger full" style="grid-column:1/-1;">
              <i class="ri-error-warning-fill"></i> {{ error }}
            </p>

            <div class="form-actions full">
              <button type="button" class="btn btn-outline-red btn-sm" @click="$emit('cerrar')">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-sm" :disabled="guardando">
                <i class="ri-save-line"></i> {{ producto ? 'Guardar cambios' : 'Crear producto' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
