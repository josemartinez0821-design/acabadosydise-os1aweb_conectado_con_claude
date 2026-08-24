# Acabados y Diseños 1A — Web

Aplicación web de comercio electrónico y gestión para **Acabados y Diseños 1A**, empresa familiar de Tesalia, Huila, dedicada a la venta de pinturas, materiales de acabado y servicios de instalación (Drywall, PVC, estuco, Graniplast).

Proyecto formativo SENA (Tecnólogo en Análisis y Desarrollo de Software).

## Stack

- **Vue 3** (Composition API, `<script setup>`)
- **Vite**
- **Vue Router**
- **Pinia** (manejo de estado)
- **Axios** (listo para conectar con el backend real)

Por ahora, todo el frontend corre sobre datos de prueba (`src/data/mockData.js`), mientras se construye el backend (Spring + MySQL, esquema ya definido) que reemplazará esa capa manteniendo los mismos nombres de campo.

## Funcionalidades

- Catálogo de productos con filtros, búsqueda, variantes de tamaño/color y calculadora de cantidad de pintura
- Selector de color de pinturas por familias, con búsqueda por nombre/código
- Carrito de compras y checkout en 3 pasos
- Módulo de cotizaciones (productos y servicios)
- Historial de pedidos y perfil de usuario
- Servicios: listado y detalle con galería
- Contacto, PQRS, páginas legales
- Panel de administración (en construcción)
- Autenticación con roles Administrador / Cliente

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

## Estructura

```
src/
  components/   Componentes reutilizables (layout, producto, servicio)
  views/        Vistas por ruta
  stores/       Stores de Pinia
  data/         Datos de prueba (mockData.js) y catálogos de referencia
  composables/  Lógica reutilizable (formato, toasts, etc.)
  router/       Configuración de rutas
```
