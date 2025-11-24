<template>
  <section class="empleado-view">
    <header>
      <h1>Pedidos</h1>

      <!-- FILTRO -->
      <input
        v-model="filtro"
        type="text"
        class="filtro-empleado"
        placeholder="Filtrar por # de pedido o producto..."
      />

      <div class="estadisticas">
        <span class="badge pendiente">Pendientes: {{ pendientesFiltrados.length }}</span>
        <span class="badge preparando">En preparación: {{ enPrepFiltrados.length }}</span>
        <span class="badge listo">Listos: {{ listosFiltrados.length }}</span>
      </div>
    </header>

    <!-- FILA 1: Pendientes + En preparación -->
    <div class="fila-superior">
      <div class="columna">
        <h2>Pendientes</h2>
        <p v-if="pendientesFiltrados.length === 0" class="empty">No hay pedidos pendientes</p>

        <PedidoCard
          v-for="order in pendientesFiltrados"
          :key="order.id"
          :order="order"
          @prep="markInPreparation"
        />
      </div>

      <div class="columna">
        <h2>En preparación</h2>
        <p v-if="enPrepFiltrados.length === 0" class="empty">No hay pedidos en preparación</p>

        <PedidoCard
          v-for="order in enPrepFiltrados"
          :key="order.id"
          :order="order"
          @ready="markReady"
        />
      </div>
    </div>

    <!-- FILA 2: Listos -->
    <div class="fila-listos">
      <h2>Listos</h2>
      <p v-if="listosFiltrados.length === 0" class="empty">No hay pedidos listos</p>

      <div class="listos-grid">
        <PedidoCard
          v-for="order in listosFiltrados"
          :key="order.id"
          :order="order"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue"
import { useOrdersStore } from "../stores/orders"
import PedidoCard from "../components/PedidoCard.vue"

const store = useOrdersStore()

// texto del filtro
const filtro = ref("")

// lógica del filtro
const coincideFiltro = (order) => {
  const term = filtro.value.trim().toLowerCase()
  if (!term) return true

  const matchId = String(order.id).includes(term)

  const matchItem = order.items?.some(item =>
    (item.name ?? "").toLowerCase().includes(term)
  )

  return matchId || matchItem
}

// computados filtrados
const pendientesFiltrados = computed(() =>
  store.pendientesDet.filter(coincideFiltro)
)

const enPrepFiltrados = computed(() =>
  store.enPrepDet.filter(coincideFiltro)
)

const listosFiltrados = computed(() =>
  store.listosDet.filter(coincideFiltro)
)

// funciones del store
const markInPreparation = store.markInPreparation
const markReady = store.markReady
</script>

<style scoped>
.empleado-view {
  padding: 20px;
  display: grid;
  gap: 20px;
}

header {
  display: grid;
  gap: 10px;
}

.filtro-empleado {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
}

.estadisticas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.pendiente {
  background: #ffe8a3;
  color: #a97900;
}

.preparando {
  background: #cfe7ff;
  color: #0056a7;
}

.listo {
  background: #c8f7c5;
  color: #1c7c1c;
}


.fila-superior {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  align-items: start; /* ✔ FIX importante */
}

.columna {
  display: grid;
  gap: 12px;
}


.fila-listos {
  margin-top: 10px;
}

.listos-grid-empleado {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.empty {
  font-style: italic;
  color: #666;
}

@media (max-width: 900px) {
  .fila-superior {
    grid-template-columns: 1fr;
  }

  .listos-grid {
    grid-template-columns: 1fr;
  }
}
</style>

