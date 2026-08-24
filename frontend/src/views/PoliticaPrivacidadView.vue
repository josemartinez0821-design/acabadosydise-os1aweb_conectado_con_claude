<script setup>
import { useCatalogStore } from '../stores/catalog'
import LegalLayout from '../components/layout/LegalLayout.vue'

const catalog = useCatalogStore()
</script>

<template>
  <LegalLayout
    title="Política de Privacidad"
    subtitle="Tratamiento de datos personales conforme a la Ley 1581 de 2012 (Habeas Data)"
  >
      <div class="legal-content">
        <p class="legal-updated">Última actualización: julio de 2026</p>

        <div class="legal-section">
          <h2><span class="legal-num">1</span> Responsable del tratamiento</h2>
          <p>
            {{ catalog.configuracion.nombre_empresa }}, con domicilio en {{ catalog.configuracion.direccion }},
            {{ catalog.configuracion.ciudad }} ({{ catalog.configuracion.departamento }}), es responsable del
            tratamiento de los datos personales que nos proporcionas a través de esta plataforma.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">2</span> Datos que recopilamos</h2>
          <p>Al registrarte o realizar una compra podemos recopilar:</p>
          <ul>
            <li>Datos de identificación: nombre, tipo y número de documento.</li>
            <li>Datos de contacto: correo electrónico, teléfono, WhatsApp y dirección.</li>
            <li>Datos de la relación comercial: historial de compras, cotizaciones y pedidos.</li>
          </ul>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">3</span> Finalidad del tratamiento</h2>
          <p>Usamos tus datos personales para:</p>
          <ul>
            <li>Gestionar tu cuenta, tus compras, cotizaciones y el envío de tus pedidos.</li>
            <li>Enviarte notificaciones sobre el estado de tus pedidos por correo o WhatsApp.</li>
            <li>Brindarte atención a través de nuestros canales de PQRS.</li>
            <li>Cumplir con obligaciones legales y contables.</li>
          </ul>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">4</span> Derechos del titular (Habeas Data)</h2>
          <p>
            De acuerdo con la Ley 1581 de 2012 y sus decretos reglamentarios, tienes derecho a conocer, actualizar,
            rectificar y solicitar la supresión de tus datos personales, así como a revocar la autorización otorgada
            para su tratamiento. Puedes ejercer estos derechos escribiéndonos a través de nuestra
            <RouterLink to="/pqrs">sección de PQRS</RouterLink> o directamente a
            <a :href="`mailto:${catalog.configuracion.email}`">{{ catalog.configuracion.email }}</a>.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">5</span> Seguridad de la información</h2>
          <p>
            Implementamos medidas técnicas y administrativas razonables para proteger tus datos personales contra
            pérdida, uso indebido o acceso no autorizado. Tu contraseña nunca es visible para nuestro equipo.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">6</span> Con quién compartimos tus datos</h2>
          <p>
            No vendemos ni compartimos tus datos personales con terceros para fines publicitarios. Solo compartimos la
            información estrictamente necesaria con las entidades de pago (tarjeta, Nequi, Daviplata, transferencia)
            para procesar tus compras.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">7</span> Cambios a esta política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad para reflejar cambios en nuestras prácticas. Publicaremos
            cualquier cambio en esta misma página.
          </p>
        </div>

        <div class="legal-section">
          <h2><span class="legal-num">8</span> Contacto</h2>
          <p>
            Para cualquier consulta sobre el tratamiento de tus datos, contáctanos al
            {{ catalog.configuracion.telefono }} o a
            <a :href="`mailto:${catalog.configuracion.email}`">{{ catalog.configuracion.email }}</a>.
          </p>
        </div>
      </div>
  </LegalLayout>
</template>
