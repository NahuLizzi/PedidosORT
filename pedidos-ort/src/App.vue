<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import { ref, computed } from "vue";

const link = ref("/");
const router = useRouter();
const route = useRoute();

// Función para cerrar sesión
function logout() {
  localStorage.removeItem("isAuth");
  router.push("/login");
}

// Saber si hay sesión activa
const isLoggedIn = computed(() => localStorage.getItem("isAuth") === "1");

// Saber si estamos en el login (para no mostrar el botón ahí)
const isLoginPage = computed(() => route.path === "/login");
</script>

<template>
  <header class="header">
    <!-- Link a Home -->
    <RouterLink :to="link" class="home-link">🏠 Home</RouterLink>

    <!-- Botón de cerrar sesión -->
    <button
      v-if="isLoggedIn && !isLoginPage"
      @click="logout"
      class="logout-btn"
    >
      Cerrar sesión
    </button>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
.header {
  background-color: #4f46e5;
  color: white;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 55px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.home-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
}

/* 🌿 Botón con estilo moderno */
.logout-btn {
  background-color: #6366f1; /* violeta suave */
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;
}

.logout-btn:hover {
  background-color: #4338ca; /* tono más oscuro al pasar el mouse */
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

main {
  padding-top: 70px; /* espacio para que no se oculte el contenido */
}
</style>
