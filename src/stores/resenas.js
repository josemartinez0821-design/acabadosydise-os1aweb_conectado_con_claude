import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MockData } from '../data/mockData'

// TODO: cuando el backend Spring esté disponible, reemplazar las referencias
// a MockData por llamadas a `api` (src/services/api.js) manteniendo los mismos nombres de campo.
// NOTA: la tabla `resenas_productos` no existe en la BD real todavía — hay que crearla al conectar el backend.
export const useResenasStore = defineStore('resenas', () => {
  const resenas = ref(MockData.resenas_productos)

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
    return resenas.value.some((r) => r.id_producto === id_producto && r.id_usuario === id_usuario)
  }

  function crearResena({ id_producto, id_usuario, calificacion, comentario }) {
    const nuevoId = resenas.value.length ? Math.max(...resenas.value.map((r) => r.id_resena)) + 1 : 1
    const nueva = {
      id_resena: nuevoId,
      id_producto,
      id_usuario,
      calificacion,
      comentario,
      fecha: new Date().toISOString().slice(0, 10),
    }
    resenas.value.push(nueva)
    return nueva
  }

  return { resenas, getResenasDeProducto, getPromedio, getDistribucion, yaReseno, crearResena }
})
