import { defineStore } from 'pinia'
import axios from 'axios'
import { useProductsStore } from './products'

const API_URL = 'https://690fb63445e65ab24ac49beb.mockapi.io/orders'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null
  }),

  getters: {
    pendientes: (state) => state.orders.filter(o => o.status === 'PENDIENTE'),
    enPreparacion: (state) => state.orders.filter(o => o.status === 'PREPARACION'),
    listos: (state) => state.orders.filter(o => o.status === 'LISTO'),

    pendientesDet() {
      return this.pendientes.map(this.withDetails)
    },
    enPrepDet() {
      return this.enPreparacion.map(this.withDetails)
    },
    listosDet() {
      return this.listos.map(this.withDetails)
    },

    myOrders(state) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return state.orders.filter(o => o.userId === user.id)
    }
  },

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(API_URL)

        this.orders = res.data.map(o => {
          let parsed = []

          try {
            if (Array.isArray(o.items)) parsed = o.items
            else if (typeof o.items === 'string') parsed = JSON.parse(o.items)
          } catch {
            parsed = []
          }

          return {
            ...o,
            items: parsed
          }
        })
      } catch (err) {
        this.error = err.message
        console.error('Error cargando pedidos:', err)
      } finally {
        this.loading = false
      }
    },

    async createOrder(items, comment = '') {
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const order = {
        createdAt: Date.now(),
        status: 'PENDIENTE',
        userId: user.id,
        items: JSON.stringify(items),
        comment
      }

      try {
        const res = await axios.post(API_URL, order)

        const savedOrder = {
          ...res.data,
          items
        }

        this.orders.push(savedOrder)

        return savedOrder.id
      } catch (err) {
        this.error = err.message
        console.error('Error creando pedido:', err)
      }
    },

    async markInPreparation(id) {
      const order = this.orders.find(o => o.id === id)
      if (!order || order.status !== 'PENDIENTE') return

      order.status = 'PREPARACION'

      try {
        await axios.put(`${API_URL}/${id}`, {
          ...order,
          items: JSON.stringify(order.items)
        })
      } catch (err) {
        this.error = err.message
        console.error('Error actualizando pedido:', err)
      }
    },

    async markReady(id) {
      const order = this.orders.find(o => o.id === id)
      if (!order || order.status !== 'PREPARACION') return

      order.status = 'LISTO'

      try {
        await axios.put(`${API_URL}/${id}`, {
          ...order,
          items: JSON.stringify(order.items)
        })
      } catch (err) {
        this.error = err.message
        console.error('Error actualizando pedido:', err)
      }
    },

    withDetails(order) {
      const productsStore = useProductsStore()

      const items = order.items.map(it => {
        const p = productsStore.byId(it.productId)

        const price = p?.price ?? 0

        return {
          ...it,
          name: p?.name ?? it.productId,
          price,
          img: p?.img ?? null,
          lineTotal: price * it.qty
        }
      })

      const total = items.reduce((acc, it) => acc + it.lineTotal, 0)

      return {
        ...order,
        items,
        total
      }
    }
  }
})
