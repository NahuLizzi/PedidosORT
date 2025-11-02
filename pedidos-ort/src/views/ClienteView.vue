<template>
  <div class="cliente-view">
    <h1>Menu de Productos</h1>

    <div class="productos">
      <PedidoCard
        v-for="prod in productos"
        :key="prod.id"
        :producto="prod"
        @agregar="agregarAlCarrito"
      />
    </div>

    <hr />

    <Carrito
      :items="carrito"
      @confirmar="confirmarPedido"
    />

    <div v-if="pedidoConfirmado" class="estado-pedido">
      <h2>Estado del Pedido</h2>
      <p>Numero de pedido: {{ numeroPedido }}</p>
      <p>Estado: {{ estadoPedido }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PedidoCard from '../components/PedidoCard.vue'
import Carrito from '../components/Carrito.vue'
import { useProductsStore } from '../stores/products'
import { useOrdersStore } from '../stores/orders'

const productosStore = useProductsStore()
const ordersStore = useOrdersStore()


const productos = productosStore.all;
//const productos = productosStore.all
const carrito = ref([])

const pedidoConfirmado = ref(false)
const numeroPedido = ref(null)
const estadoPedido = ref('Pendiente')

const agregarAlCarrito = (producto) => {
  const existente = carrito.value.find((p) => p.productId === producto.id);
  if (existente) existente.qty++;
  else 
  carrito.value.push({ 
      productId: producto.id,
      name: producto.name,
      price: producto.price,
      qty: 1,
      img: producto.img,
  });
}

/*const confirmarPedido = () => {
  numeroPedido.value = ordersStore.createOrder(carrito.value)
  pedidoConfirmado.value = true
  estadoPedido.value = 'Pendiente'
}*/

const confirmarPedido = () => {
  if (carrito.value.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  const items = carrito.value.map(p => ({
    productId: p.productId || p.id,
    qty: p.qty || 1
  }));

  numeroPedido.value = ordersStore.createOrder(items);
  pedidoConfirmado.value = true;
  estadoPedido.value = 'Pendiente';
  carrito.value = [];
};

</script>

<style scoped>
.cliente-view {
  padding: 2rem;
}
.productos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.estado-pedido {
  margin-top: 2rem;
  padding: 1rem;
  background: #f4f4f4;
  border-radius: 10px;
}
</style>
