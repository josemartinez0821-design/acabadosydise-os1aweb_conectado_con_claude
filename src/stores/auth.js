import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Refleja la tabla `usuarios` + `roles` de la BD (id_rol: 1 Administrador, 2 Cliente, 3 Vendedor)
export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => usuario.value?.id_rol === 1)

  function setSession(newToken, newUsuario) {
    token.value = newToken
    usuario.value = newUsuario
    localStorage.setItem('token', newToken)
    localStorage.setItem('usuario', JSON.stringify(newUsuario))
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return { token, usuario, isAuthenticated, isAdmin, setSession, logout }
})
