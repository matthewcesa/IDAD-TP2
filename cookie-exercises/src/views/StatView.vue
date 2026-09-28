<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = computed(() => store.getters['cookies/currentUser'])
const leaderboard = computed(() => store.getters['cookies/leaderboard'])
const challenges = computed(() => store.getters['cookies/recentChallenges'])
const stats = computed(() => store.getters['cookies/gameStats'])
const scoreTarget = ref(store.getters['cookies/leaderboard'][0]?.id ?? '')
const scoreValue = ref(0)
const feedback = ref('')

function challenge(opponentId) {
  store.dispatch('cookies/challengePlayer', opponentId)
  feedback.value = 'Challenge recorded. The result compares lifetime cookie totals.'
}

function updateScore() {
  store.commit('cookies/setPlayerScore', { userId: scoreTarget.value, score: scoreValue.value })
  feedback.value = 'Player score updated.'
}

function resetSelected() {
  if (!scoreTarget.value || !window.confirm("Reset this player's game?")) return
  store.commit('cookies/resetGame', scoreTarget.value)
  scoreValue.value = 0
  feedback.value = "The player's game has been reset."
}

function resetEveryone() {
  if (!window.confirm('Reset all games and delete all challenges?')) return
  store.commit('cookies/resetGame')
  scoreValue.value = 0
  feedback.value = 'All games have been reset.'
}
</script>

<template>
  <main v-if="user" class="page-shell stats-page">
    <section class="stats-heading">
      <div><p class="eyebrow">TOP BAKERS</p><h1>Leaderboard<span>.</span></h1><router-link class="return-link" to="/">← Back to game</router-link></div>
      <div class="leaderboard-summary"><strong>{{ stats.totalPlayers }}</strong><span>bakers<br />registered</span></div>
    </section>

    <div class="stats-grid">
      <section class="leaderboard-section">
        <div class="section-heading"><div><p class="eyebrow">ALL PLAYERS</p><h2>High scores</h2></div></div>
        <div class="leaderboard-table">
          <div class="table-head"><span>RANK</span><span>BAKER</span><span>TOTAL COOKIES</span><span>CHALLENGE</span></div>
          <div v-for="(player, index) in leaderboard" :key="player.id" class="leaderboard-row" :class="{ 'is-current-player': player.id === user.id }">
            <span class="rank-number" :class="{ 'top-rank': index < 3 }">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="player-name"><strong>{{ player.username }}</strong><small v-if="player.id === user.id">YOU</small><small v-else>{{ player.role }}</small></span>
            <strong class="score-number">{{ Math.floor(player.totalCookies).toLocaleString('en-US') }}</strong>
            <button v-if="player.id !== user.id && user.role === 'Player'" class="challenge-button" type="button" :aria-label="`Challenge ${player.username}`" @click="challenge(player.id)">Challenge ↗</button>
            <span v-else class="you-mark">—</span>
          </div>
          <p v-if="!leaderboard.length" class="empty-state">No players yet.</p>
        </div>
        <p v-if="feedback" class="feedback-message" aria-live="polite">{{ feedback }}</p>
      </section>

      <aside class="stats-aside">
        <section class="personal-stats">
          <p class="eyebrow">YOUR GAME</p>
          <h2>{{ user.username }}</h2>
          <dl>
            <div><dt>Cookies in bank</dt><dd>{{ Math.floor(user.cookies).toLocaleString('en-US') }}</dd></div>
            <div><dt>Auto production</dt><dd>{{ user.autoProduction }} / sec</dd></div>
            <div><dt>Active multiplier</dt><dd>×{{ user.multiplier }}</dd></div>
            <div><dt>Total earned</dt><dd>{{ Math.floor(user.totalCookies).toLocaleString('en-US') }}</dd></div>
          </dl>
        </section>

        <section class="challenge-history">
          <p class="eyebrow">RECENT MATCHES</p>
          <h2>Challenges</h2>
          <div v-if="challenges.length" class="challenge-list">
            <article v-for="duel in challenges" :key="duel.id" class="challenge-item">
              <div><strong>{{ duel.challenger }}</strong><span>vs.</span><strong>{{ duel.opponent }}</strong></div>
              <small>{{ Math.floor(duel.challengerScore).toLocaleString('en-US') }} — {{ Math.floor(duel.opponentScore).toLocaleString('en-US') }} cookies</small>
              <small class="duel-winner">{{ ['Tie', 'Égalité'].includes(duel.winner) ? 'It is a tie' : `${duel.winner} wins the challenge` }}</small>
            </article>
          </div>
          <p v-else class="muted-copy">No challenges yet.</p>
        </section>
      </aside>
    </div>

    <section v-if="user.role === 'Admin'" class="admin-panel">
      <div class="admin-heading"><div><p class="eyebrow">MODERATION TOOLS</p><h2>Administration</h2></div><span>ADMIN</span></div>
      <div class="admin-controls">
        <label>Player
          <select v-model="scoreTarget">
            <option value="">Select a player</option>
            <option v-for="player in leaderboard" :key="player.id" :value="player.id">{{ player.username }}</option>
          </select>
        </label>
        <label>New score
          <input v-model.number="scoreValue" type="number" min="0" step="1" />
        </label>
        <button class="admin-action" type="button" :disabled="!scoreTarget" @click="updateScore">Update score</button>
        <button class="admin-reset" type="button" :disabled="!scoreTarget" @click="resetSelected">Reset this player</button>
        <button class="admin-reset all-reset" type="button" @click="resetEveryone">Reset all games</button>
      </div>
      <p class="admin-footnote">{{ feedback || 'Player accounts remain active after a reset.' }}</p>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  max-width: 900px;
  margin: 24px auto;
  padding: 0 16px;
}

.stats-heading,
.admin-heading {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.leaderboard-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
}

.table-head,
.leaderboard-row {
  display: grid;
  grid-template-columns: 45px minmax(80px, 1fr) minmax(100px, 1fr) 55px;
  gap: 6px;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.player-name {
  display: flex;
  flex-direction: column;
}

.personal-stats {
  padding: 12px;
  background: #eee;
}

.personal-stats dl div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.personal-stats dd {
  margin: 0;
}

.challenge-item {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}

.admin-panel {
  margin-top: 24px;
}

.admin-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.admin-controls label {
  display: grid;
  gap: 4px;
}

.admin-controls select,
.admin-controls input {
  max-width: 180px;
}

.admin-controls button,
.challenge-button {
  cursor: pointer;
}

@media (max-width: 650px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>