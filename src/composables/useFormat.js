export function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value)
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

// `fecha` en `ventas` es DATETIME (ej. "2026-05-10 14:32:00") — muestra fecha y hora juntas.
export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '—'
  const d = new Date(dateTimeStr.replace(' ', 'T'))
  const fecha = d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
  const hora = d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${fecha} · ${hora}`
}

// La tabla `cotizaciones` no tiene columna para la fecha deseada del servicio, solo `observaciones`
// (texto libre). En vez de agregar una columna, la fecha se empaca al inicio de `observaciones` con
// un prefijo reconocible y se vuelve a separar al mostrarla — así se ve como un campo propio en la UI
// sin tocar el esquema. Mismo patrón usado por `respuesta`/`precio_dia` en este proyecto.
const PREFIJO_FECHA_DESEADA = '📅 Fecha deseada:'
const REGEX_FECHA_DESEADA = /^📅 Fecha deseada:\s*([^\n]+)\n?\n?/

export function empacarFechaDeseada(fechaLegible, notaCliente) {
  const encabezado = `${PREFIJO_FECHA_DESEADA} ${fechaLegible}`
  return notaCliente ? `${encabezado}\n\n${notaCliente}` : encabezado
}

export function extraerFechaDeseada(observaciones) {
  const match = (observaciones || '').match(REGEX_FECHA_DESEADA)
  return match ? match[1].trim() : null
}

export function extraerNotaCliente(observaciones) {
  return (observaciones || '').replace(REGEX_FECHA_DESEADA, '').trim() || null
}

// Traduce el ENUM real de `productos.unidad_medida` (BD) a una etiqueta legible en español.
const UNIDAD_MEDIDA_LABELS = {
  unidad: 'Unidad',
  metro2: 'Metro cuadrado (m²)',
  metro: 'Metro lineal',
  litro: 'Litro',
  galon: 'Galón',
  kilogramo: 'Kilogramo',
  caja: 'Caja',
  rollo: 'Rollo',
  bulto: 'Bulto',
}
export function formatUnidadMedida(valor) {
  return UNIDAD_MEDIDA_LABELS[valor] || valor
}
