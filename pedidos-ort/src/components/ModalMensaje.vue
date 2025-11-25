<template>
  <transition name="fade">
    <div v-if="visible" class="toast" :class="tipo">
      {{ mensaje }}
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  mensaje: String,
  tipo: { type: String, default: 'exito' },
  duracion: { type: Number, default: 2500 }
})

const visible = ref(true)
onMounted(() => {
  setTimeout(() => (visible.value = false), props.duracion)
})
</script>

<style scoped>
.toast {
  display: block;
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 12px 22px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}
.exito {
  background: linear-gradient(90deg, #16a34a, #22c55e);
}
.error {
  background: linear-gradient(90deg, #dc2626, #ef4444);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
