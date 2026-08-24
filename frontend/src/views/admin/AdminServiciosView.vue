<script setup>
// RF09/RF10 - CRUD de servicios -> tabla `servicios`. Calca AdminProductosView.vue, sin la parte
// de inventario/stock (los servicios no manejan existencias).
import { ref, computed, watch } from 'vue'
import { useCatalogStore } from '../../stores/catalog'
import { useToast } from '../../composables/useToast'
import { formatCOP } from '../../composables/useFormat'
import ServicioFormModal from '../../components/admin/ServicioFormModal.vue'

const catalog = useCatalogStore()
const { showToast } = useToast()

const busqueda = ref('')
const filtroTipo = ref('')
const filtroEstado = ref('')
const paginaActual = ref(1)
const POR_PAGINA = 8

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
function nombreTipo(tipo) {
  return TIPOS.find((t) => t.value === tipo)?.label || tipo
}

function precioServicio(s) {
  if (s.precio_hora != null) return `${formatCOP(s.precio_hora)} / hora`
  if (s.precio_dia != null) return `${formatCOP(s.precio_dia)} / día`
  if (s.precio_proyecto != null) return `${formatCOP(s.precio_proyecto)} / proyecto`
  return '—'
}

const serviciosFiltrados = computed(() => {
  const term = busqueda.value.trim().toLowerCase()
  return catalog.servicios
    .filter((s) => {
      const coincideTerm = !term || s.nombre_servicio.toLowerCase().includes(term) || s.codigo_servicio.toLowerCase().includes(term)
      const coincideTipo = !filtroTipo.value || s.tipo_servicio === filtroTipo.value
      const coincideEstado = !filtroEstado.value || (filtroEstado.value === 'activo' ? s.activo : !s.activo)
      return coincideTerm && coincideTipo && coincideEstado
    })
    .sort((a, b) => b.id_servicio - a.id_servicio)
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(serviciosFiltrados.value.length / POR_PAGINA)))
const serviciosPagina = computed(() => {
  const inicio = (paginaActual.value - 1) * POR_PAGINA
  return serviciosFiltrados.value.slice(inicio, inicio + POR_PAGINA)
})
watch([busqueda, filtroTipo, filtroEstado], () => { paginaActual.value = 1 })
watch(totalPaginas, (nuevo) => { if (paginaActual.value > nuevo) paginaActual.value = nuevo })

function limpiarFiltros() {
  busqueda.value = ''
  filtroTipo.value = ''
  filtroEstado.value = ''
}
function toggleFiltroEstado(valor) {
  filtroEstado.value = filtroEstado.value === valor ? '' : valor
}
function irAPagina(n) {
  paginaActual.value = Math.min(Math.max(1, n), totalPaginas.value)
}

const totalServicios = computed(() => catalog.servicios.length)
const totalActivos = computed(() => catalog.servicios.filter((s) => s.activo).length)
const pctActivos = computed(() => (totalServicios.value ? Math.round((totalActivos.value / totalServicios.value) * 100) : 0))
const totalDestacados = computed(() => catalog.servicios.filter((s) => s.destacado).length)

const mostrarForm = ref(false)
const servicioEditando = ref(null)
function abrirCrear() {
  servicioEditando.value = null
  mostrarForm.value = true
}
function abrirEditar(s) {
  servicioEditando.value = s
  mostrarForm.value = true
}
function onGuardado({ esNuevo }) {
  showToast(esNuevo ? '¡Servicio creado correctamente!' : '¡Servicio actualizado correctamente!', 'success')
}

const servicioAEliminar = ref(null)
async function eliminarServicio() {
  const servicio = servicioAEliminar.value
  try {
    await catalog.eliminarServicio(servicio.id_servicio)
    showToast('Servicio eliminado del catálogo.', 'success')
  } catch (e) {
    showToast(e.response?.data?.mensaje || 'No se pudo eliminar el servicio. Intenta de nuevo.', 'danger')
  }
  servicioAEliminar.value = null
}
</script>

<template>
  <div class="admin-page-header">
    <div>
      <h1>Gestión de Servicios</h1>
      <p>Administra el catálogo de servicios de instalación, diseño y mantenimiento.</p>
    </div>
    <button type="button" class="btn btn-primary" @click="abrirCrear">
      <i class="ri-add-line"></i> Nuevo Servicio
    </button>
  </div>

  <div class="prod-stats-grid">
    <button type="button" class="prod-stat" :class="{ active: !filtroEstado }" @click="filtroEstado = ''">
      <div class="prod-stat-label"><i class="ri-tools-line"></i> Total servicios</div>
      <strong class="prod-stat-value">{{ totalServicios }}</strong>
    </button>
    <button type="button" class="prod-stat" :class="{ active: filtroEstado === 'activo' }" @click="toggleFiltroEstado('activo')">
      <div class="prod-stat-label"><i class="ri-checkbox-circle-line"></i> Activos</div>
      <div class="prod-stat-value-row">
        <strong class="prod-stat-value">{{ totalActivos }}</strong>
        <span class="prod-stat-note ok">{{ pctActivos }}% del catálogo</span>
      </div>
    </button>
    <button type="button" class="prod-stat">
      <div class="prod-stat-label"><i class="ri-star-line"></i> Destacados</div>
      <strong class="prod-stat-value">{{ totalDestacados }}</strong>
    </button>
  </div>

  <div class="admin-filters-bar">
    <div class="search-input-wrap">
      <input v-model="busqueda" type="search" class="form-control" placeholder="Buscar por nombre o código..." />
    </div>
    <select v-model="filtroTipo">
      <option value="">Tipo de servicio</option>
      <option v-for="t in TIPOS" :key="t.value" :value="t.value">{{ t.label }}</option>
    </select>
    <select v-model="filtroEstado">
      <option value="">Estado</option>
      <option value="activo">Activo</option>
      <option value="inactivo">Inactivo</option>
    </select>
    <button type="button" class="btn btn-outline-red btn-sm" @click="limpiarFiltros">
      <i class="ri-filter-off-line"></i> Limpiar filtros
    </button>
  </div>

  <div class="admin-card">
    <div class="admin-card-header">
      <h2>Lista de servicios</h2>
      <span>{{ serviciosFiltrados.length }} registros encontrados</span>
    </div>

    <div v-if="!serviciosPagina.length" class="admin-empty">
      <i class="ri-inbox-line"></i>
      <p>No hay servicios que coincidan con estos filtros.</p>
    </div>

    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Tipo</th>
            <th>Precio</th>
            <th>Materiales</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in serviciosPagina" :key="s.id_servicio" :class="{ 'prod-fila-inactivo': !s.activo }">
            <td>
              <div class="admin-prod-cell">
                <img :src="s.imagen_url" :alt="s.nombre_servicio" class="admin-prod-thumb" />
                <div class="admin-prod-info">
                  <strong :title="s.nombre_servicio">{{ s.nombre_servicio }}</strong>
                  <span>Cód: {{ s.codigo_servicio }}</span>
                </div>
              </div>
            </td>
            <td>{{ nombreTipo(s.tipo_servicio) }}</td>
            <td>{{ precioServicio(s) }}</td>
            <td>{{ s.incluye_materiales ? 'Sí' : 'No' }}</td>
            <td><span class="badge" :class="s.activo ? 'badge-green' : 'badge-gray'">{{ s.activo ? 'Activo' : 'Inactivo' }}</span></td>
            <td>
              <div class="admin-actions-cell">
                <button type="button" class="admin-action-btn" title="Editar" @click="abrirEditar(s)"><i class="ri-edit-line"></i></button>
                <button type="button" class="admin-action-btn danger" title="Eliminar" @click="servicioAEliminar = s"><i class="ri-delete-bin-line"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPaginas > 1" class="admin-pagination">
      <button type="button" class="admin-page-btn" :disabled="paginaActual === 1" @click="irAPagina(paginaActual - 1)"><i class="ri-arrow-left-s-line"></i></button>
      <button
        v-for="n in totalPaginas"
        :key="n"
        type="button"
        class="admin-page-btn"
        :class="{ active: n === paginaActual }"
        @click="irAPagina(n)"
      >{{ n }}</button>
      <button type="button" class="admin-page-btn" :disabled="paginaActual === totalPaginas" @click="irAPagina(paginaActual + 1)"><i class="ri-arrow-right-s-line"></i></button>
    </div>
  </div>

  <ServicioFormModal
    :mostrar="mostrarForm"
    :servicio="servicioEditando"
    @cerrar="mostrarForm = false"
    @guardado="onGuardado"
  />

  <Transition name="confirm-modal-fade">
    <div v-if="servicioAEliminar" class="confirm-modal-overlay" @click.self="servicioAEliminar = null">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="servicioAEliminar = null"><i class="ri-close-line"></i></button>
          <div class="confirm-modal-icon" style="background:rgba(192,57,43,0.1);color:var(--primary);"><i class="ri-delete-bin-line"></i></div>
          <h3 class="confirm-modal-title">¿Eliminar este servicio?</h3>
          <p class="confirm-modal-text">
            Vas a eliminar <strong>{{ servicioAEliminar?.nombre_servicio }}</strong> del catálogo. Esta acción no se puede deshacer.
          </p>
          <div class="confirm-modal-actions">
            <button class="btn btn-primary btn-lg btn-block" style="background:var(--danger);" @click="eliminarServicio">
              <i class="ri-delete-bin-line"></i> Sí, eliminar
            </button>
            <button class="btn btn-outline-red btn-block" @click="servicioAEliminar = null">Cancelar</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.prod-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 22px; }
.prod-stat {
  display: block; width: 100%; text-align: left; background: white; border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 20px 22px; cursor: pointer; transition: var(--transition); font-family: inherit;
}
.prod-stat:hover { border-color: var(--primary); box-shadow: var(--shadow); }
.prod-stat.active { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(192,57,43,0.1); }
.prod-stat-label {
  display: flex; align-items: center; gap: 7px; font-family: var(--font-main); font-weight: 700;
  font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 12px;
}
.prod-stat-label i { font-size: 0.95rem; color: var(--text-light); }
.prod-stat-value-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.prod-stat-value { font-family: var(--font-main); font-weight: 800; font-size: 1.55rem; color: var(--secondary); }
.prod-stat-note { font-size: 0.78rem; color: var(--text-muted); }
.prod-stat-note.ok { color: var(--success); font-weight: 600; }

.admin-table tbody tr.prod-fila-inactivo td:first-child { border-left: 3px solid var(--border); padding-left: 13px; }

@media (max-width: 1100px) {
  .prod-stats-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .prod-stats-grid { grid-template-columns: 1fr; }
}
</style>
