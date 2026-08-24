import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  function showToast(message, type = 'success', duration = 3500) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, duration)
  }

  return { toasts, showToast }
}
