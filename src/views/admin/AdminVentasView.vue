<script setup>
// Historial de ventas con filtro avanzado (día/mes) -> tabla `ventas` + vista `vista_ventas_dia`
import { ref, onMounted } from 'vue'
import api from '../../services/api'

const ventas = ref([])
const filtro = ref({ desde: '', hasta: '' })

async function cargar() {
  try {
    const { data } = await api.get('/admin/ventas', { params: filtro.value })
    ventas.value = Array.isArray(data) ? data : []
  } catch (e) {
    ventas.value = []
  }
}

onMounted(cargar)
</script>

<template>
  <section class="page">
    <h1>Historial de ventas</h1>

    <form class="filtros" @submit.prevent="cargar">
      <label>Desde <input v-model="filtro.desde" type="date" /></label>
      <label>Hasta <input v-model="filtro.hasta" type="date" /></label>
      <button type="submit" class="btn btn--secondary">Filtrar</button>
    </form>

    <table>
      <thead><tr><th>N&deg;</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th></tr></thead>
      <tbody>
        <tr v-for="v in ventas" :key="v.id_venta">
          <td>{{ v.numero_venta }}</td>
          <td>{{ new Date(v.fecha).toLocaleDateString('es-CO') }}</td>
          <td>{{ v.nombre_cliente }}</td>
          <td>{{ v.estado }}</td>
          <td>${{ v.total?.toLocaleString('es-CO') }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
