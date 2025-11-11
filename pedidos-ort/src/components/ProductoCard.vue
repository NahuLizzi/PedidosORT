<template>
  <article class="producto">
    <img :src="producto.img" alt="" class="img" />

    <p class="nombre">{{ producto.name }}</p>
    <p class="precio">${{ producto.price }}</p>

    <div class="acciones">
      <!-- Si el producto no está seleccionado, mostrar botón normal -->
      <button
        v-if="cantidadSeleccionada === 0"
        @click="incrementar"
        class="btn-agregar"
      >
        Agregar al carrito
      </button>

      <!-- Si ya hay cantidad, mostrar contador -->
      <div v-else class="contador">
        <button @click="decrementar" class="btn-menos">–</button>
        <span class="cantidad">{{ cantidadSeleccionada }}</span>
        <button @click="incrementar" class="btn-mas">+</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ producto: Object })
const cantidadSeleccionada = ref(0)

// Emitir evento global con producto + cantidad
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
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 12px;
  text-align: center;
  width: 180px;
}

.img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin: 8px auto;
}

.nombre {
  font-weight: 600;
  margin: 4px 0 2px 0;
}

.precio {
  color: #555;
  margin-bottom: 8px;
}

.acciones {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-agregar {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
}
.btn-agregar:hover {
  background-color: #4338ca;
}

.contador {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-mas,
.btn-menos {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 18px;
  cursor: pointer;
}
.btn-mas:hover,
.btn-menos:hover {
  background-color: #4338ca;
}
.cantidad {
  font-weight: bold;
  font-size: 16px;
  min-width: 20px;
  text-align: center;
}
</style>