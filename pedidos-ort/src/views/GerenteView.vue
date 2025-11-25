<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import dayjs from 'dayjs'
import { useOrdersStore } from '../stores/orders.js'
import { useProductsStore } from '../stores/products.js'
import { useFeaturedProductsStore } from '../stores/featuredProducts.js'

import Kpi from '../components/Kpi.vue'
import OrdersPorDia from '../components/OrdersPorDia.vue'
import TopProductsChart from '../components/TopProductsChart.vue'
import ModalFeaturedProducts from '../components/ModalFeaturedProducts.vue'
import ResumenPedidosTable from '../components/ResumenPedidosTable.vue'


const store = useOrdersStore()
const products = useProductsStore()
const featured = useFeaturedProductsStore()

const ready = ref(false)
const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const greeting = ref('')
const COLORS = { accent:'#ffbe0b', text:'#6B5300', muted:'#7A6400', border:'#E8D79C' }

onMounted(async () => {
  const h = new Date().getHours()
  greeting.value = h<12? '¡Buenos días' : h<19? '¡Buenas tardes' : '¡Buenas noches'

  await Promise.all([
    products.fetchProducts?.(),
    store.fetchOrders(),
    featured.fetchFeaturedProducts?.()
  ])
  await nextTick()
  ready.value = true
})

const ordersByDay = computed(() => {
  const map = new Map()
  for (const o of store.orders){
    const raw = o.date ?? o.createdAt
    const d = dayjs(typeof raw === 'number' ? raw : String(raw)).format('YYYY-MM-DD')
    map.set(d, (map.get(d)||0)+1)
  }
  const labels = Array.from(map.keys()).sort()
  const series = labels.map(d => map.get(d))
  return { labels, series }
})

const ordersDet = computed(() => store.orders.map(store.withDetails))

const summaryTable = computed(() =>
  ordersDet.value.map(o => ({
    id: o.id,
    date: dayjs(o.date ?? o.createdAt).format('DD/MM/YYYY'),
    lines: Array.isArray(o.items) ? o.items.reduce((n, it) => n + (it?.qty ?? 1), 0) : 0,
    total: Number(o.total ?? 0)
  }))
)

const topProducts = computed(() => {
  const acc = {}
  for (const o of ordersDet.value){
    for (const it of o.items){
      const pid = it.productId ?? it.id ?? it.code
      if (!pid) continue
      acc[pid] = (acc[pid] ?? 0) + (Number(it.qty)||1)
    }
  }
  const entries = Object.entries(acc).sort((a,b)=>b[1]-a[1]).slice(0,5)
  const ids = entries.map(([pid]) => String(pid))
  const labels = ids.map(id => products.byId?.(id)?.name ?? String(id))
  const series = entries.map(([,q]) => q)
  return { ids, labels, series }
})

const totalSales = computed(() =>
  ordersDet.value.reduce((s,o)=> s + (o.total ?? 0), 0)
)

const currency = n => new Intl.NumberFormat('es-AR',{
  style:'currency', currency:'ARS', maximumFractionDigits:0
}).format(n)

/* Modal state */
const showFeature = ref(false)
const form = ref({ productId:'', name:'', discount:0 })

function openFeatureByIndex(i){
  const pid = topProducts.value.ids?.[i]
  const name = topProducts.value.labels?.[i]
  if (!pid) return
  const current = featured.byProductId(pid)
  form.value = {
    productId: pid,
    name: name ?? String(pid),
    discount: current?.discount ?? 0
  }
  showFeature.value = true
}

async function saveFeatured(discount){
  const { productId, name } = form.value
  if (!productId) return
  await featured.upsertFeatured({ productId, name, discount, isFeatured:true })
  showFeature.value = false
}

async function removeFeatured(){
  const { productId } = form.value
  if (!productId) return
  await featured.unsetFeatured(productId)
  showFeature.value = false
}
</script>

<template>
<section v-if="ready" class="page">
  <div class="header">
    <div>
      <h1>{{ greeting }}, {{ user.name || 'Gerente' }} 👋</h1>
      <p class="sub">Bienvenido al panel de control. Aquí podés ver la actividad del restaurante.</p>
    </div>
  </div>

  <Kpi
    :total-orders="store.orders.length"
    :total-sales-text="currency(totalSales)"
    :distinct-products="topProducts.labels.length"
  />

  <div class="grid-2">
    <OrdersPorDia
      :labels="ordersByDay.labels"
      :series="ordersByDay.series"
      :colors="COLORS"
    />
    <TopProductsChart
      :labels="topProducts.labels"
      :series="topProducts.series"
      :colors="COLORS"
      @select="openFeatureByIndex"
    />
  </div>
<ResumenPedidosTable :rows="summaryTable" />
</section>

<div v-else class="loading">
  <div class="spinner"></div>
  <span>Cargando estadísticas…</span>
</div>

<ModalFeaturedProducts
  v-model="showFeature"
  :product-name="form.name"
  :discount="form.discount"
  :loading="featured.loading"
  @save="saveFeatured"
  @remove="removeFeatured"
/>
</template>

<style scoped>
:global(:root){
  --rc-accent:#ffbe0b;--rc-text:#816501;--rc-muted:#7A6400;--rc-border:#e2cc7a
}
.page{padding:24px;color:var(--rc-text);max-width:1200px;margin:0 auto}
.header{display:flex;justify-content:center;align-items:center;margin-bottom:24px}
.header h1{font-size:26px;margin:0}.sub{color:var(--rc-muted);margin-top:6px}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.loading{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#555}
.spinner{width:32px;height:32px;border:3px solid #ffbe0b33;border-top-color:var(--rc-accent);border-radius:50%;animation:spin .9s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@media (max-width:900px){.grid-2{grid-template-columns:1fr}}
</style>