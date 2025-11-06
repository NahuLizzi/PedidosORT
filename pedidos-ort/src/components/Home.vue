<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

//  Leer el usuario actual
const user = computed(() => JSON.parse(localStorage.getItem("user") || "{}"));
const role = computed(() => user.value.role || "sin-rol");
const name = computed(() => user.value.name || "Usuario");

//  Acciones según rol
function Client() {
  router.push("/cliente");
}
function Employee() {
  router.push("/empleado");
}
function Manager() {
  router.push("/gerente");
}
</script>

<template>
  <section class="home">
    <h1>Bienvenido, {{ name }} 👋</h1>
    <p>Tu rol actual es: <b>{{ role }}</b></p>

    <div class="menu">
      <!-- Rol cliente -->
      <button v-if="role === 'cliente' || role === 'gerente'" @click="Client">
        Zona de Cliente
      </button>

      <!-- Rol empleado -->
      <button v-if="role === 'empleado' || role === 'gerente'" @click="Employee">
        Zona de Empleado
      </button>

      <!-- Rol gerente -->
      <button v-if="role === 'gerente'" @click="Manager">
        Zona de Gerente
      </button>
    </div>
  </section>
</template>

<style scoped>
.home {
  text-align: center;
  margin-top: 100px;
  font-family: system-ui, sans-serif;
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
}

button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  width: 240px;
  transition: background 0.2s, transform 0.1s;
}

button:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
}
</style>