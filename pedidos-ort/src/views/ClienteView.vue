<template>
  <div class="cliente-view">
    <h1>Menú de Productos</h1>

    <div class="layout">
      <!-- Lista de productos -->
      <div class="productos">
        <ProductoCard
          v-for="prod in productos"
          :key="prod.id"
          :producto="prod"
        />
      </div>

      <!-- Carrito visible al costado -->
      <Carrito />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProductoCard from '../components/ProductoCard.vue'
import Carrito from '../components/Carrito.vue'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'

const productosStore = useProductsStore()
const productos = productosStore.all

// conectamos el store de pedidos
const ordersStore = useOrdersStore()

onMounted(() => {
  // cargar pedidos existentes desde MockAPI al entrar
  ordersStore.fetchOrders()
})
</script>

<style scoped>
.cliente-view {
  padding: 2rem;
}
.layout {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}
.productos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
}
</style>
