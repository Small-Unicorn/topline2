import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, saveUser } from '@/utils/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getUser()
  },
  mutations: {
    // 永远通过 mutation 来修改 state，第一个参数是state
    setUser (state, user) {
      // 更新
      state.user = user

      // 将数据放到本地存储的目的是为了保持刷新保存数据状态
      saveUser(state.user)
    }
  },
  // 异步修改后 交给 mutations修改state
  actions: {
  }
})
