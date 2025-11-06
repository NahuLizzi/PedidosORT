<script setup>
import { RouterView, useRouter, useRoute } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

//  Cerrar sesión
function logout() {
  localStorage.removeItem("isAuth");
  localStorage.removeItem("user");
  router.push("/login");
}

//  Sesión activa
const isLoggedIn = computed(() => localStorage.getItem("isAuth") === "1");

// Ocultar header en login
const isLoginPage = computed(() => route.path === "/login");

// Rol actual
const userRole = computed(() => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "sin rol";
});

// Ir siempre al Home global
function goHome() {
  router.push("/");
}
</script>

<template>
  <!-- Header visible solo fuera del login -->
  <header class="header" v-if="!isLoginPage">
    <!-- Botón que lleva al Home global -->
    <button @click="goHome" class="home-link">🏠 Home</button>

 

    <!-- Cerrar sesión -->
    <button v-if="isLoggedIn" @click="logout" class="logout-btn">
      Cerrar sesión
    </button>
  </header>

  <!-- Contenido principal -->
  <main>
    <RouterView :key="route.fullPath" />
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
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.home-link:hover {
  opacity: 0.85;
}

.role {
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 20px;
}

.logout-btn {
  background-color: #6366f1;
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
  background-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

main {
  padding-top: 70px;
}
</style>