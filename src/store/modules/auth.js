import request from '@/http/request.js'
import Leancloud from '@/http/leancloud.js'
const TodoUser = new Leancloud('TodoUser')

const URL = {
  check: `/auth/check`,
  login: `/auth/login`,
  logout: `/auth/logout`,
  patchUser: `/auth/patch`
}

const state = {
  user: null,
  isLogin: false
}

const mutations = {
  setUser(state, payload) {
    state.user = payload
  },
  setLogin(state, payload) {
    state.isLogin = payload
  }
}
const actions = {
  async check({ commit }) {
    let res = await request({ url: URL.check, method: 'GET' })
    return res
  },
  async login({ commit }, data) {
    let res = await request({ url: URL.login, method: 'POST', data })
    return res
  },
  async logout({ commit }) {
    let res = await request({ url: URL.logout, method: 'GET' })
    return res
  },
  async patchUser({ commit }, data) {
    let res = await request({ url: URL.patchUser, method: 'PATCH', data })
    return res
  },
  async createTodoUser({ commit }, data) {
    let res = await TodoUser.create(data)
    return res
  }
}

export default { state, mutations, actions }
