<template>
  <article class="producto">
    <img :src="producto.img" alt="" class="img" />
    <p>{{ producto.name }} - ${{ producto.price }}</p>
    <button @click="agregarAlCarrito">Agregar al carrito</button>
  </article>
</template>

<script setup>
const props = defineProps({ producto: Object })

function agregarAlCarrito() {
  // Evento global: Carrito.vue escucha esto
  window.dispatchEvent(new CustomEvent('agregar-producto', { detail: props.producto }))
}
</script>

<style scoped>
.producto {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 12px;
  text-align: center;
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
}
button:hover {
  background-color: #4338ca;
}
</style>