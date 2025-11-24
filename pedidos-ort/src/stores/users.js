import { defineStore } from "pinia"

const API_URL = "https://691bd77b3aaeed735c8e7658.mockapi.io/api/users"

//const API_URL = "https://www.mockachino.com/0528e0d6-a212-49/users"

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const res = await fetch(API_URL)
        this.users = await res.json()
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async registerUser(newUser) {
      try {
        // Todo usuario que se registra es cliente
        newUser.role = "cliente"

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        })

        const data = await res.json()
        this.users.push(data)
        return data
      } catch (err) {
        this.error = err
        console.error("Error al registrar usuario:", err)
      }
    }
  }
})
