import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MockData } from '../data/mockData'

// TODO: cuando el backend Spring esté disponible, reemplazar las referencias
// a MockData por llamadas a `api` (src/services/api.js) manteniendo los mismos nombres de campo.
export const usePqrsStore = defineStore('pqrs', () => {
  const pqrs = ref(MockData.pqrs)

  const TIPOS = {
    peticion: { label: 'Petición', icon: 'ri-file-list-3-line', badge: 'badge-blue', desc: 'Solicitud de información, documentos o acciones a la empresa' },
    queja: { label: 'Queja', icon: 'ri-emotion-unhappy-line', badge: 'badge-red', desc: 'Inconformidad sobre la calidad del servicio o atención' },
    reclamo: { label: 'Reclamo', icon: 'ri-error-warning-line', badge: 'badge-yellow', desc: 'Exigencia de reconocimiento o compensación por un daño' },
    sugerencia: { label: 'Sugerencia', icon: 'ri-lightbulb-line', badge: 'badge-green', desc: 'Ideas o propuestas para mejorar nuestros productos y servicios' },
    garantia: { label: 'Garantía', icon: 'ri-shield-check-line', badge: 'badge-gray', desc: 'Solicitud de aplicación de garantía sobre un producto o servicio' },
  }

  const ESTADOS = {
    abierto: { label: 'Abierto', badge: 'badge-blue', icon: 'ri-inbox-line' },
    en_proceso: { label: 'En Proceso', badge: 'badge-yellow', icon: 'ri-loader-4-line' },
    resuelto: { label: 'Resuelto', badge: 'badge-green', icon: 'ri-checkbox-circle-line' },
    cerrado: { label: 'Cerrado', badge: 'badge-gray', icon: 'ri-close-circle-line' },
  }

  function getPqrsDeUsuario(id_usuario) {
    return pqrs.value
      .filter((p) => p.id_usuario === id_usuario)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))
  }

  function crearPqrs({ id_usuario, tipo, asunto, descripcion, evidencia_nombre }) {
    const nuevoId = pqrs.value.length ? Math.max(...pqrs.value.map((p) => p.id_pqrs)) + 1 : 1
    const anio = new Date().getFullYear()
    const secuencia = pqrs.value.filter((p) => p.numero_pqrs.includes(`PQRS-${anio}`)).length + 1
    const numero = `PQRS-${anio}-${String(secuencia).padStart(3, '0')}`

    const nuevo = {
      id_pqrs: nuevoId,
      numero_pqrs: numero,
      id_usuario,
      tipo,
      asunto,
      descripcion,
      estado: 'abierto',
      prioridad: 'media',
      fecha_creacion: new Date().toISOString().slice(0, 10),
      fecha_resolucion: null,
      respuesta: null,
      id_responsable: null,
      // NOTA: `evidencia_nombre` no existe como columna en la tabla `pqrs` de la BD real todavía.
      // Al conectar el backend hay que agregar una columna (p.ej. `evidencia_url VARCHAR(255)`) y
      // un endpoint/almacenamiento de archivos real; por ahora solo se guarda el nombre en memoria.
      evidencia_nombre: evidencia_nombre || null,
    }
    pqrs.value.push(nuevo)
    return nuevo
  }

  return { pqrs, TIPOS, ESTADOS, getPqrsDeUsuario, crearPqrs }
})
