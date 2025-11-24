<script setup>
import { RouterView, useRouter, useRoute } from "vue-router"
import { computed, onMounted } from "vue"
import { useSessionStore } from "./stores/session"

const router = useRouter()
const route = useRoute()

//Con Pinia
const session = useSessionStore()

onMounted(() => {
  session.restoreSession()
})

// cerrar sesion
function logout() {
  session.logout()
  router.replace("/")
}
/*Antes sin Pinia
  function logout() {
  localStorage.removeItem("isAuth")
  localStorage.removeItem("user")
  router.push("/login")
}*/

// sesion activa
//Sin Pinia
//const isLoggedIn = computed(() => localStorage.getItem("isAuth") === "1")
const isLoggedIn = computed(() => session.isAuth)

const isLoginPage = computed(() => route.path === "/login")

const isHomePublico = computed(() => route.path === "/")

// volver al home
function goHome() {
  router.push("/")
}
</script>

<template>
  <!-- header principal -->
  <header class="header">
    <div class="left-section">
      <button @click="goHome" class="home-btn">🏠 Inicio</button>
    </div>
    <div class="center-section">
      <h1 class="title">Mi Aplicación</h1>
    </div>
    <div class="right-section">
     <button v-if="!isLoggedIn && !isLoginPage" class="btn btn-primary" @click="$router.push('/login')" > 
     Iniciar sesión
      </button>
      <button v-if="isLoggedIn && !isLoginPage" @click="logout" class="logout-btn">
      Cerrar sesión
      </button>
    </div>
  </header>

  <!-- boton de volver global (oculto en login y home publico) -->
  <div v-if="!isLoginPage && !isHomePublico" class="volver-container">
    <button @click="router.back()" class="btn-volver">⬅️ Volver</button>
  </div>

  <!-- contenido principal -->
  <main class="main-content">
    <RouterView :key="route.fullPath" />
  </main>
</template>

<style scoped>
/* ======== HEADER ======== */
.header {
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.left-section,
.center-section,
.right-section {
  display: flex;
  align-items: center;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* ======== BOTONES ======== */
.home-btn {
  background: white;
  border: none;
  color: #4f46e5;
  font-weight: 600;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.home-btn:hover {
  background: #eef2ff;
  transform: translateY(-1px);
}

.logout-btn {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  border-radius: 8px;
  padding: 6px 14px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.25s ease;
}

.logout-btn:hover {
  background-color: white;
  color: #4f46e5;
  transform: translateY(-1px);
}

/* ======== CONTENIDO ======== */
.main-content {
  padding-top: 100px; /* espacio para header y boton volver */
  padding-bottom: 40px;
}

/* ======== BOTON VOLVER ======== */
.volver-container {
  margin-top: 65px;
  display: flex;
  justify-content: flex-start;
  padding: 0 20px;
}

.btn-volver {
  background: #f9fafb;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-volver:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}
</style>