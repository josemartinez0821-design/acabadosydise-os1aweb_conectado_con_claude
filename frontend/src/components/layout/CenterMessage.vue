<script setup>
import { useCenterMessage } from '../../composables/useCenterMessage'

const { mensaje } = useCenterMessage()
</script>

<template>
  <Transition name="center-msg">
    <div v-if="mensaje" class="center-message-wrap">
      <div class="center-message-card" :class="`center-message-${mensaje.tipo}`">
        <div class="center-message-icon"><i :class="mensaje.icono"></i></div>
        <div>
          <p class="center-message-text">{{ mensaje.texto }}</p>
          <span v-if="mensaje.badge" class="center-message-badge">{{ mensaje.badge }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>
