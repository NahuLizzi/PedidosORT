<template>
  <article class="producto-card">
    <img :src="producto.img" class="img" />

    <p class="nombre">{{ producto.name }}</p>
    <p class="precio">$ {{ producto.price }}</p>

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
  window.dispatchEvent(
    new CustomEvent("actualizar-producto", {
      detail: {
        id: props.producto.id,
        name: props.producto.name,
        price: props.producto.price,
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
  width: 220px;            /* 🟢 CONTROL REAL DEL ANCHO */
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

.contador {
  display: flex;
  justify-content: center;
  gap: 10px;
}
</style>
