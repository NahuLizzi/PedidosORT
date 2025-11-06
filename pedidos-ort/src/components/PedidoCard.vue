<!-- src/components/PedidoCard.vue -->
<template>
  <article class="pedido">
    <header class="pedido-header">
      <h3 v-if="order">Pedido #{{ order.id }}</h3>
      <h3 v-else>{{ producto.name }}</h3>
      <small v-if="order">{{ estadoLabel(order.status) }}</small>
    </header>

    <!-- Si es un pedido -->
    <template v-if="order">
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
    </template>

    <!-- Si es producto -->
    <template v-else>
      <img :src="producto.img" alt="" class="img" />
      <p>{{ producto.name }} - ${{ producto.price }}</p>
      <button @click="$emit('agregar', producto)">Agregar al carrito</button>
    </template>
  </article>
</template>

<script setup>
defineProps({
  order: Object,
  producto: Object,
});

const estadoLabel = (estado) => {
  switch (estado) {
    case "PENDIENTE":
      return "🕒 Pendiente";
    case "PREPARACION":
      return "👩‍🍳 En preparación";
    case "LISTO":
      return "✅ Listo";
    default:
      return estado;
  }
};
</script>

<style scoped>
.pedido {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin: 8px auto;
}

button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #4338ca;
}
</style>