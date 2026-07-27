// ============================================================
// ACABADOS Y DISEÑOS 1A WEB — Mock Data
// Datos simulados basados en la base de datos real del proyecto
// ============================================================

const MockData = {

  // ── ROLES ──────────────────────────────────────────────────
  roles: [
    { id_rol: 1, nombre_rol: 'Administrador', descripcion: 'Acceso total al sistema' },
    { id_rol: 2, nombre_rol: 'Cliente', descripcion: 'Puede comprar y ver su historial' },
    { id_rol: 3, nombre_rol: 'Vendedor', descripcion: 'Empleado que gestiona ventas' }
  ],

  // ── USUARIOS ───────────────────────────────────────────────
  usuarios: [
    {
      id_usuario: 1,
      tipo_identificacion: 'CC',
      numero_identificacion: '1079409325',
      nombre: 'Jose Miguel',
      apellido: 'Martinez Perdomo',
      fecha_nacimiento: '2000-05-18',
      email: 'josemiguel@acabados1a.com',
      telefono: '3101234567',
      whatsapp: '3101234567',
      direccion: 'Calle 5 #10-20',
      ciudad: 'Pitalito',
      departamento: 'Huila',
      id_rol: 1,
      estado: 1,
      password: 'admin2026'
    },
    {
      id_usuario: 2,
      tipo_identificacion: 'CC',
      numero_identificacion: '1079409357',
      nombre: 'Juliana Valentina',
      apellido: 'Trujillo Mendez',
      fecha_nacimiento: '2001-03-15',
      email: 'juliana@acabados1a.com',
      telefono: '3159876543',
      whatsapp: '3159876543',
      direccion: 'Carrera 3 #8-45',
      ciudad: 'Pitalito',
      departamento: 'Huila',
      id_rol: 1,
      estado: 1,
      password: 'admin2026'
    },
    {
      id_usuario: 3,
      tipo_identificacion: 'CC',
      numero_identificacion: '3004561234',
      nombre: 'Carlos Andres',
      apellido: 'Gomez Ruiz',
      fecha_nacimiento: '1990-07-22',
      email: 'carlos.gomez@gmail.com',
      telefono: '3004561234',
      whatsapp: '3004561234',
      direccion: 'Avenida 1 #15-30',
      ciudad: 'Pitalito',
      departamento: 'Huila',
      id_rol: 2,
      estado: 1,
      password: 'cliente123'
    },
    {
      id_usuario: 4,
      tipo_identificacion: 'CC',
      numero_identificacion: '1075401233',
      nombre: 'Maria Fernanda',
      apellido: 'Lopez Torres',
      fecha_nacimiento: '1995-11-08',
      email: 'mfernanda.lopez@gmail.com',
      telefono: '3117894567',
      whatsapp: '3117894567',
      direccion: 'Calle 10 #5-12',
      ciudad: 'La Plata',
      departamento: 'Huila',
      id_rol: 2,
      estado: 1,
      password: 'cliente123'
    },
    {
      id_usuario: 5,
      tipo_identificacion: 'CC',
      numero_identificacion: '1075801344',
      nombre: 'Pedro Antonio',
      apellido: 'Vargas Silva',
      fecha_nacimiento: '1988-02-14',
      email: 'pedro.vargas@hotmail.com',
      telefono: '3286547891',
      whatsapp: '3286547891',
      direccion: 'Carrera 7 #20-55',
      ciudad: 'Neiva',
      departamento: 'Huila',
      id_rol: 2,
      estado: 1,
      password: 'cliente123'
    }
  ],

  // ── CATEGORÍAS ─────────────────────────────────────────────
  categorias: [
    { id_categoria: 1, nombre: 'Pinturas y Vinilos', descripcion: 'Pinturas de interiores y exteriores, vinilos tipo 1, 2 y 3', estado: 1, icono: 'ri-paint-brush-line' },
    { id_categoria: 2, nombre: 'Materiales de Acabado', descripcion: 'Estuco plástico, graniplast y acabados de paredes', estado: 1, icono: 'ri-tools-line' },
    { id_categoria: 3, nombre: 'Pegantes y Adhesivos', descripcion: 'Pegacol y pegantes para cerámica', estado: 1, icono: 'ri-drop-line' },
    { id_categoria: 4, nombre: 'Drywall y PVC', descripcion: 'Láminas y accesorios para Drywall, PVC e icopor', estado: 1, icono: 'ri-layout-grid-line' },
    { id_categoria: 5, nombre: 'Herramientas', descripcion: 'Rodillos, brochas y herramientas de pintura', estado: 1, icono: 'ri-hammer-line' }
  ],

  // ── IMPUESTOS ──────────────────────────────────────────────
  impuestos: [
    { id_impuesto: 1, nombre: 'IVA 19%', valor: 19.00, aplica_productos: 1, aplica_servicios: 1 },
    { id_impuesto: 2, nombre: 'IVA 5%', valor: 5.00, aplica_productos: 1, aplica_servicios: 0 },
    { id_impuesto: 3, nombre: 'Exento', valor: 0.00, aplica_productos: 1, aplica_servicios: 1 }
  ],

  // ── PRODUCTOS ──────────────────────────────────────────────
  productos: [
    {
      id_producto: 1,
      codigo_producto: 'PINT-001',
      nombre: 'Vinilo Interior Tipo 1 Blanco',
      descripcion: 'Pintura acrílica blanca mate para interiores. Rendimiento 12-14 m²/L. Secado rápido.',
      especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min | Secado total 2h',
      marca: 'Pintuco',
      modelo: 'Tipo 1',
      unidad_medida: 'Galón',
      presentacion: '1 Galón',
      color: 'Blanco',
      acabado: 'Mate',
      material: 'Acrílico base agua',
      dimensiones: null,
      peso_kg: 4.5,
      precio_compra: 32000,
      precio_venta: 45000,
      precio_mayorista: 40000,
      imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 1,
      descuento_maximo: 10,
      destacado: 1,
      activo: 1
    },
    {
      id_producto: 2,
      codigo_producto: 'PINT-002',
      nombre: 'Pintura Azul Pastel',
      descripcion: 'Pintura color azul pastel para paredes interiores. Acabado mate premium.',
      especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min',
      marca: 'Pintuco',
      modelo: 'Tipo 2',
      unidad_medida: 'Galón',
      presentacion: '1 Galón',
      color: 'Azul Pastel',
      acabado: 'Mate',
      material: 'Acrílico base agua',
      precio_compra: 34000,
      precio_venta: 48000,
      precio_mayorista: 43000,
      imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 1,
      descuento_maximo: 10,
      destacado: 1,
      activo: 1
    },
    {
      id_producto: 3,
      codigo_producto: 'PINT-003',
      nombre: 'Estuco Plástico',
      descripcion: 'Estuco plástico para acabados decorativos en paredes. Fácil aplicación.',
      especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 8-10 m²/kg | Tiempo de secado 4-6h',
      marca: 'Corona',
      modelo: 'Estándar',
      unidad_medida: 'Cubeta',
      presentacion: '25 kg',
      color: 'Blanco',
      acabado: 'Liso',
      material: 'Polímero acrílico',
      precio_compra: 28000,
      precio_venta: 38000,
      precio_mayorista: 34000,
      imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 2,
      descuento_maximo: 15,
      destacado: 1,
      activo: 1
    },
    {
      id_producto: 4,
      codigo_producto: 'PINT-004',
      nombre: 'Vinilo Mate Exterior Tipo 2',
      descripcion: 'Pintura vinilo mate para exteriores. Alta resistencia a la intemperie.',
      especificaciones_tecnicas: 'Base agua | UV-resistente | Rendimiento 10-12 m²/L',
      marca: 'Sherwin Williams',
      modelo: 'Exterior Pro',
      unidad_medida: 'Galón',
      presentacion: '1 Galón',
      color: 'Blanco Hueso',
      acabado: 'Mate',
      material: 'Látex acrílico',
      precio_compra: 42000,
      precio_venta: 62000,
      precio_mayorista: 56000,
      imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 1,
      descuento_maximo: 10,
      destacado: 0,
      activo: 1
    },
    {
      id_producto: 5,
      codigo_producto: 'PINT-005',
      nombre: 'Esmalte Brillante',
      descripcion: 'Esmalte para madera y metal. Acabado brillante de alta durabilidad.',
      especificaciones_tecnicas: 'Base aceite | Rendimiento 10 m²/L | Secado total 24h',
      marca: 'Pintuco',
      modelo: 'Esmalte Pro',
      unidad_medida: 'Galón',
      presentacion: '1 Galón',
      color: 'Blanco',
      acabado: 'Brillante',
      material: 'Alquídico',
      precio_compra: 38000,
      precio_venta: 55000,
      precio_mayorista: 49000,
      imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 1,
      descuento_maximo: 5,
      destacado: 0,
      activo: 1
    },
    {
      id_producto: 6,
      codigo_producto: 'HERR-001',
      nombre: 'Rodillo para Pintura 9"',
      descripcion: 'Rodillo profesional de 9 pulgadas. Manga de microfibra para acabado perfecto.',
      especificaciones_tecnicas: 'Medida 9" | Manga microfibra | Mango ergonómico',
      marca: 'Purdy',
      modelo: 'Pro',
      unidad_medida: 'Unidad',
      presentacion: 'Kit rodillo + bandeja',
      color: 'N/A',
      acabado: 'N/A',
      material: 'Plástico + Microfibra',
      precio_compra: 12000,
      precio_venta: 18000,
      precio_mayorista: 16000,
      imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
      id_impuesto: 1,
      id_categoria: 5,
      descuento_maximo: 5,
      destacado: 1,
      activo: 1
    },
    {
      id_producto: 7,
      codigo_producto: 'HERR-002',
      nombre: 'Brocha Plana 2"',
      descripcion: 'Brocha de 2 pulgadas para acabados finos. Cerdas naturales premium.',
      especificaciones_tecnicas: 'Medida 2" | Cerdas naturales | Mango madera',
      marca: 'Omega',
      modelo: 'Plana',
      unidad_medida: 'Unidad',
      presentacion: '1 Unidad',
      color: 'N/A',
      acabado: 'N/A',
      material: 'Madera + Cerdas naturales',
      precio_compra: 5000,
      precio_venta: 8500,
      precio_mayorista: 7500,
      imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      id_impuesto: 1,
      id_categoria: 5,
      descuento_maximo: 0,
      destacado: 0,
      activo: 1
    },
    {
      id_producto: 8,
      codigo_producto: 'HERR-003',
      nombre: 'Lijas para Muro',
      descripcion: 'Lijas finas para acabados de paredes. Pack x10 unidades. Grano 120.',
      especificaciones_tecnicas: 'Grano 120 | 10 unidades | Papel abrasivo',
      marca: 'Norton',
      modelo: 'Grano 120',
      unidad_medida: 'Pack',
      presentacion: 'Pack x10',
      color: 'N/A',
      acabado: 'N/A',
      material: 'Papel abrasivo',
      precio_compra: 4000,
      precio_venta: 6500,
      precio_mayorista: 5800,
      imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      id_impuesto: 1,
      id_categoria: 5,
      descuento_maximo: 0,
      destacado: 0,
      activo: 1
    },
    {
      id_producto: 9,
      codigo_producto: 'HERR-004',
      nombre: 'Cinta de Enmascarar',
      descripcion: 'Cinta para proteger áreas durante la pintura. No deja residuo.',
      especificaciones_tecnicas: 'Ancho 1" | 40 metros | Papel crepe',
      marca: '3M',
      modelo: '101E',
      unidad_medida: 'Rollo',
      presentacion: '40m x 1"',
      color: 'Crema',
      acabado: 'N/A',
      material: 'Papel crepe + adhesivo',
      precio_compra: 3500,
      precio_venta: 5800,
      precio_mayorista: 5200,
      imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80',
      id_impuesto: 1,
      id_categoria: 5,
      descuento_maximo: 0,
      destacado: 0,
      activo: 1
    },
    {
      id_producto: 10,
      codigo_producto: 'PEGA-001',
      nombre: 'Pegacol Extra Cerámica',
      descripcion: 'Adhesivo para pegar icopor y PVC. Alta resistencia y secado rápido.',
      especificaciones_tecnicas: 'Bolsa 25 kg | Rendimiento 4-5 m²/bolsa | Tiempo abierto 20 min',
      marca: 'Corona',
      modelo: 'Extra',
      unidad_medida: 'Bolsa',
      presentacion: '25 kg',
      color: 'Gris',
      acabado: 'N/A',
      material: 'Cemento + polímeros',
      precio_compra: 22000,
      precio_venta: 32000,
      precio_mayorista: 28000,
      imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 3,
      descuento_maximo: 10,
      destacado: 1,
      activo: 1
    },
    {
      id_producto: 11,
      codigo_producto: 'MAT-001',
      nombre: 'Graniplast Textura Fina',
      descripcion: 'Acabado granulado para fachadas. Textura fina y alta durabilidad.',
      especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 2-3 m²/kg | Impermeable',
      marca: 'Revestex',
      modelo: 'Textura Fina',
      unidad_medida: 'Cubeta',
      presentacion: '25 kg',
      color: 'Blanco',
      acabado: 'Granulado',
      material: 'Polímero + áridos',
      precio_compra: 55000,
      precio_venta: 78000,
      precio_mayorista: 70000,
      imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 2,
      descuento_maximo: 10,
      destacado: 1,
      activo: 1
    },
    {
      id_producto: 12,
      codigo_producto: 'DRY-001',
      nombre: 'Lámina Drywall Standard 1/2"',
      descripcion: 'Lámina de yeso standard para divisiones internas. Medidas 1.22x2.44m.',
      especificaciones_tecnicas: '1.22m x 2.44m x 1/2" | 9.5kg | Panel yeso estándar',
      marca: 'USG',
      modelo: 'Standard',
      unidad_medida: 'Unidad',
      presentacion: '1 Lámina',
      color: 'Blanco',
      acabado: 'Liso',
      material: 'Yeso con papel revestido',
      precio_compra: 18000,
      precio_venta: 28000,
      precio_mayorista: 25000,
      imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      id_impuesto: 3,
      id_categoria: 4,
      descuento_maximo: 15,
      destacado: 0,
      activo: 1
    }
  ],

  // ── SERVICIOS ──────────────────────────────────────────────
  servicios: [
    {
      id_servicio: 1,
      codigo_servicio: 'SERV-001',
      nombre_servicio: 'Instalación de Drywall',
      descripcion: 'Instalación profesional de paneles de drywall para divisiones y cielorrasos',
      tipo_servicio: 'drywall',
      incluye_materiales: 1,
      precio_hora: 85000,
      precio_proyecto: null,
      duracion_estimada_horas: 8,
      imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      id_impuesto: 1,
      activo: 1,
      destacado: 0,
      rating: 4.8,
      num_resenas: 23,
      garantia_meses: 6,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm',
      zona_cobertura: 'Pitalito, Tesalia, La Plata, Neiva',
      que_incluye: [
        'Materiales de drywall (láminas y perfilería)',
        'Mano de obra especializada',
        'Aislamiento acústico básico',
        'Limpieza del área al finalizar'
      ],
      como_funciona: [
        { titulo: 'Visita técnica', descripcion: 'Un técnico visita el sitio para tomar medidas y evaluar el proyecto.' },
        { titulo: 'Cotización y agenda', descripcion: 'Recibes el presupuesto y agendamos la fecha de instalación.' },
        { titulo: 'Instalación', descripcion: 'Nuestro equipo instala el drywall siguiendo los estándares de calidad.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos contigo el trabajo terminado y entregamos la garantía.' }
      ],
      galeria: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80',
        'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80'
      ]
    },
    {
      id_servicio: 2,
      codigo_servicio: 'SERV-002',
      nombre_servicio: 'Aplicación de Pintura',
      descripcion: 'Aplicación de pintura en interiores y exteriores con acabado profesional',
      tipo_servicio: 'aplicacion_pintura',
      incluye_materiales: 0,
      precio_hora: 15000,
      precio_proyecto: null,
      duracion_estimada_horas: 4,
      imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      id_impuesto: 1,
      activo: 1,
      destacado: 1,
      rating: 4.9,
      num_resenas: 41,
      garantia_meses: 3,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm',
      zona_cobertura: 'Pitalito, Tesalia, La Plata, Neiva, Garzón',
      que_incluye: [
        'Mano de obra especializada',
        'Protección de muebles y pisos',
        'Aplicación de 2 manos de pintura',
        'Limpieza del área al finalizar'
      ],
      como_funciona: [
        { titulo: 'Visita técnica', descripcion: 'Evaluamos las superficies y calculamos la cantidad de pintura necesaria.' },
        { titulo: 'Cotización y agenda', descripcion: 'Recibes el presupuesto y agendamos la fecha de trabajo.' },
        { titulo: 'Aplicación', descripcion: 'Aplicamos la pintura con técnicas profesionales para un acabado uniforme.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos contigo el resultado y entregamos la garantía.' }
      ],
      galeria: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80'
      ]
    },
    {
      id_servicio: 3,
      codigo_servicio: 'SERV-003',
      nombre_servicio: 'Asesoría en Diseño de Interiores',
      descripcion: 'Asesoría personalizada para diseño y decoración de interiores',
      tipo_servicio: 'asesoria',
      incluye_materiales: 0,
      precio_hora: 50000,
      precio_proyecto: null,
      duracion_estimada_horas: 2,
      imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
      id_impuesto: 2,
      activo: 1,
      destacado: 1,
      rating: 4.7,
      num_resenas: 15,
      garantia_meses: 1,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm',
      zona_cobertura: 'Pitalito, Tesalia, San Agustín',
      que_incluye: [
        'Visita y diagnóstico del espacio',
        'Propuesta de paleta de colores',
        'Recomendación de materiales y acabados',
        'Plano conceptual básico'
      ],
      como_funciona: [
        { titulo: 'Agenda tu cita', descripcion: 'Coordinamos una visita o videollamada según prefieras.' },
        { titulo: 'Diagnóstico', descripcion: 'Analizamos el espacio, la luz y tus necesidades.' },
        { titulo: 'Propuesta', descripcion: 'Te entregamos una propuesta con colores, materiales y distribución.' },
        { titulo: 'Acompañamiento', descripcion: 'Te asesoramos durante la compra e implementación.' }
      ],
      galeria: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'
      ]
    },
    {
      id_servicio: 4,
      codigo_servicio: 'SERV-004',
      nombre_servicio: 'Instalación de PVC',
      descripcion: 'Instalación de paneles de PVC para paredes y techos',
      tipo_servicio: 'pvc',
      incluye_materiales: 1,
      precio_hora: null,
      precio_proyecto: 120000,
      duracion_estimada_horas: 6,
      imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&q=80',
      id_impuesto: 1,
      activo: 1,
      destacado: 0,
      rating: 4.6,
      num_resenas: 9,
      garantia_meses: 12,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm',
      zona_cobertura: 'Pitalito, Tesalia',
      que_incluye: [
        'Láminas de PVC y perfilería',
        'Mano de obra especializada',
        'Sellado de uniones',
        'Limpieza del área al finalizar'
      ],
      como_funciona: [
        { titulo: 'Visita técnica', descripcion: 'Medimos el área y definimos el diseño con el cliente.' },
        { titulo: 'Cotización y agenda', descripcion: 'Presupuesto claro y fecha de instalación acordada.' },
        { titulo: 'Instalación', descripcion: 'Instalamos los paneles de PVC con acabado profesional.' },
        { titulo: 'Entrega final', descripcion: 'Revisión final del trabajo y entrega de garantía.' }
      ],
      galeria: [
        'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80',
        'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80'
      ]
    },
    {
      id_servicio: 5,
      codigo_servicio: 'SERV-005',
      nombre_servicio: 'Mantenimiento General',
      descripcion: 'Mantenimiento correctivo y preventivo de acabados en general',
      tipo_servicio: 'mantenimiento',
      incluye_materiales: 0,
      precio_hora: null,
      precio_proyecto: 25000,
      duracion_estimada_horas: 3,
      imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
      id_impuesto: 1,
      activo: 1,
      destacado: 0,
      rating: 4.5,
      num_resenas: 12,
      garantia_meses: 2,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm',
      zona_cobertura: 'Pitalito, Tesalia, La Plata',
      que_incluye: [
        'Diagnóstico del daño o desgaste',
        'Mano de obra especializada',
        'Materiales menores de reparación',
        'Limpieza del área al finalizar'
      ],
      como_funciona: [
        { titulo: 'Solicitud', descripcion: 'Nos cuentas qué necesita mantenimiento o reparación.' },
        { titulo: 'Diagnóstico', descripcion: 'Un técnico evalúa el daño y define el alcance del trabajo.' },
        { titulo: 'Ejecución', descripcion: 'Realizamos la reparación o mantenimiento acordado.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos el resultado contigo antes de finalizar.' }
      ],
      galeria: [
        'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80'
      ]
    }
  ],

  // ── INVENTARIO ─────────────────────────────────────────────
  inventario: [
    { id_inventario: 1, id_producto: 1, cantidad_disponible: 50, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 200, ubicacion_bodega: 'Bodega A - Estante 1' },
    { id_inventario: 2, id_producto: 2, cantidad_disponible: 35, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 150, ubicacion_bodega: 'Bodega A - Estante 2' },
    { id_inventario: 3, id_producto: 3, cantidad_disponible: 40, cantidad_reservada: 2, stock_minimo: 10, stock_maximo: 150, ubicacion_bodega: 'Bodega A - Estante 3' },
    { id_inventario: 4, id_producto: 4, cantidad_disponible: 20, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 100, ubicacion_bodega: 'Bodega B - Estante 1' },
    { id_inventario: 5, id_producto: 5, cantidad_disponible: 15, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 80, ubicacion_bodega: 'Bodega B - Estante 2' },
    { id_inventario: 6, id_producto: 6, cantidad_disponible: 60, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 200, ubicacion_bodega: 'Bodega C - Estante 1' },
    { id_inventario: 7, id_producto: 7, cantidad_disponible: 25, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 100, ubicacion_bodega: 'Bodega C - Estante 2' },
    { id_inventario: 8, id_producto: 8, cantidad_disponible: 45, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 150, ubicacion_bodega: 'Bodega A - Estante 4' },
    { id_inventario: 9, id_producto: 9, cantidad_disponible: 80, cantidad_reservada: 0, stock_minimo: 20, stock_maximo: 300, ubicacion_bodega: 'Bodega C - Estante 3' },
    { id_inventario: 10, id_producto: 10, cantidad_disponible: 200, cantidad_reservada: 0, stock_minimo: 30, stock_maximo: 500, ubicacion_bodega: 'Bodega C - Estante 3' },
    { id_inventario: 11, id_producto: 11, cantidad_disponible: 3, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 50, ubicacion_bodega: 'Bodega C - Estante 4' },
    { id_inventario: 12, id_producto: 12, cantidad_disponible: 18, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 60, ubicacion_bodega: 'Bodega B - Estante 3' }
  ],

  // ── COTIZACIONES ───────────────────────────────────────────
  cotizaciones: [
    { id_cotizacion: 1, numero_cotizacion: 'COT-001', id_usuario: 3, fecha: '2026-04-24', estado: 'pendiente', total_estimado: 185000, observaciones: 'Cliente solicita cotización para remodelación de sala', validez_dias: 15 },
    { id_cotizacion: 2, numero_cotizacion: 'COT-002', id_usuario: 2, fecha: '2026-04-24', estado: 'aprobada', total_estimado: 450000, observaciones: 'Cotización para proyecto de oficina', validez_dias: 15 },
    { id_cotizacion: 3, numero_cotizacion: 'COT-003', id_usuario: 3, fecha: '2026-04-25', estado: 'convertida_venta', total_estimado: 98000, observaciones: 'Cliente aprobó y realizó compra', validez_dias: 15 }
  ],

  // ── VENTAS ─────────────────────────────────────────────────
  ventas: [
    { id_venta: 1, numero_venta: 'VEN-2026-001', id_usuario: 3, id_cotizacion: 3, fecha: '2026-04-25', subtotal: 82353, descuento: 0, iva_total: 15647, total: 98000, estado: 'completada', metodo_pago: 'transferencia', notas_cliente: 'Entrega en domicilio', fecha_entrega_real: '2026-04-27' },
    { id_venta: 2, numero_venta: 'VEN-2026-002', id_usuario: 4, id_cotizacion: null, fecha: '2026-04-26', subtotal: 126050, descuento: 5000, iva_total: 0, total: 121050, estado: 'completada', metodo_pago: 'efectivo', notas_cliente: null, fecha_entrega_real: '2026-04-26' },
    { id_venta: 3, numero_venta: 'VEN-2026-003', id_usuario: 5, id_cotizacion: null, fecha: '2026-05-01', subtotal: 62500, descuento: 0, iva_total: 0, total: 62500, estado: 'en_proceso', metodo_pago: 'nequi', notas_cliente: 'Llamar antes de entregar', fecha_entrega_real: null },
    { id_venta: 4, numero_venta: 'VEN-2026-004', id_usuario: 3, id_cotizacion: null, fecha: '2026-05-10', subtotal: 230000, descuento: 10000, iva_total: 0, total: 220000, estado: 'pendiente', metodo_pago: 'tarjeta', notas_cliente: null, fecha_entrega_real: null },
    { id_venta: 5, numero_venta: 'VEN-2026-005', id_usuario: 4, id_cotizacion: null, fecha: '2026-05-15', subtotal: 96000, descuento: 0, iva_total: 0, total: 96000, estado: 'completada', metodo_pago: 'transferencia', notas_cliente: null, fecha_entrega_real: '2026-05-17' }
  ],

  // ── DETALLE VENTAS ─────────────────────────────────────────
  detalle_ventas: [
    { id_detalle: 1, id_venta: 1, id_producto: 1, cantidad: 1, precio_unitario: 45000, subtotal: 45000 },
    { id_detalle: 2, id_venta: 1, id_producto: 3, cantidad: 1, precio_unitario: 38000, subtotal: 38000 },
    { id_detalle: 3, id_venta: 2, id_producto: 1, cantidad: 2, precio_unitario: 45000, subtotal: 90000 },
    { id_detalle: 4, id_venta: 2, id_producto: 6, cantidad: 1, precio_unitario: 18000, subtotal: 18000 },
    { id_detalle: 5, id_venta: 3, id_producto: 10, cantidad: 1, precio_unitario: 32000, subtotal: 32000 },
    { id_detalle: 6, id_venta: 3, id_producto: 11, cantidad: 1, precio_unitario: 78000, subtotal: 78000 },
    { id_detalle: 7, id_venta: 4, id_producto: 4, cantidad: 2, precio_unitario: 62000, subtotal: 124000 },
    { id_detalle: 8, id_venta: 4, id_producto: 5, cantidad: 2, precio_unitario: 55000, subtotal: 110000 },
    { id_detalle: 9, id_venta: 5, id_producto: 2, cantidad: 2, precio_unitario: 48000, subtotal: 96000 }
  ],

  // ── PQRS ───────────────────────────────────────────────────
  pqrs: [
    { id_pqrs: 1, numero_pqrs: 'PQRS-2026-001', id_usuario: 3, tipo: 'queja', asunto: 'Demora en entrega', descripcion: 'Mi pedido lleva 5 días y no ha llegado', estado: 'en_proceso', prioridad: 'alta', fecha_creacion: '2026-04-28' },
    { id_pqrs: 2, numero_pqrs: 'PQRS-2026-002', id_usuario: 4, tipo: 'peticion', asunto: 'Solicitud de catálogo', descripcion: 'Quisiera recibir el catálogo completo de productos', estado: 'resuelta', prioridad: 'baja', fecha_creacion: '2026-04-30', fecha_resolucion: '2026-05-02', respuesta: 'Se envió catálogo al correo registrado' },
    { id_pqrs: 3, numero_pqrs: 'PQRS-2026-003', id_usuario: 5, tipo: 'sugerencia', asunto: 'Mejorar empaque', descripcion: 'Los productos deberían venir con mejor empaque para evitar daños', estado: 'recibida', prioridad: 'media', fecha_creacion: '2026-05-05' }
  ],

  // ── PROMOCIONES ────────────────────────────────────────────
  promociones: [
    {
      id: 1,
      titulo: '¡Gran Descuento en Pinturas!',
      descripcion: 'Hasta 20% de descuento en toda la línea de vinilos tipo 1 y 2. Aplica para compras mayores a $150.000.',
      imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
      tipo: 'descuento',
      descuento_porcentaje: 20,
      fecha_inicio: '2026-05-01',
      fecha_fin: '2026-05-31',
      activo: 1
    },
    {
      id: 2,
      titulo: 'Combo Acabados Profesionales',
      descripcion: 'Lleva Estuco + Rodillo + Brocha por solo $55.000. Ahorra más de $15.000 en materiales premium.',
      imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      tipo: 'combo',
      precio_especial: 55000,
      fecha_inicio: '2026-05-10',
      fecha_fin: '2026-06-10',
      activo: 1
    },
    {
      id: 3,
      titulo: 'Servicio de Pintura con 10% OFF',
      descripcion: 'Contrata nuestro servicio de aplicación de pintura este mes y obtén 10% de descuento. Incluye mano de obra especializada.',
      imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
      tipo: 'servicio',
      descuento_porcentaje: 10,
      fecha_inicio: '2026-05-15',
      fecha_fin: '2026-06-15',
      activo: 1
    }
  ],

  // ── CONFIGURACIÓN ──────────────────────────────────────────
  configuracion: {
    nombre_empresa: 'Acabados y Diseños 1A',
    nit: '1079409325-1',
    telefono: '3101234567',
    email: 'info@acabados1a.com',
    direccion: 'Calle 5 #10-20, Tesalia',
    ciudad: 'Tesalia',
    departamento: 'Huila',
    facebook: 'https://facebook.com/acabados1a',
    instagram: 'https://instagram.com/acabados1a',
    whatsapp: '573101234567',
    horario: 'Lunes a Sábado: 8:00am - 6:00pm',
    mision: 'Brindar soluciones integrales en acabados y diseño de espacios, ofreciendo productos de alta calidad y servicios especializados que transformen los hogares y empresas de nuestros clientes.',
    vision: 'Ser la empresa líder en acabados y diseño de interiores del suroccidente colombiano, reconocida por la calidad de nuestros productos, la excelencia en el servicio y nuestro compromiso con la satisfacción del cliente.'
  }
};

// ── CARRITO (LocalStorage) ─────────────────────────────────
const CartManager = {
  getCart() {
    const cart = localStorage.getItem('acabados1a_cart');
    return cart ? JSON.parse(cart) : [];
  },
  saveCart(cart) {
    localStorage.setItem('acabados1a_cart', JSON.stringify(cart));
    this.updateCartBadge();
  },
  addItem(producto, cantidad = 1) {
    const cart = this.getCart();
    const existing = cart.find(i => i.id_producto === producto.id_producto);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      cart.push({ ...producto, cantidad });
    }
    this.saveCart(cart);
  },
  removeItem(id_producto) {
    const cart = this.getCart().filter(i => i.id_producto !== id_producto);
    this.saveCart(cart);
  },
  updateQuantity(id_producto, cantidad) {
    const cart = this.getCart();
    const item = cart.find(i => i.id_producto === id_producto);
    if (item) {
      item.cantidad = cantidad;
      if (item.cantidad <= 0) return this.removeItem(id_producto);
    }
    this.saveCart(cart);
  },
  clearCart() {
    localStorage.removeItem('acabados1a_cart');
    this.updateCartBadge();
  },
  getTotal() {
    return this.getCart().reduce((sum, i) => sum + (i.precio_venta * i.cantidad), 0);
  },
  getCount() {
    return this.getCart().reduce((sum, i) => sum + i.cantidad, 0);
  },
  updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      const count = this.getCount();
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
};

// ── AUTH (LocalStorage) ────────────────────────────────────
const Auth = {
  login(email, password) {
    const user = MockData.usuarios.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('acabados1a_user', JSON.stringify(user));
      return user;
    }
    return null;
  },
  logout() {
    localStorage.removeItem('acabados1a_user');
    window.location.href = 'index.html';
  },
  getCurrentUser() {
    const u = localStorage.getItem('acabados1a_user');
    return u ? JSON.parse(u) : null;
  },
  isLoggedIn() {
    return !!this.getCurrentUser();
  },
  isAdmin() {
    const u = this.getCurrentUser();
    return u && u.id_rol === 1;
  },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

// ── HELPERS ────────────────────────────────────────────────
const Helpers = {
  formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);
  },
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
  },
  getStockStatus(id_producto) {
    const inv = MockData.inventario.find(i => i.id_producto === id_producto);
    if (!inv) return { label: 'Sin inventario', class: 'out' };
    if (inv.cantidad_disponible === 0) return { label: 'Agotado', class: 'out' };
    if (inv.cantidad_disponible <= inv.stock_minimo) return { label: 'Stock bajo', class: 'low' };
    return { label: 'Disponible', class: 'in' };
  },
  getProductStock(id_producto) {
    const inv = MockData.inventario.find(i => i.id_producto === id_producto);
    return inv ? inv.cantidad_disponible : 0;
  },
  getCategoryName(id_categoria) {
    const cat = MockData.categorias.find(c => c.id_categoria === id_categoria);
    return cat ? cat.nombre : 'Sin categoría';
  },
  getUserName(id_usuario) {
    const u = MockData.usuarios.find(u => u.id_usuario === id_usuario);
    return u ? `${u.nombre} ${u.apellido}` : 'Desconocido';
  },
  showLoader(container) {
    return `<div class="skeleton-grid">${Array(6).fill('<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>').join('')}</div>`;
  }
};

// Inicializar badge al cargar
document.addEventListener('DOMContentLoaded', () => CartManager.updateCartBadge());
