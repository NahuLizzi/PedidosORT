<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { ref, computed } from 'vue'


const props = defineProps({
    labels: { type: Array, required: true },
    series: { type: Array, required: true }, // números
    colors: { type: Object, required: true } // {accent, muted, border}
})

const options = computed(() => ({
    chart: { toolbar:{show:false}, foreColor: props.colors.muted },
    colors: [props.colors.accent],
    xaxis: { categories: props.labels },
    yaxis: { labels:{ style:{ colors: props.colors.muted }}},
    dataLabels:{enabled:false},
    stroke:{width:3},
    grid:{ strokeDashArray:4, borderColor: props.colors.border }
}))

const apexSeries = computed(() => [{ name:'Pedidos', data: props.series }])
</script>

<template>
<div class="card">
    <div class="card-title">Cantidad de pedidos por día</div>
    <apexchart type="line" height="260" :options="options" :series="apexSeries" />
</div>
</template>

<script>
export default { components:{ apexchart: VueApexCharts } }
</script>

<style scoped>
.card{background:#fffbe6;border-radius:12px;padding:16px;border:1px solid var(--rc-border)}
.card-title{color:var(--rc-muted);font-weight:600;margin-bottom:10px}
</style>
