<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <nav>
    <router-link to="/">Accueil</router-link> |
    <router-link to="/stats">Stats</router-link>
  </nav>
  <router-view />
</template>