<script setup>
import { computed } from 'vue'
import { useInactivityLogout } from '../../composables/useInactivityLogout'

const { mostrarAviso, segundosRestantes, seguirConectado, cerrarSesionPorInactividad } = useInactivityLogout()

const tiempoFormateado = computed(() => {
  const m = Math.floor(segundosRestantes.value / 60)
  const s = segundosRestantes.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})
</script>

<template>
  <Transition name="confirm-modal-fade">
    <div v-if="mostrarAviso" class="confirm-modal-overlay">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal">
          <div class="confirm-modal-icon"><i class="ri-time-line"></i></div>
          <h3 class="confirm-modal-title">¿Sigues ahí?</h3>
          <p class="confirm-modal-text">
            Tu sesión está por cerrarse por inactividad en
            <span class="confirm-modal-countdown">{{ tiempoFormateado }}</span>.
          </p>
          <div class="confirm-modal-actions">
            <button class="btn btn-primary btn-lg btn-block" @click="seguirConectado">
              <i class="ri-refresh-line"></i> Seguir conectado
            </button>
            <button class="btn btn-outline-red btn-block" @click="cerrarSesionPorInactividad">Cerrar sesión ahora</button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
