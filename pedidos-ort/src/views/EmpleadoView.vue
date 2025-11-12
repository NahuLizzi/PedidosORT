<!-- src/views/EmpleadoView.vue -->
<template>
  <section class="empleado-view">
    <!-- saludo -->
    <div class="saludo">
      <h2>Bienvenido, {{ name }} 👨‍🍳</h2>
      <p class="sub">¡Es hora de preparar los pedidos!</p>
    </div>

    <!-- encabezado general -->
    <header class="top">
      <h1>Pedidos – Cocina</h1>
      <div class="stats">
        <span>🕒 Pendientes: {{ pendientesDet.length }}</span>
        <span>👩‍🍳 En prep: {{ enPrepDet.length }}</span>
        <span>✅ Listos: {{ listosDet.length }}</span>
      </div>
    </header>

    <!-- columnas de pedidos -->
    <div class="cols">
      <!-- pendientes -->
      <div class="col pendientes">
        <h2>Pendientes</h2>
        <p v-if="pendientesDet.length === 0" class="empty">Sin pedidos</p>
        <PedidoCard
          v-for="o in pendientesDet"
          :key="o.id"
          :order="o"
          @prep="markInPreparation"
        />
      </div>

      <!-- en preparacion -->
      <div class="col enprep">
        <h2>En preparación</h2>
        <p v-if="enPrepDet.length === 0" class="empty">Sin pedidos</p>
        <PedidoCard
          v-for="o in enPrepDet"
          :key="o.id"
          :order="o"
          @ready="markReady"
        />
      </div>

      <!-- listos -->
      <div class="col listos">
        <h2>Listos</h2>
        <p v-if="listosDet.length === 0" class="empty">Sin pedidos</p>
        <PedidoCard
          v-for="o in listosDet"
          :key="o.id"
          :order="o"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import PedidoCard from '../components/PedidoCard.vue'
import { useOrdersStore } from '../stores/orders'
import { storeToRefs } from 'pinia'

const ordersStore = useOrdersStore()
const { pendientesDet, enPrepDet, listosDet } = storeToRefs(ordersStore)
const { markInPreparation, markReady, fetchOrders } = ordersStore

// saludo personalizado
const user = computed(() => JSON.parse(localStorage.getItem('user') || '{}'))
const name = computed(() => user.value.name || 'Empleado')

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.empleado-view {
  padding: 2rem;
  background: #fffbe6; /* fondo calido */
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
  color: #d62828;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.saludo .sub {
  color: #555;
  font-size: 1rem;
}

/* encabezado superior */
.top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  background: #ffbe0b1a;
  padding: 10px 16px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}
.top h1 {
  margin: 0;
  color: #2c2c2c;
  font-size: 1.6rem;
}
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-weight: 500;
  color: #444;
}

/* columnas */
.cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 1.2rem;
}
.col {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  padding: 1rem;
  display: grid;
  gap: 12px;
  align-content: start;
}
h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2c2c2c;
  text-align: center;
}
.empty {
  color: #777;
  font-style: italic;
  text-align: center;
}

/* colores psegun estado */
.pendientes { border-top: 5px solid #facc15; }
.enprep { border-top: 5px solid #f97316; }
.listos { border-top: 5px solid #22c55e; }

/* responsive */
@media (max-width: 980px) {
  .cols {
    grid-template-columns: 1fr;
  }
}
</style>
