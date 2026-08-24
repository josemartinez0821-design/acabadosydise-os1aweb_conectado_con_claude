import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

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

// Anticipo para confirmar una cotización de solo servicio (sin productos, sin pasarela de pago
// real todavía): antes bastaba con un simple "¿seguro?" del navegador, sin ningún compromiso real
// del cliente. Ahora paga un anticipo (simulado, igual que el resto de pagos del sitio) antes de
// que la cita cuente como confirmada para el calendario del admin.
export const PORCENTAJE_ANTICIPO = 0.5
export function montoAnticipo(totalEstimado) {
  return Math.round(totalEstimado * PORCENTAJE_ANTICIPO)
}

// Advertencias mostradas junto a las dos opciones de cotización de un servicio.
export const ADVERTENCIA_MODO = {
  todo_incluido: 'Este precio es un estimado — el valor final puede variar según lo que se necesite en el sitio.',
  solo_servicio:
    'En esta opción tú pones los materiales, asegúrate de tenerlos listos antes de la fecha del servicio. Además, el tiempo que elegiste es tu estimado: si el trabajo requiere más horas de las calculadas, se cobrará el excedente a la misma tarifa. ¿No estás seguro cuánto tiempo tomará? Nuestro equipo te puede orientar antes de confirmar.',
}

// A diferencia de productos/servicios (catálogo público, se cargan una vez al iniciar la app),
// cotizaciones es información privada por usuario — se carga bajo demanda (CotizacionesView.vue/
// AdminCotizacionesView.vue en su propio onMounted) y solo si hay sesión iniciada. El backend real
// ya trae los ítems de cada cotización anidados (`c.productos`/`c.servicios`), así que ya no hace
// falta guardarlos en arrays sueltos aparte como hacía el mock.
export const useCotizacionesStore = defineStore('cotizaciones', () => {
  const cotizaciones = ref([])
  async function cargarCotizaciones() {
    const { data } = await api.get('/cotizaciones')
    cotizaciones.value = data
  }

  // Colores con significado real, no decorativo: amarillo = todavía sin responder; azul = el admin
  // ya fijó precio pero FALTA que el cliente pague (no está cerrada, por eso no es verde); rojo =
  // rechazada (por el admin o por el cliente); verde = de verdad completa, solo cuando ya pagó.
  const ESTADOS = {
    pendiente: {
      label: 'Pendiente', badge: 'badge-yellow', icon: 'ri-time-line', banner: 'pendiente',
      mensaje: 'Tu solicitud fue recibida. Nuestro equipo la está evaluando y te responderá en máximo 24 horas.',
    },
    en_revision: {
      label: 'En Revisión', badge: 'badge-yellow', icon: 'ri-search-eye-line', banner: 'pendiente',
      mensaje: 'Estamos preparando tu cotización con el mejor precio posible. Te contactaremos muy pronto.',
    },
    aprobada: {
      label: 'Aprobada — pendiente pago', badge: 'badge-blue', icon: 'ri-bank-card-2-line', banner: 'aprobada',
      mensaje: '¡Tu cotización fue aprobada! Todavía falta que confirmes el pago para que quede cerrada — hazlo dentro del plazo de validez.',
    },
    rechazada: {
      label: 'Rechazada', badge: 'badge-red', icon: 'ri-close-circle-line', banner: 'rechazada',
      mensaje: 'Lamentablemente no pudimos aprobar esta cotización.',
    },
    convertida_venta: {
      label: 'Cotización completa', badge: 'badge-green', icon: 'ri-checkbox-circle-fill', banner: 'convertida',
      mensaje: '¡Listo! Ya pagaste y tu cotización quedó completa.',
    },
  }

  function getCotizacionesDeUsuario(id_usuario) {
    // El backend ya solo devuelve las propias de un cliente (o todas, si es admin) - este filtro
    // queda como red de seguridad adicional, no como el mecanismo real de aislamiento.
    return cotizaciones.value
      .filter((c) => c.usuario?.id_usuario === id_usuario)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }

  function getItemsCotizacion(id_cotizacion) {
    const cot = cotizaciones.value.find((c) => c.id_cotizacion === id_cotizacion)
    return { productos: cot?.productos || [], servicios: cot?.servicios || [] }
  }

  // ── Crear / responder cotizaciones — llama al backend real y resincroniza con
  // cargarCotizaciones() en vez de parchar el array local, mismo patrón que productos/servicios.
  // id_usuario ya no se manda: el backend lo saca del token, nunca del body.
  async function crearCotizacion({ itemsProductos, itemsServicios, observaciones }) {
    const payload = {
      observaciones: observaciones || null,
      productos: itemsProductos.map((i) => ({ id_producto: i.producto.id_producto, cantidad: i.cantidad, precio_unitario: i.precio_unitario })),
      servicios: itemsServicios.map((i) => ({ id_servicio: i.servicio.id_servicio, cantidad: i.cantidad, precio_estimado: i.precio_estimado })),
    }
    await api.post('/cotizaciones', payload)
    await cargarCotizaciones()
  }

  // `totalEstimado` solo lo aplica el admin al aprobar (ajuste de precio final) - en cualquier
  // otro caso se omite y el backend simplemente no lo toca.
  async function actualizarEstado(id_cotizacion, nuevoEstado, respuesta = null, totalEstimado = null) {
    await api.patch(`/cotizaciones/${id_cotizacion}/estado`, {
      estado: nuevoEstado,
      respuesta,
      total_estimado: totalEstimado,
    })
    await cargarCotizaciones()
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
    cargarCotizaciones,
    ESTADOS,
    getCotizacionesDeUsuario,
    getItemsCotizacion,
    crearCotizacion,
    actualizarEstado,
    estaVencida,
    diasParaVencer,
  }
})
