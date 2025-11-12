<template>
  <div class="cliente-view">
    <!-- saludo -->
    <div class="saludo">
      <h2>Bienvenido, {{ name }} 👋</h2>
      <p class="sub">¡Elegí tus productos favoritos y armá tu pedido!</p>
    </div>

    <h1>Menú de Productos</h1>

    <div class="layout">
      <!-- lista de productos -->
      <div class="productos">
        <ProductoCard
          v-for="prod in productos"
          :key="prod.id"
          :producto="prod"
        />
      </div>

      <!-- carrito visible al costado -->
      <Carrito />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import ProductoCard from '../components/ProductoCard.vue'
import Carrito from '../components/Carrito.vue'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'

const productosStore = useProductsStore()
const productos = productosStore.all

// conectamos el store de pedidos
const ordersStore = useOrdersStore()

// saludo personalizado
const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'))
const name = computed(() => user.value.name || 'Usuario')

onMounted(() => {
  // cargar pedidos existentes desde MockAPI al entrar
  ordersStore.fetchOrders()
})
</script>

<style scoped>
.cliente-view {
  padding: 2rem;
  background-color: #fffbe6; /* fondo calido */
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  color: #2c2c2c;
}

/* saludo */
.saludo {
  text-align: center;
  margin-bottom: 1.5rem;
}
.saludo h2 {
  color: #d62828; /* rojo suave */
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.saludo .sub {
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
}

/* titulo */
h1 {
  text-align: center;
  color: #2c2c2c;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}

/* layout general */
.layout {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

/* seccion de productos */
.productos {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  flex: 1;
}

/* adaptable a pantallas chicas */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    align-items: center;
  }
}
</style>
