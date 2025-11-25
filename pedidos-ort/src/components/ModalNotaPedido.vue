<template>
  <teleport to="body">
    <div class="overlay" @click.self="$emit('close')">
      <div class="nota-modal">
        <h2>📝 Agregar nota al pedido</h2>
        <textarea v-model="nota" placeholder="Ej: sin cebolla, extra queso..."></textarea>
        <div class="actions">
          <button class="guardar" @click="guardarNota">Guardar</button>
          <button class="cancelar" @click="$emit('close')">Cancelar</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['save', 'close'])
const nota = ref('')

function guardarNota() {
  emit('save', nota.value) 
  emit('close')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999 !important;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  z-index: 99999999 !important;
}

textarea {
  width: 100%;
  height: 120px;
  resize: none;
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.guardar {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

.cancelar {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
