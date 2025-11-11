<template>
  <div class="historial">
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
import { onMounted, ref } from 'vue'
import { useOrdersStore } from '../stores/orders'
import ModalDetallePedido from '../components/ModalDetallePedido.vue'

const ordersStore = useOrdersStore()
const pedidoSeleccionado = ref(null)

onMounted(() => {
  ordersStore.fetchOrders()
})

function abrirDetalle(pedido) {
  pedidoSeleccionado.value = ordersStore.withDetails(pedido)
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
.historial { padding: 2rem; }
.empty { color: #666; font-style: italic; }
.pedido {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
}
.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  margin-bottom: 6px;
}
.estado {
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  color: white;
}
.estado.pendiente { background: #facc15; color: #333; }
.estado.preparacion { background: #f97316; }
.estado.listo { background: #22c55e; }
.btn-detalle {
  margin-top: 0.5rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}
.btn-detalle:hover { background: #4338ca; }
</style>
