<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>Agregar nota al pedido</h2>
      <textarea v-model="nota" placeholder="Ej: sin cebolla, extra queso..." />
      <div class="actions">
        <button @click="guardar">Guardar</button>
        <button class="cancel" @click="$emit('close')">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const nota = ref('')
const emit = defineEmits(['close', 'save'])

function guardar() {
  emit('save', nota.value)
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  width: 380px;
}
textarea {
  width: 100%;
  height: 100px;
  margin-top: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: none;
}
.actions {
  margin-top: 1rem;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
button {
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}
button.cancel {
  background: #6b7280;
}
button:hover {
  opacity: 0.9;
}
</style>
