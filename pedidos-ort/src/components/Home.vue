<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = computed(() => JSON.parse(localStorage.getItem("user") || "{}"));
const role = computed(() => user.value.role || "sin-rol");
const name = computed(() => user.value.name || "Usuario");

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
      <button v-if="role === 'cliente' || role === 'gerente'" @click="Client">
        Zona de Cliente
      </button>

      <button v-if="role === 'empleado' || role === 'gerente'" @click="Employee">
        Zona de Empleado
      </button>

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
  font-family: 'Poppins', sans-serif;
  color: #2c2c2c;
}

h1 {
  color: #d62828; /* rojo suave */
  font-weight: 700;
  font-size: 2.2rem;
}

.menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 30px;
}

button {
  background-color: #ffbe0b; /* amarillo mostaza */
  color: #2c2c2c;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  width: 240px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

button:hover {
  background-color: #faa307;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}
</style>
