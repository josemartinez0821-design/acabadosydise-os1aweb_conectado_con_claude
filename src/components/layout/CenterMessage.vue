<script setup>
import { useCenterMessage } from '../../composables/useCenterMessage'

const { mensaje } = useCenterMessage()
</script>

<template>
  <Transition name="center-msg">
    <div v-if="mensaje" class="center-message-wrap">
      <div class="center-message-card" :class="`center-message-${mensaje.tipo}`">
        <div class="center-message-icon"><i :class="mensaje.icono"></i></div>
        <p class="center-message-text">{{ mensaje.texto }}</p>
      </div>
    </div>
  </Transition>
</template>
