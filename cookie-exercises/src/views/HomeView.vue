<template>
  <h1> {{ $store.state.cookies.cookies }} cookies</h1>
  <p>Double : {{ $store.getters['cookies/doubleCookies'] }}</p>
  <button @click="$store.commit('cookies/ajouterCookie')">Cliquer </button>
</template>