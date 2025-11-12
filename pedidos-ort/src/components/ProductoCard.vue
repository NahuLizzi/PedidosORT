<template>
  <article class="producto card shadow-sm border-warning text-center p-3">
    <img
      :src="producto.img"
      alt=""
      class="img rounded-3 border border-warning mb-3"
    />

    <p class="nombre fw-semibold fs-5 text-dark">{{ producto.name }}</p>
    <p class="precio text-muted fs-6 mb-3">$ {{ producto.price }}</p>

    <div class="acciones">
      <!-- Si el producto no está seleccionado -->
      <button
        v-if="cantidadSeleccionada === 0"
        @click="incrementar"
        class="btn btn-warning text-dark fw-bold w-100"
      >
        🍔 Agregar al carrito
      </button>

      <!-- Si ya hay cantidad -->
      <div v-else class="contador d-flex justify-content-center align-items-center gap-3">
        <button @click="decrementar" class="btn btn-outline-warning fw-bold">–</button>
        <span class="cantidad fs-5 fw-bold">{{ cantidadSeleccionada }}</span>
        <button @click="incrementar" class="btn btn-outline-warning fw-bold">+</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ producto: Object })
const cantidadSeleccionada = ref(0)

function notificarCambio() {
  window.dispatchEvent(new CustomEvent('actualizar-producto', {
    detail: { ...props.producto, qty: cantidadSeleccionada.value }
  }))
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
.producto {
  width: 200px;
  background-color: #fffef8;
  border-radius: 12px;
}
.img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
.contador button {
  min-width: 40px;
}
</style>
