const STORAGE_KEY = 'cookie-club-save'

const starterAdmin = {
  id: 'starter-admin',
  username: 'Admin',
  password: 'cookieadmin',
  role: 'Admin',
  cookies: 0,
  totalCookies: 0,
  autoProduction: 0,
  multiplier: 1,
  autoLevel: 0,
  multiplierLevel: 0
}

function loadSave() {
  try {
    const save = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (save && Array.isArray(save.users)) return save
  } catch {
  }

  return { users: [starterAdmin], currentUserId: null, challenges: [] }
}

function currentUser(state) {
  return state.users.find(user => user.id === state.currentUserId)
}

function upgradePrice(user, type) {
  return type === 'auto'
    ? Math.round(25 * 1.65 ** user.autoLevel)
    : Math.round(100 * 2 ** user.multiplierLevel)
}

export default {
  namespaced: true,
  state: loadSave,
  getters: {
    currentUser,
    isAuthenticated: state => Boolean(currentUser(state)),
    leaderboard: state => state.users
      .filter(user => user.role === 'Player')
      .sort((left, right) => right.totalCookies - left.totalCookies),
    recentChallenges: state => [...state.challenges].slice(0, 8),
    upgradePrices: (state, getters) => {
      const user = getters.currentUser
      return user
        ? { auto: upgradePrice(user, 'auto'), multiplier: upgradePrice(user, 'multiplier') }
        : { auto: 25, multiplier: 100 }
    },
    gameStats: (state, getters) => {
      const user = getters.currentUser
      return {
        cookies: user?.cookies ?? 0,
        autoProduction: user?.autoProduction ?? 0,
        multiplier: user?.multiplier ?? 1,
        totalPlayers: state.users.filter(player => player.role === 'Player').length,
        totalCookies: state.users.reduce((total, player) => total + player.totalCookies, 0)
      }
    }
  },
  mutations: {
    registerUser(state, user) {
      state.users.push(user)
      state.currentUserId = user.id
    },
    login(state, userId) {
      state.currentUserId = userId
    },
    logout(state) {
      state.currentUserId = null
    },
    earnCookies(state, amount) {
      const user = currentUser(state)
      if (!user || amount <= 0) return
      user.cookies += amount
      user.totalCookies += amount
    },
    buyUpgrade(state, type) {
      const user = currentUser(state)
      if (!user || !['auto', 'multiplier'].includes(type)) return
      const price = upgradePrice(user, type)
      if (user.cookies < price) return

      user.cookies -= price
      if (type === 'auto') {
        user.autoLevel += 1
        user.autoProduction += 1
      } else {
        user.multiplierLevel += 1
        user.multiplier = Number((user.multiplier * 1.5).toFixed(2))
      }
    },
    addChallenge(state, challenge) {
      state.challenges.unshift(challenge)
    },
    setPlayerScore(state, { userId, score }) {
      const player = state.users.find(user => user.id === userId)
      if (!player || player.role !== 'Player') return
      const safeScore = Math.max(0, Number(score) || 0)
      player.cookies = safeScore
      player.totalCookies = safeScore
    },
    resetGame(state, userId = null) {
      const players = userId
        ? state.users.filter(user => user.id === userId && user.role === 'Player')
        : state.users.filter(user => user.role === 'Player')
      players.forEach(user => {
        user.cookies = 0
        user.totalCookies = 0
        user.autoProduction = 0
        user.multiplier = 1
        user.autoLevel = 0
        user.multiplierLevel = 0
      })
      if (!userId) state.challenges = []
    }
  },
  actions: {
    register({ state, commit }, { username, password }) {
      const cleanName = username.trim()
      if (cleanName.length < 3) throw new Error('Username must be at least 3 characters long.')
      if (password.length < 4) throw new Error('Password must be at least 4 characters long.')
      if (state.users.some(user => user.username.toLowerCase() === cleanName.toLowerCase())) {
        throw new Error('That username is already taken.')
      }

      const id = `player-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      commit('registerUser', {
        id,
        username: cleanName,
        password,
        role: 'Player',
        cookies: 0,
        totalCookies: 0,
        autoProduction: 0,
        multiplier: 1,
        autoLevel: 0,
        multiplierLevel: 0
      })
    },
    login({ state, commit }, { username, password }) {
      const user = state.users.find(player => player.username.toLowerCase() === username.trim().toLowerCase())
      if (!user || user.password !== password) throw new Error('Incorrect username or password.')
      commit('login', user.id)
    },
    buyUpgrade({ commit }, type) {
      commit('buyUpgrade', type)
    },
    produceAutomatically({ getters, commit }) {
      const user = getters.currentUser
      if (user && user.autoProduction > 0) {
        commit('earnCookies', user.autoProduction * user.multiplier)
      }
    },
    challengePlayer({ getters, commit }, opponentId) {
      const challenger = getters.currentUser
      const opponent = getters.leaderboard.find(user => user.id === opponentId)
      if (!challenger || challenger.role !== 'Player' || !opponent || opponent.id === challenger.id) return

      const challengerScore = challenger.totalCookies
      const opponentScore = opponent.totalCookies
      const winner = challengerScore === opponentScore
        ? 'Tie'
        : challengerScore > opponentScore ? challenger.username : opponent.username
      commit('addChallenge', {
        id: `challenge-${Date.now()}`,
        challenger: challenger.username,
        opponent: opponent.username,
        challengerScore,
        opponentScore,
        winner,
        createdAt: new Date().toISOString()
      })
    }
  }
}