import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useResenasStore = defineStore('resenas', () => {
  // Ya viene del backend real (cargarResenas(), llamado desde DetalleProductoView.vue's
  // onMounted — no se precarga en App.vue porque solo esa vista la consume, mismo criterio
  // que cotizaciones/pqrs). Empieza vacío en vez de MockData.resenas_productos.
  const resenas = ref([])
  async function cargarResenas() {
    const { data } = await api.get('/resenas')
    resenas.value = data
  }

  function getResenasDeProducto(id_producto) {
    return resenas.value
      .filter((r) => r.id_producto === id_producto)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  function getPromedio(id_producto) {
    const lista = getResenasDeProducto(id_producto)
    if (!lista.length) return 0
    return lista.reduce((sum, r) => sum + r.calificacion, 0) / lista.length
  }

  function getDistribucion(id_producto) {
    const lista = getResenasDeProducto(id_producto)
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    lista.forEach((r) => { dist[r.calificacion]++ })
    return dist
  }

  function yaReseno(id_producto, id_usuario) {
    return resenas.value.some((r) => r.id_producto === id_producto && r.usuario.id_usuario === id_usuario)
  }

  async function crearResena({ id_producto, calificacion, comentario }) {
    await api.post('/resenas', { id_producto, calificacion, comentario })
    await cargarResenas()
  }

  return { resenas, cargarResenas, getResenasDeProducto, getPromedio, getDistribucion, yaReseno, crearResena }
})
