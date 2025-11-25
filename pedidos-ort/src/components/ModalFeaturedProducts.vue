<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
    modelValue: { type: Boolean, required: true }, // v-model:visible
    productName: { type: String, default: '' },
    discount: { type: Number, default: 0 },
    loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'save', 'remove'])

const localDiscount = ref(props.discount)
watch(() => props.discount, v => localDiscount.value = v)

function close(){ emit('update:modelValue', false) }
function save(){ emit('save', Number(localDiscount.value)||0) }
function remove(){ emit('remove') }
</script>

<template>
<div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal">
        <h3>Destacar producto</h3>
        <p class="muted">Producto: <strong>{{ productName }}</strong></p>

        <label class="lbl">Descuento (%)
        <input class="inp" type="number" min="0" max="100" v-model.number="localDiscount" />
        </label>

        <div class="modal-actions">
        <button class="btn primary" :disabled="loading" @click="save">
            {{ loading ? 'Guardando…' : 'Guardar' }}
        </button>
        <button class="btn warn" :disabled="loading" @click="remove">
            {{ loading ? 'Quitando…' : 'Quitar destacado' }}
        </button>
        <button class="btn" @click="close">Cancelar</button>
        </div>
    </div>
</div>
</template>

<style scoped>
.modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;z-index:9999}
.modal{display:block; width:min(480px,90vw);background:#fffef5;border:1px solid var(--rc-border);border-radius:12px;padding:16px;box-shadow:0 12px 30px rgba(0,0,0,.15)}
.muted{color:var(--rc-muted);font-weight:600}
.lbl{display:block;font-weight:600;color:var(--rc-muted);margin:12px 0 6px}
.inp{width:120px;padding:8px 10px;border:1px solid var(--rc-border);border-radius:8px;background:#fffdf1;color:var(--rc-text)}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}
.btn{padding:8px 12px;border-radius:8px;border:1px solid var(--rc-border);background:#fffbe6;color:var(--rc-text)}
.btn.primary{background:var(--rc-accent);border-color:var(--rc-accent);color:#3a2f00;font-weight:600}
.btn.warn{background:#ffe6e6;border-color:#ffb3b3;color:#8a0000}
</style>