<script setup>
// RF16/RF17 - CRUD de productos y actualización de stock -> tablas `productos` + `inventario`
import { ref, onMounted } from 'vue'
import api from '../../services/api'

const productos = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/productos')
    productos.value = Array.isArray(data) ? data : []
  } catch (e) {
    productos.value = []
  }
})
</script>

<template>
  <section class="page">
    <h1>Gestión de productos</h1>
    <button class="btn btn--primary">Crear producto</button>

    <table>
      <thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th></th></tr></thead>
      <tbody>
        <tr v-for="p in productos" :key="p.id_producto">
          <td>{{ p.codigo_producto }}</td>
          <td>{{ p.nombre }}</td>
          <td>${{ p.precio_venta?.toLocaleString('es-CO') }}</td>
          <td>{{ p.cantidad_disponible }}</td>
          <td><button>Editar</button> <button>Eliminar</button></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
