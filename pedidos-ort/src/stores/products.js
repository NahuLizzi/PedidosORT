import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [
      // Comidas 
      { id: 'H001', name: 'Hamburguesa clásica', price: 4500, img: '/img/hamburguesa.png', category: 'Comidas' },
      { id: 'H002', name: 'Hamburguesa doble con queso', price: 5200, img: '/img/hamburguesa_doble.png', category: 'Comidas' },
      { id: 'P001', name: 'Papas fritas', price: 2000, img: '/img/papas.png', category: 'Comidas' },
      { id: 'N001', name: 'Nuggets de pollo', price: 2500, img: '/img/nuggets.png', category: 'Comidas' },
      { id: 'PZ01', name: 'Pizza muzarella', price: 5200, img: '/img/pizza.png', category: 'Comidas' },
      { id: 'H003', name: 'Pancho', price: 2300, img: '/img/pancho.png', category: 'Comidas' },

      // Bebidas
      { id: 'B001', name: 'Agua', price: 1200, img: '/img/agua.png', category: 'Bebidas' },
      { id: 'B002', name: 'Agua con gas', price: 1300, img: '/img/aguacongas.png', category: 'Bebidas' },
      { id: 'B003', name: 'Gaseosa', price: 1500, img: '/img/gaseosa.png', category: 'Bebidas' },
      { id: 'B004', name: 'Cerveza', price: 2500, img: '/img/cerveza.png', category: 'Bebidas' },

      // Postres
      { id: 'D001', name: 'Helado', price: 1800, img: '/img/helado.png', category: 'Postres' },
      { id: 'D002', name: 'Flan con dulce de leche', price: 1900, img: '/img/flan.png', category: 'Postres' },
      { id: 'D003', name: 'Brownie con helado', price: 2100, img: '/img/brownie.png', category: 'Postres' },
    ]
  }),

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
