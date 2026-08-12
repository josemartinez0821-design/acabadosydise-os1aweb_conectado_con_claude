<script setup>
// RF12 - panel de administración: métricas clave, pedidos recientes, accesos a gestión de productos/inventario -> RF15-RF19
import { ref, onMounted } from 'vue'
import api from '../../services/api'

const metricas = ref(null)
const pedidosRecientes = ref([])

onMounted(async () => {
  try {
    const [resMetricas, resPedidos] = await Promise.all([
      api.get('/admin/metricas'),
      api.get('/admin/ventas?limit=10'),
    ])
    metricas.value = resMetricas.data
    pedidosRecientes.value = Array.isArray(resPedidos.data) ? resPedidos.data : []
  } catch (e) {
    pedidosRecientes.value = []
  }
})
</script>

<template>
  <section class="page">
    <h1>Panel de administración</h1>

    <div class="metricas" v-if="metricas">
      <div><strong>${{ metricas.ventasHoy?.toLocaleString('es-CO') }}</strong><span>Ventas hoy</span></div>
      <div><strong>{{ metricas.pedidosHoy }}</strong><span>Pedidos hoy</span></div>
      <div><strong>{{ metricas.productosStockBajo }}</strong><span>Stock crítico</span></div>
      <div><strong>{{ metricas.usuariosActivos }}</strong><span>Usuarios activos</span></div>
    </div>

    <nav class="accesos-rapidos">
      <RouterLink to="/admin/productos">Gestionar productos</RouterLink>
      <RouterLink to="/admin/ventas">Historial de ventas</RouterLink>
      <RouterLink to="/admin/cotizaciones">Historial de cotizaciones</RouterLink>
      <RouterLink to="/admin/reportes">Reportes</RouterLink>
    </nav>

    <h2>Pedidos recientes</h2>
    <table v-if="pedidosRecientes.length">
      <thead><tr><th>N&deg;</th><th>Cliente</th><th>Estado</th><th>Total</th></tr></thead>
      <tbody>
        <tr v-for="venta in pedidosRecientes" :key="venta.id_venta">
          <td>{{ venta.numero_venta }}</td>
          <td>{{ venta.nombre_cliente }}</td>
          <td>{{ venta.estado }}</td>
          <td>${{ venta.total?.toLocaleString('es-CO') }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
.metricas { display: flex; gap: 2rem; margin: 1.5rem 0; }
.accesos-rapidos { display: flex; gap: 1rem; margin-bottom: 2rem; }
</style>
