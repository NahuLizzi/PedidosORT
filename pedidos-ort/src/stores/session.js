import { defineStore } from "pinia"

export const useSessionStore = defineStore("session", {
  state: () => ({
    isAuth: false,
    user: null
  }),

  actions: {
    login(userData) {
      this.isAuth = true
      this.user = userData

      // persistencia Pinia
      localStorage.setItem("session", JSON.stringify(this.$state))

      // compatibilidad con el resto del proyecto
      localStorage.setItem("isAuth", "1")
      localStorage.setItem("user", JSON.stringify(userData))
    },

    logout() {
      this.isAuth = false
      this.user = null

      // limpiar todo
      localStorage.removeItem("session")
      localStorage.removeItem("isAuth")
      localStorage.removeItem("user")
    },

    restoreSession() {
      // 1) intenta restaurar desde session Pinia
      const saved = localStorage.getItem("session")
      if (saved) {
        const data = JSON.parse(saved)
        this.isAuth = data.isAuth
        this.user = data.user
        return
      }

      // 2) fallback a tu formato viejo 
      const isAuth = localStorage.getItem("isAuth") === "1"
      const user = JSON.parse(localStorage.getItem("user") || "null")

      this.isAuth = isAuth
      this.user = user
    }
  },

      /* Antes sin Pinia
      Persistencia en localStorage
      localStorage.setItem("session", JSON.stringify(this.$state))
    },

    logout() {
      this.isAuth = false
      this.user = null
      localStorage.removeItem("session")
    },

    restoreSession() {
      const saved = localStorage.getItem("session")
      if (saved) {
        const data = JSON.parse(saved)
        this.isAuth = data.isAuth
        this.user = data.user
      }
    }
  },
*/
  getters: {
    role: (state) => state.user?.role ?? "sin rol",
    name: (state) => state.user?.name ?? "Usuario"
  }
})
