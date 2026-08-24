import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const usePqrsStore = defineStore('pqrs', () => {
  const pqrs = ref([])

  async function cargarPqrs() {
    const { data } = await api.get('/pqrs')
    pqrs.value = data
  }

  // El tipo usa su propia paleta ("badge-tipo-*", definida en style.css) en vez de reutilizar
  // badge-red/blue/yellow/green/gray — esos ya los usan Prioridad y Estado, y al ponerlos juntos
  // en una fila de tabla (tipo + prioridad + estado) se veían iguales y confundían de un vistazo.
  const TIPOS = {
    peticion: { label: 'Petición', icon: 'ri-file-list-3-line', badge: 'badge-tipo-peticion', desc: 'Solicitud de información, documentos o acciones a la empresa' },
    queja: { label: 'Queja', icon: 'ri-emotion-unhappy-line', badge: 'badge-tipo-queja', desc: 'Inconformidad sobre la calidad del servicio o atención' },
    reclamo: { label: 'Reclamo', icon: 'ri-error-warning-line', badge: 'badge-tipo-reclamo', desc: 'Exigencia de reconocimiento o compensación por un daño' },
    sugerencia: { label: 'Sugerencia', icon: 'ri-lightbulb-line', badge: 'badge-tipo-sugerencia', desc: 'Ideas o propuestas para mejorar nuestros productos y servicios' },
    garantia: { label: 'Garantía', icon: 'ri-shield-check-line', badge: 'badge-tipo-garantia', desc: 'Solicitud de aplicación de garantía sobre un producto o servicio' },
  }

  const ESTADOS = {
    abierto: { label: 'Abierto', badge: 'badge-blue', icon: 'ri-inbox-line' },
    en_proceso: { label: 'En Proceso', badge: 'badge-yellow', icon: 'ri-loader-4-line' },
    resuelto: { label: 'Resuelto', badge: 'badge-green', icon: 'ri-checkbox-circle-line' },
    cerrado: { label: 'Cerrado', badge: 'badge-gray', icon: 'ri-close-circle-line' },
  }

  const PRIORIDADES = {
    baja: { label: 'Baja', badge: 'badge-gray' },
    media: { label: 'Media', badge: 'badge-blue' },
    alta: { label: 'Alta', badge: 'badge-yellow' },
    urgente: { label: 'Urgente', badge: 'badge-red' },
  }

  // GET /api/pqrs ya devuelve solo las del usuario logueado (o todas si es admin) - se filtra igual
  // acá por si acaso, pero en la práctica ya viene filtrado del backend.
  function getPqrsDeUsuario(id_usuario) {
    return pqrs.value
      .filter((p) => p.id_usuario === id_usuario)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
  }

  async function crearPqrs({ tipo, asunto, descripcion, departamento, ciudad, evidencia_nombre }) {
    const { data } = await api.post('/pqrs', {
      tipo, asunto, descripcion, departamento, ciudad, evidencia_nombre,
    })
    await cargarPqrs()
    return data
  }

  // El admin responde/gestiona: cambia estado, deja una respuesta visible para el cliente y queda
  // registrado como responsable (lo resuelve el backend a partir del token, no de lo que se mande
  // acá). `fecha_resolucion` solo se fija la primera vez que pasa a resuelto/cerrado.
  async function actualizarPqrs(id_pqrs, { estado, respuesta, prioridad } = {}) {
    const { data } = await api.patch(`/pqrs/${id_pqrs}/estado`, { estado, respuesta, prioridad })
    await cargarPqrs()
    return data
  }

  // ── Aviso de "respuesta nueva" para el cliente ──────────────────────────────
  // No hay correo real todavía para esto, así que el aviso vive enteramente en el navegador:
  // localStorage guarda, por usuario, qué PQRS con respuesta ya vio. Cualquier PQRS con `respuesta`
  // no listada ahí cuenta como "nueva" y enciende el punto rojo en la barra de navegación.
  const CLAVE_VISTOS = 'acabados1a_pqrs_vistos'
  function cargarVistos() {
    try { return JSON.parse(localStorage.getItem(CLAVE_VISTOS) || '{}') } catch { return {} }
  }
  const vistosPorUsuario = ref(cargarVistos())

  function pqrsConRespuestaNueva(id_usuario) {
    const vistos = vistosPorUsuario.value[id_usuario] || []
    return getPqrsDeUsuario(id_usuario).filter((p) => p.respuesta && !vistos.includes(p.id_pqrs))
  }
  function contarRespuestasNuevas(id_usuario) {
    return id_usuario ? pqrsConRespuestaNueva(id_usuario).length : 0
  }
  // Se llama al abrir "Mis Solicitudes" — marca como vistas TODAS las respuestas que ya existen en
  // ese momento (no una por una), que es lo natural: si entraste a la lista, ya las viste todas.
  function marcarPqrsVistas(id_usuario) {
    const idsConRespuesta = getPqrsDeUsuario(id_usuario).filter((p) => p.respuesta).map((p) => p.id_pqrs)
    vistosPorUsuario.value = { ...vistosPorUsuario.value, [id_usuario]: idsConRespuesta }
    localStorage.setItem(CLAVE_VISTOS, JSON.stringify(vistosPorUsuario.value))
  }

  return {
    pqrs, TIPOS, ESTADOS, PRIORIDADES,
    cargarPqrs, getPqrsDeUsuario, crearPqrs, actualizarPqrs,
    contarRespuestasNuevas, marcarPqrsVistas,
  }
})
