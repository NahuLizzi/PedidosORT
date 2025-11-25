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
    activos: (state) => state.featuredProducts.filter(f => f.isFeatured === true),
    byProductId: (state) => (productId) =>
    state.featuredProducts.find(f => f.productId === String(productId)) || null,
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
    },
    async upsertFeatured({ productId, name, discount, isFeatured = true }) {
    this.loading = true
    this.error = null
    const payload = {
      productId: String(productId),
      name: name ?? String(productId),
      discount: Number(discount) || 0,
      isFeatured,
      updatedAt: Date.now()
    }
    try {
      const existing = this.byProductId(productId)
      if (existing?.id) {
        const { data } = await axios.put(`${API_URL}/${existing.id}`, payload)
        Object.assign(existing, data)              // mantiene reactividad
        return data
      } else {
        const { data } = await axios.post(API_URL, payload)
        this.featuredProducts.push(data)
        return data
      }
    } catch (err) {
      this.error = err.message
      console.error('Error guardando destacado:', err)
      throw err
    } finally {
      this.loading = false
    }
  },
   async unsetFeatured(productId) {
    this.loading = true
    this.error = null
    try {
      const existing = this.byProductId(productId)
      if (!existing?.id) return
      const { data } = await axios.put(`${API_URL}/${existing.id}`, {
        ...existing,
        isFeatured: false,
        updatedAt: Date.now()
      })
      Object.assign(existing, data)
      return data
    } catch (err) {
      this.error = err.message
      console.error('Error quitando destacado:', err)
      throw err
    } finally {
      this.loading = false
    }
  }
}
})