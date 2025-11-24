<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useUsersStore } from "../stores/users"

const store = useUsersStore()
const router = useRouter()

// Campos del formulario
const name = ref("")
const apellido = ref("")
const email = ref("")
const password = ref("")
const userId = ref("")
const error = ref("")
const success = ref(false)

async function register() {
  if (!name.value || !apellido.value || !email.value || !password.value || !userId.value) {
    error.value = "Todos los campos son obligatorios"
    return
  }

  const newUser = {
    name: name.value,
    apellido: apellido.value,
    email: email.value,
    password: password.value,
    userId: userId.value,
    createdAt: Date.now()
  }

  const result = await store.registerUser(newUser)
  if (result) {
    success.value = true
    setTimeout(() => router.push("/login"), 1500)
  } else {
    error.value = "Error al registrar usuario"
  }
}
</script>

<template>
  <div class="register-container">
    <h1>Registrar nuevo usuario</h1>

    <form @submit.prevent="register" class="form-vertical">
      <label>Nombre</label>
      <input v-model="name" placeholder="Nombre" />

      <label>Apellido</label>
      <input v-model="apellido" placeholder="Apellido" />

      <label>Correo electrónico</label>
      <input v-model="email" type="email" placeholder="Correo electrónico" />

      <label>Contraseña</label>
      <input v-model="password" type="password" placeholder="Contraseña" />

      <label>User ID</label>
      <input v-model="userId" placeholder="User ID" />

      <button type="submit">Registrar</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Usuario registrado correctamente ✅</p>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  font-family: system-ui, sans-serif;
}

.form-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 300px;
}

label {
  text-align: left;
  font-weight: 600;
  color: #333;
}

input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
  font-size: 1rem;
}

button {
  margin-top: 10px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #3730a3;
}

.error {
  color: red;
  margin-top: 10px;
}

.success {
  color: green;
  margin-top: 10px;
}
</style>
