// Contenido enriquecido de servicios (rating, reseñas, galería, "qué incluye", "cómo funciona",
// etc.) que la tabla real `servicios` no tiene columnas para — mismo patrón que
// `grupos_variante_productos` para productos: se queda mock-only, indexado por `codigo_servicio`,
// y catalog.js lo combina en el cliente con lo que sí viene del backend real. No editable desde
// el admin (igual que las variantes de tamaño de producto tampoco lo son).
//
// `que_incluye`: cada ítem es { t: 'texto', material?: true }. Los marcados `material: true` son
// insumos que pone el negocio y por eso desaparecen de la lista cuando el cliente elige la
// modalidad "Solo servicio" en el detalle (ver DetalleServicioView). Solo los servicios con
// `incluye_materiales` en el backend (drywall, PVC, pisos, estuco, cielo raso) llevan líneas así.
//
// `zona_cobertura`: es la misma para todos — Tesalia (sede) y Paicol. Otras zonas se evalúan y
// tienen costo de desplazamiento a coordinar (regla de 3 niveles, ver CotizacionesView); ese
// detalle se explica al cotizar, aquí solo va el titular.
export const ServiciosEnriquecimiento = {
  'SERV-001': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    rating: 4.8, num_resenas: 23, garantia_meses: 6,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Láminas de drywall y perfilería', material: true },
      { t: 'Mano de obra especializada' },
      { t: 'Aislamiento acústico básico' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Cotiza en línea', descripcion: 'Elige el servicio, indica cuántas horas crees que tomará y arma tu solicitud en minutos.' },
      { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
      { titulo: 'Instalación', descripcion: 'Nuestro equipo instala el drywall siguiendo los estándares de calidad.' },
      { titulo: 'Entrega final', descripcion: 'Revisamos contigo el trabajo terminado y entregamos la garantía.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80'],
  },
  'SERV-002': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    rating: 4.9, num_resenas: 41, garantia_meses: 3,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Mano de obra especializada' },
      { t: 'Protección de muebles y pisos' },
      { t: 'Aplicación de 2 manos de pintura' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Cotiza en línea', descripcion: 'Elige el servicio, indica cuántas horas crees que tomará y arma tu solicitud en minutos.' },
      { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
      { titulo: 'Aplicación', descripcion: 'Aplicamos la pintura con técnicas profesionales para un acabado uniforme.' },
      { titulo: 'Entrega final', descripcion: 'Revisamos contigo el resultado y entregamos la garantía.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80'],
  },
  'SERV-003': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
    rating: 4.7, num_resenas: 15, garantia_meses: 1,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Visita y diagnóstico del espacio' },
      { t: 'Propuesta de paleta de colores' },
      { t: 'Recomendación de materiales y acabados' },
      { t: 'Plano conceptual básico' },
    ],
    como_funciona: [
      { titulo: 'Agenda tu cita', descripcion: 'Coordinamos una visita o videollamada según prefieras.' },
      { titulo: 'Diagnóstico', descripcion: 'Analizamos el espacio, la luz y tus necesidades.' },
      { titulo: 'Propuesta', descripcion: 'Te entregamos una propuesta con colores, materiales y distribución.' },
      { titulo: 'Acompañamiento', descripcion: 'Te asesoramos durante la compra e implementación.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'],
  },
  'SERV-004': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&q=80',
    rating: 4.6, num_resenas: 9, garantia_meses: 12,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Láminas de PVC y perfilería', material: true },
      { t: 'Mano de obra especializada' },
      { t: 'Sellado de uniones' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos las medidas aproximadas del área y arma tu solicitud en minutos.' },
      { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
      { titulo: 'Instalación', descripcion: 'Instalamos los paneles de PVC con acabado profesional.' },
      { titulo: 'Entrega final', descripcion: 'Revisión final del trabajo y entrega de garantía.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80'],
  },
  'SERV-005': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
    rating: 4.5, num_resenas: 12, garantia_meses: 2,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Diagnóstico del daño o desgaste' },
      { t: 'Mano de obra especializada' },
      { t: 'Materiales menores de reparación' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Solicitud', descripcion: 'Nos cuentas qué necesita mantenimiento o reparación.' },
      { titulo: 'Diagnóstico', descripcion: 'Un técnico evalúa el daño y define el alcance del trabajo.' },
      { titulo: 'Ejecución', descripcion: 'Realizamos la reparación o mantenimiento acordado.' },
      { titulo: 'Entrega final', descripcion: 'Revisamos el resultado contigo antes de finalizar.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80'],
  },
  'SERV-006': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
    rating: 4.8, num_resenas: 18, garantia_meses: 3,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Visita y levantamiento del espacio' },
      { t: 'Propuesta de distribución y mobiliario' },
      { t: 'Paleta de colores personalizada' },
      { t: 'Plano 2D del proyecto' },
    ],
    como_funciona: [
      { titulo: 'Agenda tu cita', descripcion: 'Coordinamos una visita al espacio a diseñar.' },
      { titulo: 'Diagnóstico', descripcion: 'Analizamos el espacio, la luz y tus necesidades.' },
      { titulo: 'Propuesta', descripcion: 'Te entregamos la propuesta de distribución y colores.' },
      { titulo: 'Entrega final', descripcion: 'Recibes el plano 2D y las recomendaciones completas.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80'],
  },
  'SERV-007': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&q=80',
    rating: 4.7, num_resenas: 11, garantia_meses: 3,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Visita técnica de fachada' },
      { t: 'Propuesta de colores y acabados exteriores' },
      { t: 'Recomendación de materiales resistentes al clima' },
      { t: 'Render conceptual de la fachada' },
    ],
    como_funciona: [
      { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos sobre tu fachada y arma tu solicitud en minutos.' },
      { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el alcance y la fecha en máximo 24 horas.' },
      { titulo: 'Propuesta', descripcion: 'Presentamos la propuesta de colores y materiales.' },
      { titulo: 'Entrega final', descripcion: 'Recibes el render conceptual de tu fachada.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'],
  },
  'SERV-008': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    rating: 4.6, num_resenas: 14, garantia_meses: 12,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Piso laminado de alta resistencia', material: true },
      { t: 'Perfiles y remates de acabado', material: true },
      { t: 'Instalación con nivelación previa' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Cotiza en línea', descripcion: 'Indica el área aproximada y cuántas horas crees que tomará, y arma tu solicitud en minutos.' },
      { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
      { titulo: 'Instalación', descripcion: 'Instalamos el piso laminado con acabado profesional.' },
      { titulo: 'Entrega final', descripcion: 'Revisión final del trabajo y entrega de garantía.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80'],
  },
  'SERV-009': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
    rating: 4.7, num_resenas: 20, garantia_meses: 6,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Estuco o graniplast', material: true },
      { t: 'Mano de obra especializada' },
      { t: 'Acabado texturizado uniforme' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos el tipo de acabado que buscas, indica los días estimados y arma tu solicitud en minutos.' },
      { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
      { titulo: 'Aplicación', descripcion: 'Aplicamos el estuco o graniplast con técnica profesional.' },
      { titulo: 'Entrega final', descripcion: 'Revisamos contigo el resultado y entregamos la garantía.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80'],
  },
  'SERV-010': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
    rating: 4.5, num_resenas: 8, garantia_meses: 6,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Láminas de icopor decorativo', material: true },
      { t: 'Perfilería y guías de instalación', material: true },
      { t: 'Mano de obra especializada' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos las medidas aproximadas del área y arma tu solicitud en minutos.' },
      { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
      { titulo: 'Instalación', descripcion: 'Instalamos el cielo raso con acabado profesional.' },
      { titulo: 'Entrega final', descripcion: 'Revisión final del trabajo y entrega de garantía.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80'],
  },
  'SERV-011': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    rating: 4.9, num_resenas: 9, garantia_meses: 1,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Diagnóstico técnico del proyecto' },
      { t: 'Recomendaciones de materiales y presupuesto' },
      { t: 'Cronograma estimado de obra' },
      { t: 'Informe escrito de recomendaciones' },
    ],
    como_funciona: [
      { titulo: 'Agenda tu cita', descripcion: 'Coordinamos una visita o videollamada según prefieras.' },
      { titulo: 'Diagnóstico', descripcion: 'Analizamos el alcance y el estado actual del proyecto.' },
      { titulo: 'Recomendaciones', descripcion: 'Te entregamos materiales, presupuesto y cronograma sugerido.' },
      { titulo: 'Entrega final', descripcion: 'Recibes un informe escrito con todas las recomendaciones.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80'],
  },
  'SERV-012': {
    imagen_detalle_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    rating: 4.4, num_resenas: 6, garantia_meses: 2,
    horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Tesalia y Paicol',
    que_incluye: [
      { t: 'Diagnóstico del estado de la fachada' },
      { t: 'Limpieza y reparación de fisuras menores' },
      { t: 'Mano de obra especializada' },
      { t: 'Limpieza del área al finalizar' },
    ],
    como_funciona: [
      { titulo: 'Solicitud', descripcion: 'Nos cuentas qué necesita la fachada.' },
      { titulo: 'Diagnóstico', descripcion: 'Un técnico evalúa el daño y define el alcance del trabajo.' },
      { titulo: 'Ejecución', descripcion: 'Realizamos la reparación o mantenimiento acordado.' },
      { titulo: 'Entrega final', descripcion: 'Revisamos el resultado contigo antes de finalizar.' },
    ],
    galeria: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80'],
  },
}
