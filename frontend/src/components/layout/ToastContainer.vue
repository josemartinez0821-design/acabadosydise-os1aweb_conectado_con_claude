<script setup>
import { useToast } from '../../composables/useToast'

const { toasts } = useToast()

const icons = {
  success: 'ri-checkbox-circle-fill',
  danger: 'ri-error-warning-fill',
  warning: 'ri-alert-fill',
  info: 'ri-information-fill',
}
</script>

<template>
  <div id="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="`toast-${toast.type}`">
      <i :class="icons[toast.type] || icons.info"></i>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>
