<script setup>
import { useCatalogStore } from '../stores/catalog'
import LegalLayout from '../components/layout/LegalLayout.vue'

const catalog = useCatalogStore()
</script>

<template>
  <LegalLayout
    title="Términos y Condiciones"
    :subtitle="`Condiciones de uso de la plataforma ${catalog.configuracion.nombre_empresa}`"
  >
      <div class="legal-content">
        <p class="legal-updated">Última actualización: julio de 2026</p>

        <div class="legal-section">
          <h2><span class="legal-num">1</span> Aceptación de los términos</h2>
          <p>
            Al registrarte, navegar o realizar una compra en este sitio, aceptas los presentes Términos y Condiciones.
            Si no estás de acuerdo con alguno de los puntos aquí descritos, te pedimos no utilizar la plataforma.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">2</span> Uso del sitio</h2>
          <p>
            El catálogo de productos y servicios puede ser consultado libremente sin necesidad de registro. Para agregar
            productos al carrito no se requiere una cuenta, pero sí es necesario iniciar sesión para completar una compra,
            solicitar una cotización o hacer seguimiento a tus pedidos.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">3</span> Registro y cuenta de usuario</h2>
          <p>
            Al crear una cuenta te comprometes a proporcionar información veraz y actualizada (nombre, correo, teléfono y
            dirección) y a mantener la confidencialidad de tu contraseña. Eres responsable de toda actividad realizada
            desde tu cuenta.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">4</span> Productos, precios y disponibilidad</h2>
          <p>
            Los precios publicados están expresados en pesos colombianos (COP) e incluyen los impuestos aplicables según
            corresponda. La disponibilidad de inventario se muestra de forma referencial y puede variar; en caso de que un
            producto no esté disponible tras confirmar tu pedido, te notificaremos para acordar una alternativa o el
            reembolso correspondiente.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">5</span> Compras, pagos y envíos</h2>
          <p>
            Aceptamos pagos con tarjeta, Nequi, Daviplata y transferencia bancaria. Una compra se considera confirmada
            cuando el pago ha sido aprobado y recibes el número de seguimiento correspondiente. Los tiempos de entrega
            varían según el municipio de destino dentro de nuestra zona de cobertura.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">6</span> Cotizaciones y servicios de instalación</h2>
          <p>
            Las cotizaciones generadas a través de la plataforma tienen una validez limitada (indicada en cada
            cotización) y están sujetas a confirmación de disponibilidad. Los servicios de instalación se agendan
            directamente con nuestro equipo tras la aprobación de la cotización.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">7</span> Propiedad intelectual</h2>
          <p>
            El logo, los textos, las imágenes y el diseño de este sitio son propiedad de {{ catalog.configuracion.nombre_empresa }}
            y no pueden reproducirse sin autorización previa.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">8</span> Limitación de responsabilidad</h2>
          <p>
            Nos esforzamos por mantener la información del catálogo actualizada y precisa; sin embargo, no nos hacemos
            responsables por errores tipográficos en precios o descripciones que sean corregidos oportunamente.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">9</span> Modificaciones</h2>
          <p>
            Podemos actualizar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigencia desde
            su publicación en esta misma página.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">10</span> Contacto</h2>
          <p>
            Si tienes dudas sobre estos términos, escríbenos a
            <a :href="`mailto:${catalog.configuracion.email}`">{{ catalog.configuracion.email }}</a>
            o al {{ catalog.configuracion.telefono }}.
          </p>
        </div>
      </div>
  </LegalLayout>
</template>
