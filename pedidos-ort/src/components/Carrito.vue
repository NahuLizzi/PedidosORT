<template>
  <div class="carrito">
    <h2>Tu carrito</h2>

    <div v-if="carrito.length === 0 && !pedidoEnviado">
      No hay productos aún.
    </div>

    <ul v-if="carrito.length > 0">
      <li v-for="(item, i) in carrito" :key="i" class="item">
        <span>{{ item.name }} x{{ item.qty }} — ${{ item.price * item.qty }}</span>
        <button class="btn-eliminar" @click="eliminarItem(i)">🗑️</button>
      </li>
    </ul>

    <p v-if="carrito.length > 0" class="total">
      Total: ${{ total }}
    </p>

    <!-- 🔹 Comentario visible -->
    <div v-if="notaPedido" class="nota">
      🗒️ <em>{{ notaPedido }}</em>
      <button class="editar-nota" @click="mostrarNota = true">Editar nota</button>
    </div>

    <div v-if="carrito.length > 0" class="acciones">
      <button @click="mostrarNota = true" class="btn-nota" v-if="!notaPedido">
        Agregar nota
      </button>
      <button @click="confirmarPedido" class="btn-confirmar">
        Confirmar Pedido
      </button>
    </div>

    <div v-if="pedidoEnviado" class="pedido-enviado">
      <h3>Pedido enviado</h3>
      <p>Tu pedido está en preparación por el restaurante.</p>
    </div>

    <!-- Modales -->
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

    <!-- 🔹 Botón para ver historial -->
    <router-link to="/historial" class="btn-historial">
      📜 Ver historial de pedidos
    </router-link>
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

window.addEventListener('agregar-producto', e => {
  const producto = e.detail
  const existente = carrito.value.find(p => p.id === producto.id)
  if (existente) existente.qty++
  else carrito.value.push({ ...producto, qty: 1 })
})

const total = computed(() =>
  carrito.value.reduce((acc, p) => acc + p.price * p.qty, 0)
)

function eliminarItem(i) {
  carrito.value.splice(i, 1)
}

function guardarNota(texto) {
  notaPedido.value = texto
}

async function confirmarPedido() {
  if (carrito.value.length === 0) return
  const items = carrito.value.map(p => ({ productId: p.id, qty: p.qty }))
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
.nota {
  background: #f3f4f6;
  border-left: 4px solid #4f46e5;
  border-radius: 6px;
  padding: 8px;
  margin: 10px 0;
  font-size: 0.9rem;
  color: #374151;
}

.editar-nota {
  background: none;
  border: none;
  color: #4f46e5;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: 6px;
  text-decoration: underline;
}

.editar-nota:hover {
  color: #4338ca;
}

/* 🔹 Botón Ver Historial */
.btn-historial {
  display: inline-block;
  margin-top: 1.5rem;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-historial:hover {
  background: #e0e7ff;
  color: #4338ca;
}
</style>

