import { defineStore } from "pinia"
import axios from "axios"

//Api de productos destacados(featuresProducts) en Mockapi
const API_URL = "https://691bd77b3aaeed735c8e7658.mockapi.io/api/featuredProducts"

export const useFeaturedProductsStore = defineStore("featuredProducts", {
  state: () => ({
    featuredProducts: [],
    loading: false,
    error: null
  }),

  getters: {
    activos: (state) => state.featuredProducts.filter(f => f.isFeatured === true)
  },

  actions: {
    async fetchFeaturedProducts() {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(API_URL)
        this.featuredProducts = Array.isArray(data) ? data : []
      } catch (err) {
        this.error = err.message
        console.error("Error cargando featuredProducts:", err)
      } finally {
        this.loading = false
      }
    }
  }
})