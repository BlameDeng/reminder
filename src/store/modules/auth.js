import request from '@/http/request.js'
import Leancloud from '@/http/leancloud.js'
const TodoUser = new Leancloud('TodoUser')

const prefix = 'http://www.denglin.xyz:3000'
const URL = {
    check: `${prefix}/auth/check`,
    login: `${prefix}/auth/login`,
    logout: `${prefix}/auth/logout`,
    patchUser: `${prefix}/auth/patch`
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