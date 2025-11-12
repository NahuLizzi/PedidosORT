<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>🧾 Pedido #{{ pedido.id }}</h2>
      <p class="estado"><strong>Estado:</strong> {{ pedido.status }}</p>
      <ul class="items">
        <li v-for="item in pedido.items" :key="item.productId">
          {{ item.name }} ×{{ item.qty }}
          <span class="line-total">${{ item.lineTotal }}</span>
        </li>
      </ul>
      <p class="total"><strong>Total:</strong> ${{ pedido.total }}</p>
      <button class="btn-cerrar" @click="$emit('close')">Cerrar</button>
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
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
}
.modal {
  background: #fff;
  padding: 1.8rem;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  animation: pop 0.25s ease-out;
}
@keyframes pop {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
h2 {
  color: #4f46e5;
  margin-bottom: 0.6rem;
  text-align: center;
}
.estado {
  text-align: center;
  color: #374151;
  margin-bottom: 1rem;
}
.items {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem;
}
.items li {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed #e5e7eb;
  padding: 6px 0;
}
.line-total {
  color: #4f46e5;
  font-weight: 600;
}
.total {
  text-align: right;
  font-size: 1.1rem;
  color: #111827;
  margin-top: 1rem;
}
.btn-cerrar {
  margin-top: 1.2rem;
  width: 100%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}
.btn-cerrar:hover {
  background: #4338ca;
}
</style>
