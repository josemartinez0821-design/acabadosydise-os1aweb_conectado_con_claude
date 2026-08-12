import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MockData } from '../data/mockData'

// TODO: cuando el backend Spring esté disponible, reemplazar las referencias
// a MockData por llamadas a `api` (src/services/api.js) manteniendo los mismos nombres de campo.
export const useCatalogStore = defineStore('catalog', () => {
  const categorias = ref(MockData.categorias)
  const productos = ref(MockData.productos)
  const servicios = ref(MockData.servicios)
  const inventario = ref(MockData.inventario)
  const promociones = ref(MockData.promociones)
  const configuracion = ref(MockData.configuracion)

  const productosDestacados = computed(() => productos.value.filter((p) => p.destacado))

  // Algunos productos (ej. pinturas) tienen "hermanos" por tamaño (1/4, 1, 2.5, 5 galones) que son
  // filas independientes en la BD real (mismo patrón que ya usan las variantes de drywall).
  // El catálogo solo muestra un representante por familia; los demás tamaños se eligen en el detalle.
  const productosCatalogo = computed(() => productos.value.filter((p) => p.mostrarEnCatalogo !== false))

  function getVariantesTamano(producto) {
    if (!producto?.grupo_variante) return []
    return productos.value
      .filter((p) => p.grupo_variante === producto.grupo_variante)
      .sort((a, b) => (a.orden_variante ?? 0) - (b.orden_variante ?? 0))
  }

  function getCategoryName(id_categoria) {
    const cat = categorias.value.find((c) => c.id_categoria === id_categoria)
    return cat ? cat.nombre : 'Sin categoría'
  }

  function getCategoryCount(id_categoria) {
    return productosCatalogo.value.filter((p) => p.id_categoria === id_categoria).length
  }

  function getCategoryStockCount(id_categoria) {
    return productosCatalogo.value.filter((p) => p.id_categoria === id_categoria && getProductStock(p.id_producto) > 0).length
  }

  function getStockStatus(id_producto) {
    const inv = inventario.value.find((i) => i.id_producto === id_producto)
    if (!inv) return { label: 'Sin inventario', class: 'stock-out' }
    if (inv.cantidad_disponible === 0) return { label: 'Agotado', class: 'stock-out' }
    if (inv.cantidad_disponible <= inv.stock_minimo) return { label: 'Stock bajo', class: 'stock-low' }
    return { label: 'Disponible', class: 'stock-in' }
  }

  function getProductStock(id_producto) {
    const inv = inventario.value.find((i) => i.id_producto === id_producto)
    return inv ? inv.cantidad_disponible : 0
  }

  function getProductById(id_producto) {
    return productos.value.find((p) => p.id_producto === Number(id_producto)) || null
  }

  function getServiceById(id_servicio) {
    return servicios.value.find((s) => s.id_servicio === Number(id_servicio)) || null
  }

  // Solo estas categorías son fabricación propia (Vinilos, Estuco/Graniplast, Pegantes) — el resto
  // (Drywall/PVC, Herramientas) son productos de terceros que solo se revenden, así que no se
  // cotizan al por mayor. Compartido entre DetalleProductoView.vue y CotizacionesView.vue.
  const CATEGORIAS_FABRICACION_PROPIA = [1, 2, 3]
  function esFabricacionPropia(producto) {
    return CATEGORIAS_FABRICACION_PROPIA.includes(producto.id_categoria)
  }
  const productosFabricacionPropia = computed(() => productosCatalogo.value.filter(esFabricacionPropia))

  function getActivePromoForProduct(id_producto) {
    // Solo promos tipo "descuento" representan un % aplicable al precio de este producto
    // individual (los combos tienen un precio especial de paquete, no aplican aquí).
    return promociones.value.find((p) => p.activo && p.tipo === 'descuento' && p.id_producto === Number(id_producto)) || null
  }

  // Recomendador servicios <-> productos: qué tipos de servicio tienen sentido según la
  // categoría del producto (ej. pinturas -> aplicación de pintura; drywall -> instalación de drywall).
  // Se usa en Detalle de producto, Carrito y Nueva Cotización para sugerir el servicio relacionado.
  const CATEGORIA_A_TIPOS_SERVICIO = {
    1: ['aplicacion_pintura', 'asesoria'], // Pinturas y Vinilos
    2: ['aplicacion_pintura'], // Materiales de Acabado (estuco, graniplast) -> misma bolsa que "aplicación de pintura"
    3: ['instalacion'], // Pegantes y Adhesivos
    4: ['drywall', 'pvc', 'instalacion'], // Drywall y PVC
    5: [], // Herramientas -> sin servicio directo asociado
  }

  function getServiciosSugeridos(idsCategorias, excluirIds = []) {
    const tipos = new Set()
    idsCategorias.forEach((catId) => {
      ;(CATEGORIA_A_TIPOS_SERVICIO[catId] || []).forEach((t) => tipos.add(t))
    })
    if (!tipos.size) return []
    const excluir = new Set(excluirIds)
    return servicios.value.filter((s) => tipos.has(s.tipo_servicio) && !excluir.has(s.id_servicio))
  }

  return {
    categorias,
    productos,
    servicios,
    inventario,
    promociones,
    configuracion,
    productosDestacados,
    productosCatalogo,
    productosFabricacionPropia,
    esFabricacionPropia,
    getVariantesTamano,
    getCategoryName,
    getCategoryCount,
    getCategoryStockCount,
    getStockStatus,
    getProductStock,
    getProductById,
    getServiceById,
    getActivePromoForProduct,
    getServiciosSugeridos,
  }
})
