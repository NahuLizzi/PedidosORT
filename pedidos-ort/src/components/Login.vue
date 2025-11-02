<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const route  = useRoute()

function login() {
  error.value = ''

  const accounts = [
    { email: 'alejandra@gmail.com', password: 'pnt22025', role: 'cliente',  name: 'Alejandra' },
    { email: 'ailin@gmail.com', password: 'pnt22025',     role: 'cliente',   name: 'Ailin'     },
    { email: 'micaela@gmail.com', password: 'pnt22025',     role: 'empleado',  name: 'Micaela'    },
    { email: 'nahuel@gmail.com', password: 'pnt22025',     role: 'gerente',   name: 'Nahuel'      },
  ]

  const e = email.value.trim()
  const p = password.value

  const found = accounts.find(u => u.email === e && u.password === p)

  if (found) {
   
    localStorage.setItem('isAuth', '1')
    localStorage.setItem('user', JSON.stringify({
      email: found.email,
      role:  found.role,
      name:  found.name,
    }))

 
    const redirect = String(route.query.redirect || '/')
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

  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 20px;
  width: min(420px, 92vw);
  margin-inline: auto;
  box-shadow: 0 6px 16px rgba(0,0,0,.06);
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1; /* slate-300 */
  width: 260px;
  transition: border-color .15s, box-shadow .15s;
}

input:focus {
  outline: none;
  border-color: #4f46e5;          /* indigo-600 */
  box-shadow: 0 0 0 3px rgba(79,70,229,.15);
}

button {
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  width: 260px;
  transition: filter .15s, transform .02s;
}

button:hover { filter: brightness(.95); }
button:active { transform: translateY(1px); }
button:disabled { opacity: .6; cursor: not-allowed; }

.error {
  color: #b91c1c;                  /* red-700 */
  background: #fee2e2;            /* red-100 */
  border: 1px solid #fecaca;      /* red-200 */
  padding: 8px 10px;
  border-radius: 8px;
  width: 260px;
  text-align: center;
}

.hint {
  font-size: .85rem;
  color: #64748b;                  /* slate-500 */
}

@media (max-width: 480px) {
  .login-container { margin-top: 48px; padding: 16px; }
  input, button, .error { width: 92vw; max-width: 360px; }
}
</style>