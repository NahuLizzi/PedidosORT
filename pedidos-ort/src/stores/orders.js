import { defineStore } from 'pinia'
import axios from 'axios'
import { useProductsStore } from './products'
import { useSessionStore } from './session'

const API_URL = 'https://690fb63445e65ab24ac49beb.mockapi.io/orders'
// helper: convierte a timestamp válido o devuelve null
const toTs = (v) => {
  if (typeof v === 'number' && Number.isFinite(v) && v > 0) return v
  if (typeof v === 'string') {
    const t = Date.parse(v)
    return Number.isFinite(t) ? t : null
  }
  return null
}

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

    /*Antes sin Pinia
      myOrders(state) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      return state.orders.filter(o => o.userId === user.id)
    }ale*/

    myOrders() {
     const session = useSessionStore()

  // Pinia
     const sessionUserId = session.user?.id

  // fallback a localStorage para no romper nada
     const lsUserId = JSON.parse(localStorage.getItem('user') || '{}')?.id
     const userId = sessionUserId ?? lsUserId

     console.log(userId);

     if (!userId) return []

     //usamos withDetails para que el historial muestre total y detalles
     return this.orders
        .filter(o => String(o.userId) === userId)
        .map(o => this.withDetails(o))
      }
  },

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null

//Se comenta codigo anterior, para corregir en caso de que se rompa Cliente/Empleado
      // try {
      //   const res = await axios.get(API_URL)

      //   this.orders = res.data.map(o => {
      //     let parsed = []

      //     try {
      //       if (Array.isArray(o.items)) parsed = o.items
      //       else if (typeof o.items === 'string') parsed = JSON.parse(o.items)
      //     } catch {
      //       parsed = []
      //     }

      //     return {
      //       ...o,
      //       items: parsed
      //     }
      //   })
      try {
        const { data } = await axios.get(API_URL)
        this.orders = data.map(o => {
          // items siempre array
          let items = []
          try {
          items = Array.isArray(o.items)
              ? o.items
              : typeof o.items === 'string'
                ? JSON.parse(o.items)
                : []
          } catch { items = [] }

          // qty numérica (>=1) y productId normalizado por si viene con otro nombre
          items = items.map(it => ({
            ...it,
            productId: it.productId ?? it.id ?? it.code,
            qty: Number(it.qty) > 0 ? Number(it.qty) : 1
          }))
          // fecha consistente (timestamp ms) para evitar 31/12/1969
          const createdAt = toTs(o.createdAt) ?? toTs(o.date) ?? Date.now()
          return { ...o, items, createdAt }
        })
      } catch (err) {
        this.error = err.message
        console.error('Error cargando pedidos:', err)
      } finally {
        this.loading = false
      }
    },

    /* Antes sin Pinia 
    async createOrder(items, comment = '') {
      const user = JSON.parse(localStorage.getItem('user') || '{}')

      const order = {
        createdAt: Date.now(),
        status: 'PENDIENTE',
        userId: user.id,
        items: JSON.stringify(items),
        comment
      }*/

    async createOrder(items, comment = '') {
    const session = useSessionStore()

    const sessionUserId = session.user?.id
    const lsUserId = JSON.parse(localStorage.getItem('user') || '{}')?.id
    const userId = sessionUserId ?? lsUserId

    if (!userId) {
    this.error = 'No hay usuario logueado'
    throw new Error('No hay usuario logueado')
    }

    const order = {
    createdAt: Date.now(),
    status: 'PENDIENTE',
    userId,
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
    throw err
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
//Se comenta codigo anterior, para corregir en caso de que se rompa Cliente/Empleado
  //   withDetails(order) {
  //     const productsStore = useProductsStore()

  //     const items = order.items.map(it => {
  //       const p = productsStore.byId(it.productId)

  //       const price = p?.price ?? 0

  //       return {
  //         ...it,
  //         name: p?.name ?? it.productId,
  //         price,
  //         img: p?.img ?? null,
  //         lineTotal: price * it.qty
  //       }
  //     })

  //     const total = items.reduce((acc, it) => acc + it.lineTotal, 0)

  //     return {
  //       ...order,
  //       items,
  //       total
  //     }
  //   }
    
      withDetails(order) {
      const productsStore = useProductsStore()
      const items = (order.items ?? []).map(it => {
        const p = productsStore.byId?.(it.productId)
        const price = Number(p?.price) || Number(it.price) || 0   // fallback si aún no cargó products
        const qty   = Number(it.qty) > 0 ? Number(it.qty) : 1
        return {
          ...it,
          name: p?.name ?? it.productName ?? it.productId,
          price,
          img:  p?.img ?? null,
          lineTotal: price * qty
        }
      })
      const total = items.reduce((acc, it) => acc + it.lineTotal, 0)
      return { ...order, items, total }
      }
    }
})

