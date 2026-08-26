<script setup>
import { useValidationTooltip } from '../../composables/useValidationTooltip'

const { tooltip } = useValidationTooltip()
</script>

<template>
  <Transition name="validation-tip">
    <div v-if="tooltip" class="validation-tooltip" :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }">
      <i class="ri-error-warning-fill"></i> {{ tooltip.texto }}
    </div>
  </Transition>
</template>
