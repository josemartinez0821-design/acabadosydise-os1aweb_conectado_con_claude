# Pendientes — Acabados y Diseños 1A Web

Última actualización: 24/09/2026.

## 1. Documento de evidencia SENA (`Evidencia proyecto formativo.docx`)

Puntos 3 y 4 de "Productos esperados" ya tienen sus secciones con capturas reales
(código fuente, módulos funcionales, entorno de pruebas y registro de pruebas).

- [x] Punto 4 — **Validación del cumplimiento de los requerimientos establecidos**
      (24/09/2026: RF01–RF23 y RNF01–RNF12 → 22 cumplen, 9 parcialmente, 4 no).
- [x] Punto 4 — se da por completo con las secciones actuales (decisión del 24/09/2026).
- [ ] *(Opcional)* Poner al día las secciones antiguas que todavía describen el diseño
      original (Angular, MySQL/XAMPP, 20 tablas; el glosario menciona "Angular y MySQL").

## 2. Verificaciones pendientes

- [ ] Probar en vivo el toast de notificaciones del **lado cliente** (requiere iniciar
      sesión con una cuenta de cliente). El lado admin ya se verificó.

## 3. Despliegue (plataforma evaluada: Railway)

- [ ] Versionar `application.properties` con marcadores `${...}` para los secretos
      (BD, `jwt.secret`, correo) y dejar los valores reales solo en variables de entorno.
- [ ] `server.port=${PORT:8080}`.
- [ ] CORS: permitir el dominio público del frontend (hoy solo `http://localhost:*`).
- [ ] Imágenes de productos: se guardan en disco (`uploads/productos`) → necesitan un
      volumen persistente y copiar las imágenes existentes.
- [ ] Base de datos: crear MySQL/MariaDB en la plataforma e importar el dump completo
      (23 tablas, 3 vistas, 2 triggers — revisar `DEFINER` de triggers/vistas).
- [ ] Confirmar que el plan elegido permite SMTP saliente (registro, recuperación de
      contraseña y contacto dependen del correo).
- [ ] Frontend: compilar con `VITE_API_BASE_URL` apuntando al backend público y servirlo
      con redirección a `index.html` (rutas de Vue Router).

## 4. Backlog del producto

- [ ] **Defecto:** el botón "Compartir en Facebook" del detalle de producto
      (`DetalleProductoView.vue`) abre `facebook.com/sharer/sharer.php` sin el parámetro
      `?u=`, así que no comparte el enlace del producto.
- [ ] En el motor WebKit (Safari) los títulos con Montserrat se ven con letra delgada.
      Confirmarlo en un Safari real (Mac/iPhone) antes de corregir.
- [ ] Probar el sitio en Firefox (en este PC Windows bloqueó el navegador de pruebas).
- [ ] Pasarela de pago real (Wompi) — bloqueado por el cliente; hoy el pago es simulado.
- [ ] Panel de administración para editar la configuración de la empresa (hoy solo por BD).
- [ ] Tabla `auditoria`: existe pero no se usa.
- [ ] Reseñas: permitir editar/borrar.
- [ ] Ventas: botones para los estados intermedios (`confirmado`, `preparando`, …).
- [ ] `InventarioController` no tiene `GET /{id}` (Productos y Servicios ya lo tienen).
- [ ] Modal de eliminar servicio dice "no se puede deshacer", pero es un borrado lógico.

## Notas sobre datos de prueba

- **VEN-2026-005** (cliente de prueba Jose Antonio Martinez) quedó en `entregado` con una
  guía ficticia (`TEST-VERIFICACION-001`, Servientrega) por la prueba de notificaciones
  del 17/09/2026. Se decidió dejarlo así; no es un pedido real.
