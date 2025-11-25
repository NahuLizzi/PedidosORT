<script setup>
const props = defineProps({
rows: {
    type: Array,
    default: () => []
}
})
const currency = (n) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
</script>

<template>
<div class="card">
<div class="card-title">Resumen de pedidos</div>

<table class="table" v-if="rows.length">
    <thead>
    <tr>
        <th class="t-left">ID</th>
        <th>Fecha</th>
        <th>Ítems</th>
        <th class="t-right">Total</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="r in rows" :key="r.id">
        <td class="t-left">{{ r.id }}</td>
        <td>{{ r.date }}</td>
        <td>{{ r.lines }}</td>
        <td class="t-right">{{ currency(r.total) }}</td>
    </tr>
    </tbody>
</table>

<div v-else class="empty">No hay pedidos para mostrar.</div>
</div>
</template>

<style scoped>
.card { background:#fffbe6; border:1px solid var(--rc-border); border-radius:12px; padding:16px; }
.card-title { color: var(--rc-muted); font-weight:600; margin-bottom:10px; }
.table { width:100%; border-collapse:separate; border-spacing:0 8px; color: var(--rc-text); }
.table th { text-align:left; color:var(--rc-text); font-weight:600; }
.table td, .table th { color: var(--rc-text); padding:10px 12px; background:#ffbe0b28; }
.table tr { box-shadow:0 1px 6px rgba(175,163,163,.08); border-radius:8px; }
.t-right { text-align:right; border-bottom-right-radius: 5px; border-top-right-radius: 5px; }
.t-left  { text-align:left;  border-bottom-left-radius: 5px;  border-top-left-radius: 5px; }
.empty { color: var(--rc-muted); padding: 8px 0; }
</style>