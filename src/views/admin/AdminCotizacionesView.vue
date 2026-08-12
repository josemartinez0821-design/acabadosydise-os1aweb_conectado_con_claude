<script setup>
// Gestión de cotizaciones para el admin -> tablas `cotizaciones`, `cotizacion_productos`, `cotizacion_servicios`.
// Antes esta vista llamaba a un endpoint que no existe (api.get('/admin/cotizaciones')) y por eso
// nunca mostraba nada: el cliente y el admin leían de fuentes distintas. Ahora usa el mismo store
// reactivo que ya usa `CotizacionesView.vue`, así que una solicitud nueva aparece aquí al instante.
import { ref, computed } from 'vue'
import { useCatalogStore } from '../../stores/catalog'
import { useCotizacionesStore } from '../../stores/cotizaciones'
import { useToast } from '../../composables/useToast'
import { formatCOP, formatDate, extraerFechaDeseada, extraerNotaCliente } from '../../composables/useFormat'
import { MockData } from '../../data/mockData'

const catalog = useCatalogStore()
const cotizStore = useCotizacionesStore()
const { showToast } = useToast()

const busqueda = ref('')
const filtroEstado = ref('')

function nombreCliente(id_usuario) {
  const u = MockData.usuarios.find((x) => x.id_usuario === id_usuario)
  return u ? `${u.nombre} ${u.apellido}` : 'Cliente'
}
function emailCliente(id_usuario) {
  return MockData.usuarios.find((x) => x.id_usuario === id_usuario)?.email || ''
}
function ciudadCliente(id_usuario) {
  const u = MockData.usuarios.find((x) => x.id_usuario === id_usuario)
  return u?.ciudad ? `${u.ciudad}, ${u.departamento}` : 'Sin registrar'
}

const listaOrdenada = computed(() =>
  [...cotizStore.cotizaciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
)

const listaFiltrada = computed(() => {
  const termino = busqueda.value.toLowerCase()
  return listaOrdenada.value.filter((c) => {
    const coincideTermino =
      !termino ||
      c.numero_cotizacion.toLowerCase().includes(termino) ||
      nombreCliente(c.id_usuario).toLowerCase().includes(termino)
    const coincideEstado = !filtroEstado.value || c.estado === filtroEstado.value
    return coincideTermino && coincideEstado
  })
})

const conteoPorEstado = computed(() => {
  const conteo = {}
  Object.keys(cotizStore.ESTADOS).forEach((k) => (conteo[k] = 0))
  cotizStore.cotizaciones.forEach((c) => conteo[c.estado] !== undefined && conteo[c.estado]++)
  return conteo
})

const cotizacionExpandida = ref(null)
function toggleDetalle(id) {
  cotizacionExpandida.value = cotizacionExpandida.value === id ? null : id
  accionAbierta.value = null
}
function itemsDe(id_cotizacion) {
  return cotizStore.getItemsCotizacion(id_cotizacion)
}
function nombreProducto(id_producto) {
  return catalog.getProductById(id_producto)?.nombre || 'Producto'
}
function nombreServicio(id_servicio) {
  return catalog.getServiceById(id_servicio)?.nombre_servicio || 'Servicio'
}

// ── Acciones: aprobar / poner en revisión / rechazar ────────────────────────
const accionAbierta = ref(null) // { id_cotizacion, tipo: 'aprobar' | 'rechazar' }
const totalAjustado = ref(0)
const notaRespuesta = ref('')

function abrirAccion(cot, tipo) {
  accionAbierta.value = { id_cotizacion: cot.id_cotizacion, tipo }
  totalAjustado.value = cot.total_estimado
  notaRespuesta.value = ''
}
function cerrarAccion() {
  accionAbierta.value = null
}

function confirmarAprobar(cot) {
  cotizStore.actualizarEstado(cot.id_cotizacion, 'aprobada', notaRespuesta.value.trim() || null)
  cot.total_estimado = Number(totalAjustado.value) || cot.total_estimado
  showToast(`Cotización ${cot.numero_cotizacion} aprobada.`, 'success')
  cerrarAccion()
}
function confirmarRechazar(cot) {
  if (!notaRespuesta.value.trim()) {
    showToast('Escribe el motivo del rechazo para que el cliente lo vea.', 'danger')
    return
  }
  cotizStore.actualizarEstado(cot.id_cotizacion, 'rechazada', notaRespuesta.value.trim())
  showToast(`Cotización ${cot.numero_cotizacion} rechazada.`, 'info')
  cerrarAccion()
}
function marcarEnRevision(cot) {
  cotizStore.actualizarEstado(cot.id_cotizacion, 'en_revision')
  showToast(`Cotización ${cot.numero_cotizacion} marcada en revisión.`, 'info')
}
</script>

<template>
  <section class="page-header">
    <div class="container">
      <div class="breadcrumb">
        <span class="breadcrumb-item"><RouterLink to="/admin/dashboard"><i class="ri-dashboard-line"></i> Panel Admin</RouterLink></span>
        <span class="breadcrumb-sep"><i class="ri-arrow-right-s-line"></i></span>
        <span class="breadcrumb-item active">Cotizaciones</span>
      </div>
      <h1 class="page-header-title">Gestión de Cotizaciones</h1>
      <p class="page-header-sub">Revisa lo que piden los clientes, su fecha deseada y decide el estado de cada solicitud.</p>
    </div>
  </section>

  <section class="section" style="padding-top:32px;">
    <div class="container">
      <div class="admin-cotiz-stats">
        <div v-for="(v, k) in cotizStore.ESTADOS" :key="k" class="admin-cotiz-stat">
          <div class="admin-cotiz-stat-value">{{ conteoPorEstado[k] || 0 }}</div>
          <div class="admin-cotiz-stat-label"><i :class="v.icon"></i> {{ v.label }}</div>
        </div>
      </div>

      <div class="services-toolbar">
        <div class="search-input-wrap">
          <i class="ri-search-line search-input-icon"></i>
          <input v-model="busqueda" type="search" class="form-control" placeholder="Buscar por número o cliente..." style="padding-left:38px;" />
        </div>
        <select v-model="filtroEstado">
          <option value="">Todos los estados</option>
          <option v-for="(v, k) in cotizStore.ESTADOS" :key="k" :value="k">{{ v.label }}</option>
        </select>
      </div>

      <p v-if="!listaFiltrada.length" class="text-muted text-center" style="padding:60px 0;">No hay cotizaciones que coincidan.</p>

      <div v-for="cot in listaFiltrada" :key="cot.id_cotizacion" class="cotiz-card">
        <div class="cotiz-card-header">
          <div>
            <div class="cotiz-card-numero">{{ cot.numero_cotizacion }}</div>
            <div class="cotiz-card-fecha">{{ formatDate(cot.fecha) }} &middot; {{ nombreCliente(cot.id_usuario) }} &middot; {{ emailCliente(cot.id_usuario) }}</div>
          </div>
          <span v-if="cotizStore.estaVencida(cot)" class="badge badge-gray"><i class="ri-time-line"></i> Vencida</span>
          <span v-else class="badge" :class="cotizStore.ESTADOS[cot.estado].badge">
            <i :class="cotizStore.ESTADOS[cot.estado].icon"></i> {{ cotizStore.ESTADOS[cot.estado].label }}
          </span>
        </div>

        <div class="cotiz-card-meta">
          <div class="cotiz-card-meta-item"><span>Total estimado</span><strong>{{ formatCOP(cot.total_estimado) }}</strong></div>
          <div class="cotiz-card-meta-item"><span>Ciudad del cliente</span><strong>{{ ciudadCliente(cot.id_usuario) }}</strong></div>
          <div class="cotiz-card-meta-item"><span>Validez</span><strong>{{ cot.validez_dias }} días</strong></div>
        </div>

        <div v-if="extraerFechaDeseada(cot.observaciones)" class="cotiz-fecha-deseada-chip">
          <i class="ri-calendar-event-line"></i> Fecha deseada del servicio: <strong>{{ extraerFechaDeseada(cot.observaciones) }}</strong>
        </div>
        <p v-if="extraerNotaCliente(cot.observaciones)" class="cotiz-card-obs"><strong>Nota del cliente:</strong> {{ extraerNotaCliente(cot.observaciones) }}</p>
        <p v-if="cot.respuesta" class="cotiz-card-obs"><strong>Tu respuesta:</strong> {{ cot.respuesta }}</p>

        <template v-if="cotizacionExpandida === cot.id_cotizacion">
          <div style="margin: 4px 0 14px;">
            <div v-for="p in itemsDe(cot.id_cotizacion).productos" :key="'p' + p.id_detalle" class="cotiz-detail-item">
              <span>{{ nombreProducto(p.id_producto) }}<span class="cotiz-detail-item-meta">x{{ p.cantidad }}</span></span>
              <span>{{ formatCOP(p.subtotal) }}</span>
            </div>
            <div v-for="s in itemsDe(cot.id_cotizacion).servicios" :key="'s' + s.id_detalle" class="cotiz-detail-item">
              <span>{{ nombreServicio(s.id_servicio) }}</span>
              <span>{{ formatCOP(s.subtotal) }}</span>
            </div>
            <div class="cotiz-detail-total"><span>Total</span><span>{{ formatCOP(cot.total_estimado) }}</span></div>
          </div>
        </template>

        <!-- Panel de acción: aprobar o rechazar -->
        <div v-if="accionAbierta?.id_cotizacion === cot.id_cotizacion" class="admin-cotiz-accion">
          <template v-if="accionAbierta.tipo === 'aprobar'">
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Total final a aprobar</label>
              <input v-model.number="totalAjustado" type="number" min="0" class="form-control" />
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Nota para el cliente (opcional)</label>
              <textarea v-model="notaRespuesta" class="form-control" rows="2" placeholder="Ej: Confirmamos la fecha e incluye materiales."></textarea>
            </div>
            <div style="display:flex;gap:10px;">
              <button class="btn btn-outline-red btn-sm" @click="cerrarAccion">Cancelar</button>
              <button class="btn btn-primary btn-sm" @click="confirmarAprobar(cot)"><i class="ri-checkbox-circle-line"></i> Confirmar aprobación</button>
            </div>
          </template>
          <template v-else>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label required">Motivo del rechazo</label>
              <textarea v-model="notaRespuesta" class="form-control" rows="2" placeholder="Cuéntale al cliente por qué, y si aplica, cuándo podría reprogramar."></textarea>
            </div>
            <div style="display:flex;gap:10px;">
              <button class="btn btn-outline-red btn-sm" @click="cerrarAccion">Cancelar</button>
              <button class="btn btn-sm" style="background:var(--danger);color:white;" @click="confirmarRechazar(cot)"><i class="ri-close-circle-line"></i> Confirmar rechazo</button>
            </div>
          </template>
        </div>

        <div class="cotiz-card-footer">
          <template v-if="cot.estado === 'pendiente' || cot.estado === 'en_revision'">
            <button v-if="cot.estado === 'pendiente'" class="btn btn-sm" style="background:rgba(41,128,185,0.08);color:var(--info);" @click="marcarEnRevision(cot)">
              <i class="ri-search-eye-line"></i> Poner en revisión
            </button>
            <button class="btn btn-sm" style="background:var(--danger);color:white;" @click="abrirAccion(cot, 'rechazar')">
              <i class="ri-close-circle-line"></i> Rechazar
            </button>
            <button class="btn btn-primary btn-sm" @click="abrirAccion(cot, 'aprobar')">
              <i class="ri-checkbox-circle-line"></i> Aprobar
            </button>
          </template>
          <button class="btn btn-outline-red btn-sm" @click="toggleDetalle(cot.id_cotizacion)">
            {{ cotizacionExpandida === cot.id_cotizacion ? 'Ocultar detalle' : 'Ver detalle' }}
            <i :class="cotizacionExpandida === cot.id_cotizacion ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.admin-cotiz-stats { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 24px; }
.admin-cotiz-stat {
  flex: 1; min-width: 120px; background: white; border: 1px solid var(--border); border-radius: var(--radius);
  padding: 14px 16px; text-align: center;
}
.admin-cotiz-stat-value { font-family: var(--font-main); font-weight: 800; font-size: 1.4rem; color: var(--secondary); }
.admin-cotiz-stat-label { font-size: 0.72rem; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 2px; }

.admin-cotiz-accion { background: var(--off-white); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 14px; }

@media (max-width: 768px) {
  .admin-cotiz-stats { gap: 8px; }
  .admin-cotiz-stat { min-width: 45%; }
}
</style>
