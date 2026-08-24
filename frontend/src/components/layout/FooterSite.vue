<script setup>
import { useCatalogStore } from '../../stores/catalog'

const catalog = useCatalogStore()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">ACABADOS <span>1A</span></div>
          <p class="footer-desc">Empresa especializada en materiales de acabados, pinturas y servicios de instalación para hogares y empresas del Huila.</p>
          <p class="footer-desc" style="margin-bottom:16px;font-style:italic;">"Calidad y servicio en cada proyecto"</p>
          <div class="footer-socials">
            <a :href="catalog.configuracion.facebook" target="_blank" rel="noopener" class="footer-social footer-social--facebook" aria-label="Facebook"><i class="ri-facebook-fill"></i></a>
            <a :href="catalog.configuracion.instagram" target="_blank" rel="noopener" class="footer-social footer-social--instagram" aria-label="Instagram"><i class="ri-instagram-line"></i></a>
            <a :href="catalog.configuracion.twitter" target="_blank" rel="noopener" class="footer-social footer-social--twitter" aria-label="X (Twitter)"><i class="ri-twitter-x-fill"></i></a>
            <a :href="catalog.configuracion.tiktok" target="_blank" rel="noopener" class="footer-social footer-social--tiktok" aria-label="TikTok"><i class="ri-tiktok-fill"></i></a>
          </div>
        </div>

        <div>
          <h4 class="footer-title">Productos</h4>
          <div class="footer-links">
            <RouterLink to="/productos?cat=1">Pinturas y Vinilos</RouterLink>
            <RouterLink to="/productos?cat=2">Materiales de Acabado</RouterLink>
            <RouterLink to="/productos?cat=3">Pegantes y Adhesivos</RouterLink>
            <RouterLink to="/productos?cat=4">Drywall y PVC</RouterLink>
            <RouterLink to="/productos?cat=5">Herramientas</RouterLink>
          </div>
        </div>

        <div>
          <h4 class="footer-title">Mi Cuenta</h4>
          <div class="footer-links">
            <RouterLink to="/login">Iniciar Sesión</RouterLink>
            <RouterLink to="/registro">Registrarse</RouterLink>
            <RouterLink to="/perfil">Mi Perfil</RouterLink>
            <RouterLink to="/cotizaciones">Cotizaciones</RouterLink>
          </div>
        </div>

        <div>
          <h4 class="footer-title">Contacto</h4>
          <div class="footer-contact-item"><i class="ri-map-pin-line"></i> {{ catalog.configuracion.direccion }}, {{ catalog.configuracion.departamento }}</div>
          <div class="footer-contact-item"><i class="ri-phone-line"></i> {{ catalog.configuracion.telefono }}</div>
          <div class="footer-contact-item"><i class="ri-mail-line"></i> {{ catalog.configuracion.email }}</div>
          <div class="footer-contact-item"><i class="ri-time-line"></i> {{ catalog.configuracion.horario }}</div>
          <RouterLink to="/pqrs" class="btn btn-outline-red btn-sm" style="width:100%;justify-content:center;display:flex;margin-top:16px;">
            <i class="ri-customer-service-line"></i> Atención PQRS
          </RouterLink>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-legal-links">
          <RouterLink to="/terminos-y-condiciones">Términos y Condiciones</RouterLink>
          <span>·</span>
          <RouterLink to="/politica-privacidad">Política de Privacidad</RouterLink>
        </div>
        <p>&copy; 2026 Acabados y Diseños 1A — Todos los derechos reservados | NIT: {{ catalog.configuracion.nit }} |
           Desarrollado por Juliana Trujillo &amp; Jose Miguel Martínez — SENA ADSO Ficha 3151895</p>
      </div>
    </div>
  </footer>
</template>
