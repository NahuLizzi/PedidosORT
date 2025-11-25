<script setup>
import { ref, watch, computed } from 'vue'

defineProps({
    totalOrders: { type: Number, required: true },
    totalSalesText: { type: String, required: true },
    distinctProducts: { type: Number, required: true }
})
</script>

<template>
<div class="kpis">
<div class="card kpi">
    <span class="muted">Pedidos totales</span>
    <strong class="kpi-title">{{ totalOrders }}</strong>
</div>
<div class="card kpi">
    <span class="muted">Ventas acumuladas</span>
    <strong class="kpi-title">{{ totalSalesText }}</strong>
</div>
<div class="card kpi">
    <span class="muted">Productos distintos</span>
    <strong class="kpi-title">{{ distinctProducts }}</strong>
</div>
</div>
</template>

<style scoped>
.kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px}
.kpi{background:#fff7cc;border:1px solid var(--rc-border);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px}
.kpi-title{font-size:24px;color:var(--rc-text)}
.muted{color:var(--rc-muted);font-weight:600}
@media (max-width:900px){.kpis{grid-template-columns:1fr}}
</style>