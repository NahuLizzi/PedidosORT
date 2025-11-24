<template>
  <div class="cliente-view">
    <div class="saludo">
      <h2>Bienvenido, {{ name }} 👋</h2>
      <p class="sub">¡Elegí tus productos favoritos y armá tu pedido!</p>
    </div>

    <h1>Menú de Productos</h1>

    <div class="layout">
     
      <div class="productos-grid">
        <ProductoCard
          v-for="prod in productosConDescuento"
          :key="prod.id"
          :producto="prod"
        />
      </div>

      
      <div class="carrito-wrapper">
        <Carrito />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import ProductoCard from '../components/ProductoCard.vue'
import Carrito from '../components/Carrito.vue'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'
import { useFeaturedProductsStore } from '../stores/featuredProducts'

const productosStore = useProductsStore()
const productos = computed(() => productosStore.all)

const ordersStore = useOrdersStore()
const featuredStore = useFeaturedProductsStore()

const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'))
const name = computed(() => user.value.name || 'Usuario')

//Productos con descuento(si corresponde)
const productosConDescuento = computed(() => {
  const activos = featuredStore.featuredProducts.filter(f => f.isFeatured)

  return productos.value.map(p => {
    const feat = activos.find(f => String(f.productId) === String(p.id))

    if (!feat) {
      return {
        ...p,
        discount: 0,
        finalPrice: Number(p.price) || 0,
        isFeatured: false,
        label: ""
      }
    }

    const price = Number(p.price) || 0
    const discount = Number(feat.discount) || 0
    const finalPrice = Math.round(price * (1 - discount / 100))

    return {
      ...p,
      discount,
      finalPrice,
      isFeatured: true,
      label: feat.label ?? ""
    }
  })
})

  onMounted(async () => {
    await productosStore.fetchProducts()       // Productos de Mockachino
    await featuredStore.fetchFeaturedProducts() //Productos destacados de MockAPI
    await ordersStore.fetchOrders()
  })

/*onMounted(() => {
  productosStore.fetchProducts()
  ordersStore.fetchOrders()
})*/
</script>

<style scoped>
.cliente-view {
  padding: 2rem;
  background-color: #fffbe6;
  min-height: 100vh;
}

/* Layout principal: productos a la izquierda — carrito a la derecha */
.layout {
  display: grid;
  grid-template-columns: 1fr 300px;   /* 🟢 productos | carrito */
  align-items: flex-start;
  gap: 2rem;
}

/* CUADRÍCULA TIPO MERCADOLIBRE */
.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.carrito-wrapper {
  position: sticky;
  top: 20px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr; /* carrito debajo */
  }
}
</style>
