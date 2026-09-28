<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const mode = ref('login')
const username = ref('')
const password = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  try {
    if (mode.value === 'register') {
      await store.dispatch('cookies/register', { username: username.value, password: password.value })
    } else {
      await store.dispatch('cookies/login', { username: username.value, password: password.value })
    }
    router.push('/')
  } catch (problem) {
    error.value = problem.message
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-form-side">
      <div class="login-form-wrap">
        <router-link class="brand login-brand" to="/login">
          <span class="brand-mark">C</span>
          <span>Cookies<span class="brand-accent">Clicker</span></span>
        </router-link>
        <p class="eyebrow">YOUR LITTLE BAKERY, ALWAYS OPEN</p>
        <h1>{{ mode === 'login' ? 'Welcome back!' : 'Join the bakery.' }}</h1>
        <p class="login-intro">{{ mode === 'login' ? 'Sign in to continue your game.' : 'Create an account and bake your first cookie.' }}</p>
        <form class="login-form" @submit.prevent="submit">
          <label for="username">Username</label>
          <input id="username" v-model="username" autocomplete="username" minlength="3" maxlength="20" required placeholder="e.g. CookieFan" />
          <label for="password">Password</label>
          <input id="password" v-model="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" minlength="4" required type="password" placeholder="At least 4 characters" />
          <p v-if="error" class="form-error" role="alert">{{ error }}</p>
          <button class="submit-button" type="submit">{{ mode === 'login' ? 'Sign in' : 'Create account' }} <span aria-hidden="true">↗</span></button>
        </form>
        <p class="mode-switch">
          {{ mode === 'login' ? 'New here?' : 'Already have an account?' }}
          <button type="button" @click="mode = mode === 'login' ? 'register' : 'login'; error = ''">{{ mode === 'login' ? 'Create an account' : 'Sign in' }}</button>
        </p>
        <div class="demo-login"><span class="demo-dot"></span><p>Demo account<br /><strong>Admin</strong> · password <strong>cookieadmin</strong></p></div>
        <p class="local-note">Accounts and progress are stored locally on this device.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form-side {
  width: 100%;
  max-width: 420px;
  padding: 32px 24px;
}

.login-form-wrap {
  width: min(320px, 100%);
}

.login-form {
  display: grid;
  gap: 8px;
}

.login-form input {
  padding: 8px;
}

.submit-button {
  padding: 8px;
  background: var(--green);
  color: white;
  cursor: pointer;
}

.mode-switch button {
  cursor: pointer;
}
</style>