<script setup>
// RF05 - catálogo: filtros (categoría, precio, disponibilidad), búsqueda, orden, paginación
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '../stores/catalog'
import ProductCard from '../components/product/ProductCard.vue'

const catalog = useCatalogStore()
const route = useRoute()

const busqueda = ref('')
const categoriasSeleccionadas = ref(route.query.cat ? [Number(route.query.cat)] : [])
const precioMin = ref(0)
const precioMax = ref(200000)
const orden = ref('relevancia')
const paginaActual = ref(1)
const porPagina = 18 // 6 filas x 3 tarjetas

watch(
  () => route.query.cat,
  (cat) => {
    categoriasSeleccionadas.value = cat ? [Number(cat)] : []
  }
)

// Al cambiar de página, sube al inicio en vez de dejar al usuario abajo en la paginación.
watch(paginaActual, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

function toggleCategoria(id) {
  const i = categoriasSeleccionadas.value.indexOf(id)
  if (i >= 0) categoriasSeleccionadas.value.splice(i, 1)
  else categoriasSeleccionadas.value.push(id)
  paginaActual.value = 1
}

function limpiarFiltros() {
  busqueda.value = ''
  categoriasSeleccionadas.value = []
  precioMin.value = 0
  precioMax.value = 200000
  paginaActual.value = 1
}

const productosFiltrados = computed(() => {
  let lista = catalog.productosCatalogo.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincideCategoria = !categoriasSeleccionadas.value.length || categoriasSeleccionadas.value.includes(p.id_categoria)
    const coincidePrecio = p.precio_venta >= precioMin.value && p.precio_venta <= precioMax.value
    return coincideBusqueda && coincideCategoria && coincidePrecio
  })

  if (orden.value === 'precio-asc') lista = [...lista].sort((a, b) => a.precio_venta - b.precio_venta)
  else if (orden.value === 'precio-desc') lista = [...lista].sort((a, b) => b.precio_venta - a.precio_venta)
  else if (orden.value === 'nombre') lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre))

  return lista
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(productosFiltrados.value.length / porPagina)))
const productosPagina = computed(() => {
  const start = (paginaActual.value - 1) * porPagina
  return productosFiltrados.value.slice(start, start + porPagina)
})

watch(productosFiltrados, () => {
  if (paginaActual.value > totalPaginas.value) paginaActual.value = 1
})
</script>

<template>
  <section class="services-hero">
    <div class="services-hero-bg">
      <img src="https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?w=1600&q=80" alt="Catálogo Acabados 1A" />
    </div>
    <div class="container">
      <div class="breadcrumb">
        <span class="breadcrumb-item"><RouterLink to="/"><i class="ri-home-4-line"></i> Inicio</RouterLink></span>
        <span class="breadcrumb-sep"><i class="ri-arrow-right-s-line"></i></span>
        <span class="breadcrumb-item active">Catálogo</span>
      </div>
      <h1 class="services-hero-title">Catálogo de <em>Productos</em></h1>
      <p class="services-hero-desc">
        Pinturas, materiales de acabado, drywall, pegantes y herramientas de las mejores marcas, listos para tu próximo proyecto.
      </p>
    </div>
  </section>

  <div class="container">
    <div class="services-stats-card">
      <div class="services-stat"><i class="ri-store-2-line"></i><strong>{{ catalog.productosCatalogo.length }}+</strong><span>Productos disponibles</span></div>
      <div class="services-stat"><i class="ri-award-line"></i><strong>3+</strong><span>Marcas reconocidas</span></div>
      <div class="services-stat"><i class="ri-refund-line"></i><strong>30 días</strong><span>De garantía</span></div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="layout-sidebar">
        <aside class="sidebar">
          <div class="sidebar-card">
            <div class="sidebar-section">
              <div class="sidebar-title"><i class="ri-search-line"></i> Buscar</div>
              <div class="search-input-wrap">
                <i class="ri-search-line search-input-icon"></i>
                <input v-model="busqueda" type="search" class="form-control" placeholder="Buscar productos..." style="padding-left:38px;" />
              </div>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-title"><i class="ri-price-tag-3-line"></i> Categorías</div>
              <label v-for="cat in catalog.categorias" :key="cat.id_categoria" class="filter-row">
                <span class="filter-row-left">
                  <input
                    type="checkbox"
                    class="filter-checkbox"
                    :value="cat.id_categoria"
                    :checked="categoriasSeleccionadas.includes(cat.id_categoria)"
                    @change="toggleCategoria(cat.id_categoria)"
                  />
                  {{ cat.nombre }}
                </span>
              </label>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-title"><i class="ri-money-dollar-circle-line"></i> Rango de precio</div>
              <div class="price-range">
                <div class="price-input-wrap">
                  <span>$</span>
                  <input v-model.number="precioMin" type="number" class="form-control" placeholder="Mín" min="0" />
                </div>
                <div class="price-input-wrap">
                  <span>$</span>
                  <input v-model.number="precioMax" type="number" class="form-control" placeholder="Máx" min="0" />
                </div>
              </div>
            </div>

            <div class="sidebar-section">
              <button class="btn btn-outline-red btn-block" @click="limpiarFiltros"><i class="ri-refresh-line"></i> Limpiar filtros</button>
            </div>
          </div>
        </aside>

        <div>
          <div class="d-flex justify-between align-center mb-24" style="flex-wrap:wrap;gap:12px;">
            <span class="text-muted">{{ productosFiltrados.length }} producto(s) encontrado(s)</span>
            <select v-model="orden" class="form-control" style="max-width:220px;">
              <option value="relevancia">Más relevantes</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </div>

          <p v-if="!productosPagina.length" class="text-center text-muted" style="padding:60px 0;">
            No se encontraron productos con esos filtros.
          </p>
          <div v-else class="products-grid">
            <ProductCard v-for="producto in productosPagina" :key="producto.id_producto" :producto="producto" />
          </div>

          <div class="pagination" v-if="totalPaginas > 1">
            <button class="page-btn" :disabled="paginaActual === 1" @click="paginaActual--"><i class="ri-arrow-left-s-line"></i></button>
            <button
              v-for="p in totalPaginas"
              :key="p"
              class="page-btn"
              :class="{ active: p === paginaActual }"
              @click="paginaActual = p"
            >{{ p }}</button>
            <button class="page-btn" :disabled="paginaActual === totalPaginas" @click="paginaActual++"><i class="ri-arrow-right-s-line"></i></button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-input-wrap { position: relative; }
.search-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 1rem; pointer-events: none; }

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 8px;
  margin: 0 -8px;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--text);
  cursor: pointer;
  transition: var(--transition);
}
.filter-row:hover { background: var(--off-white); }
.filter-row-left { display: flex; align-items: center; gap: 10px; }
.filter-checkbox { width: 17px; height: 17px; accent-color: var(--primary); cursor: pointer; flex-shrink: 0; }

.price-range { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.price-input-wrap { position: relative; display: flex; align-items: center; }
.price-input-wrap span {
  position: absolute; left: 14px; color: var(--text-muted); font-size: 0.85rem; pointer-events: none;
}
.price-input-wrap .form-control { padding-left: 26px; }
</style>
