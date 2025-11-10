<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>Pedido #{{ pedido.id }}</h2>
      <p><strong>Estado:</strong> {{ pedido.status }}</p>
      <ul>
        <li v-for="item in pedido.items" :key="item.productId">
          {{ item.name }} x{{ item.qty }} — ${{ item.lineTotal }}
        </li>
      </ul>
      <p class="total"><strong>Total:</strong> ${{ pedido.total }}</p>
      <button @click="$emit('close')">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ pedido: Object })
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 360px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.total {
  margin-top: 1rem;
  font-weight: bold;
}
button {
  margin-top: 1rem;
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #4338ca;
}
</style>
