<template>
  <h1>Statistiques</h1>
  <p>Cookies : {{ $store.state.cookies.cookies }}</p>
  <p>Double : {{ $store.getters['cookies/doubleCookies'] }}</p>
</template>