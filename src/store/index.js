import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import request from '@/request/request.js'

const URL = {
    check: '/auth/check',
    login: '/auth/login',
    logout: '/auth/logout'
}

export default new Vuex.Store({
    state: {
        user: null,
        isLogin: false
    },
    getters: {},
    mutations: {
        setUser(state, payload) {
            state.user = payload
        },
        setLogin(state, payload) {
            state.isLogin = payload
        }
    },
    actions: {
        async check({ commit }) {
            let res = await request({ url: URL.check, method: 'GET' })
            console.log(res)
            return res
        },
        async login({ commit }, data) {
            let res = await request({ url: URL.login, method: 'POST', data })
            console.log(res)
            return res
        },
        async logout({ commit }) {
            let res = await request({ url: URL.logout, method: 'GET' })
            return res
        }
    }
})