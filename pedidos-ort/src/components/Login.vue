<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const route  = useRoute()

async function login() {
  error.value = ''

  // obtenemos los usuarios desde Mockachino
  const res = await fetch("https://www.mockachino.com/0528e0d6-a212-49/users")
  const data = await res.json()
  const accounts = data.users   // array de usuarios

  // validamos
  const e = email.value.trim()
  const p = password.value
  const found = accounts.find(u => u.email === e && u.password === p)

  if (found) {
    // guardamos datos en localStorage
    localStorage.setItem('isAuth', '1')
    localStorage.setItem('user', JSON.stringify({
      id:    found.id,
      email: found.email,
      role:  found.role,
      name:  found.name,
    }))

    // redirige según rol
    let redirect = '/'
    if (found.role === 'cliente')  redirect = '/cliente'
    else if (found.role === 'empleado') redirect = '/empleado'
    else if (found.role === 'gerente')  redirect = '/gerente'

    router.push(redirect)
  } else {
    error.value = 'Email o contraseña incorrectos'
  }
}
</script>

<template>
  <div class="login-container">
    <h1>Iniciar sesión</h1>

    <input
      v-model.trim="email"
      type="email"
      placeholder="Correo electrónico"
      autocomplete="username"
      inputmode="email"
    />

    <input
      v-model="password"
      type="password"
      placeholder="Contraseña"
      autocomplete="current-password"
    />

    <button @click="login">Entrar</button>

    <p v-if="error" class="error">{{ error }}</p>

    <p class="hint">
      Usuario de prueba: <b>alejandra@gmail.com</b> / Contraseña: <b>pnt22025</b>
    </p>
    <p class="hint">
      Usuario de prueba: <b>ailin@gmail.com</b> / Contraseña: <b>pnt22025</b>
    </p>
    <p class="hint">
      Usuario de prueba: <b>micaela@gmail.com</b> / Contraseña: <b>pnt22025</b>
    </p>
    <p class="hint">
      Usuario de prueba: <b>nahuel@gmail.com</b> / Contraseña: <b>pnt22025</b>
    </p>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 80px;

  background: #fffbe6;
  border: 2px solid #ffbe0b;
  border-radius: 16px;
  padding: 32px 24px;
  width: min(420px, 92vw);
  margin-inline: auto;
  box-shadow: 0 8px 20px rgba(0,0,0,.08);
}

h1 {
  color: #d62828;
  font-weight: 700;
  font-size: 2rem;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  width: 260px;
  transition: border-color .15s, box-shadow .15s;
}

input:focus {
  outline: none;
  border-color: #ffbe0b;
  box-shadow: 0 0 0 3px rgba(255,190,11,.25);
}

button {
  background: #ffbe0b;
  color: #2c2c2c;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  width: 260px;
  transition: all .15s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

button:hover {
  background-color: #faa307;
  transform: translateY(-2px);
}

.error {
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 8px 10px;
  border-radius: 8px;
  width: 260px;
  text-align: center;
}

.hint {
  font-size: .85rem;
  color: #555;
}

@media (max-width: 480px) {
  .login-container { margin-top: 48px; padding: 20px; }
  input, button, .error { width: 92vw; max-width: 360px; }
}
</style>
