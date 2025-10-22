<!-- src/components/PedidoCard.vue -->
<template>
  <article class="pedido">
    <header class="pedido-header">
      <h3>Pedido #{{ order.id }}</h3>
      <small>{{ estadoLabel(order.status) }}</small>
    </header>

    <ul class="pedido-items">
      <li v-for="item in order.items" :key="item.productId" class="pedido-item">
        <img :src="item.img" alt="" class="img" />
        <div class="info">
          <strong>{{ item.name }}</strong>
          <span>x{{ item.qty }}</span>
        </div>
        <span class="price">$ {{ item.lineTotal }}</span>
      </li>
    </ul>

    <footer class="pedido-footer">
      <p class="total">Total: ${{ order.total }}</p>
      <div class="actions">
        <button v-if="order.status === 'PENDIENTE'" @click="$emit('prep', order.id)">
          Marcar en preparación
        </button>
        <button v-if="order.status === 'PREPARACION'" @click="$emit('ready', order.id)">
          Marcar listo
        </button>
      </div>
    </footer>
  </article>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    required: true
  }
})

const estadoLabel = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return '🕒 Pendiente'
    case 'PREPARACION': return '👩‍🍳 En preparación'
    case 'LISTO': return '✅ Listo'
    default: return estado
  }
}
</script>

<style scoped>
.pedido {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.pedido-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}

.pedido-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.img {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}

.info {
  flex: 1;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
}

.price {
  font-weight: bold;
}

.pedido-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 6px;
}

button {
  background-color: #ff8c00;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #e17c00;
}

.total {
  font-weight: bold;
}
</style>
