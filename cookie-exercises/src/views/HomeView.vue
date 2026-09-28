<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.getters['cookies/currentUser'])
const prices = computed(() => store.getters['cookies/upgradePrices'])

function bake() {
  store.commit('cookies/earnCookies', user.value.multiplier)
}

function buy(type) {
  store.dispatch('cookies/buyUpgrade', type)
}
</script>

<template>
  <main v-if="user" class="page-shell game-page">
    <section class="game-heading">
      <div>
        <p class="eyebrow">{{ user.username.toUpperCase() }}'S BAKERY</p>
        <h1>One batch<br /><span>at a time.</span></h1>
      </div>
      <div class="balance-block" aria-live="polite">
        <span class="balance-label">YOUR BALANCE</span>
        <strong>{{ user.cookies.toLocaleString('en-US', { maximumFractionDigits: 1 }) }}</strong>
        <span class="balance-unit">cookies</span>
      </div>
    </section>

    <section class="game-layout" aria-label="Game and upgrades">
      <div class="oven-panel">
        <div class="oven-topline">
          <span><i class="live-dot"></i> OVEN IS ON</span>
          <span>{{ (user.autoProduction * user.multiplier).toLocaleString('en-US', { maximumFractionDigits: 2 }) }} / sec</span>
        </div>
        <div class="cookie-stage">
          <span class="stage-caption">FRESH FROM THE OVEN</span>
          <button class="cookie-button" type="button" aria-label="Bake a cookie" @click="bake">
            <img class="cookie-art" src="https://i.pinimg.com/736x/29/4e/f5/294ef54b29d2d9d9b3839d47ee702053.jpg" alt="" />
          </button>
          <span class="click-hint">CLICK TO BAKE ONE</span>
        </div>
        <div class="oven-footer">
          <div><span class="mini-stat-label">AUTO PRODUCTION</span><strong>{{ user.autoProduction }} <small>/ sec</small></strong></div>
          <div><span class="mini-stat-label">MULTIPLIER</span><strong>×{{ user.multiplier }}</strong></div>
          <div><span class="mini-stat-label">TOTAL COOKIES BAKED</span><strong>{{ Math.floor(user.totalCookies).toLocaleString('en-US') }}</strong></div>
        </div>
      </div>

      <aside class="shop-panel" aria-label="Shop">
        <div class="section-heading">
          <div><p class="eyebrow">INVEST IN YOUR BAKERY</p><h2>Shop</h2></div>
          <span class="shop-count">{{ user.autoLevel + user.multiplierLevel }} {{ user.autoLevel + user.multiplierLevel === 1 ? 'PURCHASE' : 'PURCHASES' }}</span>
        </div>
        <div class="shop-table-wrap">
          <div class="shop-grid" role="group" aria-label="Available upgrades">
            <div class="shop-row shop-header" aria-hidden="true">
              <strong>Upgrade</strong><strong>Effect</strong><strong>Level</strong><strong>Price</strong>
            </div>
            <div class="shop-row" :class="{ 'is-unavailable': user.cookies < prices.auto }" role="button" :tabindex="user.cookies >= prices.auto ? 0 : -1" :aria-disabled="user.cookies < prices.auto" :aria-label="`Buy Automatic Oven for ${prices.auto} cookies`" @click="buy('auto')" @keydown.enter.prevent="buy('auto')" @keydown.space.prevent="buy('auto')">
              <strong>Automatic Oven</strong><span>+1 cookie / sec</span><span>{{ user.autoLevel }}</span><span>{{ prices.auto.toLocaleString('en-US') }} cookies</span>
            </div>
            <div class="shop-row" :class="{ 'is-unavailable': user.cookies < prices.multiplier }" role="button" :tabindex="user.cookies >= prices.multiplier ? 0 : -1" :aria-disabled="user.cookies < prices.multiplier" :aria-label="`Buy Secret Icing for ${prices.multiplier} cookies`" @click="buy('multiplier')" @keydown.enter.prevent="buy('multiplier')" @keydown.space.prevent="buy('multiplier')">
              <strong>Secret Icing</strong><span>×1.5 multiplier</span><span>{{ user.multiplierLevel }}</span><span>{{ prices.multiplier.toLocaleString('en-US') }} cookies</span>
            </div>
          </div>
        </div>
        <p class="shop-note">Upgrade prices increase after each purchase.</p>
        <router-link class="shop-link" to="/stats">View leaderboard <span aria-hidden="true">↗</span></router-link>
      </aside>
    </section>
    <p class="save-note">Your progress is saved automatically on this device.</p>
  </main>
</template>

<style scoped>
.page-shell {
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
}

.game-heading,
.oven-topline,
.oven-footer,
.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.game-heading {
  align-items: center;
}

.balance-block {
  min-width: 120px;
  text-align: right;
}

.balance-label,
.balance-unit,
.balance-block strong {
  display: block;
}

.game-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.oven-panel {
  padding: 12px;
  background: var(--green);
  color: white;
}

.cookie-stage {
  min-height: 200px;
  display: grid;
  place-content: center;
  text-align: center;
}

.cookie-button {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.cookie-art {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.oven-footer {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  border-top: 1px solid white;
  padding-top: 10px;
}

.oven-footer > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-stat-label {
  overflow-wrap: anywhere;
  font-size: 11px;
}

.shop-table-wrap {
  overflow-x: auto;
}

.shop-grid {
  min-width: 460px;
  font-size: 12px;
}

.shop-row {
  display: grid;
  grid-template-columns: 1.2fr 1fr .45fr .9fr;
  gap: 8px;
  align-items: center;
  padding: 10px 6px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.shop-header {
  cursor: default;
  font-size: 11px;
}

.shop-row:not(.shop-header):hover:not(.is-unavailable) {
  background: #e8eee8;
}

.shop-row.is-unavailable {
  opacity: .5;
  cursor: not-allowed;
}

@media (max-width: 650px) {
  .game-layout {
    grid-template-columns: 1fr;
  }
}
</style>