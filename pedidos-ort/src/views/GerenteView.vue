<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import VueApexCharts from 'vue3-apexcharts'
import { useOrdersStore } from '../stores/orders.js'
import { useProductsStore } from '../stores/products.js'
import { useFeaturedProductsStore } from '../stores/featuredProducts.js'

//Guardamos las ordenes
const store = useOrdersStore()
//Guardamos los productos
const products = useProductsStore()
//Guardamos los productos destacados
const featuredProductsStore = useFeaturedProductsStore()
//Ref para Spinner para cuando los gráficos esten listos.
const ready = ref(false)     

// Estado base y saludo
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const greeting = ref('')

//Paleta de colores
const COLORS = {
  accent: '#ffbe0b', // barras/línea (ya lo usás)
  text:   '#6B5300', // texto principal (más oscuro)
  muted:  '#7A6400', // texto secundario/labels
  border: '#E8D79C', // grilla/bordes suaves
}


// Generar saludo según la hora
const updateGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) greeting.value = '¡Buenos días'
  else if (hour < 19) greeting.value = '¡Buenas tardes'
  else greeting.value = '¡Buenas noches'
}
onMounted(updateGreeting)

const showFeature = ref(false) 
const form = ref({ productId: '', name: '', discount: 0 }) 

// Obtener pedidos y productos al montar 

onMounted(async () => {
  await Promise.all([
    products.fetchProducts?.(), 
    store.fetchOrders(),
    featuredProductsStore.fetchFeaturedProducts?.()
  ])
  await nextTick()
  ready.value= true
})

const ordersByDay = computed(() => {
  const map = new Map()
  for (const o of store.orders) {
    const raw = o.date ?? o.createdAt
    const d = dayjs(typeof raw === 'number' ? raw : String(raw)).format('YYYY-MM-DD')
    map.set(d, (map.get(d) ?? 0) + 1)
  }
  const labels = Array.from(map.keys()).sort()
  const series = labels.map(d => map.get(d))
  return { labels, series }
})
const ordersDet = computed(() => store.orders.map(store.withDetails))

const topProducts = computed(() => {
  const acc = {} // pid -> qty
  for (const o of ordersDet.value) {
    for (const it of o.items) {
      // siempre priorizamos el ID real
      const pid = it.productId ?? it.id ?? it.code
      if (!pid) continue
      acc[pid] = (acc[pid] ?? 0) + (Number(it.qty) || 1)
    }
  }

  const entries = Object.entries(acc)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5) // TOP 5

  const ids    = entries.map(([pid]) => String(pid))
  const labels = ids.map(id => products.byId?.(id)?.name ?? String(id))
  const series = entries.map(([,qty]) => qty)

  return { ids, labels, series }
})
const totalSales = computed(() =>
  ordersDet.value.reduce((sum, o) => sum + (o.total ?? 0), 0)
)

const summaryTable = computed(() =>
  ordersDet.value.map(o => ({
    id: o.id,
    date: dayjs(o.date ?? o.createdAt).format('DD/MM/YYYY'),
    lines: o.items.reduce((n,it)=> n + (it.qty ?? 1), 0),
    total: o.total ?? 0
  }))
)

const currency = (n) =>
  new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 }).format(n)

/*  Configuración de gráficos */
const optsOrdersByDay = computed(() => ({
  chart: { toolbar: { show: false }, foreColor: COLORS.muted },
  colors: [COLORS.accent],     
  xaxis: { categories: ordersByDay.value.labels },
  yaxis: { labels: { style: { colors: COLORS.muted } }},
  dataLabels: { enabled: false },
  stroke: { width: 3 },
  grid: { strokeDashArray: 4, borderColor: COLORS.border },
}))
const seriesOrdersByDay = computed(() => [
  { name: 'Pedidos', data: ordersByDay.value.series }
])

const seriesTopProducts = computed(() => [
  { name: 'Cantidad', data: Array.isArray(topProducts.value?.series) ? topProducts.value.series : [] }
])

// 1) helpers para el array
const safeArray = (x) => (Array.isArray(x) ? x : [])

const onBarSelectFromOpts = (event, ctx, cfg) => {
  console.log('[opts] dataPointSelection', { cfg, labels: ctx?.w?.globals?.labels })
  // Reutilizamos tu handler genérico
  handleBarSelect(event, ctx, cfg)
}

const optsTopProducts = computed(() => ({
  chart: {
    foreColor: COLORS.muted,
    toolbar: { show: false },
    zoom: { enabled: false },
    selection: { enabled: false }
  },
  colors: [COLORS.accent],
  plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
  xaxis: {
    categories: Array.isArray(topProducts.value?.labels) ? topProducts.value.labels : [],
    tickPlacement: 'on',
    labels: {
      rotate: -45,
      rotateAlways: true,
      hideOverlappingLabels: true,
      minHeight: 70,
      maxHeight: 120,
      offsetY: 8,
      style: { fontSize: '12px', colors: COLORS.muted },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { formatter: (v) => Number(v).toFixed(0) } },
  dataLabels: {
    enabled: true,
    offsetY: -6,
    formatter: (val) => Number(val).toFixed(0),
    style: { colors: [COLORS.text] },
  },
  grid: { strokeDashArray: 4, borderColor: COLORS.border },
  tooltip: {
    theme: 'dark',
    x: {
      // muestra el label completo
      formatter: (_val, { dataPointIndex }) => topProducts.value.labels?.[dataPointIndex] ?? ''
    },
    y: { formatter: (val) => `${Number(val).toFixed(0)} uds` }
  },
  noData: { text: 'Sin datos', align: 'center', style: { color: '#e5e7eb' } },
}))

const saveFeatured = async () => {
  if (!form.value.productId) return
  await featuredProductsStore.upsertFeatured({
    productId: form.value.productId,
    name: form.value.name,
    discount: Number(form.value.discount) || 0,
    isFeatured: true
  })
  showFeature.value = false
}

const removeFeatured = async () => {
  if (!form.value.productId) return
  await featuredProductsStore.unsetFeatured(form.value.productId)
  showFeature.value = false
}

const findProductByLabel = (label) => {
  const list = products.items || products.list || products.products || []
  const found = list.find(p =>
    (p.name && p.name === label) ||
    (p.code && p.code === label) ||
    (p.id && p.id === label)
  )
  return found || { id: String(label), name: String(label) }
}

const handleBarSelect = (_event, _ctx, cfg) => {
  const i = cfg?.dataPointIndex
  if (typeof i !== 'number' || i < 0) return

  const productId = topProducts.value.ids?.[i]
  const name      = topProducts.value.labels?.[i]
  if (!productId) return

  const current = featuredProductsStore.byProductId(productId) // <- lee del store de destacados

  form.value = {
    productId,
    name: name ?? String(productId),
    discount: current?.discount ?? 0
  }
  showFeature.value = true
}

const onBarSelect = (label) => {
  //obtenemos el producto por su label
  const p = findProductByLabel(label)
  const productId = p?.id ?? p?.code ?? String(label)

  //intenta products.byId(productId) y sino usa el que viene de la búsqueda
  const name = products.byId?.(productId)?.name ?? p?.name ?? String(label)

  //descuento actual desde featuredProducts
  const current = featuredProductsStore.byProductId(productId)
  const discount = current?.discount ?? 0

  //seteo el form y abro el modal
  form.value = { productId, name, discount }
  showFeature.value = true
}

</script>

<template>
  <section  v-if="ready" class="page">
    <div class="header">
      <div>
        <h1>{{ greeting }}, {{ user.name || 'Gerente' }} 👋</h1>
        <p class="sub">Bienvenido al panel de control. Aquí podés ver la actividad del restaurante.</p>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpis">
      <div class="card kpi">
        <span class="muted">Pedidos totales</span>
        <strong class="kpi-title">{{ store.orders.length }}</strong>
      </div>
      <div class="card kpi">
        <span class="muted">Ventas acumuladas</span>
        <strong class="kpi-title">{{ currency(totalSales) }}</strong>
      </div>
      <div class="card kpi">
        <span class="muted">Productos distintos</span>
        <strong class="kpi-title">{{ topProducts.labels.length }}</strong>
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
          :series="seriesTopProducts"
          @dataPointSelection="handleBarSelect"/> 
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="card-title">Resumen de pedidos</div>
      <table class="table">
        <thead>
          <tr>
            <th class="t-left">ID</th>
            <th>Fecha</th>
            <th>Ítems</th>
            <th class="t-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in summaryTable" :key="row.id">
            <td class="t-left">{{ row.id }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.lines }}</td>
            <td class="t-right">{{ currency(row.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <div v-else class="loading">
    <div class="spinner"></div>
    <span>Cargando estadísticas…</span>
  </div>


<!--  Modal simple -->
<div v-if="showFeature" class="modal-backdrop" @click.self="showFeature=false">
  <div class="modal">
    <h3>Destacar producto</h3>
    <p class="muted">Producto: <strong>{{ form.name }}</strong></p>

    <label class="lbl">Descuento (%)
      <input class="inp" type="number" min="0" max="100" v-model.number="form.discount" />
    </label>

    <div class="modal-actions">
      <button class="btn primary"
              @click="saveFeatured"
              :disabled="featuredProductsStore.loading">
        {{ featuredProductsStore.loading ? 'Guardando...' : 'Guardar' }}
      </button>

      <button class="btn warn"
              @click="removeFeatured"
              :disabled="featuredProductsStore.loading">
        {{ featuredProductsStore.loading ? 'Quitando...' : 'Quitar destacado' }}
      </button>
      <button class="btn" @click="showFeature=false">Cancelar</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  components: { apexchart: VueApexCharts }
}
</script>

<style scoped>
/*Declaramos los colores con variables CSS */ 

:global(:root){
  --rc-accent: #ffbe0b;   /* acento (barras / línea / spinner) */
  --rc-text:   #816501;   /* texto principal */
  --rc-muted:  #7A6400;   /* texto secundario */
  --rc-border: #e2cc7a;   /* bordes / grilla suave */
}

.page { padding: 24px; color: var(--rc-text); max-width: 1200px; margin: 0 auto; }
.header { display:flex; justify-content: center; align-items:center; margin-bottom: 24px; }
.header h1 { font-size: 26px; margin:0; }
.sub { color: var(--rc-muted); margin-top:6px; }

.kpis { display:grid; grid-template-columns: repeat(3,1fr); gap:16px; margin-bottom:16px; }
.kpi { background:#fff7cc; border:1px solid var(--rc-border); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:8px; }
.kpi strong, .kpi-title { font-size:24px; color: var(--rc-text); }

.grid-2 { display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:16px; }
.card { background:#fffbe6; border-radius:12px; padding:16px;border:1px solid var(--rc-border) }
.card-title { color: var(--rc-muted); font-weight:600; margin-bottom:10px; }


.table { width:100%; border-collapse:separate; border-spacing:0 8px; color: var(--rc-text); }
.table th { text-align:left; color:var(--rc-text); font-weight:600; }
.table td, .table th { color: var(--rc-text); padding:10px 12px; background:#ffbe0b28;  }
.table tr { box-shadow:0 1px 6px rgba(175, 163, 163, 0.08); border-radius:8px; }
.t-right { text-align:right; border-bottom-right-radius: 5px; border-top-right-radius: 5px;}
.t-left { text-align:left; border-bottom-left-radius: 5px; border-top-left-radius: 5px; }

.muted { color:var(--rc-muted); font-weight:bold ; }

.loading{
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;      /* centra horizontal */
  justify-content: center;  /* centra vertical */
  gap: 12px;
  color: #555;
}
.spinner{
  width: 32px; height: 32px;
  border: 3px solid #ffbe0b33;
  border-top-color: var(--rc-accent);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin{to{transform: rotate(360deg)}}

.actions{ display:flex; justify-content:flex-end; margin:12px 0 24px; }
.btn{ padding:8px 12px; border-radius:8px; border:1px solid var(--rc-border); background:#fffbe6; color:var(--rc-text); }
.btn + .btn{ margin-left:8px; }
.btn.primary{ background: var(--rc-accent); border-color: var(--rc-accent); color:#3a2f00; font-weight:600; }
.btn.warn{ background:#ffe6e6; border-color:#ffb3b3; color:#8a0000; }

.modal-backdrop{
  position:fixed; inset:0; background:rgba(0,0,0,.25);
  display:flex; align-items:center; justify-content:center; z-index:50;
  z-index: 9999 !important;
}
.modal{
  display:block;
  width: min(480px, 90vw);
  z-index: 10000 !important;
  background:#fffef5; border:1px solid var(--rc-border); border-radius:12px; padding:16px;
  box-shadow: 0 12px 30px rgba(0,0,0,.15);
}
.lbl{ display:block; font-weight:600; color:var(--rc-muted); margin:12px 0 6px; }
.inp{
  width: 120px; padding:8px 10px; border:1px solid var(--rc-border); border-radius:8px; outline:none;
  color:var(--rc-text); background:#fffdf1;
}
.modal-actions{ display:flex; justify-content:flex-end; gap:8px; margin-top:16px; }


@media (max-width: 900px){
  .kpis{ grid-template-columns: 1fr; }
  .grid-2{ grid-template-columns: 1fr; }
}
</style>
