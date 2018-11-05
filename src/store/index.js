import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import request from '@/http/request.js'

const prefix = `http://118.31.8.24:3000/`
const URL = {
    check: `${prefix}auth/check`,
    login: `${prefix}auth/login`,
    logout: `${prefix}auth/logout`,
    patch: `${prefix}auth/patch`
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
            console.log(res)
            return res
        },
        async patch({ commit }, data) {
            let res = await request({ url: URL.patch, method: 'PATCH', data })
            console.log(res)
            return res
        }
    }
})