<!-- <template>
  <section class="vista">
    <h2> Panel del Gerente</h2>
    <p>Control y administración general del sistema.</p>
  </section>
</template>

<style scoped>
.vista {
  text-align: center;
  margin-top: 80px;
}
</style> -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import VueApexCharts from 'vue3-apexcharts'

/* 
  1) Mock de pedidos
 */
const orders = ref([])

onMounted(() => {
  // id, date (ISO), items [{ productId, productName, qty, price }]
  orders.value = [
    { id: 1, date: '2025-11-01', items: [
      { productId: 10, productName:'Hamburguesa', qty:2, price:3500 },
      { productId: 11, productName:'Papas',        qty:1, price:1800 },
    ]},
    { id: 2, date: '2025-11-01', items: [
      { productId: 12, productName:'Nuggets',      qty:1, price:3000 },
      { productId: 11, productName:'Papas',        qty:2, price:1800 },
    ]},
    { id: 3, date: '2025-11-02', items: [
      { productId: 10, productName:'Hamburguesa',  qty:1, price:3500 },
      { productId: 13, productName:'Pizza',        qty:1, price:6000 },
    ]},
    { id: 4, date: '2025-11-02', items: [
      { productId: 10, productName:'Hamburguesa',  qty:3, price:3500 },
    ]},
    { id: 5, date: '2025-11-03', items: [
      { productId: 11, productName:'Papas',        qty:3, price:1800 },
      { productId: 12, productName:'Nuggets',      qty:2, price:3000 },
    ]},
  ]
}) /// Tengo que traer las órdenes del componente ordenes

/* 
  2) Computeds / métricas
    */
// 2.1 Pedidos por día (labels + series)
const ordersByDay = computed(() => {
  const map = new Map()
  for (const o of orders.value) {
    const d = dayjs(o.date).format('YYYY-MM-DD')
    map.set(d, (map.get(d) ?? 0) + 1)
  }
  const labels = Array.from(map.keys()).sort()
  const series = labels.map(d => map.get(d))
  return { labels, series }
})

// 2.2 Top productos por cantidad
const topProducts = computed(() => {
  const qtyMap = {}
  for (const o of orders.value) {
    for (const it of o.items) {
      qtyMap[it.productName] = (qtyMap[it.productName] ?? 0) + it.qty
    }
  }
  const entries = Object.entries(qtyMap)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 6)
  return {
    labels: entries.map(([name]) => name),
    series: entries.map(([,qty]) => qty),
  }
})

// 2.3 Total de ventas acumuladas
const totalSales = computed(() =>
  orders.value.reduce((acc, o) =>
    acc + o.items.reduce((s, it) => s + it.qty * it.price, 0), 0)
)

// 2.4 Tabla simple de resumen
const summaryTable = computed(() =>
  orders.value.map(o => {
    const lines = o.items.reduce((s, it) => s + it.qty, 0)
    const total = o.items.reduce((s, it) => s + it.qty * it.price, 0)
    return {
      id: o.id,
      date: dayjs(o.date).format('DD/MM/YYYY'),
      lines,
      total
    }
  }).sort((a,b) => a.id - b.id)
)

// util formateo moneda
const currency = (n) =>
  new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 }).format(n)

/* 
  3) Opciones de gráficos
*/
const optsOrdersByDay = computed(() => ({
  chart: { toolbar: { show: false } },
  xaxis: { categories: ordersByDay.value.labels },
  dataLabels: { enabled: false },
  stroke: { width: 3 },
  grid: { strokeDashArray: 4 },
}))
const seriesOrdersByDay = computed(() => [
  { name: 'Pedidos', data: ordersByDay.value.series }
])

const optsTopProducts = computed(() => ({
  chart: { toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
  xaxis: { categories: topProducts.value.labels },
  dataLabels: { enabled: false },
}))
const seriesTopProducts = computed(() => [
  { name: 'Cantidad', data: topProducts.value.series }
])
</script>

<template>
  <section class="page">
    <h1 class="title">Panel del Gerente</h1>

    <!-- KPIs -->
    <div class="kpis">
      <div class="card kpi">
        <span class="muted">Pedidos totales</span>
        <strong>{{ orders.length }}</strong>
      </div>
      <div class="card kpi">
        <span class="muted">Ventas acumuladas</span>
        <strong>{{ currency(totalSales) }}</strong>
      </div>
      <div class="card kpi">
        <span class="muted">Productos distintos</span>
        <strong>{{ topProducts.labels.length }}</strong>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid-2">
      <div class="card">
        <div class="card-title">Cantidad de pedidos por día</div>
        <apexchart type="line" height="260"
          :options="optsOrdersByDay"
          :series="seriesOrdersByDay" />
      </div>

      <div class="card">
        <div class="card-title">Productos más vendidos</div>
        <apexchart type="bar" height="260"
          :options="optsTopProducts"
          :series="seriesTopProducts" />
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-title">Resumen de pedidos</div>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            <th>Ítems</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in summaryTable" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.lines }}</td>
            <td class="right">{{ currency(row.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
export default {
  components: { apexchart: VueApexCharts }
}
</script>

<style scoped>
.page { padding: 24px; color:#e5e7eb; max-width: 1200px; margin: 0 auto; }
.title { text-align:center; font-size:28px; margin: 0 0 16px; }

.kpis { display:grid; grid-template-columns: repeat(3,1fr); gap:16px; margin-bottom:16px; }
.kpi { background:#171a1f; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:8px; }
.kpi strong { font-size:24px; }

.grid-2 { display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px; }
.card { background:#171a1f; border-radius:12px; padding:16px; }
.card-title { color:#9aa3b2; font-weight:600; margin-bottom:10px; }

.table { width:100%; border-collapse:separate; border-spacing:0 8px; }
.table th { text-align:left; color:#9aa3b2; font-weight:600; }
.table td, .table th { padding:10px 12px; background:#171a1f; }
.table tr { box-shadow:0 1px 6px rgba(0,0,0,.08); border-radius:8px; }
.right { text-align:right; }

.muted { color:#9aa3b2; }

@media (max-width: 900px){
  .kpis{ grid-template-columns: 1fr; }
  .grid-2{ grid-template-columns: 1fr; }
}
</style>