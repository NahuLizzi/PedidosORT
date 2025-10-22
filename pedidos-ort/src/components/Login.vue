<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Variables reactivas
const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()

function login() {
  // Datos válidos de ejemplo (puede ser cualquier par)
  const validEmail = 'alejandrannjuarez@gmail.com'
  const validPassword = 'pnt22025'

  // Verificar credenciales
  if (email.value === validEmail && password.value === validPassword) {
    // Guardar "sesión" en localStorage
    localStorage.setItem('isAuth', '1')

    // Redirigir al Home
    router.push('/')
  } else {
    error.value = 'Email o contraseña incorrectos'
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Iniciar sesión</h1>

    <input v-model="email" type="email" placeholder="Correo electrónico" />
    <input v-model="password" type="password" placeholder="Contraseña" />

    <button @click="login">Entrar</button>

    <p v-if="error" class="error">{{ error }}</p>

    <p class="hint">
      Usuario de prueba: <b>alejandrannjuarez@gmail.com</b> / Contraseña: <b>pnt22025</b>
    </p>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 80px;
}

input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 240px;
}

button {
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #3730a3;
}

.error {
  color: red;
}

.hint {
  font-size: 0.85rem;
  color: #555;
}
</style>