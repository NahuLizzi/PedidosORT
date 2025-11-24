<template>
  <article class="producto-card">
    <img :src="producto.img" class="img" />

    <p class="nombre">{{ producto.name }}</p>

    <!-- PRECIOS CON DESCUENTO -->
    <div v-if="producto.discount > 0" class="precios">
      <div class="price-row">
        <span class="old-price">
          <s>$ {{ producto.price }}</s>
        </span>
        <span class="discount-box">
          -{{ producto.discount }}%
        </span>
      </div>

      <p class="final-price">$ {{ producto.finalPrice }}</p>

      <p v-if="producto.label" class="label">
        {{ producto.label }}
      </p>
    </div>

    <!-- PRECIO NORMAL -->
    <p v-else class="precio">$ {{ producto.price }}</p>

    <div class="acciones">
      <button
        v-if="cantidadSeleccionada === 0"
        @click="incrementar"
        class="btn-agregar"
      >
        🍔 Agregar
      </button>

      <div v-else class="contador">
        <button @click="decrementar">–</button>
        <span class="cantidad">{{ cantidadSeleccionada }}</span>
        <button @click="incrementar">+</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from "vue"

const props = defineProps({ producto: Object })
const cantidadSeleccionada = ref(0)

function notificarCambio() {
  // si hay descuento, se envia precio final (finalPrice) al carrito
  const priceToSend = props.producto.finalPrice ?? props.producto.price

  window.dispatchEvent(
    new CustomEvent("actualizar-producto", {
      detail: {
        id: props.producto.id,
        name: props.producto.name,
        price: priceToSend,
        qty: cantidadSeleccionada.value
      }
    })
  )
}

function incrementar() {
  cantidadSeleccionada.value++
  notificarCambio()
}

function decrementar() {
  if (cantidadSeleccionada.value > 0) {
    cantidadSeleccionada.value--
    notificarCambio()
  }
}
</script>

<style scoped>
.producto-card {
  width: 220px;
  background: #fffef8;
  border: 1px solid #ffe082;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
}

.img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
}

.precios {
  margin-top: .25rem;
}

.price-row{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

.old-price{
  color: #6c757d;
  font-size: .9rem;
}

.discount-box{
  background: #dc3545;
  color: #fff;
  font-weight: 700;
  font-size: .75rem;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
}

.final-price{
  color: #198754;
  font-weight: 700;
  font-size: 1.05rem;
  margin: 4px 0 0;
}

.label{
  font-size: .8rem;
  color: #6c757d;
  margin-top: 2px;
}

.contador {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
