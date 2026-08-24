import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'

// Refleja `carrito` + `carrito_productos`: { id_producto, nombre, precio_venta, cantidad, imagen_url }
export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('carrito') || '[]'))
  const { showToast } = useToast()

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.precio_venta * item.cantidad, 0)
  )
  const cantidadTotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.cantidad, 0)
  )

  function persist() {
    localStorage.setItem('carrito', JSON.stringify(items.value))
  }

  function agregarProducto(producto, cantidad = 1) {
    const existente = items.value.find((i) => i.id_producto === producto.id_producto)
    if (existente) {
      existente.cantidad += cantidad
    } else {
      items.value.push({ ...producto, cantidad })
    }
    persist()
    showToast(`"${producto.nombre}" agregado al carrito`, 'success')
  }

  function actualizarCantidad(id_producto, cantidad) {
    const item = items.value.find((i) => i.id_producto === id_producto)
    if (item) item.cantidad = cantidad
    persist()
  }

  function eliminarProducto(id_producto) {
    items.value = items.value.filter((i) => i.id_producto !== id_producto)
    persist()
  }

  function vaciarCarrito() {
    items.value = []
    persist()
  }

  return { items, total, cantidadTotal, agregarProducto, actualizarCantidad, eliminarProducto, vaciarCarrito }
})
