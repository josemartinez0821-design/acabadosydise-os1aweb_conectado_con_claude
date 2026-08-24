<script setup>
// Gestión de PQRS para el admin -> tabla `pqrs`. Rediseñado sobre el mismo patrón de
// tabla+panel-lateral que ya usa el resto del panel admin (stats-grid + filters-bar + admin-table,
// ver AdminProductosView.vue), en vez del layout de tarjetas+modal de la primera versión — panel
// de detalle fijo a la derecha (no modal) para poder ver la lista y el caso activo al mismo tiempo.
import { ref, computed, watch } from 'vue'
import { usePqrsStore } from '../../stores/pqrs'
import { useToast } from '../../composables/useToast'
import { formatDateTime } from '../../composables/useFormat'

const pqrsStore = usePqrsStore()
const { showToast } = useToast()

// Cada PQRS ya trae su `usuario` anidado (viene del backend) - se arma un mapa en vez de pedir una
// lista aparte de clientes, mismo patrón que AdminVentasView.vue.
const usuarioPorId = computed(() => {
  const map = {}
  pqrsStore.pqrs.forEach((p) => { if (p.usuario) map[p.id_usuario] = p.usuario })
  return map
})
function cliente(id_usuario) {
  return usuarioPorId.value[id_usuario] || null
}
function nombreCliente(id_usuario) {
  const u = cliente(id_usuario)
  return u ? `${u.nombre} ${u.apellido}` : 'Cliente'
}
function emailCliente(id_usuario) {
  return cliente(id_usuario)?.email || ''
}
function telefonoCliente(id_usuario) {
  const u = cliente(id_usuario)
  return u?.whatsapp || u?.telefono || ''
}
function linkWhatsapp(id_usuario, p) {
  const tel = telefonoCliente(id_usuario).replace(/\D/g, '')
  if (!tel) return null
  const texto = encodeURIComponent(`Hola, te escribo sobre tu PQRS ${p.numero_pqrs} de Acabados y Diseños 1A.`)
  return `https://wa.me/57${tel}?text=${texto}`
}
function iniciales(id_usuario) {
  const u = cliente(id_usuario)
  return u ? ((u.nombre[0] || '') + (u.apellido[0] || '')).toUpperCase() : '?'
}
// Color determinístico por cliente (no aleatorio) para que el mismo cliente siempre tenga el mismo
// color de avatar en toda la lista — solo variedad visual, no tiene significado.
const PALETA_AVATAR = ['avatar-rojo', 'avatar-azul', 'avatar-verde', 'avatar-alerta', 'avatar-morado']
function colorAvatar(id_usuario) {
  return PALETA_AVATAR[id_usuario % PALETA_AVATAR.length]
}

// ── Estadísticas (informativas, no filtran al hacer clic — igual que Productos/Ventas/Inventario) ──
const totalPendientes = computed(() => pqrsStore.pqrs.filter((p) => p.estado === 'abierto').length)
const totalEnProceso = computed(() => pqrsStore.pqrs.filter((p) => p.estado === 'en_proceso').length)
const totalRespondidas = computed(() => pqrsStore.pqrs.filter((p) => ['resuelto', 'cerrado'].includes(p.estado)).length)
const totalGeneral = computed(() => pqrsStore.pqrs.length)

// ── Filtros + paginación ─────────────────────────────────────
const busqueda = ref('')
const filtroEstado = ref('')
const filtroTipo = ref('')
const filtroPrioridad = ref('')
const paginaActual = ref(1)
const POR_PAGINA = 8

function limpiarFiltros() {
  busqueda.value = ''
  filtroEstado.value = ''
  filtroTipo.value = ''
  filtroPrioridad.value = ''
}

// Las tarjetas de arriba también filtran, no solo informan — "Respondidas" es un valor especial
// (no existe como estado único en la BD) que agrupa resuelto+cerrado, ver coincideEstado abajo.
// El select "Estado" de la barra de filtros sigue funcionando aparte con los 4 estados reales.
function toggleFiltroEstado(valor) {
  filtroEstado.value = filtroEstado.value === valor ? '' : valor
}

// Orden de atención: primero lo que sigue sin responder, priorizando urgente/alta y lo más antiguo
// dentro de cada prioridad — así arriba de la tabla queda lo que de verdad necesita atención en vez
// de una lista plana por fecha. Lo ya resuelto/cerrado va al final, más reciente primero.
const RANGO_PRIORIDAD = { urgente: 0, alta: 1, media: 2, baja: 3 }
const listaFiltrada = computed(() => {
  const termino = busqueda.value.toLowerCase()
  return pqrsStore.pqrs
    .filter((p) => {
      const coincideTermino =
        !termino ||
        p.numero_pqrs.toLowerCase().includes(termino) ||
        p.asunto.toLowerCase().includes(termino) ||
        nombreCliente(p.id_usuario).toLowerCase().includes(termino)
      const coincideTipo = !filtroTipo.value || p.tipo === filtroTipo.value
      const coincideEstado =
        !filtroEstado.value ||
        (filtroEstado.value === 'respondidas' ? ['resuelto', 'cerrado'].includes(p.estado) : p.estado === filtroEstado.value)
      const coincidePrioridad = !filtroPrioridad.value || p.prioridad === filtroPrioridad.value
      return coincideTermino && coincideTipo && coincideEstado && coincidePrioridad
    })
    .sort((a, b) => {
      const aAbierta = !['resuelto', 'cerrado'].includes(a.estado)
      const bAbierta = !['resuelto', 'cerrado'].includes(b.estado)
      if (aAbierta !== bAbierta) return aAbierta ? -1 : 1
      if (aAbierta) {
        const diffPrioridad = RANGO_PRIORIDAD[a.prioridad] - RANGO_PRIORIDAD[b.prioridad]
        if (diffPrioridad !== 0) return diffPrioridad
        return new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
      }
      return new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
    })
})
watch([busqueda, filtroEstado, filtroTipo, filtroPrioridad], () => { paginaActual.value = 1 })

const totalPaginas = computed(() => Math.max(1, Math.ceil(listaFiltrada.value.length / POR_PAGINA)))
const itemsPagina = computed(() => {
  const inicio = (paginaActual.value - 1) * POR_PAGINA
  return listaFiltrada.value.slice(inicio, inicio + POR_PAGINA)
})
function irAPagina(n) {
  paginaActual.value = Math.min(Math.max(1, n), totalPaginas.value)
}

// ── Panel de detalle (fijo a la derecha, no modal) ──────────────────────────
const pqrsActiva = ref(null)
const prioridadForm = ref('media')
const estadoForm = ref('abierto')
const respuestaForm = ref('')

function seleccionar(p) {
  pqrsActiva.value = p
  prioridadForm.value = p.prioridad
  estadoForm.value = p.estado
  respuestaForm.value = p.respuesta || ''
}
function cerrarPanel() {
  pqrsActiva.value = null
}

async function guardar(estadoOverride) {
  const estadoFinal = estadoOverride || estadoForm.value
  if (estadoFinal === 'resuelto' && !respuestaForm.value.trim()) {
    showToast('Escribe una respuesta para el cliente antes de marcarla como resuelta.', 'danger')
    return
  }
  try {
    await pqrsStore.actualizarPqrs(pqrsActiva.value.id_pqrs, {
      estado: estadoFinal,
      respuesta: respuestaForm.value.trim() || null,
      prioridad: prioridadForm.value,
    })
  } catch (e) {
    showToast(e.response?.data?.mensaje || 'No se pudo actualizar la PQRS.', 'danger')
    return
  }
  estadoForm.value = estadoFinal
  showToast(`${pqrsActiva.value.numero_pqrs} actualizada.`, 'success')
}
</script>

<template>
  <div class="admin-page-header">
    <div>
      <h1>Gestión de PQRS</h1>
      <p>Peticiones, quejas, reclamos, sugerencias y garantías radicadas por los clientes.</p>
    </div>
  </div>

  <div class="admin-stats-grid">
    <button type="button" class="admin-stat-card pqrs-admin-stat-clicable" :class="{ active: filtroEstado === 'abierto' }" @click="toggleFiltroEstado('abierto')">
      <div class="admin-stat-top"><span class="admin-stat-icon icon-alerta"><i class="ri-time-line"></i></span></div>
      <strong class="admin-stat-value">{{ totalPendientes }}</strong>
      <span class="admin-stat-label">Pendientes</span>
    </button>
    <button type="button" class="admin-stat-card pqrs-admin-stat-clicable" :class="{ active: filtroEstado === 'en_proceso' }" @click="toggleFiltroEstado('en_proceso')">
      <div class="admin-stat-top"><span class="admin-stat-icon icon-azul"><i class="ri-loader-4-line"></i></span></div>
      <strong class="admin-stat-value">{{ totalEnProceso }}</strong>
      <span class="admin-stat-label">En Proceso</span>
    </button>
    <button type="button" class="admin-stat-card pqrs-admin-stat-clicable" :class="{ active: filtroEstado === 'respondidas' }" @click="toggleFiltroEstado('respondidas')">
      <div class="admin-stat-top"><span class="admin-stat-icon icon-verde"><i class="ri-checkbox-circle-line"></i></span></div>
      <strong class="admin-stat-value">{{ totalRespondidas }}</strong>
      <span class="admin-stat-label">Respondidas</span>
    </button>
    <button type="button" class="admin-stat-card pqrs-admin-stat-clicable" :class="{ active: !filtroEstado }" @click="limpiarFiltros">
      <div class="admin-stat-top"><span class="admin-stat-icon icon-morado"><i class="ri-file-list-3-line"></i></span></div>
      <strong class="admin-stat-value">{{ totalGeneral }}</strong>
      <span class="admin-stat-label">Total</span>
    </button>
  </div>

  <div class="admin-filters-bar">
    <div class="search-input-wrap">
      <input v-model="busqueda" type="search" class="form-control" placeholder="Buscar por N°, cliente o asunto..." />
    </div>
    <select v-model="filtroEstado">
      <option value="">Estado: Todas</option>
      <option v-for="(e, key) in pqrsStore.ESTADOS" :key="key" :value="key">{{ e.label }}</option>
      <option value="respondidas">Respondidas (resuelto + cerrado)</option>
    </select>
    <select v-model="filtroTipo">
      <option value="">Tipo: Todos</option>
      <option v-for="(t, key) in pqrsStore.TIPOS" :key="key" :value="key">{{ t.label }}</option>
    </select>
    <select v-model="filtroPrioridad">
      <option value="">Prioridad: Toda</option>
      <option v-for="(pr, key) in pqrsStore.PRIORIDADES" :key="key" :value="key">{{ pr.label }}</option>
    </select>
    <button type="button" class="btn btn-outline-red btn-sm" @click="limpiarFiltros">
      <i class="ri-filter-off-line"></i> Limpiar
    </button>
  </div>

  <div class="pqrs-admin-layout">
    <div>
      <div class="admin-card">
        <div class="admin-card-header">
          <h2>Solicitudes</h2>
          <span>{{ listaFiltrada.length }} registros encontrados</span>
        </div>

        <div v-if="!itemsPagina.length" class="admin-empty">
          <i class="ri-inbox-line"></i>
          <p>No hay PQRS que coincidan con estos filtros.</p>
        </div>

        <div v-else class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>N° PQRS</th>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Asunto</th>
                <th>Prioridad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="p in itemsPagina"
                :key="p.id_pqrs"
                class="pqrs-admin-row"
                :class="{ active: pqrsActiva?.id_pqrs === p.id_pqrs }"
                @click="seleccionar(p)"
              >
                <td>
                  <strong>{{ p.numero_pqrs }}</strong>
                  <div class="pqrs-admin-fecha-cell">{{ formatDateTime(p.fecha_creacion) }}</div>
                </td>
                <td>
                  <div class="pqrs-admin-cliente-cell">
                    <span class="pqrs-admin-avatar" :class="colorAvatar(p.id_usuario)">{{ iniciales(p.id_usuario) }}</span>
                    <span>{{ nombreCliente(p.id_usuario) }}</span>
                  </div>
                </td>
                <td><span class="badge" :class="pqrsStore.TIPOS[p.tipo].badge">{{ pqrsStore.TIPOS[p.tipo].label }}</span></td>
                <td class="pqrs-admin-asunto-cell" :title="p.asunto">{{ p.asunto }}</td>
                <td><span class="badge" :class="pqrsStore.PRIORIDADES[p.prioridad].badge">{{ pqrsStore.PRIORIDADES[p.prioridad].label }}</span></td>
                <td><span class="badge" :class="pqrsStore.ESTADOS[p.estado].badge">{{ pqrsStore.ESTADOS[p.estado].label }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
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

    <aside class="pqrs-admin-panel-wrap">
      <div v-if="!pqrsActiva" class="admin-card pqrs-admin-panel-empty">
        <i class="ri-file-list-3-line"></i>
        <p>Selecciona una solicitud de la lista para ver el detalle y responder.</p>
      </div>

      <div v-else class="admin-card pqrs-admin-panel" :class="`pqrs-admin-panel--${prioridadForm}`">
        <div class="pqrs-admin-panel-header">
          <div>
            <strong>{{ pqrsActiva.numero_pqrs }}</strong>
            <select v-model="prioridadForm" class="pqrs-admin-pill-select" :class="pqrsStore.PRIORIDADES[prioridadForm].badge">
              <option v-for="(pr, key) in pqrsStore.PRIORIDADES" :key="key" :value="key">{{ pr.label.toUpperCase() }} PRIORIDAD</option>
            </select>
          </div>
          <button type="button" class="pqrs-admin-panel-close" aria-label="Cerrar" @click="cerrarPanel"><i class="ri-close-line"></i></button>
        </div>
        <h3 class="pqrs-admin-panel-asunto">{{ pqrsActiva.asunto }}</h3>

        <div class="pqrs-admin-panel-cliente">
          <span class="pqrs-admin-avatar" :class="colorAvatar(pqrsActiva.id_usuario)">{{ iniciales(pqrsActiva.id_usuario) }}</span>
          <div class="pqrs-admin-panel-cliente-info">
            <strong>{{ nombreCliente(pqrsActiva.id_usuario) }}</strong>
            <span>{{ emailCliente(pqrsActiva.id_usuario) }}</span>
          </div>
        </div>
        <div class="pqrs-admin-panel-contacto-grid">
          <div><span>Teléfono</span><strong>{{ telefonoCliente(pqrsActiva.id_usuario) || 'Sin registrar' }}</strong></div>
          <div><span>Ciudad (perfil)</span><strong>{{ cliente(pqrsActiva.id_usuario)?.ciudad || 'Sin registrar' }}</strong></div>
        </div>
        <div v-if="pqrsActiva.ciudad && pqrsActiva.departamento" class="pqrs-admin-panel-contacto-grid" style="margin-top:-4px;">
          <div style="grid-column:1 / -1;"><span>Ubicación de la solicitud</span><strong><i class="ri-map-pin-line"></i> {{ pqrsActiva.ciudad }}, {{ pqrsActiva.departamento }}</strong></div>
        </div>
        <div class="pqrs-admin-panel-contacto-btns">
          <a v-if="telefonoCliente(pqrsActiva.id_usuario)" :href="`tel:${telefonoCliente(pqrsActiva.id_usuario)}`" class="pqrs-admin-contacto-btn"><i class="ri-phone-line"></i> Llamar</a>
          <a v-if="linkWhatsapp(pqrsActiva.id_usuario, pqrsActiva)" :href="linkWhatsapp(pqrsActiva.id_usuario, pqrsActiva)" target="_blank" rel="noopener" class="pqrs-admin-contacto-btn whatsapp"><i class="ri-whatsapp-line"></i> WhatsApp</a>
          <a :href="`mailto:${emailCliente(pqrsActiva.id_usuario)}`" class="pqrs-admin-contacto-btn"><i class="ri-mail-line"></i> Correo</a>
        </div>

        <div class="pqrs-admin-panel-section">
          <div class="pqrs-admin-panel-section-title"><i class="ri-file-text-line"></i> Descripción</div>
          <div class="pqrs-admin-panel-descripcion-box">
            <i class="ri-double-quotes-l pqrs-admin-panel-descripcion-quote"></i>
            <p class="pqrs-admin-panel-descripcion">{{ pqrsActiva.descripcion }}</p>
          </div>
          <div v-if="pqrsActiva.evidencia_nombre" class="pqrs-evidencia-tag"><i class="ri-attachment-2"></i> {{ pqrsActiva.evidencia_nombre }}</div>
        </div>

        <div class="pqrs-admin-panel-estado-row">
          <span class="pqrs-admin-panel-estado-label">Estado</span>
          <select v-model="estadoForm" class="pqrs-admin-pill-select pqrs-admin-pill-select-lg" :class="pqrsStore.ESTADOS[estadoForm].badge">
            <option v-for="(e, key) in pqrsStore.ESTADOS" :key="key" :value="key">{{ e.label }}</option>
          </select>
        </div>

        <div class="pqrs-admin-panel-response">
          <label class="form-label">Responder al cliente</label>
          <textarea v-model="respuestaForm" class="form-control" rows="4" placeholder="Escribe tu respuesta aquí..."></textarea>
          <div class="pqrs-admin-panel-response-actions">
            <button type="button" class="btn btn-outline-red" @click="guardar()"><i class="ri-save-line"></i> Guardar cambios</button>
            <button type="button" class="btn btn-primary" @click="guardar('resuelto')"><i class="ri-send-plane-line"></i> Enviar Respuesta</button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.icon-azul { background: rgba(41,128,185,0.1); color: var(--info); }
.icon-verde { background: rgba(39,174,96,0.1); color: var(--success); }
.icon-alerta { background: rgba(243,156,18,0.12); color: var(--warning); }
.icon-rojo { background: rgba(192,57,43,0.1); color: var(--primary); }
.icon-morado { background: rgba(108,74,133,0.12); color: #6C4A85; }

.pqrs-admin-stat-clicable {
  width: 100%; text-align: left; font-family: inherit; cursor: pointer; transition: var(--transition);
}
.pqrs-admin-stat-clicable:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.pqrs-admin-stat-clicable.active { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(192,57,43,0.12); }

.pqrs-admin-layout { display: grid; grid-template-columns: 1fr 380px; gap: 20px; align-items: start; }

.pqrs-admin-row { cursor: pointer; }
.pqrs-admin-row.active td { background: rgba(192,57,43,0.05); }
.pqrs-admin-fecha-cell { font-size: 0.74rem; color: var(--text-muted); margin-top: 2px; }
.pqrs-admin-asunto-cell { max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.pqrs-admin-cliente-cell { display: flex; align-items: center; gap: 10px; }
.pqrs-admin-avatar {
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-family: var(--font-main); font-weight: 700; font-size: 0.72rem; color: white; flex-shrink: 0;
  box-shadow: 0 0 0 2px white, 0 2px 6px rgba(0,0,0,0.12);
}
.avatar-rojo { background: var(--primary); }
.avatar-azul { background: var(--info); }
.avatar-verde { background: var(--success); }
.avatar-alerta { background: var(--warning); }
.avatar-morado { background: #6C4A85; }

.pqrs-admin-panel-wrap { position: sticky; top: 84px; }
.pqrs-admin-panel-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  padding: 50px 24px; color: var(--text-muted); min-height: 280px;
}
.pqrs-admin-panel-empty i { font-size: 2.6rem; color: var(--border); margin-bottom: 12px; }

.pqrs-admin-panel { padding: 20px; max-height: calc(100vh - 110px); overflow-y: auto; border-top: 3px solid var(--border); transition: border-color 0.2s ease; }
.pqrs-admin-panel--baja { border-top-color: var(--light); }
.pqrs-admin-panel--media { border-top-color: var(--info); }
.pqrs-admin-panel--alta { border-top-color: var(--accent); }
.pqrs-admin-panel--urgente { border-top-color: var(--primary); }
.pqrs-admin-panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
.pqrs-admin-panel-header strong { font-family: var(--font-main); font-weight: 800; font-size: 1.05rem; color: var(--secondary); display: block; margin-bottom: 6px; }
.pqrs-admin-pill-select {
  appearance: none; -webkit-appearance: none; border: none; border-radius: 20px; padding: 4px 26px 4px 12px;
  font-size: 0.68rem; font-weight: 700; font-family: var(--font-main); letter-spacing: 0.4px; text-transform: uppercase;
  cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center; background-size: 12px;
}
.pqrs-admin-pill-select-lg { padding: 7px 30px 7px 14px; font-size: 0.78rem; background-position: right 11px center; background-size: 13px; }

.pqrs-admin-panel-estado-row { display: flex; align-items: center; gap: 10px; margin: 14px 0 0; }
.pqrs-admin-panel-estado-label { font-family: var(--font-main); font-weight: 700; font-size: 0.78rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.4px; }
.pqrs-admin-panel-close { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); flex-shrink: 0; }
.pqrs-admin-panel-close:hover { background: var(--off-white); color: var(--primary); }
.pqrs-admin-panel-asunto { font-family: var(--font-main); font-weight: 700; font-size: 0.95rem; color: var(--secondary); margin-bottom: 16px; }

.pqrs-admin-panel-cliente { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.pqrs-admin-panel-cliente .pqrs-admin-avatar { width: 42px; height: 42px; font-size: 0.85rem; }
.pqrs-admin-panel-cliente-info { display: flex; flex-direction: column; min-width: 0; }
.pqrs-admin-panel-cliente-info strong { font-family: var(--font-main); font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
.pqrs-admin-panel-cliente-info span { font-size: 0.78rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.pqrs-admin-panel-contacto-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: var(--off-white); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 12px; }
.pqrs-admin-panel-contacto-grid span { display: block; font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px; }
.pqrs-admin-panel-contacto-grid strong { font-size: 0.83rem; color: var(--secondary); }

.pqrs-admin-panel-contacto-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.pqrs-admin-contacto-btn {
  display: inline-flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 600;
  background: white; border: 1px solid var(--border); border-radius: 20px; padding: 6px 12px; color: var(--secondary);
}
.pqrs-admin-contacto-btn:hover { border-color: var(--primary); color: var(--primary); }
.pqrs-admin-contacto-btn.whatsapp:hover { border-color: #25D366; color: #25D366; }

.pqrs-admin-panel-section { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 4px; }
.pqrs-admin-panel-section-title { display: flex; align-items: center; gap: 6px; font-family: var(--font-main); font-weight: 700; font-size: 0.78rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 8px; }
.pqrs-admin-panel-descripcion-box {
  position: relative; background: var(--off-white); border-left: 3px solid var(--primary);
  border-radius: var(--radius-sm); padding: 14px 16px 14px 18px; overflow: hidden;
}
.pqrs-admin-panel-descripcion-quote { position: absolute; top: 6px; right: 10px; font-size: 2.2rem; color: rgba(192,57,43,0.08); }
.pqrs-admin-panel-descripcion { position: relative; font-size: 0.88rem; color: var(--text); line-height: 1.7; white-space: pre-line; }

.pqrs-admin-panel-response { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 14px; }
.pqrs-admin-panel-response-actions { display: flex; gap: 10px; margin-top: 10px; }
.pqrs-admin-panel-response-actions .btn { flex: 1; }

@media (max-width: 992px) {
  .pqrs-admin-layout { grid-template-columns: 1fr; }
  .pqrs-admin-panel-wrap { position: static; }
}
@media (max-width: 768px) {
  .pqrs-admin-asunto-cell { max-width: 120px; }
}
</style>
