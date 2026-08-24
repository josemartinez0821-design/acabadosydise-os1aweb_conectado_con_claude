<script setup>
// RF16/RF17 - CRUD de productos y estado de inventario -> tablas `productos` + `inventario`.
// catalog.crearProducto/actualizarProducto/eliminarProducto ya llaman al backend real (POST/PUT/
// DELETE /api/productos); "eliminar" es soft-delete (activo=false), por eso sigue apareciendo
// aquí como Inactivo en vez de desaparecer. La composición por categoría y "necesitan
// reabastecimiento" se calculan del catálogo/inventario reales.
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalogStore } from '../../stores/catalog'
import { useToast } from '../../composables/useToast'
import { formatCOP } from '../../composables/useFormat'
import ProductoFormModal from '../../components/admin/ProductoFormModal.vue'

const catalog = useCatalogStore()
const { showToast } = useToast()
const route = useRoute()
const router = useRouter()

// ── Filtros y búsqueda ───────────────────────────────────────
const busqueda = ref('')
const filtroCategoria = ref('')
const filtroEstado = ref('')
const filtroMarca = ref('')
const paginaActual = ref(1)
const POR_PAGINA = 8

const marcasDisponibles = computed(() => {
  const set = new Set(catalog.productos.map((p) => p.marca).filter(Boolean))
  return [...set].sort()
})

// "Inactivo" se revisa primero: un producto que el admin desactivó a propósito no necesita
// "reabastecerse" aunque tenga poco stock — antes el chequeo de stock iba primero y un producto
// inactivo con poco stock se veía como "Stock Bajo", así que el filtro "Inactivo" nunca lo
// encontraba y las estadísticas de stock bajo/agotado contaban productos que ni siquiera están
// a la venta.
function estadoProducto(producto) {
  if (!producto.activo) return { value: 'inactivo', label: 'Inactivo', badge: 'badge-gray' }
  const stock = catalog.getProductStock(producto.id_producto)
  const inv = catalog.inventario.find((i) => i.id_producto === producto.id_producto)
  if (stock === 0) return { value: 'agotado', label: 'Agotado', badge: 'badge-red' }
  if (inv && stock <= inv.stock_minimo) return { value: 'stock_bajo', label: 'Stock Bajo', badge: 'badge-yellow' }
  return { value: 'activo', label: 'Activo', badge: 'badge-green' }
}

const productosFiltrados = computed(() => {
  const term = busqueda.value.trim().toLowerCase()
  return catalog.productos
    .filter((p) => {
      const coincideTerm = !term || p.nombre.toLowerCase().includes(term) || p.codigo_producto.toLowerCase().includes(term) || (p.marca || '').toLowerCase().includes(term)
      const coincideCat = !filtroCategoria.value || p.id_categoria === Number(filtroCategoria.value)
      const coincideMarca = !filtroMarca.value || p.marca === filtroMarca.value
      // "reabastecer" es un valor especial (no un estado real) que agrupa agotado + stock_bajo —
      // lo usa el botón "Ver productos" del panel de Reabastecimiento, ver verReabastecimiento().
      const coincideEstado =
        !filtroEstado.value ||
        (filtroEstado.value === 'reabastecer'
          ? ['agotado', 'stock_bajo'].includes(estadoProducto(p).value)
          : estadoProducto(p).value === filtroEstado.value)
      return coincideTerm && coincideCat && coincideMarca && coincideEstado
    })
    .sort((a, b) => b.id_producto - a.id_producto)
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(productosFiltrados.value.length / POR_PAGINA)))
const productosPagina = computed(() => {
  const inicio = (paginaActual.value - 1) * POR_PAGINA
  return productosFiltrados.value.slice(inicio, inicio + POR_PAGINA)
})
watch([busqueda, filtroCategoria, filtroEstado, filtroMarca], () => { paginaActual.value = 1 })
// Si se elimina un producto y eso hace que la página actual deje de existir (ej. estabas en la
// última página con un solo producto y lo borraste), vuelve a una página válida en vez de quedar
// mostrando "sin resultados" con la tabla realmente vacía solo por la paginación.
watch(totalPaginas, (nuevo) => { if (paginaActual.value > nuevo) paginaActual.value = nuevo })

function limpiarFiltros() {
  busqueda.value = ''
  filtroCategoria.value = ''
  filtroEstado.value = ''
  filtroMarca.value = ''
}

// Tarjetas de arriba también filtran, no solo informan — igual que ya hacen las de PQRS/Dashboard.
function toggleFiltroEstado(valor) {
  filtroEstado.value = filtroEstado.value === valor ? '' : valor
}
function filtrarPorCategoria(id_categoria) {
  filtroCategoria.value = filtroCategoria.value === id_categoria ? '' : id_categoria
}

function irAPagina(n) {
  paginaActual.value = Math.min(Math.max(1, n), totalPaginas.value)
}

// ── Estadísticas (reales, no inventadas) ────────────────────
// "Stock Bajo" ya no es su propia tarjeta arriba — se sentía redundante con el panel de
// "Necesitan reabastecimiento" de abajo, que además junta agotados+stock bajo de forma más
// completa (lista real, no solo un número). "Agotados" sí se queda: es un dato de severidad
// distinto que vale la pena ver de un vistazo sin bajar a leer la lista.
const totalProductos = computed(() => catalog.productos.length)
const totalActivos = computed(() => catalog.productos.filter((p) => p.activo).length)
const pctActivos = computed(() => (totalProductos.value ? Math.round((totalActivos.value / totalProductos.value) * 100) : 0))
const totalAgotados = computed(() => catalog.productos.filter((p) => estadoProducto(p).value === 'agotado').length)

// ── Catálogo por categoría (composición real: cuántos productos y unidades hay en cada una,
// no cuánto se ha vendido — eso ya lo muestra el Dashboard con "Productos más vendidos") ──
const categoriasResumen = computed(() => {
  const max = Math.max(...catalog.categorias.map((c) => getCategoryProductos(c.id_categoria).length), 1)
  return catalog.categorias
    .map((c) => {
      const productosCategoria = getCategoryProductos(c.id_categoria)
      return {
        id_categoria: c.id_categoria,
        nombre: c.nombre,
        totalProductos: productosCategoria.length,
        unidadesStock: productosCategoria.reduce((s, p) => s + catalog.getProductStock(p.id_producto), 0),
        pct: Math.round((productosCategoria.length / max) * 100),
      }
    })
    .sort((a, b) => b.totalProductos - a.totalProductos)
})
function getCategoryProductos(id_categoria) {
  return catalog.productos.filter((p) => p.id_categoria === id_categoria)
}

// ── Necesitan reabastecimiento (real, no un % inventado) — agotados primero, son más urgentes.
// `pctStock` es qué tan cerca está de su propio mínimo (no un % inventado tampoco), para la
// barrita de cada fila — 100% = justo en el mínimo, 0% = agotado.
const productosNecesitanReabastecer = computed(() =>
  catalog.productos.filter((p) => ['agotado', 'stock_bajo'].includes(estadoProducto(p).value))
)
const totalReabastecer = computed(() => productosNecesitanReabastecer.value.length)
const productosReabastecer = computed(() => {
  return productosNecesitanReabastecer.value
    .map((p) => {
      const inv = catalog.inventario.find((i) => i.id_producto === p.id_producto)
      const stock = catalog.getProductStock(p.id_producto)
      return { ...p, estado: estadoProducto(p), stock, pctStock: inv?.stock_minimo ? Math.min(100, Math.round((stock / inv.stock_minimo) * 100)) : 0 }
    })
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
})

function verReabastecimiento() {
  limpiarFiltros()
  filtroEstado.value = 'reabastecer'
}

// ── CRUD ─────────────────────────────────────────────────────
const mostrarForm = ref(false)
const productoEditando = ref(null)
function abrirCrear() {
  productoEditando.value = null
  mostrarForm.value = true
}
function abrirEditar(p) {
  productoEditando.value = p
  mostrarForm.value = true
}
function onGuardado({ esNuevo }) {
  showToast(esNuevo ? '¡Producto creado correctamente!' : '¡Producto actualizado correctamente!', 'success')
}

const productoAEliminar = ref(null)
async function eliminarProducto() {
  const producto = productoAEliminar.value
  try {
    await catalog.eliminarProducto(producto.id_producto)
    showToast('Producto eliminado del catálogo.', 'success')
  } catch (e) {
    showToast(e.response?.data?.mensaje || 'No se pudo eliminar el producto. Intenta de nuevo.', 'danger')
  }
  productoAEliminar.value = null
}

// Desde el Dashboard, "Nuevo Producto" enlaza aquí con ?nuevo=true para abrir el formulario directo,
// y "Stock bajo" con ?estado=stock_bajo para llegar ya filtrado a esos productos.
onMounted(() => {
  if (route.query.nuevo === 'true') {
    abrirCrear()
    router.replace({ path: '/admin/productos' })
  } else if (route.query.estado) {
    filtroEstado.value = route.query.estado
    router.replace({ path: '/admin/productos' })
  }
})
</script>

<template>
  <div class="admin-page-header">
    <div>
      <h1>Gestión de Productos</h1>
      <p>Administra el catálogo completo de materiales, acabados y herramientas de construcción.</p>
    </div>
    <button type="button" class="btn btn-primary" @click="abrirCrear">
      <i class="ri-add-line"></i> Nuevo Producto
    </button>
  </div>

  <!-- ESTADÍSTICAS — también filtran, no solo informan -->
  <div class="prod-stats-grid">
    <button type="button" class="prod-stat" :class="{ active: !filtroEstado }" @click="filtroEstado = ''">
      <div class="prod-stat-label"><i class="ri-archive-2-line"></i> Total productos</div>
      <strong class="prod-stat-value">{{ totalProductos }}</strong>
    </button>
    <button type="button" class="prod-stat" :class="{ active: filtroEstado === 'activo' }" @click="toggleFiltroEstado('activo')">
      <div class="prod-stat-label"><i class="ri-checkbox-circle-line"></i> Activos</div>
      <div class="prod-stat-value-row">
        <strong class="prod-stat-value">{{ totalActivos }}</strong>
        <span class="prod-stat-note ok">{{ pctActivos }}% del catálogo</span>
      </div>
    </button>
    <button type="button" class="prod-stat" :class="{ active: filtroEstado === 'agotado' }" @click="toggleFiltroEstado('agotado')">
      <div class="prod-stat-label"><i class="ri-close-circle-line"></i> Agotados</div>
      <div class="prod-stat-value-row">
        <strong class="prod-stat-value" :class="{ alerta: totalAgotados }">{{ totalAgotados }}</strong>
        <span v-if="totalAgotados" class="prod-stat-note critico">crítico</span>
      </div>
    </button>
  </div>

  <!-- FILTROS -->
  <div class="admin-filters-bar">
    <div class="search-input-wrap">
      <input v-model="busqueda" type="search" class="form-control" placeholder="Buscar por nombre, código o marca..." />
    </div>
    <select v-model="filtroCategoria">
      <option value="">Categoría</option>
      <option v-for="c in catalog.categorias" :key="c.id_categoria" :value="c.id_categoria">{{ c.nombre }}</option>
    </select>
    <select v-model="filtroEstado">
      <option value="">Estado</option>
      <option value="activo">Activo</option>
      <option value="inactivo">Inactivo</option>
      <option value="stock_bajo">Stock Bajo</option>
      <option value="agotado">Agotado</option>
      <option value="reabastecer">Necesita reabastecimiento</option>
    </select>
    <select v-model="filtroMarca">
      <option value="">Marca</option>
      <option v-for="m in marcasDisponibles" :key="m" :value="m">{{ m }}</option>
    </select>
    <button type="button" class="btn btn-outline-red btn-sm" @click="limpiarFiltros">
      <i class="ri-filter-off-line"></i> Limpiar filtros
    </button>
  </div>

  <!-- TABLA -->
  <div class="admin-card">
    <div class="admin-card-header">
      <h2>Lista de productos</h2>
      <span>{{ productosFiltrados.length }} registros encontrados</span>
    </div>

    <div v-if="!productosPagina.length" class="admin-empty">
      <i class="ri-inbox-line"></i>
      <p>No hay productos que coincidan con estos filtros.</p>
    </div>

    <div v-else class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in productosPagina" :key="p.id_producto" :class="`prod-fila-${estadoProducto(p).value}`">
            <td>
              <div class="admin-prod-cell">
                <img :src="p.imagen_url" :alt="p.nombre" class="admin-prod-thumb" />
                <div class="admin-prod-info">
                  <strong :title="p.nombre">{{ p.nombre }}</strong>
                  <span>Cód: {{ p.codigo_producto }}</span>
                </div>
              </div>
            </td>
            <td>{{ catalog.getCategoryName(p.id_categoria) }}</td>
            <td>{{ p.marca || '—' }}</td>
            <td>{{ formatCOP(p.precio_venta) }}</td>
            <td>{{ catalog.getProductStock(p.id_producto) }} und</td>
            <td><span class="badge" :class="estadoProducto(p).badge">{{ estadoProducto(p).label }}</span></td>
            <td>
              <div class="admin-actions-cell">
                <button type="button" class="admin-action-btn" title="Editar" @click="abrirEditar(p)"><i class="ri-edit-line"></i></button>
                <button type="button" class="admin-action-btn danger" title="Eliminar" @click="productoAEliminar = p"><i class="ri-delete-bin-line"></i></button>
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

  <!-- CATÁLOGO POR CATEGORÍA + REABASTECIMIENTO -->
  <div class="admin-bottom-grid">
    <div class="admin-card">
      <div class="admin-card-header"><h2>Catálogo por categoría</h2></div>
      <div class="admin-bar-list">
        <button
          v-for="c in categoriasResumen"
          :key="c.id_categoria"
          type="button"
          class="prod-cat-row"
          :class="{ active: filtroCategoria === c.id_categoria }"
          @click="filtrarPorCategoria(c.id_categoria)"
        >
          <div class="admin-bar-row-top">
            <strong>{{ c.nombre }}</strong>
            <span>{{ c.totalProductos }} producto{{ c.totalProductos === 1 ? '' : 's' }} · {{ c.unidadesStock }} und.</span>
          </div>
          <div class="admin-bar-track"><div class="admin-bar-fill" :style="{ width: c.pct + '%' }"></div></div>
        </button>
      </div>
    </div>

    <div class="admin-card">
      <div class="admin-restock-card">
        <div class="admin-restock-header">
          <h3><i class="ri-alarm-warning-line"></i> Necesitan reabastecimiento</h3>
          <span v-if="totalReabastecer" class="admin-restock-count">{{ totalReabastecer }}</span>
        </div>
        <p>Productos con stock bajo o agotados que requieren atención pronto.</p>
        <div v-if="!productosReabastecer.length" class="admin-restock-empty">
          <i class="ri-checkbox-circle-line"></i> Todo el inventario está en buen nivel.
        </div>
        <div v-else class="admin-restock-list">
          <div v-for="p in productosReabastecer" :key="p.id_producto" class="admin-restock-item" :class="p.estado.value">
            <div class="admin-restock-row-top">
              <span class="admin-restock-dot"></span>
              <strong :title="p.nombre">{{ p.nombre }}</strong>
              <span class="admin-restock-qty">{{ p.stock }} und</span>
            </div>
            <div class="admin-restock-meta">
              <small>{{ catalog.getCategoryName(p.id_categoria) }}</small>
              <div class="admin-restock-bar-track"><div class="admin-restock-bar-fill" :style="{ width: p.pctStock + '%' }"></div></div>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-block admin-restock-cta" @click="verReabastecimiento">
          Ver todos los productos <i class="ri-arrow-right-line"></i>
        </button>
      </div>
    </div>
  </div>

  <ProductoFormModal
    :mostrar="mostrarForm"
    :producto="productoEditando"
    @cerrar="mostrarForm = false"
    @guardado="onGuardado"
  />

  <!-- CONFIRMAR ELIMINAR -->
  <Transition name="confirm-modal-fade">
    <div v-if="productoAEliminar" class="confirm-modal-overlay" @click.self="productoAEliminar = null">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="productoAEliminar = null"><i class="ri-close-line"></i></button>
          <div class="confirm-modal-icon" style="background:rgba(192,57,43,0.1);color:var(--primary);"><i class="ri-delete-bin-line"></i></div>
          <h3 class="confirm-modal-title">¿Eliminar este producto?</h3>
          <p class="confirm-modal-text">
            Vas a eliminar <strong>{{ productoAEliminar?.nombre }}</strong> del catálogo. Esta acción no se puede deshacer.
          </p>
          <div class="confirm-modal-actions">
            <button class="btn btn-primary btn-lg btn-block" style="background:var(--danger);" @click="eliminarProducto">
              <i class="ri-delete-bin-line"></i> Sí, eliminar
            </button>
            <button class="btn btn-outline-red btn-block" @click="productoAEliminar = null">Cancelar</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
/* Tarjetas de estadística sin íconos en cajas de colores — mismo criterio que el Dashboard: la
   jerarquía la da la tipografía (etiqueta pequeña + número grande), el color solo aparece cuando
   tiene un significado real (alerta/crítico), no como decoración fija por tarjeta. */
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
.prod-stat-value.alerta { color: var(--primary); }
.prod-stat-note { font-size: 0.78rem; color: var(--text-muted); }
.prod-stat-note.ok { color: var(--success); font-weight: 600; }
.prod-stat-note.critico { color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.7rem; letter-spacing: 0.3px; }

/* Estados del producto ahora también resaltan en el borde izquierdo de la fila, no solo en el
   badge — se ve de un vistazo qué filas necesitan atención al recorrer la tabla con la mirada. */
.admin-table tbody tr.prod-fila-agotado td:first-child { border-left: 3px solid var(--primary); }
.admin-table tbody tr.prod-fila-stock_bajo td:first-child { border-left: 3px solid var(--accent); }
.admin-table tbody tr.prod-fila-inactivo td:first-child { border-left: 3px solid var(--border); }
.admin-table tbody tr.prod-fila-activo td:first-child,
.admin-table tbody tr.prod-fila-agotado td:first-child,
.admin-table tbody tr.prod-fila-stock_bajo td:first-child,
.admin-table tbody tr.prod-fila-inactivo td:first-child { padding-left: 13px; }

/* Catálogo por categoría — filas clicables (filtran la tabla de arriba), reutiliza el patrón visual
   admin-bar-list/admin-bar-track ya establecido en Ventas/Inventario. */
.prod-cat-row { display: block; width: 100%; text-align: left; background: none; border: none; border-radius: var(--radius-sm); padding: 6px 8px; margin: -6px -8px; cursor: pointer; font-family: inherit; transition: var(--transition); }
.prod-cat-row:hover { background: var(--off-white); }
.prod-cat-row.active .admin-bar-row-top strong { color: var(--primary); }
.prod-cat-row.active .admin-bar-fill { background: linear-gradient(90deg, var(--secondary) 0%, #3a3a5c 100%); }

/* Reabastecimiento: encabezado con contador real de cuántos productos necesitan atención, y cada
   fila con un punto de color por urgencia (agotado vs stock bajo) + una barra de qué tan cerca
   está del mínimo configurado — no un simple nombre+cantidad plano como antes. */
.admin-restock-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.admin-restock-header h3 { margin-bottom: 0; }
.admin-restock-count {
  display: flex; align-items: center; justify-content: center; min-width: 26px; height: 26px; padding: 0 8px;
  background: rgba(255,255,255,0.12); border-radius: 20px; font-family: var(--font-main); font-weight: 800; font-size: 0.85rem;
}
.admin-restock-empty { display: flex; align-items: center; justify-content: center; gap: 8px; }
.admin-restock-empty i { color: var(--success); font-size: 1.1rem; }

.admin-restock-item { display: flex; flex-direction: column; align-items: stretch; gap: 6px; }
.admin-restock-row-top { display: flex; align-items: center; gap: 8px; }
.admin-restock-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.admin-restock-item.agotado .admin-restock-dot { background: var(--primary); }
.admin-restock-item.stock_bajo .admin-restock-dot { background: var(--accent); }
.admin-restock-row-top strong { flex: 1; min-width: 0; font-size: 0.82rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.admin-restock-qty { color: var(--accent); font-weight: 700; flex-shrink: 0; font-size: 0.78rem; }
.admin-restock-item.agotado .admin-restock-qty { color: var(--primary-light); }
.admin-restock-meta { display: flex; align-items: center; gap: 10px; padding-left: 15px; }
.admin-restock-meta small { font-size: 0.68rem; color: rgba(255,255,255,0.45); flex-shrink: 0; }
.admin-restock-bar-track { flex: 1; height: 4px; border-radius: 3px; background: rgba(255,255,255,0.1); overflow: hidden; }
.admin-restock-bar-fill { height: 100%; border-radius: 3px; background: var(--accent); }
.admin-restock-item.agotado .admin-restock-bar-fill { background: var(--primary-light); }
.admin-restock-cta { background: white; color: var(--secondary); transition: var(--transition); }
.admin-restock-cta:hover { background: var(--off-white); transform: translateY(-1px); }

@media (max-width: 1100px) {
  .prod-stats-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .prod-stats-grid { grid-template-columns: 1fr; }
}
</style>
