<template>
  <article class="pedido card shadow-sm mb-3 border-warning rounded-4">
    <header
      class="pedido-header card-header d-flex justify-content-between align-items-center bg-warning-subtle"
    >
      <h5 class="fw-bold text-dark mb-0">Pedido #{{ order.id }}</h5>
      <small class="text-muted">{{ estadoLabel(order.status) }}</small>
    </header>

    <ul class="list-group list-group-flush">
      <li
        v-for="item in order.items"
        :key="item.productId"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div class="d-flex align-items-center gap-3">
          <img :src="item.img" alt="" class="img rounded-3 border border-warning" />
          <div class="text-start">
            <strong>{{ item.name }}</strong>
            <div class="text-muted">x{{ item.qty }}</div>
          </div>
        </div>
        <span class="fw-semibold text-dark">$ {{ item.lineTotal }}</span>
      </li>
    </ul>

    <p
      v-if="order.comment"
      class="comentario alert alert-warning m-3 p-2 small d-flex align-items-center"
    >
      🗒️ <em class="ms-2">{{ order.comment }}</em>
    </p>

    <footer
      class="pedido-footer card-footer d-flex justify-content-between align-items-center"
    >
      <p class="fw-bold text-dark mb-0">Total: ${{ order.total }}</p>
      <div class="d-flex gap-2">
        <button
          v-if="order.status === 'PENDIENTE'"
          @click="$emit('prep', order.id)"
          class="btn btn-outline-warning btn-sm"
        >
          en preparacion
        </button>
        <button
          v-if="order.status === 'PREPARACION'"
          @click="$emit('ready', order.id)"
          class="btn btn-warning text-dark btn-sm fw-bold"
        >
          marcar listo
        </button>
      </div>
    </footer>
  </article>
</template>

<script setup>
defineProps({ order: Object })

const estadoLabel = (estado) => {
  switch (estado) {
    case 'PENDIENTE': return '🕒 Pendiente'
    case 'PREPARACION': return '👩‍🍳 En preparación'
    case 'LISTO': return '✅ Listo'
    default: return estado
  }
}
</script>

<style scoped>
.img {
  width: 70px;
  height: 70px;
  object-fit: cover;
}
</style>
