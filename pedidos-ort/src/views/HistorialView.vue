<template>
  <div class="historial">
    <!-- 🔹 Saludo -->
    <div class="saludo">
      <h2>Bienvenido, {{ name }} 👋</h2>
    </div>

    <h1>Historial de Pedidos</h1>

    <div v-if="ordersStore.myOrders.length === 0" class="empty">
      No tenés pedidos aún.
    </div>

    <div
      v-for="pedido in ordersStore.myOrders"
      :key="pedido.id"
      class="pedido"
    >
      <header class="pedido-header">
        <h2>Pedido #{{ pedido.id }}</h2>
        <span class="estado" :class="pedido.status.toLowerCase()">
          {{ estadoLabel(pedido.status) }}
        </span>
      </header>

      <p><strong>Total:</strong> ${{ pedido.total }}</p>
      <small>{{ formatDate(pedido.createdAt) }}</small>

      <button class="btn-detalle" @click="abrirDetalle(pedido)">
        Ver detalles
      </button>
    </div>

    <!-- Modal de Detalle -->
    <ModalDetallePedido
      v-if="pedidoSeleccionado"
      :pedido="pedidoSeleccionado"
      @close="pedidoSeleccionado = null"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useOrdersStore } from '../stores/orders'
import ModalDetallePedido from '../components/ModalDetallePedido.vue'

const ordersStore = useOrdersStore()
const pedidoSeleccionado = ref(null)

// Saludo personalizado
const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'))
const name = computed(() => user.value.name || 'Usuario')

onMounted(() => {
  ordersStore.fetchOrders()
})

function abrirDetalle(pedido) {
  const copy = JSON.parse(JSON.stringify(pedido)) 
  pedidoSeleccionado.value = ordersStore.withDetails(copy)
}


function formatDate(timestamp) {
  const d = new Date(timestamp)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function estadoLabel(estado) {
  switch (estado) {
    case 'PENDIENTE': return '🕒 Pendiente'
    case 'PREPARACION': return '👩‍🍳 En preparación'
    case 'LISTO': return '✅ Listo'
    default: return estado
  }
}
</script>

<style scoped>
.historial {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Saludo */
.saludo {
  text-align: center;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: #2c2c2c;
}
.saludo h2 {
  color: #d62828; /* rojo suave */
  font-size: 1.6rem;
  font-weight: 700;
}

/* titulo */
h1 {
  text-align: center;
  color: #2c2c2c;
  margin-bottom: 1.5rem;
}

.empty {
  text-align: center;
  color: #777;
  font-style: italic;
  margin-top: 2rem;
}

/* pedido card */
.pedido {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 1.2rem;
  margin-bottom: 1rem;
  transition: transform 0.15s ease-in-out;
}
.pedido:hover {
  transform: translateY(-2px);
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.estado {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  color: white;
}
.estado.pendiente { background: #ffbe0b; color: #2c2c2c; }
.estado.preparacion { background: #f97316; }
.estado.listo { background: #22c55e; }

.btn-detalle {
  margin-top: 0.8rem;
  background: #ffbe0b;
  color: #2c2c2c;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease-in-out;
}
.btn-detalle:hover {
  background: #faa307;
  transform: translateY(-1px);
}
</style>
