<script setup>
// RF13 - historial de compras del usuario -> tablas `ventas` + `detalle_ventas`
// Solo productos: `detalle_ventas` únicamente referencia `id_producto` (no hay columna para
// servicios), así que los servicios agendados siempre viven en Cotizaciones, nunca aquí.
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCatalogStore } from '../stores/catalog'
import { useVentasStore } from '../stores/ventas'
import { formatCOP, formatDateTime } from '../composables/useFormat'

const auth = useAuthStore()
const catalog = useCatalogStore()
const ventasStore = useVentasStore()

onMounted(() => {
  ventasStore.cargarVentas()
})

// GET /api/ventas ya devuelve solo las ventas del usuario logueado (o todas si es admin, caso que
// no aplica en esta vista pública) - no hace falta filtrar por id_usuario acá.
const misPedidos = computed(() => {
  if (!auth.usuario) return []
  return ventasStore.ventas
    .map((v) => ({
      ...v,
      productos: v.items.map((d) => ({ ...d, producto: catalog.getProductById(d.id_producto) })),
    }))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
})

const totalInvertido = computed(() => misPedidos.value.reduce((sum, v) => sum + (v.total || 0), 0))
const totalProductos = computed(() =>
  misPedidos.value.reduce((sum, v) => sum + v.productos.reduce((s, item) => s + item.cantidad, 0), 0)
)
</script>

<template>
  <section class="services-hero">
    <div class="services-hero-bg">
      <img src="https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1600&q=80" alt="Historial de Mis Pedidos" />
    </div>
    <div class="container">
      <div class="breadcrumb">
        <span class="breadcrumb-item"><RouterLink to="/"><i class="ri-home-4-line"></i> Inicio</RouterLink></span>
        <span class="breadcrumb-sep"><i class="ri-arrow-right-s-line"></i></span>
        <span class="breadcrumb-item active">Historial de Mis Pedidos</span>
      </div>
      <h1 class="services-hero-title">Historial de Mis <em>Pedidos</em></h1>
      <p class="services-hero-desc">Todo lo que has comprado con nosotros, con fecha y hora exactas de cada pago.</p>
    </div>
  </section>

  <div class="container">
    <div class="services-stats-card">
      <div class="services-stat"><i class="ri-shopping-bag-3-line"></i><strong>{{ misPedidos.length }}</strong><span>Pedidos realizados</span></div>
      <div class="services-stat"><i class="ri-price-tag-3-line"></i><strong>{{ formatCOP(totalInvertido) }}</strong><span>Total invertido</span></div>
      <div class="services-stat"><i class="ri-archive-2-line"></i><strong>{{ totalProductos }}</strong><span>Productos comprados</span></div>
    </div>
  </div>

  <section class="section pedidos-section">
    <div class="container">
      <div v-if="!misPedidos.length" class="pedidos-empty">
        <i class="ri-inbox-line"></i>
        <h2 class="section-title mb-0">Todavía no tienes pedidos</h2>
        <p>Cuando compres algo en nuestro catálogo, va a aparecer aquí con todo el detalle.</p>
        <RouterLink to="/productos" class="btn btn-primary"><i class="ri-store-line"></i> Ver Catálogo</RouterLink>
      </div>

      <div v-else class="pedidos-list">
        <div v-for="p in misPedidos" :key="p.id_venta" class="pedido-grupo">
          <div class="pedido-grupo-header">
            <div class="pedido-grupo-info">
              <span class="pedido-grupo-numero">{{ p.numero_venta }}</span>
              <span class="pedido-grupo-fecha"><i class="ri-time-line"></i> {{ formatDateTime(p.fecha) }}</span>
            </div>
            <strong class="pedido-grupo-total">{{ formatCOP(p.total) }}</strong>
          </div>

          <div class="pedido-productos-grid">
            <RouterLink
              v-for="item in p.productos"
              :key="item.id_detalle"
              :to="item.producto ? `/productos/${item.producto.id_producto}` : '/productos'"
              class="pedido-producto-card"
            >
              <div class="pedido-producto-img">
                <img :src="item.producto?.imagen_url" :alt="item.producto?.nombre || 'Producto'" />
              </div>
              <div class="pedido-producto-info">
                <span class="pedido-producto-nombre">{{ item.producto?.nombre || 'Producto ya no disponible' }}</span>
                <span class="pedido-producto-cantidad">Cantidad: {{ item.cantidad }}</span>
              </div>
              <div class="pedido-producto-precio">
                <strong>{{ formatCOP(item.subtotal) }}</strong>
                <i class="ri-arrow-right-s-line"></i>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pedidos-section { padding-top: 40px; }

.pedidos-empty { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.pedidos-empty i { font-size: 3rem; display: block; margin-bottom: 16px; color: var(--border); }
.pedidos-empty h2 { margin-bottom: 10px; }
.pedidos-empty p { margin: 0 auto 20px; max-width: 420px; }

.pedidos-list { display: flex; flex-direction: column; gap: 24px; }

.pedido-grupo {
  background: var(--off-white); border: 1px solid var(--border); border-radius: var(--radius-lg);
  padding: 24px 24px 28px;
}

.pedido-grupo-header {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  flex-wrap: wrap; margin-bottom: 20px; padding-bottom: 18px; border-bottom: 1px dashed var(--border);
}
.pedido-grupo-info { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.pedido-grupo-numero {
  font-family: var(--font-main); font-weight: 800; font-size: 0.85rem; color: var(--primary);
  background: rgba(192,57,43,0.08); padding: 6px 14px; border-radius: 20px; letter-spacing: 0.3px;
}
.pedido-grupo-fecha { font-size: 0.8rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 5px; }
.pedido-grupo-total { font-family: var(--font-main); font-weight: 800; font-size: 1.2rem; color: var(--secondary); }

.pedido-productos-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px;
}
.pedido-producto-card {
  display: flex; align-items: center; gap: 14px; padding: 14px;
  background: white; border: 1px solid var(--border); border-radius: var(--radius-lg);
  box-shadow: 0 2px 10px rgba(26,26,46,0.04); transition: var(--transition);
}
.pedido-producto-card:hover {
  border-color: var(--primary); transform: translateY(-3px);
  box-shadow: 0 14px 28px rgba(192,57,43,0.14);
}
.pedido-producto-img { width: 64px; height: 64px; border-radius: var(--radius); overflow: hidden; flex-shrink: 0; background: var(--off-white); }
.pedido-producto-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.pedido-producto-card:hover .pedido-producto-img img { transform: scale(1.08); }
.pedido-producto-info { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.pedido-producto-nombre {
  font-family: var(--font-main); font-size: 0.9rem; font-weight: 700; color: var(--secondary);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;
}
.pedido-producto-cantidad { font-size: 0.76rem; color: var(--text-muted); }
.pedido-producto-precio { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.pedido-producto-precio strong { font-family: var(--font-main); font-size: 0.9rem; color: var(--secondary); white-space: nowrap; }
.pedido-producto-precio i { font-size: 1.2rem; color: var(--text-muted); transition: var(--transition); }
.pedido-producto-card:hover .pedido-producto-precio i { color: var(--primary); transform: translateX(3px); }

@media (max-width: 480px) {
  .pedido-productos-grid { grid-template-columns: 1fr; }
  .pedido-grupo-header { flex-direction: column; align-items: flex-start; gap: 8px; }
}
</style>
