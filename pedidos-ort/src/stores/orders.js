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
    myOrders: (state) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  return state.orders.filter(o => o.userName === user.name)
}

  },

  actions: {
async fetchOrders() {
  try {
    const res = await axios.get(API_URL)

    // Normalizamos los pedidos de MockAPI
    const apiOrders = res.data.map(o => {
      let itemsParsed = []
      try {
        if (typeof o.items === 'string') itemsParsed = JSON.parse(o.items)
        else if (Array.isArray(o.items)) itemsParsed = o.items
      } catch {}
      return { ...o, items: Array.isArray(itemsParsed) ? itemsParsed : [] }
    })

    // Leemos los guardados en localStorage (con los productos reales)
    const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]')

    // Unificamos evitando duplicados por ID
    const all = [
      ...localOrders,
      ...apiOrders.filter(a => !localOrders.some(l => l.id === a.id))
    ]

    this.orders = all
  } catch (err) {
    this.error = err.message
    console.error('Error cargando pedidos:', err)
  }
},

    async createOrder(items, comment = '') {
  if (!items || items.length === 0) return null
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const newOrder = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    status: 'PENDIENTE',
    items, // array con los productos reales
    userName: user.name || 'Invitado',
    comment
  }

  try {
    // MockAPI recibe sólo el resumen
    await axios.post(API_URL, {
      ...newOrder,
      items: JSON.stringify(items) // compatibilidad con MockAPI
    })

    // Guardamos el pedido completo localmente
    const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]')
    localOrders.push(newOrder)
    localStorage.setItem('localOrders', JSON.stringify(localOrders))

    this.orders.push(newOrder)
    return newOrder.id
  } catch (err) {
    this.error = err.message
    console.error('Error creando pedido:', err)
  }
},

    async markInPreparation(id) {
      const order = this.orders.find(o => o.id === id)
      if (!order || order.status !== 'PENDIENTE') return
      order.status = 'PREPARACION'
      await axios.put(`${API_URL}/${id}`, order)
    },

    async markReady(id) {
      const order = this.orders.find(o => o.id === id)
      if (!order || order.status !== 'PREPARACION') return
      order.status = 'LISTO'
      await axios.put(`${API_URL}/${id}`, order)
    },

    withDetails(order) {
      const { byId } = useProductsStore()
      const items = order.items.map(it => {
        const p = byId(it.productId)
        const price = p?.price ?? 0
        return {
          ...it,
          name: p?.name ?? it.productId,
          price,
          img: p?.img ?? null,
          lineTotal: price * (it.qty ?? 1)
        }
      })
      const total = items.reduce((acc, it) => acc + it.lineTotal, 0)
      return { ...order, items, total }
    }
  }
})

