// src/stores/orders.js
import { reactive, computed } from 'vue'
import { useProductsStore } from './products' // ← para resolver nombre/precio/img por id

const STORAGE_KEY = 'pedidos_ort_orders'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  
  return [  ]
}

const state = reactive({
  orders: load(),
  nextId: 1003
})

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.orders))
}

/** Vista derivada por estado, ordenada por antigüedad */
function byStatus(status) {
  return computed(() =>
    [...state.orders]
      .filter(o => o.status === status)
      .sort((a, b) => a.createdAt - b.createdAt)
  )
}

/** Devuelve el pedido por id */
function findOrder(id) {
  return state.orders.find(o => o.id === id)
}

/** Enriquecer un pedido con datos de producto (para mostrar en la UI) */
function withDetails(order) {
  const { byId } = useProductsStore()
  return {
    ...order,
    items: order.items.map(it => {
      const p = byId(it.productId)
      return {
        ...it,
        name: p?.name ?? it.productId,
        price: p?.price ?? 0,
        img: p?.img ?? null,
        lineTotal: (p?.price ?? 0) * (it.qty ?? 1),
      }
    }),
    total: order.items.reduce((acc, it) => {
      const p = byId(it.productId)
      return acc + (p?.price ?? 0) * (it.qty ?? 1)
    }, 0)
  }
}

/** Helpers de transición de estado */
function markInPreparation(id) {
  const o = findOrder(id)
  if (!o || o.status !== 'PENDIENTE') return
  o.status = 'PREPARACION'
  o.prepAt = Date.now()
  persist()
}

function markReady(id) {
  const o = findOrder(id)
  if (!o || o.status !== 'PREPARACION') return
  o.status = 'LISTO'
  o.readyAt = Date.now()
  persist()
}

/** Crear un pedido nuevo desde la vista Cliente */
function createOrder(items /* [{productId, qty}] */) {
if (!items || items.length === 0) return null
  const order = {
    id: state.nextId++,
    items: items.map(it => ({ productId: it.productId, qty: it.qty ?? 1 })),
    createdAt: Date.now(),
    status: 'PENDIENTE'
  }
  state.orders.push(order)
  persist()
  return order.id
}

/** Selectores “con detalles” para la UI de Empleado/Gerente */
const pendientesDet = computed(() => byStatus('PENDIENTE').value.map(withDetails))
const enPrepDet     = computed(() => byStatus('PREPARACION').value.map(withDetails))
const listosDet     = computed(() => byStatus('LISTO').value.map(withDetails))

export function useOrdersStore() {
  function findOrderComputed(id) {
  return computed(() => withDetails(findOrder(id)))
}
  return {
    state,
    // crudos
    pendientes: byStatus('PENDIENTE'),
    enPreparacion: byStatus('PREPARACION'),
    listos: byStatus('LISTO'),
    // enriquecidos para mostrar
    pendientesDet,
    enPrepDet,
    listosDet,
    // acciones
    markInPreparation,
    markReady,
    createOrder,
    // util
    withDetails,
    findOrderComputed,
  }
}
