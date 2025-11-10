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
  setTimeout(() => visible.value = false, props.duracion)
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.exito { background: #16a34a; }
.error { background: #dc2626; }
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
