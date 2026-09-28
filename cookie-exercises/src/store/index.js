import { createStore } from 'vuex'
import cookies from './modules/cookies'

export default createStore({
  modules: { cookies }
})