import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: []
  }),

  actions: {
    async fetchProducts() {
      const res = await fetch("https://www.mockachino.com/0528e0d6-a212-49/products")
      const data = await res.json()

      this.products = data.products   
    }
  },

  getters: {
    all: (state) => state.products,
    byCategory: (state) => {
      return (category) => state.products.filter(p => p.category === category)
    },
    byId: (state) => {
      return (id) => state.products.find(p => p.id === id)
    }
  }
})
