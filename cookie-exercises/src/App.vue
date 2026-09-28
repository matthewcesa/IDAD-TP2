<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const currentUser = computed(() => store.getters['cookies/currentUser'])
let productionTimer

onMounted(() => {
  productionTimer = window.setInterval(() => store.dispatch('cookies/produceAutomatically'), 1000)
})

onBeforeUnmount(() => window.clearInterval(productionTimer))

function logout() {
  store.commit('cookies/logout')
  router.replace({ name: 'login' })
}
</script>

<template>
  <header v-if="currentUser" class="topbar">
    <router-link class="brand" to="/" aria-label="CookiesClicker home">
      <span>Cookies<span class="brand-accent">Clicker</span></span>
    </router-link>
    <nav class="main-nav" aria-label="Main navigation">
      <router-link to="/">Game</router-link>
      <router-link to="/stats">Leaderboard</router-link>
    </nav>
    <div class="account-tools">
      <span class="account-role">{{ currentUser.role }}</span>
      <span class="account-name">{{ currentUser.username }}</span>
      <button class="logout-button" type="button" @click="logout">Log out</button>
    </div>
  </header>
  <router-view />
</template>

<style>
:root {
  font-family: Arial, sans-serif;
  --green: #315a43;
}

body {
  margin: 0;
  color: #26372e;
}

button,
input,
select {
  font: inherit;
}

.topbar,
.main-nav,
.account-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar {
  justify-content: space-between;
  padding: 12px 5%;
  border-bottom: 1px solid #ddd;
}

.brand {
  color: inherit;
  font-weight: bold;
  text-decoration: none;
}

.main-nav a {
  color: inherit;
}

.logout-button {
  cursor: pointer;
}

@media (max-width: 650px) {
  .topbar {
    flex-wrap: wrap;
  }

  .main-nav {
    order: 1;
  }
}
</style>