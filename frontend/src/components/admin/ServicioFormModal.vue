<script setup>
// Modal de crear/editar servicio para el panel admin. Calca ProductoFormModal.vue.
import { ref, watch } from 'vue'
import { useCatalogStore } from '../../stores/catalog'

const props = defineProps({
  mostrar: { type: Boolean, default: false },
  servicio: { type: Object, default: null }, // null = crear, objeto = editar
})
const emit = defineEmits(['cerrar', 'guardado'])

const catalog = useCatalogStore()

const TIPOS = [
  { value: 'drywall', label: 'Drywall' },
  { value: 'aplicacion_pintura', label: 'Aplicación de Pintura' },
  { value: 'asesoria', label: 'Asesoría' },
  { value: 'pvc', label: 'PVC' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'diseño_interiores', label: 'Diseño de Interiores' },
  { value: 'diseño_exteriores', label: 'Diseño de Exteriores' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'consultoria', label: 'Consultoría' },
]

// El negocio cobra un servicio de una sola forma a la vez (por hora, por proyecto o por día,
// nunca combinadas) - un selector + un solo campo de precio es más simple que 3 inputs sueltos.
const TIPOS_PRECIO = [
  { value: 'hora', label: 'Por hora' },
  { value: 'proyecto', label: 'Por proyecto' },
  { value: 'dia', label: 'Por día' },
]

const vacio = () => ({
  nombre_servicio: '', descripcion: '', tipo_servicio: TIPOS[0].value, incluye_materiales: false,
  tipo_precio: 'hora', precio: null, duracion_estimada_horas: null, imagen_url: '', activo: true, destacado: false,
})

const form = ref(vacio())
const guardando = ref(false)
const error = ref('')

watch(
  () => props.mostrar,
  (val) => {
    if (!val) return
    error.value = ''
    if (props.servicio) {
      const s = props.servicio
      const tipo_precio = s.precio_proyecto != null ? 'proyecto' : s.precio_dia != null ? 'dia' : 'hora'
      form.value = {
        ...s,
        tipo_precio,
        precio: s.precio_hora ?? s.precio_proyecto ?? s.precio_dia ?? null,
        incluye_materiales: !!s.incluye_materiales,
        activo: !!s.activo,
        destacado: !!s.destacado,
      }
    } else {
      form.value = vacio()
    }
  }
)

async function guardar() {
  if (!form.value.nombre_servicio?.trim()) {
    error.value = 'El nombre del servicio es obligatorio.'
    return
  }
  if (!form.value.precio || form.value.precio <= 0) {
    error.value = 'Ingresa un precio válido.'
    return
  }
  guardando.value = true
  error.value = ''
  const datos = {
    ...form.value,
    precio_hora: form.value.tipo_precio === 'hora' ? form.value.precio : null,
    precio_proyecto: form.value.tipo_precio === 'proyecto' ? form.value.precio : null,
    precio_dia: form.value.tipo_precio === 'dia' ? form.value.precio : null,
  }
  try {
    if (props.servicio) {
      await catalog.actualizarServicio(props.servicio.id_servicio, datos)
    } else {
      await catalog.crearServicio(datos)
    }
  } catch (e) {
    error.value = e.response?.data?.mensaje || 'No se pudo guardar el servicio. Intenta de nuevo.'
    guardando.value = false
    return
  }
  guardando.value = false
  emit('guardado', { esNuevo: !props.servicio })
  emit('cerrar')
}
</script>

<template>
  <Transition name="confirm-modal-fade">
    <div v-if="mostrar" class="confirm-modal-overlay" @click.self="$emit('cerrar')">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal producto-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="$emit('cerrar')"><i class="ri-close-line"></i></button>
          <h3 class="confirm-modal-title">{{ servicio ? 'Editar servicio' : 'Nuevo servicio' }}</h3>

          <form class="form-grid-2" @submit.prevent="guardar">
            <div class="form-group full">
              <label class="form-label required">Nombre del servicio</label>
              <input v-model="form.nombre_servicio" type="text" class="form-control" placeholder="Ej. Instalación de Drywall" required />
            </div>

            <div class="form-group">
              <label class="form-label">Tipo de servicio</label>
              <select v-model="form.tipo_servicio" class="form-control">
                <option v-for="t in TIPOS" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Duración estimada (horas)</label>
              <input v-model.number="form.duracion_estimada_horas" type="number" min="0" class="form-control" placeholder="Ej. 4" />
            </div>

            <div class="form-group">
              <label class="form-label">Se cobra</label>
              <select v-model="form.tipo_precio" class="form-control">
                <option v-for="t in TIPOS_PRECIO" :key="t.value" :value="t.value">{{ t.label }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">Precio</label>
              <input v-model.number="form.precio" type="number" min="0" class="form-control" placeholder="45000" required />
            </div>

            <div class="form-group full">
              <label class="form-label">Imagen (URL)</label>
              <input v-model="form.imagen_url" type="text" class="form-control" placeholder="https://..." />
            </div>

            <div class="form-group full">
              <label class="form-label">Descripción</label>
              <textarea v-model="form.descripcion" class="form-control" rows="3" placeholder="Descripción del servicio..."></textarea>
            </div>

            <div class="form-group full">
              <label class="form-check-label">
                <input v-model="form.incluye_materiales" type="checkbox" />
                Incluye materiales
              </label>
            </div>
            <div class="form-group full">
              <label class="form-check-label">
                <input v-model="form.destacado" type="checkbox" />
                Servicio destacado
              </label>
            </div>
            <div class="form-group full">
              <label class="form-check-label">
                <input v-model="form.activo" type="checkbox" />
                Servicio activo (visible en la tienda)
              </label>
            </div>

            <p v-if="error" class="alert alert-danger full" style="grid-column:1/-1;">
              <i class="ri-error-warning-fill"></i> {{ error }}
            </p>

            <div class="form-actions full">
              <button type="button" class="btn btn-outline-red btn-sm" @click="$emit('cerrar')">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-sm" :disabled="guardando">
                <i class="ri-save-line"></i> {{ servicio ? 'Guardar cambios' : 'Crear servicio' }}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
