<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { ref, computed } from 'vue'


const props = defineProps({
    labels: { type:Array, required:true },
    series: { type:Array, required:true }, // números
    colors: { type:Object, required:true }  // {accent, muted, border, text}
})

// emite el índice del bar clickeado
const emit = defineEmits(['select'])

const options = computed(() => ({
    chart:{
        foreColor: props.colors.muted,
        toolbar:{show:false},
        zoom:{enabled:false},
        selection:{enabled:false}
    },
    colors:[props.colors.accent],
    plotOptions:{ bar:{ borderRadius:6, columnWidth:'45%' }},
    xaxis:{
        categories: props.labels,
        tickPlacement:'on',
        labels:{
        rotate:-45, rotateAlways:true, hideOverlappingLabels:true,
        minHeight:70, maxHeight:120, offsetY:8,
        style:{ fontSize:'12px', colors: props.colors.muted }
        },
        axisBorder:{show:false}, axisTicks:{show:false}
    },
    yaxis:{ labels:{ formatter:v=>Number(v).toFixed(0) }},
    dataLabels:{
        enabled:true, offsetY:-6,
        formatter:v=>Number(v).toFixed(0),
        style:{ colors:[props.colors.text] }
    },
    grid:{ strokeDashArray:4, borderColor: props.colors.border },
    tooltip:{
        theme:'dark',
        x:{ formatter:(_v, {dataPointIndex}) => props.labels?.[dataPointIndex] ?? '' },
        y:{ formatter:v=>`${Number(v).toFixed(0)} uds` }
    }
}))

const apexSeries = computed(()=> [{ name:'Cantidad', data: props.series }])

function onSelect(_e, _ctx, cfg){
    const i = cfg?.dataPointIndex
    if (typeof i === 'number' && i >= 0) emit('select', i)
}
</script>

<template>
<div class="card">
    <div class="card-title">Productos más vendidos</div>
    <apexchart
    type="bar" height="260"
    :options="options" :series="apexSeries"
    @dataPointSelection="onSelect"
    />
</div>
</template>

<script>
export default { components:{ apexchart: VueApexCharts } }
</script>

<style scoped>
.card{background:#fffbe6;border-radius:12px;padding:16px;border:1px solid var(--rc-border)}
.card-title{color:var(--rc-muted);font-weight:600;margin-bottom:10px}
</style>
