import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '../services/api'
import { useCatalogStore } from './catalog'

// Metadata de los 9 estados reales de `ventas.estado`, usada por los badges de AdminVentasView.
// La UI del admin solo pone dos de estos a mano (pendiente al crear la venta = "En proceso",
// entregado) más cancelado/devuelto — confirmado/preparando/despacho/enviado/garantia quedan acá
// documentados porque existen en el ENUM real, pero hoy ningún flujo del sitio los asigna.
export const ESTADOS_VENTA = {
  pendiente: { label: 'En proceso', badge: 'badge-yellow', icon: 'ri-truck-line' },
  confirmado: { label: 'Confirmado', badge: 'badge-blue', icon: 'ri-checkbox-circle-line' },
  preparando: { label: 'Preparando', badge: 'badge-blue', icon: 'ri-archive-2-line' },
  despacho: { label: 'En despacho', badge: 'badge-blue', icon: 'ri-truck-line' },
  enviado: { label: 'Enviado', badge: 'badge-blue', icon: 'ri-send-plane-line' },
  // El label de "entregado" no es fijo - depende de si el pedido era envío o recogida en tienda
  // (ver labelEstadoVenta). El de acá es solo el respaldo si por algo no hay metodo_envio.
  entregado: { label: 'Despachado', badge: 'badge-green', icon: 'ri-checkbox-circle-fill' },
  cancelado: { label: 'Cancelado', badge: 'badge-red', icon: 'ri-close-circle-line' },
  // Morado, no rojo - antes compartía color con "Cancelado" y no se distinguían de un vistazo en
  // la tabla (motivo real por el que el usuario pidió separarlos, 2026-08-25).
  devuelto: { label: 'Devuelto', badge: 'badge-purple', icon: 'ri-arrow-go-back-line' },
  garantia: { label: 'Garantía', badge: 'badge-gray', icon: 'ri-shield-check-line' },
}

// "Despachado" (se le pasó a la transportadora) no describe bien un pedido que el cliente recoge
// en tienda - ahí el hito real es que ya se lo entregamos en mano. Mismo estado real (`entregado`)
// en los dos casos, solo cambia cómo se llama en pantalla según `metodo_envio`.
export function labelEstadoVenta(venta) {
  if (venta.estado === 'entregado') return venta.metodo_envio === 'recogida' ? 'Entregado en tienda' : 'Despachado'
  return ESTADOS_VENTA[venta.estado]?.label || venta.estado
}

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([])

  async function cargarVentas() {
    const { data } = await api.get('/ventas')
    ventas.value = data
  }

  // `detalleVentas`/`pagos` planos se derivan de `ventas` (el backend ya los anida por venta) —
  // se mantienen como getters aparte porque AdminReportesView/DashboardView/AdminVentasView los
  // consultan así (mismo shape que tenían con MockData, para no tocar esas vistas más de lo
  // necesario).
  const detalleVentas = computed(() =>
    ventas.value.flatMap((v) => v.items.map((item) => ({ ...item, id_venta: v.id_venta })))
  )
  const pagos = computed(() =>
    ventas.value.flatMap((v) => v.pagos.map((p) => ({ ...p, id_venta: v.id_venta })))
  )

  // Persiste una venta real: la usa tanto el checkout (compra del cliente) como el anticipo de
  // una cotización aprobada y "Nueva venta" en el panel admin (pedido manual por teléfono/
  // WhatsApp). El backend crea `ventas`/`detalle_ventas`/`pagos`, resta el stock y registra el
  // movimiento 'venta' en Inventario — por eso al terminar se recarga también el inventario.
  async function crearVenta({ id_usuario, items, subtotal, total, metodo_pago, metodo_envio, id_cotizacion = null, notas_cliente = null }) {
    const { data } = await api.post('/ventas', {
      id_usuario,
      items: items.map((i) => ({ id_producto: i.id_producto, cantidad: i.cantidad, precio_venta: i.precio_venta })),
      subtotal,
      total,
      metodo_pago,
      metodo_envio,
      id_cotizacion,
      notas_cliente,
    })
    await cargarVentas()
    await useCatalogStore().cargarInventario()
    return data
  }

  function getPagosDeVenta(id_venta) {
    return ventas.value.find((v) => v.id_venta === id_venta)?.pagos || []
  }

  // Cambia el estado de un pedido a mano (no hay integración logística real, el admin dice qué
  // pasó). Si el nuevo estado es 'cancelado'/'devuelto' y todavía no lo estaba, el backend repone
  // el stock (movimiento 'devolucion' por cada producto) y marca el/los pagos como 'reversado'.
  async function actualizarEstadoVenta(id_venta, nuevoEstado, { numero_guia = null, transportadora = null, motivo = null } = {}) {
    const { data } = await api.patch(`/ventas/${id_venta}/estado`, { estado: nuevoEstado, numero_guia, transportadora, motivo })
    await cargarVentas()
    await useCatalogStore().cargarInventario()
    return data
  }

  async function actualizarNotasVenta(id_venta, { notas_internas, fecha_entrega_estimada } = {}) {
    const { data } = await api.put(`/ventas/${id_venta}/notas`, { notas_internas, fecha_entrega_estimada })
    await cargarVentas()
    return data
  }

  return {
    ventas,
    detalleVentas,
    pagos,
    cargarVentas,
    crearVenta,
    getPagosDeVenta,
    actualizarEstadoVenta,
    actualizarNotasVenta,
  }
})
