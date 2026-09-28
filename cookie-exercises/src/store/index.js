import { createStore } from 'vuex'
import cookies from './modules/cookies'

const store = createStore({
  modules: { cookies }
})

store.subscribe((mutation, state) => {
  try {
    localStorage.setItem('cookie-club-save', JSON.stringify(state.cookies))
  } catch {
    // Keep the game available when browser storage is unavailable.
  }
})

export default store