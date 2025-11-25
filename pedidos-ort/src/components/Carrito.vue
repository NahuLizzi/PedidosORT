<template>
  <div class="carrito my-4 p-4 rounded-4 shadow">
    <h2 class="titulo text-center mb-4">🛒 Tu carrito</h2>

    <!-- Mensaje cuando no hay productos -->
    <div v-if="carrito.length === 0 && !pedidoEnviado" class="text-center text-muted">
      No hay productos aún.
    </div>

    <!-- Lista de productos -->
    <ul v-if="carrito.length > 0" class="list-group mb-3">
      <li
        v-for="(item, i) in carrito"
        :key="item.productId"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span class="fw-semibold">
          {{ item.name }} x{{ item.qty }} — ${{ item.price * item.qty }}
        </span>
        <button class="btn btn-sm btn-outline-danger" @click="eliminarItem(i)">
          🗑️
        </button>
      </li>
    </ul>

    <!-- Total calculado -->
    <p v-if="carrito.length > 0" class="text-end fw-bold fs-5 text-dark">
      Total: ${{ total }}
    </p>

    <!-- Nota del pedido -->
    <div v-if="hayNota" class="alert alert-warning d-flex justify-content-between align-items-center">
      <div>🗒️ <em>{{ notaPedido }}</em></div>
      <button class="btn btn-sm btn-outline-dark" @click="mostrarNota = true">
        Editar nota
      </button>
    </div>

    <!-- Botones: agregar nota / confirmar -->
    <div v-if="carrito.length > 0" class="d-flex justify-content-between mt-3">
      <button
        class="btn btn-outline-warning"
        v-if="!hayNota"
        @click="abrirModalNota"
      >
        Agregar nota
      </button>

      <button
        class="btn btn-warning text-dark fw-bold"
        @click="confirmarPedido"
        :disabled="carrito.length === 0"
      >
        Confirmar Pedido
      </button>
    </div>

    <!-- Mensaje de pedido enviado -->
    <div v-if="pedidoEnviado" class="alert alert-success text-center mt-4 rounded-4">
      <h3>Pedido enviado</h3>
      <p>Tu pedido está en preparación por el restaurante 🍔</p>
    </div>

    <!-- Modal para nota -->
    <ModalNotaPedido
      v-if="mostrarNota"
      @save="guardarNota"
      @close="mostrarNota = false"
    />

    <!-- Modal de mensaje (exito/error) -->
    <ModalMensaje
      v-if="mensaje"
      :mensaje="mensaje"
      :tipo="tipoMensaje"
    />

    <!-- Ir al historial -->
    <div class="text-center mt-4">
      <router-link to="/historial" class="btn btn-outline-secondary">
        📜 Ver historial de pedidos
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useOrdersStore } from "../stores/orders"
import ModalNotaPedido from "./ModalNotaPedido.vue"
import ModalMensaje from "./ModalMensaje.vue"

const ordersStore = useOrdersStore()

// Estado del carrito y datos relacionados
const carrito = ref([])
const pedidoEnviado = ref(false)
const mostrarNota = ref(false)
const notaPedido = ref("")
const mensaje = ref("")
const tipoMensaje = ref("exito")

const hayNota = computed(() => notaPedido.value.trim().length > 0)

const total = computed(() =>
  carrito.value.reduce((acc, p) => acc + p.price * p.qty, 0)
)

window.addEventListener("agregar-producto", (e) => {
  const producto = e.detail
  const existente = carrito.value.find((p) => p.productId === producto.id)

  if (existente) {
    existente.qty++
  } else {
    carrito.value.push({
      productId: producto.id,
      name: producto.name,
      price: producto.price,
      qty: 1,
    })
  }
})

window.addEventListener("actualizar-producto", (e) => {
  const { id, qty, name, price } = e.detail
  const existente = carrito.value.find((p) => p.productId === id)

  if (qty > 0) {
    if (existente) {
      existente.qty = qty
    } else {
      carrito.value.push({ productId: id, name, price, qty })
    }
  } else {
    const idx = carrito.value.findIndex((p) => p.productId === id)
    if (idx !== -1) carrito.value.splice(idx, 1)
  }
})

function eliminarItem(i) {
  carrito.value.splice(i, 1)
}

function abrirModalNota() {
  mostrarNota.value = true
}

function guardarNota(texto) {
  notaPedido.value = texto
}

async function confirmarPedido() {
  if (carrito.value.length === 0) return

  const items = carrito.value.map((p) => ({
    productId: p.productId,
    qty: p.qty,
  }))

  try {
    await ordersStore.createOrder(items, notaPedido.value)
    pedidoEnviado.value = true
    mensaje.value = "Pedido enviado con éxito"
    tipoMensaje.value = "exito"

    carrito.value = []
    notaPedido.value = ""
  } catch {
    mensaje.value = "Error al enviar el pedido"
    tipoMensaje.value = "error"
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

.list-group-item {
  background-color: #fffef9;
  border: 1px solid #ffe082;
}
</style>


