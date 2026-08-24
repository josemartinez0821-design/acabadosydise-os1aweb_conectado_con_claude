<script setup>
defineProps({
  mostrar: { type: Boolean, default: false },
  icono: { type: String, default: 'ri-file-list-3-line' },
  titulo: { type: String, default: 'Inicia sesión para cotizar' },
  texto: { type: String, default: 'Necesitas una cuenta para solicitar una cotización y hacerle seguimiento desde tu perfil.' },
})
defineEmits(['cerrar', 'iniciar-sesion'])
</script>

<template>
  <Transition name="confirm-modal-fade">
    <div v-if="mostrar" class="confirm-modal-overlay" @click.self="$emit('cerrar')">
      <Transition name="confirm-modal-pop" appear>
        <div class="confirm-modal">
          <button class="confirm-modal-close" aria-label="Cerrar" @click="$emit('cerrar')">
            <i class="ri-close-line"></i>
          </button>
          <div class="confirm-modal-icon"><i :class="icono"></i></div>
          <h3 class="confirm-modal-title">{{ titulo }}</h3>
          <p class="confirm-modal-text">{{ texto }}</p>
          <div class="confirm-modal-actions">
            <button class="btn btn-primary btn-lg btn-block" @click="$emit('iniciar-sesion')">
              <i class="ri-login-box-line"></i> Iniciar Sesión
            </button>
            <button class="btn btn-outline-red btn-block" @click="$emit('cerrar')">Cancelar</button>
          </div>
          <p class="confirm-modal-footer">¿No tienes cuenta? <RouterLink to="/registro" @click="$emit('cerrar')">Regístrate gratis</RouterLink></p>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
