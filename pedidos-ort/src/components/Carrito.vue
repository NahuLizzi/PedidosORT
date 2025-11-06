<template>
  <div class="carrito">
    <h2>Carrito</h2>
    <div v-if="items.length === 0">No hay productos aún.</div>
    <ul>
      <li v-for="(item, i) in items" :key="i">
        {{ item.nombre }} - ${{ item.precio }}
      </li>
    </ul>

    <button
      v-if="items.length > 0"
      @click="$emit('confirmar')"
      class="btn-confirmar"
    >
      Confirmar Pedido
    </button>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.carrito {
  margin-top: 2rem;
}
.btn-confirmar {
  margin-top: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
