<template>
  <div class="carrito container my-4 p-4 rounded-4 shadow">
    <h2 class="titulo text-center mb-4">🛒 Tu carrito</h2>

    <div v-if="carrito.length === 0 && !pedidoEnviado" class="text-center text-muted">
      No hay productos aún.
    </div>

    <ul v-if="carrito.length > 0" class="list-group mb-3">
      <li
        v-for="(item, i) in carrito"
        :key="item.productId"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span class="fw-semibold">
          {{ item.name }} x{{ item.qty }} — ${{ item.price * item.qty }}
        </span>
        <button
          class="btn btn-sm btn-outline-danger"
          @click="eliminarItem(i)"
        >
          🗑️
        </button>
      </li>
    </ul>

    <p v-if="carrito.length > 0" class="text-end fw-bold fs-5 text-dark">
      Total: ${{ total }}
    </p>

    <!-- notaPedido -->
    <div
      v-if="notaPedido"
      class="alert alert-warning d-flex justify-content-between align-items-center"
    >
      <div>🗒️ <em>{{ notaPedido }}</em></div>
      <button class="btn btn-sm btn-outline-dark" @click="mostrarNota = true">
        Editar nota
      </button>
    </div>

    <div v-if="carrito.length > 0" class="d-flex justify-content-between mt-3">
      <button
        @click="abrirModalNota"
        class="btn btn-outline-warning"
        v-if="!notaPedido"
      >
        Agregar nota
      </button>

      <button @click="confirmarPedido" class="btn btn-warning text-dark fw-bold">
        Confirmar Pedido
      </button>
    </div>

    <div
      v-if="pedidoEnviado"
      class="alert alert-success text-center mt-4 rounded-4"
    >
      <h3>Pedido enviado</h3>
      <p>Tu pedido está en preparación por el restaurante 🍔</p>
    </div>

    <!-- modales -->
    <ModalNotaPedido
      v-if="mostrarNota"
      @save="guardarNota"
      @close="mostrarNota = false"
    />
    <ModalMensaje
      v-if="mensaje"
      :mensaje="mensaje"
      :tipo="tipoMensaje"
    />

    <!-- boton para ver historial -->
    <div class="text-center mt-4">
      <router-link to="/historial" class="btn btn-outline-secondary">
        📜 Ver historial de pedidos
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore } from '../stores/orders'
import ModalNotaPedido from './ModalNotaPedido.vue'
import ModalMensaje from './ModalMensaje.vue'

const ordersStore = useOrdersStore()

const carrito = ref([])
const pedidoEnviado = ref(false)
const mostrarNota = ref(false)
const notaPedido = ref('')
const mensaje = ref('')
const tipoMensaje = ref('exito')

/* ---------------------------------------
   EVENTO: Agregar producto al carrito
--------------------------------------- */
window.addEventListener('agregar-producto', e => {
  const producto = e.detail
  // producto.id es el ID REAL del producto de Mockachino
  const existente = carrito.value.find(p => p.productId === producto.id)

  if (existente) {
    existente.qty++
  } else {
    carrito.value.push({
      productId: producto.id,
      name: producto.name,
      price: producto.price,
      qty: 1
    })
  }
})

/* ---------------------------------------
   EVENTO: Actualizar cantidad de producto
--------------------------------------- */
window.addEventListener('actualizar-producto', e => {
  const { id, qty, name, price } = e.detail
  const existente = carrito.value.find(p => p.productId === id)

  if (qty > 0) {
    if (existente) {
      existente.qty = qty
    } else {
      carrito.value.push({ productId: id, name, price, qty })
    }
  } else {
    const idx = carrito.value.findIndex(p => p.productId === id)
    if (idx !== -1) carrito.value.splice(idx, 1)
  }
})

/* ---------------------------------------
   TOTAL DEL CARRITO
--------------------------------------- */
const total = computed(() =>
  carrito.value.reduce((acc, p) => acc + p.price * p.qty, 0)
)

/* ---------------------------------------
   Eliminar producto
--------------------------------------- */
function eliminarItem(i) {
  carrito.value.splice(i, 1)
}

/* ---------------------------------------
   Nota de pedido
--------------------------------------- */
function abrirModalNota() {
  mostrarNota.value = true
}

function guardarNota(texto) {
  notaPedido.value = texto
}

/* ---------------------------------------
   Confirmar pedido → MockAPI
--------------------------------------- */
async function confirmarPedido() {
  if (carrito.value.length === 0) return

  const items = carrito.value.map(p => ({
    productId: p.productId,
    qty: p.qty
  }))

  try {
    await ordersStore.createOrder(items, notaPedido.value)
    pedidoEnviado.value = true
    mensaje.value = 'Pedido enviado con éxito'
    tipoMensaje.value = 'exito'
    carrito.value = []
    notaPedido.value = ''
  } catch {
    mensaje.value = 'Error al enviar el pedido'
    tipoMensaje.value = 'error'
  }
}
</script>

<style scoped>
.carrito {
  background-color: #fffef7;
  border: 2px solid #ffe082;
}

.titulo {
  color: #ffb300;
  text-shadow: 1px 1px #fff;
}

.btn-warning {
  background-color: #ffc107 !important;
  border: none;
}

.btn-warning:hover {
  background-color: #ffb300 !important;
}

.btn-outline-warning {
  border-color: #ffb300;
  color: #ffb300;
}

.btn-outline-warning:hover {
  background-color: #ffb300;
  color: #fff;
}

.btn-outline-secondary:hover {
  background-color: #f0f0f0;
}

.list-group-item {
  background-color: #fffef9;
  border: 1px solid #ffe082;
}
</style>

