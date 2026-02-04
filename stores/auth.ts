import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const username = ref('guest')

  const user = computed(() => ({
    username: username.value,
    isAuthenticated: isAuthenticated.value,
  }))

  function login(user: string, _password: string): boolean {
    // Basit authentication - ileride API ile değiştirilecek
    if (user === 'ali' && _password === 'admin') {
      isAuthenticated.value = true
      username.value = 'ali'
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    username.value = 'guest'
  }

  return {
    isAuthenticated,
    username,
    user,
    login,
    logout,
  }
})
