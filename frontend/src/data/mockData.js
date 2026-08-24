// ============================================================
// ACABADOS Y DISEÑOS 1A WEB — Mock Data
// Portado desde github-frontend/assets/data/mockdata.js
// Refleja la estructura real de la base de datos (acabadosydiseños1a24abril.sql)
// Se usa como fuente temporal mientras el backend Spring no está disponible.
// ============================================================

export const MockData = {

  // ── ROLES ──────────────────────────────────────────────────
  roles: [
    { id_rol: 1, nombre_rol: 'Administrador', descripcion: 'Acceso total al sistema' },
    { id_rol: 2, nombre_rol: 'Cliente', descripcion: 'Puede comprar y ver su historial' },
    { id_rol: 3, nombre_rol: 'Vendedor', descripcion: 'Empleado que gestiona ventas' }
  ],

  // ── USUARIOS ───────────────────────────────────────────────
  usuarios: [
    {
      id_usuario: 1, tipo_identificacion: 'CC', numero_identificacion: '1079409325',
      nombre: 'Jose Miguel', apellido: 'Martinez Perdomo', fecha_nacimiento: '2000-05-18',
      email: 'josemiguel@acabados1a.com', telefono: '3101234567', whatsapp: '3101234567',
      direccion: 'Calle 5 #10-20', ciudad: 'Pitalito', departamento: 'Huila',
      id_rol: 1, estado: 1, password: 'admin2026'
    },
    {
      id_usuario: 2, tipo_identificacion: 'CC', numero_identificacion: '1079409357',
      nombre: 'Juliana Valentina', apellido: 'Trujillo Mendez', fecha_nacimiento: '2001-03-15',
      email: 'juliana@acabados1a.com', telefono: '3159876543', whatsapp: '3159876543',
      direccion: 'Carrera 3 #8-45', ciudad: 'Pitalito', departamento: 'Huila',
      id_rol: 1, estado: 1, password: 'admin2026'
    },
    {
      id_usuario: 3, tipo_identificacion: 'CC', numero_identificacion: '3004561234',
      nombre: 'Carlos Andres', apellido: 'Gomez Ruiz', fecha_nacimiento: '1990-07-22',
      email: 'carlos.gomez@gmail.com', telefono: '3004561234', whatsapp: '3004561234',
      direccion: 'Avenida 1 #15-30', ciudad: 'Pitalito', departamento: 'Huila',
      id_rol: 2, estado: 1, password: 'cliente123'
    },
    {
      id_usuario: 4, tipo_identificacion: 'CC', numero_identificacion: '1075401233',
      nombre: 'Maria Fernanda', apellido: 'Lopez Torres', fecha_nacimiento: '1995-11-08',
      email: 'mfernanda.lopez@gmail.com', telefono: '3117894567', whatsapp: '3117894567',
      direccion: 'Calle 10 #5-12', ciudad: 'La Plata', departamento: 'Huila',
      id_rol: 2, estado: 1, password: 'cliente123'
    },
    {
      id_usuario: 5, tipo_identificacion: 'CC', numero_identificacion: '1075801344',
      nombre: 'Pedro Antonio', apellido: 'Vargas Silva', fecha_nacimiento: '1988-02-14',
      email: 'pedro.vargas@hotmail.com', telefono: '3286547891', whatsapp: '3286547891',
      direccion: 'Carrera 7 #20-55', ciudad: 'Neiva', departamento: 'Huila',
      id_rol: 2, estado: 1, password: 'cliente123'
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
    { id_producto: 1, codigo_producto: 'PINT-001', nombre: 'Vinilo Interior Tipo 1 Blanco', descripcion: 'Pintura acrílica blanca mate, ideal para paredes y cielorrasos de interiores: salas, habitaciones, pasillos y oficinas. Se aplica sobre superficies de mampostería, pañete, drywall o estuco ya preparadas. Cubrimiento uniforme, resistente al lavado suave y sin olores fuertes. Rendimiento 12-14 m²/L, secado rápido al tacto.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min | Secado total 2h', marca: 'Pintuco', modelo: 'Tipo 1', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Blanco', acabado: 'Mate', material: 'Acrílico base agua', peso_kg: 4.5, precio_compra: 32000, precio_venta: 45000, precio_mayorista: 40000, imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 1, activo: 1, grupo_variante: 'vinilo-int-blanco-t1', tamano: '1 Gal.', orden_variante: 2 },
    { id_producto: 2, codigo_producto: 'PINT-002', nombre: 'Pintura Azul Pastel', descripcion: 'Pintura vinilo tipo 2 en azul pastel, perfecta para darle un toque fresco y relajante a habitaciones, salas y espacios de descanso. Acabado mate premium que disimula pequeñas imperfecciones del muro. Ideal para interiores sobre pañete, estuco o drywall ya imprimados.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min', marca: 'Pintuco', modelo: 'Tipo 2', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Azul Pastel', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 34000, precio_venta: 48000, precio_mayorista: 43000, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 1, activo: 1, grupo_variante: 'vinilo-int-azul-t2', tamano: '1 Gal.', orden_variante: 2 },
    { id_producto: 3, codigo_producto: 'PINT-003', nombre: 'Estuco Plástico', descripcion: 'Estuco plástico para acabados decorativos en paredes. Fácil aplicación.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 8-10 m²/kg | Tiempo de secado 4-6h', marca: 'Corona', modelo: 'Estándar', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Blanco', acabado: 'Liso', material: 'Polímero acrílico', precio_compra: 28000, precio_venta: 38000, precio_mayorista: 34000, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 15, destacado: 1, activo: 1 },
    { id_producto: 4, codigo_producto: 'PINT-004', nombre: 'Vinilo Mate Exterior Tipo 2', descripcion: 'Pintura vinilo mate formulada para fachadas y muros exteriores expuestos al sol, la lluvia y la humedad. Alta resistencia a la intemperie y a los rayos UV sin decolorarse. Se aplica sobre mampostería, pañete o concreto ya curado; ideal para fachadas de casas, locales y edificios.', especificaciones_tecnicas: 'Base agua | UV-resistente | Rendimiento 10-12 m²/L', marca: 'Sherwin Williams', modelo: 'Exterior Pro', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Blanco Hueso', acabado: 'Mate', material: 'Látex acrílico', precio_compra: 42000, precio_venta: 62000, precio_mayorista: 56000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-ext-blanco-t2', tamano: '1 Gal.', orden_variante: 2 },
    { id_producto: 5, codigo_producto: 'PINT-005', nombre: 'Esmalte Brillante', descripcion: 'Esmalte de alta durabilidad para superficies de madera y metal: puertas, ventanas, rejas, muebles y estructuras metálicas. Acabado brillante que resalta el color y protege contra el desgaste diario. Ideal tanto para interiores como para elementos exteriores bajo techo.', especificaciones_tecnicas: 'Base aceite | Rendimiento 10 m²/L | Secado total 24h', marca: 'Pintuco', modelo: 'Esmalte Pro', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Blanco', acabado: 'Brillante', material: 'Alquídico', precio_compra: 38000, precio_venta: 55000, precio_mayorista: 49000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 5, destacado: 1, activo: 1 },
    { id_producto: 6, codigo_producto: 'HERR-001', nombre: 'Rodillo para Pintura 9"', descripcion: 'Rodillo profesional de 9 pulgadas. Manga de microfibra para acabado perfecto.', especificaciones_tecnicas: 'Medida 9" | Manga microfibra | Mango ergonómico', marca: 'Purdy', modelo: 'Pro', unidad_medida: 'unidad', presentacion: 'Kit rodillo + bandeja', color: 'N/A', acabado: 'N/A', material: 'Plástico + Microfibra', precio_compra: 12000, precio_venta: 18000, precio_mayorista: 16000, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 5, destacado: 1, activo: 1 },
    { id_producto: 7, codigo_producto: 'HERR-002', nombre: 'Brocha Plana 2"', descripcion: 'Brocha de 2 pulgadas para acabados finos. Cerdas naturales premium.', especificaciones_tecnicas: 'Medida 2" | Cerdas naturales | Mango madera', marca: 'Omega', modelo: 'Plana', unidad_medida: 'unidad', presentacion: '1 Unidad', color: 'N/A', acabado: 'N/A', material: 'Madera + Cerdas naturales', precio_compra: 5000, precio_venta: 8500, precio_mayorista: 7500, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 8, codigo_producto: 'HERR-003', nombre: 'Lijas para Muro', descripcion: 'Lijas finas para acabados de paredes. Pack x10 unidades. Grano 120.', especificaciones_tecnicas: 'Grano 120 | 10 unidades | Papel abrasivo', marca: 'Norton', modelo: 'Grano 120', unidad_medida: 'unidad', presentacion: 'Pack x10', color: 'N/A', acabado: 'N/A', material: 'Papel abrasivo', precio_compra: 4000, precio_venta: 6500, precio_mayorista: 5800, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 9, codigo_producto: 'HERR-004', nombre: 'Cinta de Enmascarar', descripcion: 'Cinta para proteger áreas durante la pintura. No deja residuo.', especificaciones_tecnicas: 'Ancho 1" | 40 metros | Papel crepe', marca: '3M', modelo: '101E', unidad_medida: 'rollo', presentacion: '40m x 1"', color: 'Crema', acabado: 'N/A', material: 'Papel crepe + adhesivo', precio_compra: 3500, precio_venta: 5800, precio_mayorista: 5200, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 10, codigo_producto: 'PEGA-001', nombre: 'Pegacol Extra Cerámica', descripcion: 'Adhesivo para pegar icopor y PVC. Alta resistencia y secado rápido.', especificaciones_tecnicas: 'Bolsa 25 kg | Rendimiento 4-5 m²/bolsa | Tiempo abierto 20 min', marca: 'Corona', modelo: 'Extra', unidad_medida: 'bulto', presentacion: '25 kg', color: 'Gris', acabado: 'N/A', material: 'Cemento + polímeros', precio_compra: 22000, precio_venta: 32000, precio_mayorista: 28000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 3, descuento_maximo: 10, destacado: 1, activo: 1 },
    { id_producto: 11, codigo_producto: 'MAT-001', nombre: 'Graniplast Textura Fina', descripcion: 'Acabado granulado para fachadas. Textura fina y alta durabilidad.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 2-3 m²/kg | Impermeable', marca: 'Revestex', modelo: 'Textura Fina', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Blanco', acabado: 'Granulado', material: 'Polímero + áridos', precio_compra: 55000, precio_venta: 78000, precio_mayorista: 70000, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 1, activo: 1, grupo_variante: 'graniplast-textura-fina', tamano: 'Blanco', orden_variante: 1 },
    { id_producto: 12, codigo_producto: 'DRY-001', nombre: 'Lámina Drywall Standard 1/2"', descripcion: 'Lámina de yeso standard para divisiones internas. Medidas 1.22x2.44m.', especificaciones_tecnicas: '1.22m x 2.44m x 1/2" | 9.5kg | Panel yeso estándar', marca: 'USG', modelo: 'Standard', unidad_medida: 'unidad', presentacion: '1 Lámina', color: 'Blanco', acabado: 'Liso', material: 'Yeso con papel revestido', precio_compra: 18000, precio_venta: 28000, precio_mayorista: 25000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 15, destacado: 1, activo: 1 },
    { id_producto: 13, codigo_producto: 'PINT-006', nombre: 'Vinilo Interior Tipo 3 Gris Perla', descripcion: 'Pintura vinilo tipo 3 en gris perla, pensada para acabados modernos y minimalistas en salas, oficinas y habitaciones. Combina bien con madera, blanco y tonos cálidos. Se aplica en interiores sobre pañete, estuco o drywall imprimado, con muy buen poder de cubrimiento.', especificaciones_tecnicas: 'Base agua | Rendimiento 11-13 m²/L | Secado al tacto 30 min', marca: 'Pintuco', modelo: 'Tipo 3', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Gris Perla', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 30000, precio_venta: 44000, precio_mayorista: 39000, imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 1, activo: 1 },
    { id_producto: 14, codigo_producto: 'PINT-007', nombre: 'Anticorrosivo Multisuperficie', descripcion: 'Base anticorrosiva que se aplica sobre estructuras metálicas (rejas, portones, cerchas, tubería) antes de la pintura de acabado, evitando que el óxido dañe el trabajo terminado. Acabado satinado, ideal para exteriores expuestos a humedad.', especificaciones_tecnicas: 'Base solvente | Rendimiento 9-10 m²/L | Secado total 12h', marca: 'Pintuco', modelo: 'Protector Metal', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Gris', acabado: 'Satinado', material: 'Alquídico', precio_compra: 36000, precio_venta: 52000, precio_mayorista: 47000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 5, destacado: 0, activo: 1 },
    { id_producto: 15, codigo_producto: 'MAT-002', nombre: 'Estuco Exterior Impermeabilizante', descripcion: 'Estuco para fachadas con propiedades impermeabilizantes. Protege contra la humedad.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 7-9 m²/kg | Impermeable', marca: 'Corona', modelo: 'Exterior Pro', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Blanco', acabado: 'Liso', material: 'Polímero acrílico impermeable', precio_compra: 33000, precio_venta: 46000, precio_mayorista: 41000, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 1, activo: 1 },
    { id_producto: 16, codigo_producto: 'MAT-003', nombre: 'Graniplast Textura Gruesa', descripcion: 'Acabado granulado grueso para fachadas de alto tráfico. Máxima durabilidad.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 2-3 m²/kg | Alta resistencia', marca: 'Revestex', modelo: 'Textura Gruesa', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Gris Piedra', acabado: 'Granulado Grueso', material: 'Polímero + áridos', precio_compra: 58000, precio_venta: 82000, precio_mayorista: 74000, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 1, activo: 1 },
    { id_producto: 17, codigo_producto: 'PEGA-002', nombre: 'Pegante para PVC e Icopor', descripcion: 'Adhesivo especializado para instalación de paneles PVC e icopor decorativo.', especificaciones_tecnicas: 'Tarro 1 Galón | Rendimiento 6-8 m²/galón | Secado rápido', marca: '3M', modelo: 'PVC-Icopor', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Transparente', acabado: 'N/A', material: 'Resina sintética', precio_compra: 24000, precio_venta: 35000, precio_mayorista: 31000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 3, descuento_maximo: 10, destacado: 1, activo: 1 },
    { id_producto: 18, codigo_producto: 'PEGA-003', nombre: 'Sellador Acrílico Multiuso', descripcion: 'Sellador para juntas y fisuras antes de pintar. Uso interior y exterior.', especificaciones_tecnicas: 'Cartucho 300ml | Aplicación con pistola | Pintable', marca: 'Sika', modelo: 'Multiuso', unidad_medida: 'unidad', presentacion: '300 ml', color: 'Blanco', acabado: 'N/A', material: 'Acrílico sellante', precio_compra: 9000, precio_venta: 14000, precio_mayorista: 12500, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 1, id_categoria: 3, descuento_maximo: 0, destacado: 1, activo: 1 },
    { id_producto: 19, codigo_producto: 'DRY-002', nombre: 'Lámina Drywall Resistente a la Humedad 1/2"', descripcion: 'Lámina de yeso resistente a la humedad para baños y cocinas. Medidas 1.22x2.44m.', especificaciones_tecnicas: '1.22m x 2.44m x 1/2" | 10.2kg | Núcleo hidrófugo', marca: 'USG', modelo: 'Humedad', unidad_medida: 'unidad', presentacion: '1 Lámina', color: 'Verde', acabado: 'Liso', material: 'Yeso hidrófugo con papel revestido', precio_compra: 24000, precio_venta: 36000, precio_mayorista: 32000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 10, destacado: 1, activo: 1 },
    { id_producto: 20, codigo_producto: 'DRY-003', nombre: 'Perfil Metálico para Drywall', descripcion: 'Riel metálico galvanizado para estructura de muros y cielorrasos en drywall.', especificaciones_tecnicas: 'Riel 3 metros | Calibre 26 | Galvanizado' , marca: 'USG', modelo: 'Riel Estándar', unidad_medida: 'metro', presentacion: 'Riel 3m', color: 'Galvanizado', acabado: 'N/A', material: 'Acero galvanizado', precio_compra: 9000, precio_venta: 14500, precio_mayorista: 13000, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 21, codigo_producto: 'HERR-005', nombre: 'Kit de Espátulas para Estuco x3', descripcion: 'Kit de 3 espátulas de diferentes medidas para aplicación de estuco y masilla.', especificaciones_tecnicas: 'Medidas 4", 6", 8" | Hoja acero inoxidable | Mango ergonómico', marca: 'Stanley', modelo: 'Kit Pro', unidad_medida: 'unidad', presentacion: 'Kit x3', color: 'N/A', acabado: 'N/A', material: 'Acero inoxidable + plástico', precio_compra: 15000, precio_venta: 24000, precio_mayorista: 21000, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 5, destacado: 1, activo: 1 },
    { id_producto: 22, codigo_producto: 'HERR-006', nombre: 'Rodillo Antigota 9"', descripcion: 'Rodillo de 9 pulgadas con diseño antigota. Evita salpicaduras durante la aplicación.', especificaciones_tecnicas: 'Medida 9" | Manga antigota | Mango ergonómico', marca: 'Purdy', modelo: 'Antigota', unidad_medida: 'unidad', presentacion: 'Kit rodillo + bandeja', color: 'N/A', acabado: 'N/A', material: 'Plástico + Microfibra', precio_compra: 13000, precio_venta: 19500, precio_mayorista: 17500, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 5, destacado: 1, activo: 1 },
    { id_producto: 23, codigo_producto: 'PINT-008', nombre: 'Pintura Interior Verde Menta', descripcion: 'Pintura acrílica en verde menta, perfecta para habitaciones, salas de estudio y espacios donde se busca un ambiente fresco y relajante. Acabado mate para interiores, se aplica sobre pañete, estuco o drywall ya preparados.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min', marca: 'Pintuco', modelo: 'Tipo 2', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Verde Menta', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 33000, precio_venta: 47000, precio_mayorista: 42000, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 24, codigo_producto: 'PINT-009', nombre: 'Esmalte Sintético Negro', descripcion: 'Esmalte sintético negro de alta cobertura para muebles, puertas, rejas y estructuras metálicas. Acabado brillante que resiste el uso diario tanto en interiores como en exteriores bajo techo.', especificaciones_tecnicas: 'Base aceite | Rendimiento 10 m²/L | Secado total 24h', marca: 'Pintuco', modelo: 'Esmalte Pro', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Negro', acabado: 'Brillante', material: 'Alquídico', precio_compra: 37000, precio_venta: 53000, precio_mayorista: 47000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 5, destacado: 0, activo: 1 },
    { id_producto: 25, codigo_producto: 'MAT-004', nombre: 'Estuco Rápido Secado', descripcion: 'Estuco plástico de secado rápido, ideal para proyectos con tiempos ajustados.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 8-10 m²/kg | Secado 2-3h', marca: 'Corona', modelo: 'Rápido', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Blanco', acabado: 'Liso', material: 'Polímero acrílico', precio_compra: 30000, precio_venta: 41000, precio_mayorista: 37000, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 26, codigo_producto: 'MAT-001-BEI', nombre: 'Graniplast Textura Fina', descripcion: 'Acabado granulado para fachadas. Textura fina y alta durabilidad.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 2-3 m²/kg | Impermeable', marca: 'Revestex', modelo: 'Textura Fina', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Beige', acabado: 'Granulado', material: 'Polímero + áridos', precio_compra: 60000, precio_venta: 84000, precio_mayorista: 76000, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'graniplast-textura-fina', tamano: 'Beige', orden_variante: 2, mostrarEnCatalogo: false },
    { id_producto: 27, codigo_producto: 'PEGA-004', nombre: 'Pegante Multiuso Cerámica', descripcion: 'Adhesivo multiuso para cerámica y porcelanato en interiores y exteriores.', especificaciones_tecnicas: 'Bolsa 25 kg | Rendimiento 4-5 m²/bolsa | Tiempo abierto 25 min', marca: 'Corona', modelo: 'Multiuso', unidad_medida: 'bulto', presentacion: '25 kg', color: 'Gris', acabado: 'N/A', material: 'Cemento + polímeros', precio_compra: 23000, precio_venta: 33000, precio_mayorista: 29000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 3, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 28, codigo_producto: 'PEGA-005', nombre: 'Sellador Silicona Transparente', descripcion: 'Sellador de silicona transparente para juntas de baños y cocinas.', especificaciones_tecnicas: 'Cartucho 280ml | Resistente al agua | Secado 24h', marca: 'Sika', modelo: 'Silicona', unidad_medida: 'unidad', presentacion: '280 ml', color: 'Transparente', acabado: 'N/A', material: 'Silicona', precio_compra: 10000, precio_venta: 15500, precio_mayorista: 13800, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 1, id_categoria: 3, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 29, codigo_producto: 'DRY-004', nombre: 'Lámina Drywall Resistente al Fuego', descripcion: 'Lámina de yeso con núcleo resistente al fuego para áreas que requieren mayor seguridad.', especificaciones_tecnicas: '1.22m x 2.44m x 5/8" | 13kg | Núcleo tipo X', marca: 'USG', modelo: 'Fuego', unidad_medida: 'unidad', presentacion: '1 Lámina', color: 'Blanco', acabado: 'Liso', material: 'Yeso con fibra de vidrio', precio_compra: 28000, precio_venta: 42000, precio_mayorista: 37000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 30, codigo_producto: 'DRY-005', nombre: 'Cinta para Juntas Drywall', descripcion: 'Cinta de papel para el tratamiento de juntas en instalaciones de drywall.', especificaciones_tecnicas: 'Rollo 75m | Ancho 5cm | Papel resistente', marca: 'USG', modelo: 'Juntas', unidad_medida: 'rollo', presentacion: '75 metros', color: 'Blanco', acabado: 'N/A', material: 'Papel', precio_compra: 6000, precio_venta: 9500, precio_mayorista: 8500, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 31, codigo_producto: 'HERR-007', nombre: 'Nivel de Burbuja 60cm', descripcion: 'Nivel de burbuja profesional de 60cm para instalaciones precisas.', especificaciones_tecnicas: 'Longitud 60cm | 3 burbujas | Estructura de aluminio', marca: 'Stanley', modelo: 'Pro 60', unidad_medida: 'unidad', presentacion: '1 Unidad', color: 'Amarillo', acabado: 'N/A', material: 'Aluminio', precio_compra: 22000, precio_venta: 32000, precio_mayorista: 28500, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 5, destacado: 0, activo: 1 },
    { id_producto: 32, codigo_producto: 'HERR-008', nombre: 'Guantes de Protección', descripcion: 'Guantes resistentes para manipulación de materiales de construcción.', especificaciones_tecnicas: 'Talla única | Palma reforzada | Transpirables', marca: '3M', modelo: 'Protección', unidad_medida: 'unidad', presentacion: '1 Par', color: 'Gris', acabado: 'N/A', material: 'Poliéster + PVC', precio_compra: 6000, precio_venta: 10000, precio_mayorista: 9000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 33, codigo_producto: 'PINT-010', nombre: 'Vinilo Exterior Tipo 3 Gris', descripcion: 'Pintura vinilo tipo 3 en gris para fachadas y muros exteriores. Alta durabilidad frente al sol y la lluvia, ideal para casas, bodegas y locales comerciales que buscan un acabado sobrio y resistente.', especificaciones_tecnicas: 'Base agua | UV-resistente | Rendimiento 10-12 m²/L', marca: 'Sherwin Williams', modelo: 'Exterior Pro', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Gris', acabado: 'Mate', material: 'Látex acrílico', precio_compra: 43000, precio_venta: 63000, precio_mayorista: 57000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 34, codigo_producto: 'MAT-006', nombre: 'Estuco Plástico Blanco Extra', descripcion: 'Estuco plástico premium para acabados finos en paredes interiores.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 9-11 m²/kg | Tiempo de secado 4-6h', marca: 'Corona', modelo: 'Extra', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Blanco', acabado: 'Liso', material: 'Polímero acrílico', precio_compra: 31000, precio_venta: 43000, precio_mayorista: 39000, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 35, codigo_producto: 'PEGA-006', nombre: 'Pegacol Estándar', descripcion: 'Adhesivo estándar para instalación de icopor y paneles decorativos.', especificaciones_tecnicas: 'Bolsa 25 kg | Rendimiento 4 m²/bolsa | Tiempo abierto 20 min', marca: 'Corona', modelo: 'Estándar', unidad_medida: 'bulto', presentacion: '25 kg', color: 'Gris', acabado: 'N/A', material: 'Cemento + polímeros', precio_compra: 20000, precio_venta: 29000, precio_mayorista: 26000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 3, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 36, codigo_producto: 'HERR-009', nombre: 'Flexómetro 5m', descripcion: 'Cinta métrica retráctil de 5 metros con freno y traba.', especificaciones_tecnicas: 'Longitud 5m | Ancho de cinta 19mm | Carcasa de goma', marca: 'Stanley', modelo: 'FatMax', unidad_medida: 'unidad', presentacion: '1 Unidad', color: 'Amarillo/Negro', acabado: 'N/A', material: 'Acero + plástico', precio_compra: 15000, precio_venta: 22000, precio_mayorista: 19500, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 5, destacado: 0, activo: 1 },
    { id_producto: 37, codigo_producto: 'PINT-011', nombre: 'Vinilo Interior Tipo 1 Amarillo Suave', descripcion: 'Pintura acrílica en amarillo suave, ideal para cocinas, comedores y habitaciones infantiles donde se busca un ambiente cálido y luminoso. Acabado mate para interiores sobre pañete, estuco o drywall.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min', marca: 'Pintuco', modelo: 'Tipo 1', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Amarillo Suave', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 32000, precio_venta: 46000, precio_mayorista: 41000, imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 38, codigo_producto: 'PINT-012', nombre: 'Barniz Marino Transparente', descripcion: 'Barniz transparente de alta resistencia para madera expuesta a humedad, sol y cambios de clima: puertas exteriores, muebles de terraza, marcos de ventana. Resalta la veta natural de la madera mientras la protege.', especificaciones_tecnicas: 'Base aceite | Rendimiento 10-12 m²/L | Secado total 18h', marca: 'Pintuco', modelo: 'Marino', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Transparente', acabado: 'Brillante', material: 'Alquídico marino', precio_compra: 41000, precio_venta: 59000, precio_mayorista: 53000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 5, destacado: 0, activo: 1 },
    { id_producto: 39, codigo_producto: 'PINT-013', nombre: 'Pintura Epóxica para Pisos', descripcion: 'Pintura epóxica bicomponente de alta resistencia para pisos de garajes, bodegas y locales comerciales con alto tráfico. Resiste el paso de vehículos, aceites y químicos comunes de taller.', especificaciones_tecnicas: 'Base epóxica bicomponente | Rendimiento 6-8 m²/L | Secado total 48h', marca: 'Sherwin Williams', modelo: 'Epóxico Piso', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Gris', acabado: 'Semi-brillante', material: 'Epóxico', precio_compra: 65000, precio_venta: 92000, precio_mayorista: 84000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 40, codigo_producto: 'PINT-014', nombre: 'Fondo Sellador Universal', descripcion: 'Sellador base que se aplica antes de la pintura de acabado, sobre pañete, estuco, drywall o concreto nuevo. Mejora la adherencia y uniformiza la absorción del muro, evitando que la pintura final quede despareja.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-15 m²/L | Secado al tacto 1h', marca: 'Pintuco', modelo: 'Sellador', unidad_medida: 'galon', presentacion: '1 Galón', color: 'Blanco', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 26000, precio_venta: 37000, precio_mayorista: 33000, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 41, codigo_producto: 'MAT-007', nombre: 'Estuco Flexible Anti-fisuras', descripcion: 'Estuco con aditivos flexibles que previenen fisuras en el acabado.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 8-10 m²/kg | Flexible', marca: 'Corona', modelo: 'Anti-fisuras', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Blanco', acabado: 'Liso', material: 'Polímero acrílico flexible', precio_compra: 34000, precio_venta: 48000, precio_mayorista: 43000, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 42, codigo_producto: 'MAT-001-TER', nombre: 'Graniplast Textura Fina', descripcion: 'Acabado granulado para fachadas. Textura fina y alta durabilidad.', especificaciones_tecnicas: 'Cubeta 25 kg | Rendimiento 2-3 m²/kg | Impermeable', marca: 'Revestex', modelo: 'Textura Fina', unidad_medida: 'kilogramo', presentacion: '25 kg', color: 'Terracota', acabado: 'Granulado', material: 'Polímero + áridos', precio_compra: 57000, precio_venta: 80000, precio_mayorista: 72000, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'graniplast-textura-fina', tamano: 'Terracota', orden_variante: 3, mostrarEnCatalogo: false },
    { id_producto: 43, codigo_producto: 'MAT-009', nombre: 'Pasta para Muros Interior', descripcion: 'Pasta lista para usar, ideal para nivelar y suavizar muros antes de pintar.', especificaciones_tecnicas: 'Cubeta 20 kg | Rendimiento 10-12 m²/kg | Lista para usar', marca: 'Corona', modelo: 'Muros', unidad_medida: 'kilogramo', presentacion: '20 kg', color: 'Blanco', acabado: 'Liso', material: 'Pasta acrílica', precio_compra: 29000, precio_venta: 40000, precio_mayorista: 36000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 44, codigo_producto: 'MAT-010', nombre: 'Impermeabilizante para Techos', descripcion: 'Recubrimiento impermeabilizante acrílico para techos y cubiertas.', especificaciones_tecnicas: 'Cubeta 20 kg | Rendimiento 1-1.5 m²/kg | Resistente a rayos UV', marca: 'Sika', modelo: 'Techo Pro', unidad_medida: 'kilogramo', presentacion: '20 kg', color: 'Blanco', acabado: 'Mate', material: 'Acrílico impermeabilizante', precio_compra: 62000, precio_venta: 87000, precio_mayorista: 79000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 2, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 45, codigo_producto: 'PEGA-007', nombre: 'Pegante Epóxico Estructural', descripcion: 'Adhesivo epóxico bicomponente para uniones estructurales de alta resistencia.', especificaciones_tecnicas: 'Jeringa 50ml | Bicomponente | Curado en 24h', marca: 'Sika', modelo: 'Estructural', unidad_medida: 'unidad', presentacion: '50 ml', color: 'Transparente', acabado: 'N/A', material: 'Resina epóxica', precio_compra: 18000, precio_venta: 27000, precio_mayorista: 24000, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 1, id_categoria: 3, descuento_maximo: 5, destacado: 0, activo: 1 },
    { id_producto: 46, codigo_producto: 'PEGA-008', nombre: 'Cinta Doble Faz Extra Fuerte', descripcion: 'Cinta adhesiva doble faz para fijación de paneles y molduras.', especificaciones_tecnicas: 'Rollo 5m | Ancho 2cm | Alta adherencia', marca: '3M', modelo: 'Extra Fuerte', unidad_medida: 'rollo', presentacion: '5 metros', color: 'Blanco', acabado: 'N/A', material: 'Espuma acrílica', precio_compra: 12000, precio_venta: 18000, precio_mayorista: 16000, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 1, id_categoria: 3, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 47, codigo_producto: 'PEGA-009', nombre: 'Masilla para Madera', descripcion: 'Masilla para reparar grietas y huecos en superficies de madera.', especificaciones_tecnicas: 'Tarro 500g | Secado 2-3h | Se puede lijar y pintar', marca: 'Sika', modelo: 'Madera', unidad_medida: 'unidad', presentacion: '500 g', color: 'Café Claro', acabado: 'N/A', material: 'Masilla celulósica', precio_compra: 11000, precio_venta: 17000, precio_mayorista: 15000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 1, id_categoria: 3, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 48, codigo_producto: 'DRY-006', nombre: 'Lámina Superboard 8mm', descripcion: 'Lámina de fibrocemento para exteriores, resistente a la humedad.', especificaciones_tecnicas: '1.20m x 2.40m x 8mm | 18kg | Fibrocemento', marca: 'Eternit', modelo: 'Superboard', unidad_medida: 'metro2', presentacion: '1 Lámina (2.88 m²)', color: 'Gris', acabado: 'Liso', material: 'Fibrocemento', precio_compra: 45000, precio_venta: 64000, precio_mayorista: 58000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 49, codigo_producto: 'DRY-007', nombre: 'Perfil Angular para Drywall', descripcion: 'Perfil angular metálico para proteger y reforzar esquinas en drywall.', especificaciones_tecnicas: 'Longitud 3m | Calibre 26 | Galvanizado', marca: 'USG', modelo: 'Angular', unidad_medida: 'metro', presentacion: 'Perfil 3m', color: 'Galvanizado', acabado: 'N/A', material: 'Acero galvanizado', precio_compra: 7000, precio_venta: 11500, precio_mayorista: 10200, imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 50, codigo_producto: 'DRY-008', nombre: 'Tornillos Autoperforantes x100', descripcion: 'Tornillos autoperforantes para fijación de láminas de drywall a perfilería.', especificaciones_tecnicas: 'Medida 1" | Caja x100 unidades | Punta fina', marca: 'USG', modelo: 'Autoperforante', unidad_medida: 'caja', presentacion: 'Caja x100', color: 'Negro', acabado: 'N/A', material: 'Acero fosfatado', precio_compra: 8000, precio_venta: 13000, precio_mayorista: 11500, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 3, id_categoria: 4, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 51, codigo_producto: 'HERR-010', nombre: 'Taladro Percutor 650W', descripcion: 'Taladro percutor eléctrico de 650W para perforación en concreto y madera.', especificaciones_tecnicas: 'Potencia 650W | Mandril 13mm | Incluye maletín', marca: 'DeWalt', modelo: 'Percutor 650', unidad_medida: 'unidad', presentacion: '1 Unidad + maletín', color: 'Amarillo/Negro', acabado: 'N/A', material: 'Plástico + metal', precio_compra: 130000, precio_venta: 185000, precio_mayorista: 168000, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 52, codigo_producto: 'HERR-011', nombre: 'Escalera Tijera 5 Pasos', descripcion: 'Escalera tijera de aluminio de 5 pasos para trabajos en altura.', especificaciones_tecnicas: '5 pasos | Aluminio | Capacidad 120kg', marca: 'Truper', modelo: 'Tijera 5', unidad_medida: 'unidad', presentacion: '1 Unidad', color: 'Plateado', acabado: 'N/A', material: 'Aluminio', precio_compra: 95000, precio_venta: 135000, precio_mayorista: 122000, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 10, destacado: 0, activo: 1 },
    { id_producto: 53, codigo_producto: 'HERR-012', nombre: 'Espátula Dentada para Adhesivo', descripcion: 'Espátula dentada para aplicar adhesivo de forma uniforme en cerámica.', especificaciones_tecnicas: 'Medida 28cm | Dientes de 6mm | Mango ergonómico', marca: 'Stanley', modelo: 'Dentada', unidad_medida: 'unidad', presentacion: '1 Unidad', color: 'N/A', acabado: 'N/A', material: 'Acero inoxidable + plástico', precio_compra: 9000, precio_venta: 14000, precio_mayorista: 12500, imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 0, destacado: 0, activo: 1 },
    { id_producto: 54, codigo_producto: 'HERR-013', nombre: 'Careta de Protección Facial', descripcion: 'Careta de protección facial para trabajos con herramientas y químicos.', especificaciones_tecnicas: 'Visor policarbonato | Ajuste regulable | Uso industrial', marca: '3M', modelo: 'Facial Pro', unidad_medida: 'unidad', presentacion: '1 Unidad', color: 'Transparente', acabado: 'N/A', material: 'Policarbonato', precio_compra: 14000, precio_venta: 21000, precio_mayorista: 18500, imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', id_impuesto: 1, id_categoria: 5, descuento_maximo: 0, destacado: 0, activo: 1 },

    // ── Variantes de tamaño (hermanas de los productos 1, 2 y 4) ──
    // No aparecen en el catálogo (mostrarEnCatalogo: false); se eligen desde el detalle del producto base.
    { id_producto: 55, codigo_producto: 'PINT-001-025', nombre: 'Vinilo Interior Tipo 1 Blanco', descripcion: 'Pintura acrílica blanca mate, ideal para paredes y cielorrasos de interiores: salas, habitaciones, pasillos y oficinas. Se aplica sobre superficies de mampostería, pañete, drywall o estuco ya preparadas. Cubrimiento uniforme, resistente al lavado suave y sin olores fuertes. Rendimiento 12-14 m²/L, secado rápido al tacto.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min | Secado total 2h', marca: 'Pintuco', modelo: 'Tipo 1', unidad_medida: 'galon', presentacion: '1/4 Galón', color: 'Blanco', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 11500, precio_venta: 16000, precio_mayorista: 14200, imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-int-blanco-t1', tamano: '1/4 Gal.', orden_variante: 1, mostrarEnCatalogo: false },
    { id_producto: 56, codigo_producto: 'PINT-001-250', nombre: 'Vinilo Interior Tipo 1 Blanco', descripcion: 'Pintura acrílica blanca mate, ideal para paredes y cielorrasos de interiores: salas, habitaciones, pasillos y oficinas. Se aplica sobre superficies de mampostería, pañete, drywall o estuco ya preparadas. Cubrimiento uniforme, resistente al lavado suave y sin olores fuertes. Rendimiento 12-14 m²/L, secado rápido al tacto.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min | Secado total 2h', marca: 'Pintuco', modelo: 'Tipo 1', unidad_medida: 'galon', presentacion: '2.5 Galones', color: 'Blanco', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 72000, precio_venta: 100000, precio_mayorista: 89000, imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-int-blanco-t1', tamano: '2.5 Gal.', orden_variante: 3, mostrarEnCatalogo: false },
    { id_producto: 57, codigo_producto: 'PINT-001-500', nombre: 'Vinilo Interior Tipo 1 Blanco', descripcion: 'Pintura acrílica blanca mate, ideal para paredes y cielorrasos de interiores: salas, habitaciones, pasillos y oficinas. Se aplica sobre superficies de mampostería, pañete, drywall o estuco ya preparadas. Cubrimiento uniforme, resistente al lavado suave y sin olores fuertes. Rendimiento 12-14 m²/L, secado rápido al tacto.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min | Secado total 2h', marca: 'Pintuco', modelo: 'Tipo 1', unidad_medida: 'galon', presentacion: '5 Galones', color: 'Blanco', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 133000, precio_venta: 185000, precio_mayorista: 165000, imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-int-blanco-t1', tamano: '5 Gal.', orden_variante: 4, mostrarEnCatalogo: false },

    { id_producto: 58, codigo_producto: 'PINT-002-025', nombre: 'Pintura Azul Pastel', descripcion: 'Pintura vinilo tipo 2 en azul pastel, perfecta para darle un toque fresco y relajante a habitaciones, salas y espacios de descanso. Acabado mate premium que disimula pequeñas imperfecciones del muro. Ideal para interiores sobre pañete, estuco o drywall ya imprimados.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min', marca: 'Pintuco', modelo: 'Tipo 2', unidad_medida: 'galon', presentacion: '1/4 Galón', color: 'Azul Pastel', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 12200, precio_venta: 17000, precio_mayorista: 15100, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-int-azul-t2', tamano: '1/4 Gal.', orden_variante: 1, mostrarEnCatalogo: false },
    { id_producto: 59, codigo_producto: 'PINT-002-250', nombre: 'Pintura Azul Pastel', descripcion: 'Pintura vinilo tipo 2 en azul pastel, perfecta para darle un toque fresco y relajante a habitaciones, salas y espacios de descanso. Acabado mate premium que disimula pequeñas imperfecciones del muro. Ideal para interiores sobre pañete, estuco o drywall ya imprimados.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min', marca: 'Pintuco', modelo: 'Tipo 2', unidad_medida: 'galon', presentacion: '2.5 Galones', color: 'Azul Pastel', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 76000, precio_venta: 106000, precio_mayorista: 94000, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-int-azul-t2', tamano: '2.5 Gal.', orden_variante: 3, mostrarEnCatalogo: false },
    { id_producto: 60, codigo_producto: 'PINT-002-500', nombre: 'Pintura Azul Pastel', descripcion: 'Pintura vinilo tipo 2 en azul pastel, perfecta para darle un toque fresco y relajante a habitaciones, salas y espacios de descanso. Acabado mate premium que disimula pequeñas imperfecciones del muro. Ideal para interiores sobre pañete, estuco o drywall ya imprimados.', especificaciones_tecnicas: 'Base agua | Rendimiento 12-14 m²/L | Secado al tacto 30 min', marca: 'Pintuco', modelo: 'Tipo 2', unidad_medida: 'galon', presentacion: '5 Galones', color: 'Azul Pastel', acabado: 'Mate', material: 'Acrílico base agua', precio_compra: 140000, precio_venta: 195000, precio_mayorista: 174000, imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-int-azul-t2', tamano: '5 Gal.', orden_variante: 4, mostrarEnCatalogo: false },

    { id_producto: 61, codigo_producto: 'PINT-004-025', nombre: 'Vinilo Mate Exterior Tipo 2', descripcion: 'Pintura vinilo mate formulada para fachadas y muros exteriores expuestos al sol, la lluvia y la humedad. Alta resistencia a la intemperie y a los rayos UV sin decolorarse. Se aplica sobre mampostería, pañete o concreto ya curado; ideal para fachadas de casas, locales y edificios.', especificaciones_tecnicas: 'Base agua | UV-resistente | Rendimiento 10-12 m²/L', marca: 'Sherwin Williams', modelo: 'Exterior Pro', unidad_medida: 'galon', presentacion: '1/4 Galón', color: 'Blanco Hueso', acabado: 'Mate', material: 'Látex acrílico', precio_compra: 15800, precio_venta: 22000, precio_mayorista: 19500, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-ext-blanco-t2', tamano: '1/4 Gal.', orden_variante: 1, mostrarEnCatalogo: false },
    { id_producto: 62, codigo_producto: 'PINT-004-250', nombre: 'Vinilo Mate Exterior Tipo 2', descripcion: 'Pintura vinilo mate formulada para fachadas y muros exteriores expuestos al sol, la lluvia y la humedad. Alta resistencia a la intemperie y a los rayos UV sin decolorarse. Se aplica sobre mampostería, pañete o concreto ya curado; ideal para fachadas de casas, locales y edificios.', especificaciones_tecnicas: 'Base agua | UV-resistente | Rendimiento 10-12 m²/L', marca: 'Sherwin Williams', modelo: 'Exterior Pro', unidad_medida: 'galon', presentacion: '2.5 Galones', color: 'Blanco Hueso', acabado: 'Mate', material: 'Látex acrílico', precio_compra: 97000, precio_venta: 136000, precio_mayorista: 121000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-ext-blanco-t2', tamano: '2.5 Gal.', orden_variante: 3, mostrarEnCatalogo: false },
    { id_producto: 63, codigo_producto: 'PINT-004-500', nombre: 'Vinilo Mate Exterior Tipo 2', descripcion: 'Pintura vinilo mate formulada para fachadas y muros exteriores expuestos al sol, la lluvia y la humedad. Alta resistencia a la intemperie y a los rayos UV sin decolorarse. Se aplica sobre mampostería, pañete o concreto ya curado; ideal para fachadas de casas, locales y edificios.', especificaciones_tecnicas: 'Base agua | UV-resistente | Rendimiento 10-12 m²/L', marca: 'Sherwin Williams', modelo: 'Exterior Pro', unidad_medida: 'galon', presentacion: '5 Galones', color: 'Blanco Hueso', acabado: 'Mate', material: 'Látex acrílico', precio_compra: 178000, precio_venta: 248000, precio_mayorista: 221000, imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80', id_impuesto: 3, id_categoria: 1, descuento_maximo: 10, destacado: 0, activo: 1, grupo_variante: 'vinilo-ext-blanco-t2', tamano: '5 Gal.', orden_variante: 4, mostrarEnCatalogo: false }
  ],

  // ── SERVICIOS ──────────────────────────────────────────────
  servicios: [
    {
      id_servicio: 1, codigo_servicio: 'SERV-001', nombre_servicio: 'Instalación de Drywall',
      descripcion: 'Instalación profesional de paneles de drywall para divisiones y cielorrasos',
      tipo_servicio: 'drywall', incluye_materiales: 1, precio_hora: 85000, precio_proyecto: null,
      duracion_estimada_horas: 8,
      imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      id_impuesto: 1, activo: 1, destacado: 0, rating: 4.8, num_resenas: 23, garantia_meses: 6,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata, Neiva',
      que_incluye: ['Materiales de drywall (láminas y perfilería)', 'Mano de obra especializada', 'Aislamiento acústico básico', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Cotiza en línea', descripcion: 'Elige el servicio, indica cuántas horas o días crees que tomará y arma tu solicitud en minutos.' },
        { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
        { titulo: 'Instalación', descripcion: 'Nuestro equipo instala el drywall siguiendo los estándares de calidad.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos contigo el trabajo terminado y entregamos la garantía.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80']
    },
    {
      id_servicio: 2, codigo_servicio: 'SERV-002', nombre_servicio: 'Aplicación de Pintura',
      descripcion: 'Aplicación de pintura en interiores y exteriores con acabado profesional',
      tipo_servicio: 'aplicacion_pintura', incluye_materiales: 0, precio_hora: 15000, precio_proyecto: null,
      duracion_estimada_horas: 4,
      imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      id_impuesto: 1, activo: 1, destacado: 1, rating: 4.9, num_resenas: 41, garantia_meses: 3,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata, Neiva, Garzón',
      que_incluye: ['Mano de obra especializada', 'Protección de muebles y pisos', 'Aplicación de 2 manos de pintura', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Cotiza en línea', descripcion: 'Elige el servicio, indica cuántas horas crees que tomará y arma tu solicitud en minutos.' },
        { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
        { titulo: 'Aplicación', descripcion: 'Aplicamos la pintura con técnicas profesionales para un acabado uniforme.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos contigo el resultado y entregamos la garantía.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80']
    },
    {
      id_servicio: 3, codigo_servicio: 'SERV-003', nombre_servicio: 'Asesoría en Diseño de Interiores',
      descripcion: 'Asesoría personalizada para diseño y decoración de interiores',
      tipo_servicio: 'asesoria', incluye_materiales: 0, precio_hora: 50000, precio_proyecto: null,
      duracion_estimada_horas: 2,
      imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
      id_impuesto: 2, activo: 1, destacado: 1, rating: 4.7, num_resenas: 15, garantia_meses: 1,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, San Agustín',
      que_incluye: ['Visita y diagnóstico del espacio', 'Propuesta de paleta de colores', 'Recomendación de materiales y acabados', 'Plano conceptual básico'],
      como_funciona: [
        { titulo: 'Agenda tu cita', descripcion: 'Coordinamos una visita o videollamada según prefieras.' },
        { titulo: 'Diagnóstico', descripcion: 'Analizamos el espacio, la luz y tus necesidades.' },
        { titulo: 'Propuesta', descripcion: 'Te entregamos una propuesta con colores, materiales y distribución.' },
        { titulo: 'Acompañamiento', descripcion: 'Te asesoramos durante la compra e implementación.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80']
    },
    {
      id_servicio: 4, codigo_servicio: 'SERV-004', nombre_servicio: 'Instalación de PVC',
      descripcion: 'Instalación de paneles de PVC para paredes y techos',
      tipo_servicio: 'pvc', incluye_materiales: 1, precio_hora: null, precio_proyecto: 120000,
      duracion_estimada_horas: 6,
      imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&q=80',
      id_impuesto: 1, activo: 1, destacado: 0, rating: 4.6, num_resenas: 9, garantia_meses: 12,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia',
      que_incluye: ['Láminas de PVC y perfilería', 'Mano de obra especializada', 'Sellado de uniones', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos las medidas aproximadas del área y arma tu solicitud en minutos.' },
        { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
        { titulo: 'Instalación', descripcion: 'Instalamos los paneles de PVC con acabado profesional.' },
        { titulo: 'Entrega final', descripcion: 'Revisión final del trabajo y entrega de garantía.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80']
    },
    {
      id_servicio: 5, codigo_servicio: 'SERV-005', nombre_servicio: 'Mantenimiento General',
      descripcion: 'Mantenimiento correctivo y preventivo de acabados en general',
      tipo_servicio: 'mantenimiento', incluye_materiales: 0, precio_hora: null, precio_proyecto: 25000,
      duracion_estimada_horas: 3,
      imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
      id_impuesto: 1, activo: 1, destacado: 0, rating: 4.5, num_resenas: 12, garantia_meses: 2,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata',
      que_incluye: ['Diagnóstico del daño o desgaste', 'Mano de obra especializada', 'Materiales menores de reparación', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Solicitud', descripcion: 'Nos cuentas qué necesita mantenimiento o reparación.' },
        { titulo: 'Diagnóstico', descripcion: 'Un técnico evalúa el daño y define el alcance del trabajo.' },
        { titulo: 'Ejecución', descripcion: 'Realizamos la reparación o mantenimiento acordado.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos el resultado contigo antes de finalizar.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80']
    },
    {
      id_servicio: 6, codigo_servicio: 'SERV-006', nombre_servicio: 'Diseño de Interiores Residencial',
      descripcion: 'Diseño completo de espacios interiores para tu hogar, con propuesta de distribución, colores y mobiliario',
      tipo_servicio: 'diseño_interiores', incluye_materiales: 0, precio_hora: null, precio_proyecto: 380000,
      duracion_estimada_horas: 12,
      imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
      id_impuesto: 2, activo: 1, destacado: 1, rating: 4.8, num_resenas: 18, garantia_meses: 3,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata',
      que_incluye: ['Visita y levantamiento del espacio', 'Propuesta de distribución y mobiliario', 'Paleta de colores personalizada', 'Plano 2D del proyecto'],
      como_funciona: [
        { titulo: 'Agenda tu cita', descripcion: 'Coordinamos una visita al espacio a diseñar.' },
        { titulo: 'Diagnóstico', descripcion: 'Analizamos el espacio, la luz y tus necesidades.' },
        { titulo: 'Propuesta', descripcion: 'Te entregamos la propuesta de distribución y colores.' },
        { titulo: 'Entrega final', descripcion: 'Recibes el plano 2D y las recomendaciones completas.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80']
    },
    {
      id_servicio: 7, codigo_servicio: 'SERV-007', nombre_servicio: 'Diseño de Fachadas y Exteriores',
      descripcion: 'Renovación visual de fachadas con propuesta de colores, texturas y materiales resistentes al clima',
      tipo_servicio: 'diseño_exteriores', incluye_materiales: 0, precio_hora: null, precio_proyecto: 300000,
      duracion_estimada_horas: 10,
      imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=1200&q=80',
      id_impuesto: 2, activo: 1, destacado: 0, rating: 4.7, num_resenas: 11, garantia_meses: 3,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, San Agustín',
      que_incluye: ['Visita técnica de fachada', 'Propuesta de colores y acabados exteriores', 'Recomendación de materiales resistentes al clima', 'Render conceptual de la fachada'],
      como_funciona: [
        { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos sobre tu fachada y arma tu solicitud en minutos.' },
        { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el alcance y la fecha en máximo 24 horas.' },
        { titulo: 'Propuesta', descripcion: 'Presentamos la propuesta de colores y materiales.' },
        { titulo: 'Entrega final', descripcion: 'Recibes el render conceptual de tu fachada.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80']
    },
    {
      id_servicio: 8, codigo_servicio: 'SERV-008', nombre_servicio: 'Instalación de Pisos Laminados',
      descripcion: 'Instalación profesional de piso laminado de alta resistencia, con nivelación previa del área',
      tipo_servicio: 'instalacion', incluye_materiales: 1, precio_hora: 25000, precio_proyecto: null,
      duracion_estimada_horas: 6,
      imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
      id_impuesto: 1, activo: 1, destacado: 0, rating: 4.6, num_resenas: 14, garantia_meses: 12,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata, Neiva',
      que_incluye: ['Piso laminado de alta resistencia', 'Instalación con nivelación previa', 'Perfiles y remates incluidos', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Cotiza en línea', descripcion: 'Indica el área aproximada y cuántas horas crees que tomará, y arma tu solicitud en minutos.' },
        { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
        { titulo: 'Instalación', descripcion: 'Instalamos el piso laminado con acabado profesional.' },
        { titulo: 'Entrega final', descripcion: 'Revisión final del trabajo y entrega de garantía.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80']
    },
    {
      id_servicio: 9, codigo_servicio: 'SERV-009', nombre_servicio: 'Aplicación de Estuco y Graniplast',
      descripcion: 'Aplicación profesional de estuco o graniplast para acabados texturizados en interiores y fachadas',
      tipo_servicio: 'aplicacion_pintura', incluye_materiales: 1, precio_hora: null, precio_proyecto: null,
      // NOTA: `precio_dia` no existe como columna en la tabla `servicios` de la BD real (solo tiene
      // `precio_hora`/`precio_proyecto`). Este servicio se cobra por día de trabajo, no por hora,
      // así que hay que agregar esa columna al conectar el backend.
      precio_dia: 150000,
      duracion_estimada_horas: 8,
      imagen_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=1200&q=80',
      id_impuesto: 1, activo: 1, destacado: 0, rating: 4.7, num_resenas: 20, garantia_meses: 6,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata, Neiva',
      que_incluye: ['Materiales de estuco o graniplast', 'Mano de obra especializada', 'Acabado texturizado uniforme', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos el tipo de acabado que buscas, indica los días estimados y arma tu solicitud en minutos.' },
        { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
        { titulo: 'Aplicación', descripcion: 'Aplicamos el estuco o graniplast con técnica profesional.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos contigo el resultado y entregamos la garantía.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80']
    },
    {
      id_servicio: 10, codigo_servicio: 'SERV-010', nombre_servicio: 'Instalación de Cielo Raso en Icopor',
      descripcion: 'Instalación de cielo raso decorativo en icopor, con perfilería y acabado uniforme',
      tipo_servicio: 'instalacion', incluye_materiales: 1, precio_hora: null, precio_proyecto: 90000,
      duracion_estimada_horas: 5,
      imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80',
      id_impuesto: 3, activo: 1, destacado: 0, rating: 4.5, num_resenas: 8, garantia_meses: 6,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia',
      que_incluye: ['Láminas de icopor decorativo', 'Perfilería y guías de instalación', 'Mano de obra especializada', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Cotiza en línea', descripcion: 'Cuéntanos las medidas aproximadas del área y arma tu solicitud en minutos.' },
        { titulo: 'Revisamos y aprobamos', descripcion: 'Nuestro equipo revisa tu solicitud y te confirma el precio final y la fecha en máximo 24 horas.' },
        { titulo: 'Instalación', descripcion: 'Instalamos el cielo raso con acabado profesional.' },
        { titulo: 'Entrega final', descripcion: 'Revisión final del trabajo y entrega de garantía.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80']
    },
    {
      id_servicio: 11, codigo_servicio: 'SERV-011', nombre_servicio: 'Consultoría en Remodelación',
      descripcion: 'Asesoría técnica para proyectos de remodelación, con recomendaciones de materiales y presupuesto',
      tipo_servicio: 'consultoria', incluye_materiales: 0, precio_hora: 60000, precio_proyecto: null,
      duracion_estimada_horas: 2,
      imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      id_impuesto: 2, activo: 1, destacado: 1, rating: 4.9, num_resenas: 9, garantia_meses: 1,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata, Neiva',
      que_incluye: ['Diagnóstico técnico del proyecto', 'Recomendaciones de materiales y presupuesto', 'Cronograma estimado de obra', 'Informe escrito de recomendaciones'],
      como_funciona: [
        { titulo: 'Agenda tu cita', descripcion: 'Coordinamos una visita o videollamada según prefieras.' },
        { titulo: 'Diagnóstico', descripcion: 'Analizamos el alcance y el estado actual del proyecto.' },
        { titulo: 'Recomendaciones', descripcion: 'Te entregamos materiales, presupuesto y cronograma sugerido.' },
        { titulo: 'Entrega final', descripcion: 'Recibes un informe escrito con todas las recomendaciones.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80']
    },
    {
      id_servicio: 12, codigo_servicio: 'SERV-012', nombre_servicio: 'Mantenimiento de Fachadas',
      descripcion: 'Mantenimiento correctivo de fachadas: limpieza, reparación de fisuras menores y retoque de acabados',
      tipo_servicio: 'mantenimiento', incluye_materiales: 0, precio_hora: null, precio_proyecto: 45000,
      duracion_estimada_horas: 4,
      imagen_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      imagen_detalle_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
      id_impuesto: 1, activo: 1, destacado: 0, rating: 4.4, num_resenas: 6, garantia_meses: 2,
      horario_atencion: 'Lunes a Sábado: 8:00am - 6:00pm', zona_cobertura: 'Pitalito, Tesalia, La Plata',
      que_incluye: ['Diagnóstico del estado de la fachada', 'Limpieza y reparación de fisuras menores', 'Mano de obra especializada', 'Limpieza del área al finalizar'],
      como_funciona: [
        { titulo: 'Solicitud', descripcion: 'Nos cuentas qué necesita la fachada.' },
        { titulo: 'Diagnóstico', descripcion: 'Un técnico evalúa el daño y define el alcance del trabajo.' },
        { titulo: 'Ejecución', descripcion: 'Realizamos la reparación o mantenimiento acordado.' },
        { titulo: 'Entrega final', descripcion: 'Revisamos el resultado contigo antes de finalizar.' }
      ],
      galeria: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80', 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=500&q=80']
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
    { id_inventario: 12, id_producto: 12, cantidad_disponible: 18, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 60, ubicacion_bodega: 'Bodega B - Estante 3' },
    { id_inventario: 13, id_producto: 13, cantidad_disponible: 45, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 150, ubicacion_bodega: 'Bodega A - Estante 5' },
    { id_inventario: 14, id_producto: 14, cantidad_disponible: 22, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 100, ubicacion_bodega: 'Bodega B - Estante 4' },
    { id_inventario: 15, id_producto: 15, cantidad_disponible: 30, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 120, ubicacion_bodega: 'Bodega A - Estante 6' },
    { id_inventario: 16, id_producto: 16, cantidad_disponible: 8, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 80, ubicacion_bodega: 'Bodega A - Estante 7' },
    { id_inventario: 17, id_producto: 17, cantidad_disponible: 60, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 200, ubicacion_bodega: 'Bodega C - Estante 5' },
    { id_inventario: 18, id_producto: 18, cantidad_disponible: 90, cantidad_reservada: 0, stock_minimo: 20, stock_maximo: 250, ubicacion_bodega: 'Bodega C - Estante 6' },
    { id_inventario: 19, id_producto: 19, cantidad_disponible: 24, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 70, ubicacion_bodega: 'Bodega B - Estante 5' },
    { id_inventario: 20, id_producto: 20, cantidad_disponible: 55, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 200, ubicacion_bodega: 'Bodega B - Estante 6' },
    { id_inventario: 21, id_producto: 21, cantidad_disponible: 4, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 60, ubicacion_bodega: 'Bodega C - Estante 7' },
    { id_inventario: 22, id_producto: 22, cantidad_disponible: 33, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 120, ubicacion_bodega: 'Bodega C - Estante 8' },
    { id_inventario: 23, id_producto: 23, cantidad_disponible: 40, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 150, ubicacion_bodega: 'Bodega A - Estante 8' },
    { id_inventario: 24, id_producto: 24, cantidad_disponible: 28, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 100, ubicacion_bodega: 'Bodega A - Estante 9' },
    { id_inventario: 25, id_producto: 25, cantidad_disponible: 35, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 130, ubicacion_bodega: 'Bodega A - Estante 10' },
    { id_inventario: 26, id_producto: 26, cantidad_disponible: 6, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 60, ubicacion_bodega: 'Bodega A - Estante 11' },
    { id_inventario: 27, id_producto: 27, cantidad_disponible: 50, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 200, ubicacion_bodega: 'Bodega C - Estante 9' },
    { id_inventario: 28, id_producto: 28, cantidad_disponible: 70, cantidad_reservada: 0, stock_minimo: 20, stock_maximo: 220, ubicacion_bodega: 'Bodega C - Estante 10' },
    { id_inventario: 29, id_producto: 29, cantidad_disponible: 20, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 70, ubicacion_bodega: 'Bodega B - Estante 7' },
    { id_inventario: 30, id_producto: 30, cantidad_disponible: 60, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 200, ubicacion_bodega: 'Bodega B - Estante 8' },
    { id_inventario: 31, id_producto: 31, cantidad_disponible: 18, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 60, ubicacion_bodega: 'Bodega C - Estante 11' },
    { id_inventario: 32, id_producto: 32, cantidad_disponible: 90, cantidad_reservada: 0, stock_minimo: 20, stock_maximo: 250, ubicacion_bodega: 'Bodega C - Estante 12' },
    { id_inventario: 33, id_producto: 33, cantidad_disponible: 15, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 80, ubicacion_bodega: 'Bodega A - Estante 12' },
    { id_inventario: 34, id_producto: 34, cantidad_disponible: 27, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 120, ubicacion_bodega: 'Bodega A - Estante 13' },
    { id_inventario: 35, id_producto: 35, cantidad_disponible: 45, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 180, ubicacion_bodega: 'Bodega C - Estante 13' },
    { id_inventario: 36, id_producto: 36, cantidad_disponible: 24, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 90, ubicacion_bodega: 'Bodega C - Estante 14' },
    { id_inventario: 37, id_producto: 37, cantidad_disponible: 38, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 140, ubicacion_bodega: 'Bodega A - Estante 14' },
    { id_inventario: 38, id_producto: 38, cantidad_disponible: 22, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 90, ubicacion_bodega: 'Bodega A - Estante 15' },
    { id_inventario: 39, id_producto: 39, cantidad_disponible: 14, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 60, ubicacion_bodega: 'Bodega A - Estante 16' },
    { id_inventario: 40, id_producto: 40, cantidad_disponible: 50, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 180, ubicacion_bodega: 'Bodega A - Estante 17' },
    { id_inventario: 41, id_producto: 41, cantidad_disponible: 30, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 120, ubicacion_bodega: 'Bodega A - Estante 18' },
    { id_inventario: 42, id_producto: 42, cantidad_disponible: 9, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 70, ubicacion_bodega: 'Bodega A - Estante 19' },
    { id_inventario: 43, id_producto: 43, cantidad_disponible: 33, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 130, ubicacion_bodega: 'Bodega A - Estante 20' },
    { id_inventario: 44, id_producto: 44, cantidad_disponible: 17, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 80, ubicacion_bodega: 'Bodega A - Estante 21' },
    { id_inventario: 45, id_producto: 45, cantidad_disponible: 60, cantidad_reservada: 0, stock_minimo: 20, stock_maximo: 220, ubicacion_bodega: 'Bodega C - Estante 15' },
    { id_inventario: 46, id_producto: 46, cantidad_disponible: 45, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 180, ubicacion_bodega: 'Bodega C - Estante 16' },
    { id_inventario: 47, id_producto: 47, cantidad_disponible: 38, cantidad_reservada: 0, stock_minimo: 12, stock_maximo: 150, ubicacion_bodega: 'Bodega C - Estante 17' },
    { id_inventario: 48, id_producto: 48, cantidad_disponible: 16, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 60, ubicacion_bodega: 'Bodega B - Estante 9' },
    { id_inventario: 49, id_producto: 49, cantidad_disponible: 55, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 200, ubicacion_bodega: 'Bodega B - Estante 10' },
    { id_inventario: 50, id_producto: 50, cantidad_disponible: 70, cantidad_reservada: 0, stock_minimo: 20, stock_maximo: 250, ubicacion_bodega: 'Bodega B - Estante 11' },
    { id_inventario: 51, id_producto: 51, cantidad_disponible: 7, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 40, ubicacion_bodega: 'Bodega C - Estante 18' },
    { id_inventario: 52, id_producto: 52, cantidad_disponible: 5, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 30, ubicacion_bodega: 'Bodega C - Estante 19' },
    { id_inventario: 53, id_producto: 53, cantidad_disponible: 42, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 160, ubicacion_bodega: 'Bodega C - Estante 20' },
    { id_inventario: 54, id_producto: 54, cantidad_disponible: 26, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 100, ubicacion_bodega: 'Bodega C - Estante 21' },
    { id_inventario: 55, id_producto: 55, cantidad_disponible: 60, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 200, ubicacion_bodega: 'Bodega A - Estante 1' },
    { id_inventario: 56, id_producto: 56, cantidad_disponible: 25, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 100, ubicacion_bodega: 'Bodega A - Estante 1' },
    { id_inventario: 57, id_producto: 57, cantidad_disponible: 12, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 60, ubicacion_bodega: 'Bodega A - Estante 1' },
    { id_inventario: 58, id_producto: 58, cantidad_disponible: 45, cantidad_reservada: 0, stock_minimo: 15, stock_maximo: 180, ubicacion_bodega: 'Bodega A - Estante 2' },
    { id_inventario: 59, id_producto: 59, cantidad_disponible: 20, cantidad_reservada: 0, stock_minimo: 8, stock_maximo: 90, ubicacion_bodega: 'Bodega A - Estante 2' },
    { id_inventario: 60, id_producto: 60, cantidad_disponible: 9, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 50, ubicacion_bodega: 'Bodega A - Estante 2' },
    { id_inventario: 61, id_producto: 61, cantidad_disponible: 30, cantidad_reservada: 0, stock_minimo: 10, stock_maximo: 120, ubicacion_bodega: 'Bodega B - Estante 1' },
    { id_inventario: 62, id_producto: 62, cantidad_disponible: 14, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 70, ubicacion_bodega: 'Bodega B - Estante 1' },
    { id_inventario: 63, id_producto: 63, cantidad_disponible: 6, cantidad_reservada: 0, stock_minimo: 5, stock_maximo: 40, ubicacion_bodega: 'Bodega B - Estante 1' }
  ],

  // ── COTIZACIONES ───────────────────────────────────────────
  // NOTA: las 6 de abajo se escribieron antes de que existiera el sistema de "fecha deseada"
  // (empacarFechaDeseada en useFormat.js) — todas incluyen un servicio, así que a todas les
  // corresponde una fecha empacada al inicio de `observaciones`, si no, el chip destacado nunca
  // aparece para ellas en el panel admin ni en el calendario.
  cotizaciones: [
    { id_cotizacion: 1, numero_cotizacion: 'COT-001', id_usuario: 3, fecha: '2026-04-24', estado: 'pendiente', total_estimado: 185000, observaciones: '📅 Fecha deseada: 2026-05-02\n\nCliente solicita cotización para remodelación de sala', validez_dias: 15 },
    { id_cotizacion: 2, numero_cotizacion: 'COT-002', id_usuario: 2, fecha: '2026-04-24', estado: 'aprobada', total_estimado: 450000, observaciones: '📅 Fecha deseada: 2026-05-06\n\nCotización para proyecto de oficina', validez_dias: 15, fecha_aprobacion: '2026-08-07' },
    { id_cotizacion: 3, numero_cotizacion: 'COT-003', id_usuario: 3, fecha: '2026-04-25', estado: 'convertida_venta', total_estimado: 98000, observaciones: '📅 Fecha deseada: 2026-05-08\n\nCliente aprobó y realizó compra', validez_dias: 15 },
    { id_cotizacion: 4, numero_cotizacion: 'COT-004', id_usuario: 3, fecha: '2026-05-05', estado: 'en_revision', total_estimado: 220000, observaciones: '📅 Fecha deseada: 2026-05-22\n\nCotización para pintura de fachada exterior', validez_dias: 15 },
    { id_cotizacion: 5, numero_cotizacion: 'COT-005', id_usuario: 3, fecha: '2026-05-10', estado: 'rechazada', total_estimado: 60000, observaciones: '📅 Fecha deseada: 2026-05-25\n\nCliente decidió posponer el proyecto', validez_dias: 15, respuesta: 'No contamos con disponibilidad para esta fecha. Con gusto podemos evaluar otras fechas — escríbenos por WhatsApp para reprogramar.' },
    { id_cotizacion: 6, numero_cotizacion: 'COT-006', id_usuario: 3, fecha: '2026-05-18', estado: 'aprobada', total_estimado: 132000, observaciones: '📅 Fecha deseada: 2026-08-25\n\nInstalación de drywall en habitación adicional', validez_dias: 15, fecha_aprobacion: '2026-08-16', respuesta: 'Confirmamos la instalación de drywall según lo solicitado. El total incluye materiales y mano de obra.' }
  ],

  // ── COTIZACION_PRODUCTOS ────────────────────────────────────
  cotizacion_productos: [
    { id_detalle: 1, id_cotizacion: 1, id_producto: 1, cantidad: 2, precio_unitario: 45000, subtotal: 90000 },
    { id_detalle: 2, id_cotizacion: 1, id_producto: 11, cantidad: 1, precio_unitario: 78000, subtotal: 78000 },
    { id_detalle: 3, id_cotizacion: 3, id_producto: 10, cantidad: 1, precio_unitario: 32000, subtotal: 32000 },
    { id_detalle: 4, id_cotizacion: 3, id_producto: 6, cantidad: 2, precio_unitario: 18000, subtotal: 36000 },
    { id_detalle: 5, id_cotizacion: 4, id_producto: 4, cantidad: 2, precio_unitario: 62000, subtotal: 124000 },
    { id_detalle: 6, id_cotizacion: 6, id_producto: 12, cantidad: 2, precio_unitario: 28000, subtotal: 56000 }
  ],

  // ── COTIZACION_SERVICIOS ────────────────────────────────────
  cotizacion_servicios: [
    { id_detalle: 1, id_cotizacion: 1, id_servicio: 2, cantidad: 1, precio_estimado: 17000, subtotal: 17000 },
    { id_detalle: 2, id_cotizacion: 2, id_servicio: 1, cantidad: 1, precio_estimado: 450000, subtotal: 450000 },
    { id_detalle: 3, id_cotizacion: 3, id_servicio: 5, cantidad: 1, precio_estimado: 30000, subtotal: 30000 },
    { id_detalle: 4, id_cotizacion: 4, id_servicio: 2, cantidad: 1, precio_estimado: 96000, subtotal: 96000 },
    { id_detalle: 5, id_cotizacion: 5, id_servicio: 3, cantidad: 1, precio_estimado: 60000, subtotal: 60000 },
    { id_detalle: 6, id_cotizacion: 6, id_servicio: 1, cantidad: 1, precio_estimado: 76000, subtotal: 76000 }
  ],

  // ── VENTAS ─────────────────────────────────────────────────
  ventas: [
    { id_venta: 1, numero_venta: 'VEN-2026-001', id_usuario: 3, id_cotizacion: 3, fecha: '2026-04-25 10:14:00', subtotal: 82353, descuento: 0, iva_total: 15647, total: 98000, estado: 'entregado', metodo_pago: 'transferencia', notas_cliente: 'Entrega en domicilio', fecha_entrega_real: '2026-04-27' },
    { id_venta: 2, numero_venta: 'VEN-2026-002', id_usuario: 4, id_cotizacion: null, fecha: '2026-04-26 16:47:00', subtotal: 126050, descuento: 5000, iva_total: 0, total: 121050, estado: 'entregado', metodo_pago: 'efectivo', notas_cliente: null, fecha_entrega_real: '2026-04-26' },
    { id_venta: 3, numero_venta: 'VEN-2026-003', id_usuario: 5, id_cotizacion: null, fecha: '2026-05-01 09:02:00', subtotal: 62500, descuento: 0, iva_total: 0, total: 62500, estado: 'preparando', metodo_pago: 'nequi', notas_cliente: 'Llamar antes de entregar', fecha_entrega_real: null },
    { id_venta: 4, numero_venta: 'VEN-2026-004', id_usuario: 3, id_cotizacion: null, fecha: '2026-05-10 14:32:00', subtotal: 230000, descuento: 10000, iva_total: 0, total: 220000, estado: 'pendiente', metodo_pago: 'tarjeta', notas_cliente: null, fecha_entrega_real: null },
    { id_venta: 5, numero_venta: 'VEN-2026-005', id_usuario: 4, id_cotizacion: null, fecha: '2026-05-15 11:58:00', subtotal: 96000, descuento: 0, iva_total: 0, total: 96000, estado: 'entregado', metodo_pago: 'transferencia', notas_cliente: null, fecha_entrega_real: '2026-05-17' }
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

  // ── PAGOS ──────────────────────────────────────────────────
  // Registro de pagos -> tabla `pagos`, sin usar en ningún otro lugar de la app hasta ahora.
  // A partir de ahora se crea uno automático por cada venta (checkout o venta manual del admin),
  // y se marca 'reversado' si el pedido se cancela o se devuelve.
  pagos: [
    { id_pago: 1, id_venta: 1, metodo_pago: 'transferencia', valor: 98000, fecha: '2026-04-25 10:15:00', estado: 'completado', transaccion_id: 'SIM-000001' },
    { id_pago: 2, id_venta: 2, metodo_pago: 'efectivo', valor: 121050, fecha: '2026-04-26 16:47:00', estado: 'completado', transaccion_id: 'SIM-000002' },
    { id_pago: 3, id_venta: 3, metodo_pago: 'nequi', valor: 62500, fecha: '2026-05-01 09:03:00', estado: 'completado', transaccion_id: 'SIM-000003' },
    { id_pago: 4, id_venta: 4, metodo_pago: 'tarjeta', valor: 220000, fecha: '2026-05-10 14:33:00', estado: 'completado', transaccion_id: 'SIM-000004' },
    { id_pago: 5, id_venta: 5, metodo_pago: 'transferencia', valor: 96000, fecha: '2026-05-15 11:59:00', estado: 'completado', transaccion_id: 'SIM-000005' },
  ],

  // ── MOVIMIENTOS DE INVENTARIO ────────────────────────────────
  // Log de entradas/salidas/ajustes/ventas/devoluciones -> tabla `movimientos_inventario`.
  // A partir de aquí se alimenta solo: checkout genera 'venta', editar stock en Productos genera
  // 'ajuste', y el panel de Inventario permite registrar entrada/salida/devolución a mano.
  movimientos_inventario: [
    { id_movimiento: 1, id_producto: 1, tipo_movimiento: 'entrada', cantidad: 50, fecha: '2026-07-01 09:00:00', id_usuario: 1, descripcion: 'Stock inicial de bodega' },
    { id_movimiento: 2, id_producto: 4, tipo_movimiento: 'entrada', cantidad: 20, fecha: '2026-07-03 10:15:00', id_usuario: 1, descripcion: 'Stock inicial de bodega' },
    { id_movimiento: 3, id_producto: 9, tipo_movimiento: 'entrada', cantidad: 80, fecha: '2026-07-10 08:30:00', id_usuario: 2, descripcion: 'Reposición de proveedor' },
    { id_movimiento: 4, id_producto: 11, tipo_movimiento: 'ajuste', cantidad: -2, fecha: '2026-07-20 15:40:00', id_usuario: 1, descripcion: 'Corrección tras conteo físico' },
    { id_movimiento: 5, id_producto: 21, tipo_movimiento: 'salida', cantidad: 3, fecha: '2026-08-01 11:00:00', id_usuario: 1, descripcion: 'Producto dañado en bodega' },
    { id_movimiento: 6, id_producto: 26, tipo_movimiento: 'entrada', cantidad: 15, fecha: '2026-08-05 09:20:00', id_usuario: 2, descripcion: 'Reposición de proveedor' },
    { id_movimiento: 7, id_producto: 16, tipo_movimiento: 'devolucion', cantidad: 1, fecha: '2026-08-08 14:10:00', id_usuario: 1, descripcion: 'Devolución de cliente, producto en buen estado' },
  ],

  // ── PQRS ───────────────────────────────────────────────────
  pqrs: [
    { id_pqrs: 1, numero_pqrs: 'PQRS-2026-001', id_usuario: 3, tipo: 'queja', asunto: 'Demora en entrega', descripcion: 'Mi pedido lleva 5 días y no ha llegado', estado: 'en_proceso', prioridad: 'alta', fecha_creacion: '2026-04-28' },
    { id_pqrs: 2, numero_pqrs: 'PQRS-2026-002', id_usuario: 4, tipo: 'peticion', asunto: 'Solicitud de catálogo', descripcion: 'Quisiera recibir el catálogo completo de productos', estado: 'resuelto', prioridad: 'baja', fecha_creacion: '2026-04-30', fecha_resolucion: '2026-05-02', respuesta: 'Se envió catálogo al correo registrado' },
    { id_pqrs: 3, numero_pqrs: 'PQRS-2026-003', id_usuario: 5, tipo: 'sugerencia', asunto: 'Mejorar empaque', descripcion: 'Los productos deberían venir con mejor empaque para evitar daños', estado: 'abierto', prioridad: 'media', fecha_creacion: '2026-05-05' }
  ],

  // ── RESEÑAS DE PRODUCTOS ────────────────────────────────────
  // NOTA: no existe una tabla `resenas_productos` en la BD real todavía — al conectar el
  // backend hay que crearla (id_resena, id_producto, id_usuario, calificacion, comentario, fecha).
  resenas_productos: [
    { id_resena: 1, id_producto: 1, id_usuario: 3, calificacion: 5, comentario: 'Excelente producto, cubre muy bien y el acabado quedó perfecto. Lo recomiendo totalmente.', fecha: '2026-04-20' },
    { id_resena: 2, id_producto: 1, id_usuario: 4, calificacion: 4, comentario: 'Buena relación calidad-precio. El color es fiel a la muestra. Llegó rápido y bien empacado.', fecha: '2026-04-15' },
    { id_resena: 3, id_producto: 1, id_usuario: 5, calificacion: 5, comentario: 'Llevo varios proyectos usando esta línea y siempre me da excelentes resultados.', fecha: '2026-03-28' },
    { id_resena: 4, id_producto: 3, id_usuario: 4, calificacion: 5, comentario: 'El estuco quedó liso y parejo, muy fácil de aplicar incluso para alguien sin experiencia previa.', fecha: '2026-04-10' },
    { id_resena: 5, id_producto: 3, id_usuario: 3, calificacion: 4, comentario: 'Buen rendimiento, aunque el secado tomó un poco más de lo que esperaba.', fecha: '2026-03-22' },
    { id_resena: 6, id_producto: 6, id_usuario: 5, calificacion: 5, comentario: 'El rodillo no suelta pelusa y deja un acabado uniforme. Muy recomendado para trabajos profesionales.', fecha: '2026-04-02' }
  ],

  // ── PROMOCIONES ────────────────────────────────────────────
  promociones: [
    { id: 1, titulo: '¡Gran Descuento en Pinturas!', descripcion: 'Hasta 20% de descuento en toda la línea de vinilos tipo 1 y 2. Aplica para compras mayores a $150.000.', imagen_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80', tipo: 'descuento', descuento_porcentaje: 20, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-31', activo: 1, id_producto: 1 },
    { id: 2, titulo: 'Combo Acabados Profesionales', descripcion: 'Lleva Estuco + Rodillo + Brocha por solo $55.000. Ahorra más de $15.000 en materiales premium.', imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', tipo: 'combo', precio_especial: 55000, fecha_inicio: '2026-05-10', fecha_fin: '2026-06-10', activo: 1, id_producto: 3 },
    { id: 3, titulo: 'Servicio de Pintura con 10% OFF', descripcion: 'Contrata nuestro servicio de aplicación de pintura este mes y obtén 10% de descuento. Incluye mano de obra especializada.', imagen_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', tipo: 'servicio', descuento_porcentaje: 10, fecha_inicio: '2026-05-15', fecha_fin: '2026-06-15', activo: 1, id_servicio: 2 },
    { id: 4, titulo: '30% OFF en Pintura Azul Pastel', descripcion: 'Renueva tus espacios con este tono exclusivo. 30% de descuento por tiempo limitado en presentación de 1 galón.', imagen_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', tipo: 'descuento', descuento_porcentaje: 30, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-31', activo: 1, id_producto: 2 },
    { id: 5, titulo: '15% OFF en Graniplast Textura Fina', descripcion: 'Dale un acabado granulado profesional a tu fachada con 15% de descuento este mes.', imagen_url: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80', tipo: 'descuento', descuento_porcentaje: 15, fecha_inicio: '2026-05-01', fecha_fin: '2026-05-31', activo: 1, id_producto: 11 }
  ],

  // ── CONFIGURACIÓN ──────────────────────────────────────────
  configuracion: {
    nombre_empresa: 'Acabados y Diseños 1A',
    lema: 'Grandes ideas que inspiran grandes Diseños',
    nit: '1079409325-1',
    telefono: '3184888660',
    telefono_alterno: '3132273771',
    // TODO: correo real pendiente de confirmar (el sitio actual no lo expone en texto plano, probablemente por antispam).
    email: 'info@acabados1a.com',
    direccion: 'Carrera 5 No 6-31, Tesalia',
    ciudad: 'Tesalia',
    departamento: 'Huila',
    facebook: 'https://facebook.com/acabados1a',
    instagram: 'https://instagram.com/acabados1a',
    twitter: 'https://x.com/acabados1a',
    tiktok: 'https://tiktok.com/@acabados1a',
    whatsapp: '573184888660',
    horario: 'Lunes a Sábado: 8:00am - 6:00pm',
    mapa_ver_url: 'https://www.google.com/maps?cid=5870515882918868969',
    mapa_llegar_url: 'https://www.google.com/maps/dir/?api=1&destination=Pinturas+Tesacol,+Tesalia,+Huila',
    mision: 'Brindar soluciones integrales en acabados y diseño de espacios, ofreciendo productos de alta calidad y servicios especializados que transformen los hogares y empresas de nuestros clientes.',
    vision: 'Ser la empresa líder en acabados y diseño de interiores del suroccidente colombiano, reconocida por la calidad de nuestros productos, la excelencia en el servicio y nuestro compromiso con la satisfacción del cliente.'
  }
}
