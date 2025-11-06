<!-- src/views/EmpleadoView.vue -->
<template>
  <section class="layout">
    <header class="top">
      <h1>Pedidos – Cocina</h1>
      <div class="stats">
        <span>Pendientes: {{ pendientesDet.length }}</span>
        <span>En prep: {{ enPrepDet.length }}</span>
        <span>Listos: {{ listosDet.length }}</span>
      </div>
    </header>

    <div class="cols">
      <div class="col">
        <h2>Pendientes</h2>
        <p v-if="pendientesDet.length === 0" class="empty">Sin pedidos</p>
        <PedidoCard
          v-for="o in pendientesDet"
          :key="o.id"
          :order="o"
          @prep="markInPreparation"
        />
      </div>

      <div class="col">
        <h2>En preparación</h2>
        <p v-if="enPrepDet.length === 0" class="empty">Sin pedidos</p>
        <PedidoCard
          v-for="o in enPrepDet"
          :key="o.id"
          :order="o"
          @ready="markReady"
        />
      </div>

      <div class="col">
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
import PedidoCard from '../components/PedidoCard.vue'
import { useOrdersStore } from '../stores/orders'

const {
  pendientesDet,
  enPrepDet,
  listosDet,
  markInPreparation,
  markReady
} = useOrdersStore()
</script>

<style scoped>
.layout { display: grid; gap: 20px; padding: 12px; }
.top { display: flex; justify-content: space-between; align-items: baseline; }
.top h1 { margin: 0; }
.stats { display: flex; gap: 12px; font-size: 14px; color: #555; }

.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.col { display: grid; gap: 12px; align-content: start; }
h2 { margin: 0; font-size: 16px; }
.empty { color: #777; font-style: italic; }

@media (max-width: 980px) {
  .cols { grid-template-columns: 1fr; }
}
</style>
