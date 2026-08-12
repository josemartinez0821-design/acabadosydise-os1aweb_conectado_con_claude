import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MockData } from '../data/mockData'

// Un servicio se cobra por hora, por día o a precio fijo de proyecto — nunca más de uno a la vez.
// Compartido entre DetalleServicioView.vue y CotizacionesView.vue para que el cálculo sea idéntico
// en ambos lugares.
export function unidadServicio(servicio) {
  if (servicio.precio_hora) return 'hora'
  if (servicio.precio_dia) return 'dia'
  return 'proyecto'
}
export function tarifaServicio(servicio) {
  return servicio.precio_hora || servicio.precio_dia || servicio.precio_proyecto || 0
}

// Advertencias mostradas junto a las dos opciones de cotización de un servicio.
export const ADVERTENCIA_MODO = {
  todo_incluido: 'Este precio es un estimado — el valor final puede variar según lo que se necesite en el sitio.',
  solo_servicio:
    'En esta opción tú pones los materiales, asegúrate de tenerlos listos antes de la fecha del servicio. Además, el tiempo que elegiste es tu estimado: si el trabajo requiere más horas de las calculadas, se cobrará el excedente a la misma tarifa. ¿No estás seguro cuánto tiempo tomará? Nuestro equipo te puede orientar antes de confirmar.',
}

// TODO: cuando el backend Spring esté disponible, reemplazar las referencias
// a MockData por llamadas a `api` (src/services/api.js) manteniendo los mismos nombres de campo.
export const useCotizacionesStore = defineStore('cotizaciones', () => {
  const cotizaciones = ref(MockData.cotizaciones)
  const cotizacionProductos = ref(MockData.cotizacion_productos)
  const cotizacionServicios = ref(MockData.cotizacion_servicios)

  const ESTADOS = {
    pendiente: {
      label: 'Pendiente', badge: 'badge-yellow', icon: 'ri-time-line', banner: 'pendiente',
      mensaje: 'Tu solicitud fue recibida. Nuestro equipo la está evaluando y te responderá en máximo 24 horas.',
    },
    en_revision: {
      label: 'En Revisión', badge: 'badge-blue', icon: 'ri-search-eye-line', banner: 'revision',
      mensaje: 'Estamos preparando tu cotización con el mejor precio posible. Te contactaremos muy pronto.',
    },
    aprobada: {
      label: 'Aprobada', badge: 'badge-green', icon: 'ri-checkbox-circle-line', banner: 'aprobada',
      mensaje: '¡Tu cotización fue aprobada! Ya puedes proceder con el pago cuando quieras.',
    },
    rechazada: {
      label: 'Rechazada', badge: 'badge-red', icon: 'ri-close-circle-line', banner: 'rechazada',
      mensaje: 'Lamentablemente no pudimos aprobar esta cotización.',
    },
    convertida_venta: {
      label: 'Convertida a Venta', badge: 'badge-gray', icon: 'ri-shopping-bag-line', banner: 'convertida',
      mensaje: '¡Listo! Esta cotización ya se convirtió en un pedido de compra.',
    },
  }

  function getCotizacionesDeUsuario(id_usuario) {
    return cotizaciones.value
      .filter((c) => c.id_usuario === id_usuario)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  function getItemsCotizacion(id_cotizacion) {
    return {
      productos: cotizacionProductos.value.filter((cp) => cp.id_cotizacion === id_cotizacion),
      servicios: cotizacionServicios.value.filter((cs) => cs.id_cotizacion === id_cotizacion),
    }
  }

  function crearCotizacion({ id_usuario, itemsProductos, itemsServicios, observaciones }) {
    const nuevoId = cotizaciones.value.length ? Math.max(...cotizaciones.value.map((c) => c.id_cotizacion)) + 1 : 1
    const numero = `COT-${String(nuevoId).padStart(3, '0')}`

    const totalProductos = itemsProductos.reduce((sum, i) => sum + i.cantidad * i.precio_unitario, 0)
    const totalServicios = itemsServicios.reduce((sum, i) => sum + i.precio_estimado, 0)

    const nuevaCotizacion = {
      id_cotizacion: nuevoId,
      numero_cotizacion: numero,
      id_usuario,
      fecha: new Date().toISOString().slice(0, 10),
      estado: 'pendiente',
      total_estimado: totalProductos + totalServicios,
      observaciones: observaciones || null,
      validez_dias: 15,
      // NOTA: `respuesta` no existe como columna en la tabla `cotizaciones` de la BD real todavía
      // (solo tiene `observaciones`, que es la nota del cliente). Al conectar el backend hay que
      // agregar una columna para que el equipo pueda responder al aprobar/rechazar.
      respuesta: null,
    }
    cotizaciones.value.push(nuevaCotizacion)

    let siguienteDetalle = cotizacionProductos.value.length
      ? Math.max(...cotizacionProductos.value.map((d) => d.id_detalle)) + 1
      : 1
    itemsProductos.forEach((item) => {
      cotizacionProductos.value.push({
        id_detalle: siguienteDetalle++,
        id_cotizacion: nuevoId,
        id_producto: item.producto.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.cantidad * item.precio_unitario,
      })
    })

    let siguienteDetalleServ = cotizacionServicios.value.length
      ? Math.max(...cotizacionServicios.value.map((d) => d.id_detalle)) + 1
      : 1
    itemsServicios.forEach((item) => {
      cotizacionServicios.value.push({
        id_detalle: siguienteDetalleServ++,
        id_cotizacion: nuevoId,
        id_servicio: item.servicio.id_servicio,
        cantidad: item.cantidad,
        precio_estimado: item.precio_estimado,
        subtotal: item.precio_estimado,
      })
    })

    return nuevaCotizacion
  }

  function actualizarEstado(id_cotizacion, nuevoEstado, respuesta = null) {
    const cot = cotizaciones.value.find((c) => c.id_cotizacion === id_cotizacion)
    if (!cot) return
    cot.estado = nuevoEstado
    if (respuesta) cot.respuesta = respuesta
    // NOTA: `fecha_aprobacion` no existe como columna en la tabla `cotizaciones` de la BD real
    // todavía (mismo caso que `respuesta`). Se usa aquí solo para contar los `validez_dias` desde
    // que se aprueba; al conectar el backend hay que agregar la columna real.
    if (nuevoEstado === 'aprobada') cot.fecha_aprobacion = new Date().toISOString().slice(0, 10)
  }

  // Una cotización aprobada "vence" si el cliente no la paga/confirma dentro de sus `validez_dias`
  // contados desde la aprobación. Es un estado puramente visual: no toca el ENUM real de `estado`
  // (que solo tiene pendiente/en_revision/aprobada/rechazada/convertida_venta).
  function estaVencida(cot) {
    if (cot.estado !== 'aprobada' || !cot.fecha_aprobacion) return false
    const limite = new Date(cot.fecha_aprobacion)
    limite.setDate(limite.getDate() + (cot.validez_dias || 15))
    return new Date() > limite
  }

  function diasParaVencer(cot) {
    if (cot.estado !== 'aprobada' || !cot.fecha_aprobacion) return null
    const limite = new Date(cot.fecha_aprobacion)
    limite.setDate(limite.getDate() + (cot.validez_dias || 15))
    return Math.ceil((limite - new Date()) / (1000 * 60 * 60 * 24))
  }

  return {
    cotizaciones,
    cotizacionProductos,
    cotizacionServicios,
    ESTADOS,
    getCotizacionesDeUsuario,
    getItemsCotizacion,
    crearCotizacion,
    actualizarEstado,
    estaVencida,
    diasParaVencer,
  }
})
