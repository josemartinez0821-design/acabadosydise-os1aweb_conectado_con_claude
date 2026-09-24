# Pendientes — Acabados y Diseños 1A Web

Última actualización: 24/09/2026.

## 1. Documento de evidencia SENA (`Evidencia proyecto formativo.docx`)

Puntos 3 y 4 de "Productos esperados" ya tienen sus secciones con capturas reales
(código fuente, módulos funcionales, entorno de pruebas y registro de pruebas).

- [ ] Punto 4 — **Validación del cumplimiento de los requerimientos establecidos**
      (tabla RF01–RF14: módulo que lo cumple, cómo se validó, resultado).
- [ ] Punto 4 — **Aplicativo web listo para su uso por parte de la empresa**
      (estado final + brechas: pago simulado y sin hosting público).
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
