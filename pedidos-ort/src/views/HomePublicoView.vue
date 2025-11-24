<script setup>
import { onMounted, computed } from "vue"
import { useProductsStore } from "../stores/products"
import { useFeaturedProductsStore } from "../stores/featuredProducts"

const productsStore = useProductsStore()
const featuredStore = useFeaturedProductsStore()

onMounted(async () => {
  if (!productsStore.products.length) {
    await productsStore.fetchProducts() // Viene de Mockachino
  }
    await featuredStore.fetchFeaturedProducts() // Viene de MockAPI(por ahora se agregan manualmente)
})

/**
 * Devuelve la lista de productos destacados junto con 
 * la lista de productos en Mockachino + descuento aplicado
 */
const featuredItems = computed(() => {
  const activos = featuredStore.featuredProducts.filter(f => f.isFeatured)

  return activos
    .map(f => {
      const p = productsStore.byId(f.productId)
      if (!p) return null

      const price = Number(p.price) || 0
      const discount = Number(f.discount) || 0
      const finalPrice = Math.round(price * (1 - discount / 100))

      return {
        ...p,                 // Trae name, img, price, id, category...
        discount,
        finalPrice,
        label: f.label ?? ""  
      }
    })
    .filter(Boolean)
})
</script>

<template>
  <div class="container py-4">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="fw-bold">Bienvenido a Nuestro Local</h1>
    </div>

    <!-- PRODUCTOS DESTACADOS -->
    <div class="card p-3 shadow-sm mb-5">
      <h3 class="mb-3">⭐ Productos Destacados</h3>

      <div v-if="featuredItems.length === 0" class="text-muted">
        No hay destacados cargados.
      </div>

      <div class="row">
        <div
          class="col-md-3 mb-3"
          v-for="p in featuredItems"
          :key="p.id"
        >
      <div class="card h-100 border-warning shadow-sm position-relative">


  <!-- wrapper para que el ribbon cruce la imagen -->
  <div class="img-wrap">
    <img
      :src="p.img"
      class="card-img-top"
      height="150"
      style="object-fit: cover;"
    />
  </div>

  <div class="card-body">
    <h5 class="fw-bold">{{ p.name }}</h5>

    <p v-if="p.label" class="small text-muted mb-1">
      {{ p.label }}
    </p>

    <!-- Precio tachado y al lado el descuento -->
<div v-if="p.discount > 0" class="price-row mb-1">
  <span class="old-price">
    <s>${{ p.price }}</s>
  </span>

  <span class="discount-box">
    -{{ p.discount }}%
  </span>
</div>

<p class="fw-bold text-success fs-5 mb-0">
  Precio: ${{ p.finalPrice }}
</p>
  </div>

</div>
        </div>
      </div>
    </div>

    <!-- TODOS LOS PRODUCTOS -->
    <div class="card p-3 shadow-sm">
      <h3 class="mb-3">🛍 Todos los Productos</h3>

      <div class="row">
        <div
          class="col-md-3 mb-4"
          v-for="p in productsStore.all"
          :key="p.id"
        >
          <div class="card h-100">
            <img :src="p.img" class="card-img-top" height="150" style="object-fit: cover;">
            <div class="card-body">
              <h5 class="fw-bold">{{ p.name }}</h5>
              <p>${{ p.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* wrapper para controlar overflow de la imagen */
.img-wrap {
  position: relative;
  overflow: hidden;
  border-top-left-radius: .375rem;
  border-top-right-radius: .375rem;
}

.price-row{
  display: flex;
  align-items: center;
  gap: 8px;
}

.old-price{
  color: #6c757d;
  font-size: 0.95rem;
}

.discount-box{
  background: #dc3545;     /* rojo */
  color: #fff;
  font-weight: 700;
  font-size: 0.8rem;       /* bien chiquito */
  padding: 2px 6px;
  border-radius: 4px;      /* cuadradito con bordes suaves */
  line-height: 1;
}
</style>