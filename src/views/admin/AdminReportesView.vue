<script setup>
// RF19 - reportes gráficos de ventas/productos más vendidos, exportables a PDF/PNG/Word -> vista `vista_productos_mas_vendidos`
</script>

<template>
  <section class="page">
    <h1>Reportes</h1>
    <p>Gráficas de ventas, productos más vendidos y promociones.</p>
    <!-- TODO: integrar librería de gráficas (Chart.js / ApexCharts) y exportación PDF/PNG/Word -->
    <div class="acciones-exportar">
      <button class="btn btn--secondary">Exportar PDF</button>
      <button class="btn btn--secondary">Exportar PNG</button>
      <button class="btn btn--secondary">Exportar Word</button>
    </div>
  </section>
</template>
