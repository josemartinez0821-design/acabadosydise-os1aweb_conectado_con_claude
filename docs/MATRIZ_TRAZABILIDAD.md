# Matriz de trazabilidad — Acabados y Diseños 1A

Relaciona cada requisito funcional con el módulo, los archivos y las funciones que lo implementan,
y con los casos de prueba que lo verifican y su resultado. Se creó para cerrar los hallazgos NC-03 y
NC-04 de la auditoría cruzada (equipo Natural One Life): el repositorio no tenía una relación formal
**requisito → módulo → archivo → función → caso de prueba → resultado**.

**Fuentes**

| Qué | Dónde |
|---|---|
| Requisitos funcionales (RF01–RF23) | *REQUISITOS FUNCIONALES Y NO FUNCIONALES DE ACABADOS Y DISEÑOS 1A* (documento oficial del proyecto) |
| Casos de prueba (38) | *AA2-EV01 Casos de Prueba* (IDs `REF-AUTH`, `P-`, `S-`, `C-`, `Q-`, `R-`, `PQ-`, `V-`, `RE-`, `CF-`, `CT-`) |
| Resultado de la ejecución | *GA9-220501096-AA3-EV02 Reporte de plan de pruebas ejecutadas* (11/09/2026): los 11 módulos quedaron **Aprobado** |
| Pruebas automáticas | `backend/src/test/java/com/acabados1a/backend/` (se corren con `./mvnw test`, necesitan MariaDB local) |

**Numeración de requisitos.** Esta matriz usa la numeración del documento oficial de requisitos. La
matriz de prototipos HTML (*Evidencia proyecto formativo*, p. 47) numeraba páginas, no requisitos
(allí "RF08" era la página de cotizaciones, mientras que el RF08 oficial es el carrito). Los
comentarios del código se alinearon a la numeración oficial en la misma rama que agregó este archivo.

**Estado:** ✅ implementado · ◐ parcial (se explica en la nota) · ✗ no implementado

## 1. Requisitos funcionales oficiales

Las rutas de backend son relativas a `backend/src/main/java/com/acabados1a/backend/`; las de
frontend, a `frontend/src/`.

### Gestión de usuarios

| RF | Requisito | Estado | Frontend | Backend (controlador → servicio) | Casos de prueba | Resultado |
|---|---|---|---|---|---|---|
| RF01 | Registro de usuarios (nombre, correo, contraseña, teléfono, dirección) | ✅ | `views/RegistroView.vue` | `AuthController` `POST /api/auth/registro` → `AuthService.registrar()` | REF-AUTH | Aprobado |
| RF02 | Validar los datos y notificar al usuario por correo | ✅ | `views/RegistroView.vue` (paso 2: código) | `AuthController` `POST /verificar-email`, `/reenviar-codigo` → `AuthService.verificarEmail()`; `EmailService.enviarCodigoVerificacion()`; `CodigoVerificacionHasher` | REF-AUTH · verificación A-1 (24/09/2026) | Aprobado |
| RF03 | Iniciar sesión para comprar o ver el historial | ✅ | `views/LoginView.vue`; guardia `requiresAuth` en `router/index.js` (`/checkout`, `/pedidos`, `/perfil`) | `AuthController` `POST /login` → `AuthService.login()`, `JwtService`; `SecurityConfig` exige token en `POST /api/ventas` | REF-AUTH · V-004 | Aprobado |
| RF04 | Notificar por correo y WhatsApp tras una compra | ◐ | `views/CheckoutView.vue` | `VentaService.crear()` → `enviarConfirmacion()` → `EmailService.enviarConfirmacionPedido()` | V-001 · `VentaServiceCrearRegresionTest` | Aprobado (correo) |

> RF04: el correo de confirmación se envía siempre. **WhatsApp no se envía automáticamente** (no hay
> integración con la API de WhatsApp Business); el negocio atiende por WhatsApp con el enlace
> `wa.me` del sitio.

### Catálogo de productos

| RF | Requisito | Estado | Frontend | Backend (controlador → servicio) | Casos de prueba | Resultado |
|---|---|---|---|---|---|---|
| RF05 | Catálogo organizado por tipo y color | ✅ | `views/ProductosView.vue` (filtros por categoría, precio, disponibilidad); `stores/catalog.js` | `ProductoController` `GET /api/productos`; `CategoriaController` `GET /api/categorias`; variantes de color desde `ConfiguracionController` (`grupos_variante_productos`) | P-001 · C-001 · C-003 | Aprobado |
| RF06 | Imagen, descripción, tipo, precio y disponibilidad de cada producto | ✅ | `views/DetalleProductoView.vue`; `stores/catalog.js` `getStockStatus()` | `ProductoController` `GET /api/productos/{id}`; `InventarioController` `GET /api/inventario` (vista pública) | P-001 · C-002 · verificación A-2 (24/09/2026) | Aprobado |
| RF07 | Consultar el catálogo sin registro, pero no comprar | ✅ | `/productos` y `/carrito` sin guardia; `/checkout` con `requiresAuth` | `SecurityConfig`: `GET` de catálogo `permitAll`, `POST /api/ventas` `authenticated` | P-001 · verificación 24/09/2026 (`POST /api/ventas` sin token → 403) | Aprobado |

### Carrito y compras

| RF | Requisito | Estado | Frontend | Backend (controlador → servicio) | Casos de prueba | Resultado |
|---|---|---|---|---|---|---|
| RF08 | Agregar, eliminar o modificar productos en el carrito | ✅ | `views/CarritoView.vue`; `stores/cart.js` `agregarProducto()`, `actualizarCantidad()`, `eliminarProducto()` | — (el carrito vive en el navegador hasta el checkout) | Sin caso formal; se ejercita en V-001 | — |
| RF09 | Calcular automáticamente el total del pedido | ✅ | `stores/cart.js` `total`; `views/CheckoutView.vue` | `VentaService.calcularSubtotal()` | V-001 · `VentaServiceCrearRegresionTest` | Aprobado · 9/9 (24/09/2026) |
| RF10 | Confirmar el pedido con dirección y método de pago | ✅ | `views/CheckoutView.vue`; `stores/ventas.js` | `VentaController` `POST /api/ventas` → `VentaService.crear()` (`validarStock()`, `guardarCabecera()`, `crearDetallesVenta()`, `crearPago()`); trigger `after_venta_detalle_insert` | V-001 · V-002 · `VentaServiceCrearRegresionTest` | Aprobado · 9/9 (24/09/2026) |
| RF11 | Pagos con tarjeta, Nequi y transferencia | ◐ | `views/CheckoutView.vue` | `Venta.MetodoPago` (tarjeta, nequi, transferencia, daviplata, efectivo, contraentrega) → `VentaService.crearPago()` | V-001 · `VentaServiceCrearRegresionTest` | Aprobado (simulado) |
| RF12 | Confirmación de compra y número de seguimiento | ✅ | `views/PedidosView.vue` | `numero_venta` lo genera el trigger `before_venta_insert` → `VentaService.guardarCabecera()`; guía y transportadora en `VentaService.actualizarEstado()` | V-003 · V-005 · `VentaServiceH3VerifyTest` | Aprobado |

> RF11: los métodos existen y el pedido se guarda completo, pero **el cobro es simulado**
> (`transaccion_id = SIM-xxxxxx`). La pasarela real (Wompi) está pendiente y depende del cliente.

### Historial y recomendaciones

| RF | Requisito | Estado | Frontend | Backend (controlador → servicio) | Casos de prueba | Resultado |
|---|---|---|---|---|---|---|
| RF13 | Historial de compras del cliente con fechas y detalles | ✅ | `views/PedidosView.vue`, `views/PerfilView.vue` | `VentaController` `GET /api/ventas` → `VentaService.listarParaUsuario()` (solo las propias si no es admin) | V-004 | Aprobado |
| RF14 | Recomendaciones personalizadas según preferencias y compras | ◐ | `views/DetalleProductoView.vue` (productos relacionados); `stores/catalog.js` (recomendador servicio ↔ producto) | — | Sin caso formal | — |

> RF14: hay sugerencias por categoría y servicio relacionado, pero **no se personalizan con el
> historial de compras** del cliente.

### Administración del sistema

| RF | Requisito | Estado | Frontend | Backend (controlador → servicio) | Casos de prueba | Resultado |
|---|---|---|---|---|---|---|
| RF15 | El administrador inicia sesión y accede al panel | ✅ | `components/layout/AdminLayout.vue`; guardia `requiresAdmin` en `router/index.js`; `views/admin/DashboardView.vue` | `AuthController` `POST /login` (rol 1 → `ROLE_ADMIN`); `SecurityConfig` `hasRole("ADMIN")` | REF-AUTH · P-003 · PQ-003 | Aprobado |
| RF16 | Agregar, modificar o eliminar productos | ✅ | `views/admin/AdminProductosView.vue` | `ProductoController` `POST`/`PUT`/`DELETE` → `ProductoService.crear()`, `actualizar()`, `eliminar()`, `subirImagen()` | P-002 · P-003 · P-004 | Aprobado |
| RF17 | Actualizar manualmente el stock y la información del producto | ✅ | `views/admin/AdminInventarioView.vue` | `MovimientoInventarioController` `POST` → `MovimientoInventarioService.registrar()`; `InventarioController` `PUT /{id}/umbrales` → `InventarioService.actualizarUmbrales()` | P-004 · C-002 | Aprobado |
| RF18 | Alertas y notificaciones de productos agotados o en promoción | ✅ | Campana de `AdminLayout.vue`; alertas de `AdminInventarioView.vue`; `views/admin/AdminPromocionesView.vue` (vigencia con fecha de inicio y fin) | `PromocionController` → `PromocionService`; umbral `stock_bajo` en `InventarioPublicoResponse` | R-001 · R-002 · R-003 · R-004 | Aprobado |
| RF19 | Gráficas de ventas, productos más vendidos y promociones | ✅ | `views/admin/AdminReportesView.vue`, `views/admin/DashboardView.vue` | `VentaController` `GET /api/ventas` (se grafica en el cliente desde `stores/ventas.js`) | Sin caso formal | — |

### Comunicación y atención al cliente

| RF | Requisito | Estado | Frontend | Backend (controlador → servicio) | Casos de prueba | Resultado |
|---|---|---|---|---|---|---|
| RF20 | Número de contacto para asesoría telefónica | ✅ | `components/layout/FooterSite.vue`, `views/ContactoView.vue` | `ConfiguracionController` `GET /api/configuracion` (clave `telefono`) | CF-001 | Aprobado |
| RF21 | Mensaje grabado si llama fuera del horario | ✗ | `views/ContactoView.vue` muestra el horario y si el local está abierto en ese momento | — | — | — |
| RF22 | Sección de noticias, promociones o blog en la página de inicio | ✅ | `views/HomeView.vue` (promociones del mes) | `PromocionController` `GET /api/promociones` | R-002 | Aprobado |
| RF23 | Compartir contenido en redes sociales (Facebook, Instagram) | ◐ | `views/DetalleProductoView.vue` (barra "Compartir") | — | Sin caso formal | — |

> RF21: depende de la central telefónica del negocio, no del software web; se deja fuera del
> alcance. RF23: compartir por WhatsApp funciona; el botón de Facebook abre el diálogo sin la URL
> del producto (defecto conocido, anotado en `PENDIENTES.md`) e Instagram no permite compartir
> enlaces desde la web.

**Resumen:** 23 requisitos oficiales → 18 ✅ implementados, 4 ◐ parciales (RF04, RF11, RF14, RF23)
y 1 ✗ fuera de alcance (RF21). 5 requisitos no tienen todavía un caso de prueba formal propio
(RF08, RF14, RF19, RF21, RF23).

## 2. Funcionalidades sin un RF oficial (ampliaciones del alcance)

Se agregaron durante el desarrollo, a pedido del negocio. No tienen número en el documento de
requisitos, pero sí casos de prueba propios.

| Funcionalidad | Frontend | Backend (controlador → servicio) | Casos de prueba | Resultado |
|---|---|---|---|---|
| Cotizaciones de productos y servicios (incluye anticipo del 50%) | `views/CotizacionesView.vue`, `views/admin/AdminCotizacionesView.vue`; `stores/cotizaciones.js` | `CotizacionController` → `CotizacionService.crear()`, `actualizarEstado()`, `enviarRecordatoriosVencimiento()` | Q-001 · Q-002 · Q-003 · Q-004 · Q-005 | Aprobado |
| Catálogo y gestión de servicios | `views/ServiciosView.vue`, `views/DetalleServicioView.vue`, `views/admin/AdminServiciosView.vue` | `ServicioController` → `ServicioService` | S-001 · S-002 · S-003 · S-004 | Aprobado |
| PQRS (radicación y respuesta) | `views/PqrsView.vue`, `views/admin/AdminPqrsView.vue`; `stores/pqrs.js` | `PqrsController` → `PqrsService.crear()`, `actualizar()` | PQ-001 · PQ-002 · PQ-003 · PQ-004 | Aprobado |
| Formulario de contacto (se envía por correo, no se guarda) | `views/ContactoView.vue` | `ContactoController` → `ContactoService.enviar()` | CT-001 · CT-002 · CT-003 | Aprobado |
| Reseñas de productos | `views/DetalleProductoView.vue`; `stores/resenas.js` | `ResenaController` → `ResenaService.crear()` | RE-001 · RE-002 · RE-003 | Aprobado |
| Configuración de la empresa (solo lectura) | `stores/catalog.js` `cargarConfiguracion()` | `ConfiguracionController` | CF-001 · CF-002 | Aprobado |
| Recuperación de contraseña | `views/RecuperarPasswordView.vue` | `AuthController` `POST /recuperar-password`, `/verificar-codigo`, `/nueva-password` → `AuthService` | verificación A-1 (24/09/2026): código correcto → 200, incorrecto → 400 | Aprobado |
| Gestión del perfil | `views/PerfilView.vue` | `UsuarioController` `PUT /{id}`, `/{id}/avatar`, `/{id}/password` | Sin caso formal | — |

## 3. Cómo mantener esta matriz

- Si se agrega o cambia una funcionalidad, actualizar su fila en el mismo commit que el código.
- En los comentarios del código, citar siempre el RF con la numeración oficial de este documento.
- Si un requisito queda sin caso de prueba, dejarlo marcado aquí en vez de omitir la fila.
