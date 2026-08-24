# Acabados y Diseños 1A — Web

Aplicación web de comercio electrónico y gestión para **Acabados y Diseños 1A**, empresa familiar de Tesalia, Huila, dedicada a la venta de pinturas, materiales de acabado y servicios de instalación (Drywall, PVC, estuco, Graniplast).

Proyecto formativo SENA (Tecnólogo en Análisis y Desarrollo de Software).

## Estructura

```
frontend/   Vue 3 + Vite + Vue Router + Pinia
backend/    Spring Boot 4 (Java 21) + MariaDB
```

## Stack

**Frontend**: Vue 3 (Composition API, `<script setup>`), Vite, Vue Router, Pinia, Axios.

**Backend**: Spring Boot, Spring Security + JWT, Spring Data JPA (Hibernate), MariaDB, envío de correo vía Gmail SMTP.

## Funcionalidades

- Catálogo de productos con filtros, búsqueda, variantes de tamaño/color
- Carrito de compras y checkout
- Cotizaciones (productos y servicios)
- Ventas: checkout real, anticipos de cotización, gestión desde el panel admin
- PQRS: radicación y gestión con respuesta del equipo
- Inventario: umbrales de stock y movimientos manuales (entrada/salida/ajuste/devolución)
- Autenticación con verificación de correo y recuperación de contraseña (JWT, roles Administrador/Cliente/Vendedor)
- Panel de administración: dashboard, productos, servicios, inventario, ventas, cotizaciones, PQRS, reportes

## Cómo correr el proyecto

### Backend

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Editar application.properties con los datos reales de tu base de datos MariaDB y credenciales SMTP
./mvnw spring-boot:run
```

Requiere una base de datos MariaDB local con el esquema del proyecto ya creado.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Por defecto apunta a `http://localhost:8080/api` (ver `frontend/.env`).
